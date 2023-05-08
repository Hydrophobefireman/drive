const e = new TextEncoder();
function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(bytes as any, (byte) =>
    (byte as number).toString(16).padStart(2, "0")
  ).join("");
}

export function stringToHex(string: string) {
  return bytesToHex(e.encode(string));
}

export function randomString() {
  return crypto.randomUUID() + crypto.randomUUID();
}
