import { it, expect } from "vitest";
import { bech32m, bech32, base58 } from "@scure/base";
import { projectAddressInput } from "./project-address-input";
it("validates all project batches before saving and keeps namespaces separate", () => {
  const ids = {
    noid: bech32m.encode("o", bech32m.toWords(new Uint8Array(32).fill(2))),
    acurast: "0x" + "ab".repeat(32),
    golem: "0x" + "cd".repeat(20),
    flyai: "0x" + "ef".repeat(20),
    akash: bech32.encode("akash", bech32.toWords(new Uint8Array(20).fill(3))),
    gonka: bech32.encode("gonka", bech32.toWords(new Uint8Array(20).fill(4))),
    nosana: base58.encode(new Uint8Array(32).fill(5)),
    ionet: "11111111-1111-4111-8111-111111111111",
    vast: "12345",
  } as const;
  for (const [p, id] of Object.entries(ids)) {
    const project = p as keyof typeof ids;
    expect(projectAddressInput(project, ` ${id}\r\n`, [], 5)).toEqual([id]);
    expect(() => projectAddressInput(project, `${id}\n${id}`, [], 5)).toThrow("duplicate");
    expect(() => projectAddressInput(project, id, [id], 5)).toThrow("duplicate");
    expect(() => projectAddressInput(project, `${id}\n<script>alert(1)</script>`, [], 5)).toThrow(
      "invalid",
    );
    expect(() => projectAddressInput(project, id, [], 0)).toThrow("quota");
  }
});
it("rejects saved Acurast keys and oversized batches", () => {
  const key = "0x" + "ab".repeat(32);
  expect(() => projectAddressInput("acurast", key, [key], 5)).toThrow("duplicate");
  expect(() => projectAddressInput("noid", "x".repeat(6001), [], 5)).toThrow("invalid");
  expect(() => projectAddressInput("vast", "1\n".repeat(51), [], 50)).toThrow("invalid");
});
