/* esm.sh - esbuild bundle(blurhash@2.0.4) es2022 production */
var B = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "#",
    "$",
    "%",
    "*",
    "+",
    ",",
    "-",
    ".",
    ":",
    ";",
    "=",
    "?",
    "@",
    "[",
    "]",
    "^",
    "_",
    "{",
    "|",
    "}",
    "~",
  ],
  b = (t) => {
    let r = 0;
    for (let a = 0; a < t.length; a++) {
      let l = t[a],
        o = B.indexOf(l);
      r = r * 83 + o;
    }
    return r;
  },
  d = (t, r) => {
    var a = "";
    for (let l = 1; l <= r; l++) {
      let o = (Math.floor(t) / Math.pow(83, r - l)) % 83;
      a += B[Math.floor(o)];
    }
    return a;
  },
  c = (t) => {
    let r = t / 255;
    return r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  },
  g = (t) => {
    let r = Math.max(0, Math.min(1, t));
    return r <= 0.0031308
      ? Math.trunc(r * 12.92 * 255 + 0.5)
      : Math.trunc(
          (1.055 * Math.pow(r, 0.4166666666666667) - 0.055) * 255 + 0.5
        );
  },
  O = (t) => (t < 0 ? -1 : 1),
  w = (t, r) => O(t) * Math.pow(Math.abs(t), r),
  E = class extends Error {
    constructor(t) {
      super(t), (this.name = "ValidationError"), (this.message = t);
    }
  },
  $ = (t) => {
    if (!t || t.length < 6)
      throw new E("The blurhash string must be at least 6 characters");
    let r = b(t[0]),
      a = Math.floor(r / 9) + 1,
      l = (r % 9) + 1;
    if (t.length !== 4 + 2 * l * a)
      throw new E(
        `blurhash length mismatch: length is ${t.length} but it should be ${
          4 + 2 * l * a
        }`
      );
  },
  F = (t) => {
    try {
      $(t);
    } catch (r) {
      return {result: !1, errorReason: r.message};
    }
    return {result: !0};
  },
  R = (t) => {
    let r = t >> 16,
      a = (t >> 8) & 255,
      l = t & 255;
    return [c(r), c(a), c(l)];
  },
  T = (t, r) => {
    let a = Math.floor(t / 361),
      l = Math.floor(t / 19) % 19,
      o = t % 19;
    return [
      w((a - 9) / 9, 2) * r,
      w((l - 9) / 9, 2) * r,
      w((o - 9) / 9, 2) * r,
    ];
  },
  U = (t, r, a, l) => {
    $(t), (l = l | 1);
    let o = b(t[0]),
      i = Math.floor(o / 9) + 1,
      u = (o % 9) + 1,
      m = (b(t[1]) + 1) / 166,
      n = new Array(u * i);
    for (let e = 0; e < n.length; e++)
      if (e === 0) {
        let h = b(t.substring(2, 6));
        n[e] = R(h);
      } else {
        let h = b(t.substring(4 + e * 2, 6 + e * 2));
        n[e] = T(h, m * l);
      }
    let s = r * 4,
      M = new Uint8ClampedArray(s * a);
    for (let e = 0; e < a; e++)
      for (let h = 0; h < r; h++) {
        let f = 0,
          p = 0,
          x = 0;
        for (let v = 0; v < i; v++)
          for (let y = 0; y < u; y++) {
            let P =
                Math.cos((Math.PI * h * y) / r) *
                Math.cos((Math.PI * e * v) / a),
              V = n[y + v * u];
            (f += V[0] * P), (p += V[1] * P), (x += V[2] * P);
          }
        let I = g(f),
          C = g(p),
          H = g(x);
        (M[4 * h + 0 + e * s] = I),
          (M[4 * h + 1 + e * s] = C),
          (M[4 * h + 2 + e * s] = H),
          (M[4 * h + 3 + e * s] = 255);
      }
    return M;
  },
  G = U,
  A = 4,
  j = (t, r, a, l) => {
    let o = 0,
      i = 0,
      u = 0,
      m = r * A;
    for (let s = 0; s < r; s++) {
      let M = A * s;
      for (let e = 0; e < a; e++) {
        let h = M + e * m,
          f = l(s, e);
        (o += f * c(t[h])), (i += f * c(t[h + 1])), (u += f * c(t[h + 2]));
      }
    }
    let n = 1 / (r * a);
    return [o * n, i * n, u * n];
  },
  q = (t) => {
    let r = g(t[0]),
      a = g(t[1]),
      l = g(t[2]);
    return (r << 16) + (a << 8) + l;
  },
  z = (t, r) => {
    let a = Math.floor(
        Math.max(0, Math.min(18, Math.floor(w(t[0] / r, 0.5) * 9 + 9.5)))
      ),
      l = Math.floor(
        Math.max(0, Math.min(18, Math.floor(w(t[1] / r, 0.5) * 9 + 9.5)))
      ),
      o = Math.floor(
        Math.max(0, Math.min(18, Math.floor(w(t[2] / r, 0.5) * 9 + 9.5)))
      );
    return a * 19 * 19 + l * 19 + o;
  },
  D = (t, r, a, l, o) => {
    if (l < 1 || l > 9 || o < 1 || o > 9)
      throw new E("BlurHash must have between 1 and 9 components");
    if (r * a * 4 !== t.length)
      throw new E("Width and height must match the pixels array");
    let i = [];
    for (let e = 0; e < o; e++)
      for (let h = 0; h < l; h++) {
        let f = h == 0 && e == 0 ? 1 : 2,
          p = j(
            t,
            r,
            a,
            (x, I) =>
              f *
              Math.cos((Math.PI * h * x) / r) *
              Math.cos((Math.PI * e * I) / a)
          );
        i.push(p);
      }
    let u = i[0],
      m = i.slice(1),
      n = "",
      s = l - 1 + (o - 1) * 9;
    n += d(s, 1);
    let M;
    if (m.length > 0) {
      let e = Math.max(...m.map((f) => Math.max(...f))),
        h = Math.floor(Math.max(0, Math.min(82, Math.floor(e * 166 - 0.5))));
      (M = (h + 1) / 166), (n += d(h, 1));
    } else (M = 1), (n += d(0, 1));
    return (
      (n += d(q(u), 4)),
      m.forEach((e) => {
        n += d(z(e, M), 2);
      }),
      n
    );
  },
  L = D;
self.blurHash = {
  ValidationError: E,
  decode: G,
  encode: L,
  isBlurhashValid: F,
};
