export async function randomSalt(length = 16): Promise<string> {
  const array = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashWithSalt(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const saltBytes = hexToBytes(saltHex);
  const passBytes = enc.encode(password);
  const combined = new Uint8Array(saltBytes.length + passBytes.length);
  combined.set(saltBytes, 0);
  combined.set(passBytes, saltBytes.length);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combined);
  return bytesToHex(new Uint8Array(hashBuffer));
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
