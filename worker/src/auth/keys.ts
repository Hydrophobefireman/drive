function buf2hex(ui: Uint16Array) {
  return [...ui].map((x) => x.toString(16).padStart(2, "0")).join("");
}

const encoder = new TextEncoder();
export async function hash(str: string) {
  return buf2hex(
    new Uint16Array(
      await crypto.subtle.digest({name: "sha-512"}, encoder.encode(str))
    )
  );
}
