import { bech32, bech32m } from "@scure/base";
export function validTscAddress(id: string) {
  if (id !== id.toLowerCase() || id.length > 90) return false;
  for (const codec of [bech32, bech32m])
    try {
      const d = codec.decode(id as `${string}1${string}`),
        version = d.words[0],
        bytes = codec.fromWords(d.words.slice(1));
      if (
        d.prefix === "tc" &&
        version !== undefined &&
        version <= 16 &&
        bytes.length >= 2 &&
        bytes.length <= 40 &&
        (version === 0 ? codec === bech32 && [20, 32].includes(bytes.length) : codec === bech32m)
      )
        return true;
    } catch {}
  return false;
}
