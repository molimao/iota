import { createRequire } from "node:module";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const LOCALES = ["zh", "zh-TW", "en", "ko", "ja"];
const PROJECT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
}

function readArguments() {
  const known = new Set(["--allowlist", "--out", "--packs"]);
  for (let index = 0; index < args.length; index += 2) {
    if (!known.has(args[index] ?? "")) throw new Error(`Unknown argument: ${args[index]}`);
  }
  return {
    allowlist: option(
      "--allowlist",
      path.join(root, "src/components/site/project-depth/accepted-projects.json"),
    ),
    out: option("--out", path.join(root, "src/components/site/project-depth/manifest.ts")),
    packs: option("--packs", path.join(root, "src/components/site/project-depth")),
  };
}

function readAllowlist(file) {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== "string")) {
    throw new Error("accepted-projects.json must be a JSON array of project ids");
  }
  if (new Set(parsed).size !== parsed.length) throw new Error("Duplicate project id in allowlist");
  return parsed;
}

function packFile(packsDir, id) {
  if (!PROJECT_ID.test(id) || id === "all") throw new Error(`Rejected project id: ${id}`);
  const packsRoot = path.resolve(packsDir);
  const file = path.resolve(packsRoot, `${id}.ts`);
  if (path.dirname(file) !== packsRoot || path.basename(file) !== `${id}.ts`) {
    throw new Error(`Rejected pack path: ${id}`);
  }
  if (!existsSync(file)) throw new Error(`Missing accepted pack: ${id}`);
  const realRoot = realpathSync(packsRoot);
  const realFile = realpathSync(file);
  if (path.dirname(realFile) !== realRoot) throw new Error(`Rejected pack path: ${id}`);
  return realFile;
}

function assertNoRuntimeCalls(sourceFile, file) {
  function visit(node) {
    if (
      ts.isImportEqualsDeclaration(node) ||
      (ts.isExportDeclaration(node) && node.moduleSpecifier)
    ) {
      throw new Error(`${file}: unexpected module dependency`);
    }
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      if (expression.kind === ts.SyntaxKind.ImportKeyword) {
        throw new Error(`${file}: dynamic import() is not allowed`);
      }
      if (
        ts.isIdentifier(expression) &&
        (expression.text === "require" || expression.text === "fetch" || expression.text === "eval")
      ) {
        throw new Error(`${file}: ${expression.text}() is not allowed`);
      }
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "process" &&
      node.name.text === "env"
    ) {
      throw new Error(`${file}: environment access is not allowed`);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
}

function assertAuthorPack(source, file) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS,
  );
  const imports = [];
  function visit(node) {
    if (ts.isImportDeclaration(node)) imports.push(node);
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  assertNoRuntimeCalls(sourceFile, file);
  if (imports.length !== 1) throw new Error(`${file}: expected only import type { Article }`);
  const declaration = imports[0];
  const specifier = declaration.moduleSpecifier;
  const clause = declaration.importClause;
  const named = clause?.namedBindings;
  const imported = named && ts.isNamedImports(named) ? named.elements : [];
  if (
    !clause?.isTypeOnly ||
    !ts.isStringLiteral(specifier) ||
    specifier.text !== "../articles" ||
    imported.length !== 1 ||
    imported[0]?.name.text !== "Article" ||
    imported[0]?.propertyName
  ) {
    throw new Error(`${file}: expected only import type { Article } from "../articles"`);
  }
}

function transpilePack(source, file) {
  const result = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      verbatimModuleSyntax: false,
      importHelpers: false,
      isolatedModules: true,
    },
    reportDiagnostics: true,
  });
  if (result.diagnostics?.length) {
    const message = result.diagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
      .join("\n");
    throw new Error(`${file}: ${message}`);
  }
  const javascript = result.outputText;
  const sourceFile = ts.createSourceFile(
    `${file}.js`,
    javascript,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.JS,
  );
  const leftovers = [];
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) leftovers.push("import");
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (leftovers.length) throw new Error(`${file}: transpiled pack still has a runtime import`);
  assertNoRuntimeCalls(sourceFile, file);
  return javascript;
}

