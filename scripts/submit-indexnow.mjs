// IndexNow uses a public site-ownership proof file, not a private API credential.
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("./indexnow.json", import.meta.url), "utf8"));
const origin = `https://${config.host}`;
const fetchOptions = { signal: AbortSignal.timeout(30_000) };
const sitemap = await fetch(`${origin}/sitemap.xml`, fetchOptions);
if (!sitemap.ok) throw new Error(`Sitemap returned HTTP ${sitemap.status}`);
const xml = await sitemap.text();
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]))];
if (!urls.length || urls.length > 10_000) throw new Error("Invalid sitemap URL count");
for (const value of urls) {
  const url = new URL(value);
  if (url.origin !== origin || /\/(app|account)(\/|$)/.test(url.pathname)) {
    throw new Error(`Unexpected URL in sitemap: ${value}`);
  }
}
const proof = await fetch(config.keyLocation, { signal: AbortSignal.timeout(30_000) });
if (!proof.ok || (await proof.text()).trim() !== config.key) {
  throw new Error("Publish and verify the IndexNow proof file before submitting");
}
if (process.argv.includes("--check")) {
  console.log(
    JSON.stringify({ mode: "check", host: config.host, urls: urls.length, proof: "valid" }),
  );
  process.exit(0);
}
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ ...config, urlList: urls }),
  signal: AbortSignal.timeout(30_000),
});
const body = (await response.text()).slice(0, 400);
if (response.status !== 200 && response.status !== 202) {
  throw new Error(`IndexNow rejected submission: HTTP ${response.status} ${body}`);
}
console.log(
  JSON.stringify({
    host: config.host,
    urls: urls.length,
    status: response.status,
    result: response.status === 200 ? "submitted" : "received; ownership validation pending",
    submittedAt: new Date().toISOString(),
  }),
);
