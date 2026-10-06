// Ciphertext is bound to its owner and project. Never serialize plaintext credentials.
const encoder = new TextEncoder();
function bytes(value: string) {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}
function base64(value: Uint8Array) {
  return btoa(String.fromCharCode(...value));
}
async function key(secret: string) {
  const raw = bytes(secret);
  if (raw.length !== 32) throw new Error("not-configured");
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
}
export async function sealCredential(token: string, user: string, project: string, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(`${user}:${project}`) },
    await key(secret),
    encoder.encode(token),
  );
  return `${base64(iv)}.${base64(new Uint8Array(encrypted))}`;
}
export async function openCredential(value: string, user: string, project: string, secret: string) {
  const [iv, data] = value.split(".");
  if (!iv || !data) throw new Error("expired");
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes(iv), additionalData: encoder.encode(`${user}:${project}`) },
    await key(secret),
    bytes(data),
  );
  return new TextDecoder().decode(plain);
}
