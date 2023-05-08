const e = new TextEncoder();
function bytesToHex(bytes: ArrayBuffer) {
  return Array.from(bytes as any, (byte) =>
    (byte as number).toString(16).padStart(2, "0")
  ).join("");
}

module.exports.stringToHex = function stringToHex(string: string) {
  return bytesToHex(e.encode(string));
};

module.exports.randomString = function randomString() {
  return require("crypto").randomBytes(32).toString("hex");
};
