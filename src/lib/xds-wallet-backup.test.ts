import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { createXdsBackupKey, encryptXdsBackup, decryptXdsBackup } from "./xds-wallet-backup";

it("decrypts an actual Agent envelope in the browser and restores a password-encrypted wallet backup", async () => {
  const keys = await createXdsBackupKey();
  const root = mkdtempSync(join(tmpdir(), "xds-backup-"));
  try {
    const output = spawnSync(
      "python3",
      [
        "-c",
        `import sys,json\nfrom pathlib import Path\nsys.path.insert(0,'scripts/device-agent')\nimport iota_watch_agent as a\nv=json.load(sys.stdin)\na.ROOT=Path(v['root'])\na.xds_transport_key()\nprint(json.dumps(a.xds_seal(v['publicKey'],'wallet:backup',dict(wallet='ZW5jcnlwdGVkIHdhbGxldA==',password='fixture wallet secret',address='disc1fixture'))))`,
      ],
      { input: JSON.stringify({ root, publicKey: keys.publicKey }), encoding: "utf8" },
    );
    expect(output.status, output.stderr).toBe(0);
    const packet = JSON.parse(output.stdout);
    const backup = await encryptXdsBackup(
      keys.privateKey,
      "wallet:backup",
      packet,
      "strong backup password",
    );
    expect(JSON.stringify(backup)).not.toContain("fixture wallet secret");
    expect(await decryptXdsBackup(backup, "strong backup password")).toEqual({
      wallet: "ZW5jcnlwdGVkIHdhbGxldA==",
      password: "fixture wallet secret",
      address: "disc1fixture",
    });
    await expect(decryptXdsBackup(backup, "wrong password")).rejects.toThrow();
    await expect(
      encryptXdsBackup(keys.privateKey, "other-wallet:backup", packet, "strong backup password"),
    ).rejects.toThrow("invalid_wallet_backup");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
