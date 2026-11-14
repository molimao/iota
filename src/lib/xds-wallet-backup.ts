import type { z } from "zod";
import type { xdsPacket } from "./idle-xds";
const decode = (v: string) => Uint8Array.from(atob(v), (c) => c.charCodeAt(0));
const encode = (v: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(v)));
export async function createXdsBackupKey() {
  const keys = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    false,
    ["encrypt", "decrypt"],
  );
  const publicKey = encode(await crypto.subtle.exportKey("spki", keys.publicKey));
  return {
    privateKey: keys.privateKey,
    publicKey: `-----BEGIN PUBLIC KEY-----\n${publicKey.match(/.{1,64}/g)!.join("\n")}\n-----END PUBLIC KEY-----\n`,
  };
}
export async function encryptXdsBackup(
  privateKey: CryptoKey,
  context: string,
  packet: z.infer<typeof xdsPacket>,
  password: string,
) {
  const raw = new Uint8Array(
    await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, decode(packet.key)),
  );
  const iv = decode(packet.iv),
    data = decode(packet.data);
  const hmac = await crypto.subtle.importKey(
    "raw",
    raw.slice(32),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const message = new Uint8Array([...new TextEncoder().encode(context), ...iv, ...data]);
  if (!(await crypto.subtle.verify("HMAC", hmac, decode(packet.tag), message)))
    throw new Error("invalid_wallet_backup");
  const transport = await crypto.subtle.importKey("raw", raw.slice(0, 32), "AES-CTR", false, [
    "decrypt",
  ]);
  const wallet = await crypto.subtle.decrypt(
    { name: "AES-CTR", counter: iv, length: 128 },
    transport,
    data,
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const secret = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 600000 },
    secret,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, wallet);
  return {
    format: "iota-watch-xds-backup-v1",
    kdf: "PBKDF2-SHA256",
    iterations: 600000,
    salt: encode(salt.buffer),
    iv: encode(nonce.buffer),
    data: encode(encrypted),
  };
}

export async function decryptXdsBackup(
  file: { format: string; iterations: number; salt: string; iv: string; data: string },
  password: string,
) {
  if (file.format !== "iota-watch-xds-backup-v1" || file.iterations !== 600000)
    throw new Error("invalid_wallet_backup");
  const secret = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: decode(file.salt), iterations: 600000 },
    secret,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const wallet = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: decode(file.iv) },
    key,
    decode(file.data),
  );
  return JSON.parse(new TextDecoder().decode(wallet)) as {
    wallet: string;
    password: string;
    address: string;
  };
}