async function importTranspiled(javascript) {
  const href = `data:text/javascript;charset=utf-8;base64,${Buffer.from(javascript).toString("base64")}`;
  try {
    return await import(href);
  } catch {
    const dir = mkdtempSync(path.join(tmpdir(), "iota-depth-pack-"));
    const file = path.join(dir, "pack.mjs");
    writeFileSync(file, javascript);
    try {
      return await import(pathToFileURL(file).href);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
}

function isPlain(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function localizedText(value, label) {
  if (!isPlain(value)) throw new Error(`${label} must include five locales`);
  for (const locale of LOCALES) {
    if (typeof value[locale] !== "string" || !value[locale].trim()) {
      throw new Error(`${label} is missing ${locale}`);
    }
  }
}

function validateGuide(guide, project, file) {
  if (!isPlain(guide)) throw new Error(`${file}: each guide must be an object`);
  if (typeof guide.slug !== "string" || !PROJECT_ID.test(guide.slug)) {
    throw new Error(`${file}: guide slug is invalid`);
  }
  if (guide.project !== project)
    throw new Error(`${file}: ${guide.slug} must belong to ${project}`);
  localizedText(guide.title, `${file} ${guide.slug} title`);
  localizedText(guide.description, `${file} ${guide.slug} description`);
  localizedText(guide.summary, `${file} ${guide.slug} summary`);
  localizedText(guide.topic, `${file} ${guide.slug} topic`);
  if (!isPlain(guide.body)) throw new Error(`${file}: ${guide.slug} body is missing`);
  for (const locale of LOCALES) {
    const blocks = guide.body[locale];
    if (
      !Array.isArray(blocks) ||
      blocks.length === 0 ||
      blocks.some((block) => typeof block !== "string" || !block.trim())
    ) {
      throw new Error(`${file}: ${guide.slug} body is missing ${locale}`);
    }
  }
  if (
    guide.published !== undefined &&
    (typeof guide.published !== "string" || !DATE.test(guide.published))
  ) {
    throw new Error(`${file}: ${guide.slug} has an invalid published date`);
  }
  if (
    guide.modified !== undefined &&
    (typeof guide.modified !== "string" || !DATE.test(guide.modified))
  ) {
    throw new Error(`${file}: ${guide.slug} has an invalid modified date`);
  }
  if (guide.sources !== undefined) {
    if (!Array.isArray(guide.sources))
      throw new Error(`${file}: ${guide.slug} sources are invalid`);
    for (const source of guide.sources) {
      if (!isPlain(source) || typeof source.name !== "string" || !source.name.trim()) {
        throw new Error(`${file}: ${guide.slug} has an invalid source`);
      }
      let url;
      try {
        url = new URL(source.url);
      } catch {
        throw new Error(`${file}: ${guide.slug} has an invalid source URL`);
      }
      if (url.protocol !== "https:")
        throw new Error(`${file}: ${guide.slug} source must use https`);
    }
  }
  if (guide.questions !== undefined) {
    if (!isPlain(guide.questions)) throw new Error(`${file}: ${guide.slug} questions are invalid`);
    for (const locale of LOCALES) {
      const rows = guide.questions[locale];
      if (
        !Array.isArray(rows) ||
        rows.some(
          (row) =>
            !isPlain(row) ||
            typeof row.question !== "string" ||
            !row.question.trim() ||
            typeof row.answer !== "string" ||
            !row.answer.trim(),
        )
      ) {
        throw new Error(`${file}: ${guide.slug} questions are missing ${locale}`);
      }
    }
  }
  if (guide.related !== undefined) {
    if (
      !Array.isArray(guide.related) ||
      guide.related.some((slug) => typeof slug !== "string" || !PROJECT_ID.test(slug))
    ) {
      throw new Error(`${file}: ${guide.slug} related links are invalid`);
    }
  }
  if (guide.keywords !== undefined) {
    if (!isPlain(guide.keywords)) throw new Error(`${file}: ${guide.slug} keywords are invalid`);
    for (const locale of LOCALES) {
      const words = guide.keywords[locale];
      if (!Array.isArray(words) || words.some((word) => typeof word !== "string")) {
        throw new Error(`${file}: ${guide.slug} keywords are missing ${locale}`);
      }
    }
  }
  return guide;
}

function guideList(mod, project, file) {
  const lists = Object.entries(mod).filter(([, value]) => Array.isArray(value));
  if (lists.length !== 1) throw new Error(`${file}: expected one exported guide array`);
  const guides = lists[0][1];
  if (guides.length !== 5) throw new Error(`${file}: expected exactly five guides`);
  const validated = guides.map((guide) => validateGuide(guide, project, file));
  if (new Set(validated.map((guide) => guide.slug)).size !== 5) {
    throw new Error(`${file}: guide slugs must be unique`);
  }
  return validated;
}

function metadata(guide) {
  const meta = {
    slug: guide.slug,
    project: guide.project,
    topic: pickLocales(guide.topic),
    title: pickLocales(guide.title),
    description: pickLocales(guide.description),
    body: Object.fromEntries(LOCALES.map((locale) => [locale, []])),
  };
  if (guide.published) meta.published = guide.published;
  if (guide.modified) meta.modified = guide.modified;
  if (guide.related) meta.related = [...guide.related];
  return meta;
}

function pickLocales(value) {
  return Object.fromEntries(LOCALES.map((locale) => [locale, value[locale]]));
}

function renderManifest(ids, metas) {
  const modules =
    ids.length === 0
      ? "export const acceptedPackModules: Record<string, () => Promise<Record<string, unknown>>> = {};\n"
      : `export const acceptedPackModules = import.meta.glob(\n  [\n${ids
          .map((id) => `    "./${id}.ts",\n`)
          .join(
            "",
          )}  ],\n  { eager: false },\n) as unknown as Record<string, () => Promise<Record<string, unknown>>>;\n`;
  return `// Generated by scripts/generate-project-depth.mjs. Do not edit by hand.
import type { Article } from "../articles";

export const acceptedDepthProjectIds: readonly string[] = ${JSON.stringify(ids)};

export const projectDepthMeta = ${JSON.stringify(metas, null, 2)} as Article[];

${modules}`;
}

async function main() {
  const paths = readArguments();
  const ids = readAllowlist(paths.allowlist);
  const metas = [];
  for (const id of ids) {
    const file = packFile(paths.packs, id);
    const source = readFileSync(file, "utf8");
    assertAuthorPack(source, file);
    const javascript = transpilePack(source, file);
    const loaded = guideList(await importTranspiled(javascript), id, file);
    metas.push(...loaded.map(metadata));
  }
  const temporary = `${paths.out}.tmp`;
  writeFileSync(temporary, renderManifest(ids, metas));
  renameSync(temporary, paths.out);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
