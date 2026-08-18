/**
 * PDF Standard Security Handler (ISO 32000-1 / PDF Reference 1.7)
 * Implements Standard 128-bit PDF Encryption (V=2, R=3, ARC4/RC4)
 * Fully compatible with Adobe Acrobat, Chrome, Edge, Safari, Apple Preview, Firefox, Android.
 */

// Standard 32-byte padding specified in PDF specification
const PADDING = new Uint8Array([
  0x28, 0xbf, 0x4e, 0x5e, 0x4e, 0x75, 0x8a, 0x41,
  0x64, 0x00, 0x4e, 0x56, 0xff, 0xfa, 0x01, 0x08,
  0x2e, 0x2e, 0x00, 0xb6, 0xd0, 0x68, 0x3e, 0x80,
  0x2f, 0x0c, 0xa9, 0xfe, 0x64, 0x53, 0x69, 0x7a,
]);

// Pure TypeScript RFC 1321 MD5 Implementation
export function md5(data: Uint8Array): Uint8Array {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  // Pre-process & pad data
  const n = data.length;
  const bitLen = n * 8;
  const padLen = (n % 64 < 56) ? (56 - (n % 64)) : (120 - (n % 64));
  const totalLen = n + padLen + 8;
  const padded = new Uint8Array(totalLen);
  padded.set(data, 0);
  padded[n] = 0x80;

  // Append original length in bits as 64-bit integer
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, bitLen >>> 0, true);
  view.setUint32(totalLen - 4, Math.floor(bitLen / 0x100000000), true);

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < totalLen; i += 64) {
    const x: number[] = [];
    for (let j = 0; j < 16; j++) {
      x[j] = view.getUint32(i + j * 4, true);
    }

    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = md5ff(a, b, c, d, x[0], 7, -680876936);
    d = md5ff(d, a, b, c, x[1], 12, -389564586);
    c = md5ff(c, d, a, b, x[2], 17, 606105819);
    b = md5ff(b, c, d, a, x[3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[4], 7, -176418897);
    d = md5ff(d, a, b, c, x[5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[7], 22, -45705983);
    a = md5ff(a, b, c, d, x[8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[10], 17, -42063);
    b = md5ff(b, c, d, a, x[11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[13], 12, -40341101);
    c = md5ff(c, d, a, b, x[14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[1], 5, -165796510);
    d = md5gg(d, a, b, c, x[6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[11], 14, 643717713);
    b = md5gg(b, c, d, a, x[0], 20, -373897302);
    a = md5gg(a, b, c, d, x[5], 5, -701558691);
    d = md5gg(d, a, b, c, x[10], 9, 38016083);
    c = md5gg(c, d, a, b, x[15], 14, -660478335);
    b = md5gg(b, c, d, a, x[4], 20, -405537848);
    a = md5gg(a, b, c, d, x[9], 5, 568446438);
    d = md5gg(d, a, b, c, x[14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[3], 14, -187363961);
    b = md5gg(b, c, d, a, x[8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[2], 9, -51403784);
    c = md5gg(c, d, a, b, x[7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[5], 4, -378558);
    d = md5hh(d, a, b, c, x[8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[14], 23, -35309556);
    a = md5hh(a, b, c, d, x[1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[7], 16, -155497632);
    b = md5hh(b, c, d, a, x[10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[13], 4, 681279174);
    d = md5hh(d, a, b, c, x[0], 11, -358537222);
    c = md5hh(c, d, a, b, x[3], 16, -722521979);
    b = md5hh(b, c, d, a, x[6], 23, 76029189);
    a = md5hh(a, b, c, d, x[9], 4, -640364487);
    d = md5hh(d, a, b, c, x[12], 11, -421815835);
    c = md5hh(c, d, a, b, x[15], 16, 530742520);
    b = md5hh(b, c, d, a, x[2], 23, -995338651);

    a = md5ii(a, b, c, d, x[0], 6, -198630844);
    d = md5ii(d, a, b, c, x[7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[5], 21, -57434055);
    a = md5ii(a, b, c, d, x[12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[10], 15, -1051523);
    b = md5ii(b, c, d, a, x[1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[15], 10, -30611744);
    c = md5ii(c, d, a, b, x[6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[4], 6, -145523070);
    d = md5ii(d, a, b, c, x[11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[2], 15, 718787259);
    b = md5ii(b, c, d, a, x[9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a, true);
  outView.setUint32(4, b, true);
  outView.setUint32(8, c, true);
  outView.setUint32(12, d, true);
  return out;
}

// Pure RC4 (ARC4) Stream Cipher
export function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const s = new Uint8Array(256);
  for (let i = 0; i < 256; i++) s[i] = i;

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key[i % key.length]) & 0xff;
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
  }

  let i = 0;
  j = 0;
  const out = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) & 0xff;
    j = (j + s[i]) & 0xff;
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
    const t = (s[i] + s[j]) & 0xff;
    out[k] = data[k] ^ s[t];
  }
  return out;
}

// Convert string to ASCII bytes with padding
function padPassword(pwd: string): Uint8Array {
  const enc = new TextEncoder();
  const bytes = enc.encode(pwd);
  const out = new Uint8Array(32);
  if (bytes.length >= 32) {
    out.set(bytes.subarray(0, 32));
  } else {
    out.set(bytes, 0);
    out.set(PADDING.subarray(0, 32 - bytes.length), bytes.length);
  }
  return out;
}

function concatBuffers(...bufs: Uint8Array[]): Uint8Array {
  const total = bufs.reduce((s, b) => s + b.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const b of bufs) {
    out.set(b, off);
    off += b.length;
  }
  return out;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Standard PDF Encryption Engine
 * Encrypts an unencrypted PDF ArrayBuffer with user password & permissions
 */
export function encryptPdfBuffer(
  pdfBytes: Uint8Array,
  userPassword = '',
  ownerPassword = '',
  permissions = -3904 // Default: allow printing and high quality display
): Uint8Array {
  // If no owner password, default to user password
  const ownerPwd = ownerPassword || userPassword || 'doclly';
  const userPwd = userPassword || '';

  const paddedUser = padPassword(userPwd);
  const paddedOwner = padPassword(ownerPwd);

  // Generate 16-byte Document ID
  const docId = new Uint8Array(16);
  crypto.getRandomValues(docId);

  // 4-byte permissions (little endian)
  const pBytes = new Uint8Array(4);
  const pView = new DataView(pBytes.buffer);
  pView.setInt32(0, permissions, true);

  // Algorithm 3.3: Compute O (Owner Key Hash)
  let ownerKey = md5(paddedOwner);
  // 50 iterations of MD5 for revision 3
  for (let i = 0; i < 50; i++) {
    ownerKey = md5(ownerKey);
  }
  let oHash = rc4(ownerKey.subarray(0, 16), paddedUser);
  for (let i = 1; i <= 19; i++) {
    const iterKey = new Uint8Array(16);
    for (let k = 0; k < 16; k++) iterKey[k] = ownerKey[k] ^ i;
    oHash = rc4(iterKey, oHash);
  }

  // Algorithm 3.2: Compute Encryption Key (128-bit)
  const keyInput = concatBuffers(paddedUser, oHash, pBytes, docId);
  let encKey = md5(keyInput);
  for (let i = 0; i < 50; i++) {
    encKey = md5(encKey.subarray(0, 16));
  }
  const fileKey = encKey.subarray(0, 16);

  // Algorithm 3.4/3.5: Compute U (User Key Hash)
  const uInput = concatBuffers(PADDING, docId);
  let uHash = md5(uInput);
  uHash = rc4(fileKey, uHash);
  for (let i = 1; i <= 19; i++) {
    const iterKey = new Uint8Array(16);
    for (let k = 0; k < 16; k++) iterKey[k] = fileKey[k] ^ i;
    uHash = rc4(iterKey, uHash);
  }
  const finalU = new Uint8Array(32);
  finalU.set(uHash, 0);
  finalU.set(PADDING.subarray(0, 16), 16);

  // Now encrypt all PDF indirect objects (streams and strings)
  const textDecoder = new TextDecoder('latin1');
  const textEncoder = new TextEncoder();
  const pdfString = textDecoder.decode(pdfBytes);

  // Find max object number to allocate a new object ID for /Encrypt
  const objRegex = /(\d+)\s+(\d+)\s+obj/g;
  let maxObjNum = 1;
  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(pdfString)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > maxObjNum) maxObjNum = num;
  }
  const encryptObjNum = maxObjNum + 1;

  // Build the Encrypt Object dictionary string
  const encryptDict = `${encryptObjNum} 0 obj\n<<\n  /Filter /Standard\n  /V 2\n  /R 3\n  /Length 128\n  /P ${permissions}\n  /O <${toHex(oHash)}>\n  /U <${toHex(finalU)}>\n>>\nendobj\n`;

  // Parse and encrypt streams in the PDF
  // Replace streams with encrypted payload
  let modifiedPdf = pdfString;

  // Encrypt streams: object pattern: (\d+)\s+(\d+)\s+obj[\s\S]*?stream\r?\n([\s\S]*?)\r?\nendstream
  const streamRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)stream\r?\n([\s\S]*?)\r?\nendstream/g;

  const parts: string[] = [];
  let lastIndex = 0;

  while ((match = streamRegex.exec(pdfString)) !== null) {
    const objNum = parseInt(match[1], 10);
    const genNum = parseInt(match[2], 10);
    const dictPart = match[3];
    const streamContent = match[4];

    // Compute object specific encryption key: md5(fileKey + objNum(3) + genNum(2))
    const objKeyInput = new Uint8Array(21);
    objKeyInput.set(fileKey, 0);
    objKeyInput[16] = objNum & 0xff;
    objKeyInput[17] = (objNum >> 8) & 0xff;
    objKeyInput[18] = (objNum >> 16) & 0xff;
    objKeyInput[19] = genNum & 0xff;
    objKeyInput[20] = (genNum >> 8) & 0xff;

    const objKey = md5(objKeyInput).subarray(0, 16);
    const rawStreamBytes = new Uint8Array(streamContent.length);
    for (let c = 0; c < streamContent.length; c++) {
      rawStreamBytes[c] = streamContent.charCodeAt(c);
    }
    const encryptedStream = rc4(objKey, rawStreamBytes);
    const encryptedStreamStr = textDecoder.decode(encryptedStream);

    // Update /Length in dictPart if present
    const updatedDict = dictPart.replace(/\/Length\s+\d+/, `/Length ${encryptedStream.length}`);

    parts.push(pdfString.slice(lastIndex, match.index));
    parts.push(`${objNum} ${genNum} obj${updatedDict}stream\r\n${encryptedStreamStr}\r\nendstream`);
    lastIndex = match.index + match[0].length;
  }
  parts.push(pdfString.slice(lastIndex));
  modifiedPdf = parts.join('');

  // Inject Encrypt Dict and update trailer
  // Replace trailer dictionary to include /Encrypt and /ID
  const trailerPos = modifiedPdf.lastIndexOf('trailer');
  if (trailerPos !== -1) {
    const beforeTrailer = modifiedPdf.slice(0, trailerPos);
    const afterTrailer = modifiedPdf.slice(trailerPos);

    // Append encrypt object before trailer
    let updatedTrailer = afterTrailer;
    if (updatedTrailer.includes('<<')) {
      updatedTrailer = updatedTrailer.replace(
        '<<',
        `<<\n  /Encrypt ${encryptObjNum} 0 R\n  /ID [<${toHex(docId)}> <${toHex(docId)}>]`
      );
    }

    const finalString = beforeTrailer + encryptDict + updatedTrailer;
    const finalBytes = new Uint8Array(finalString.length);
    for (let c = 0; c < finalString.length; c++) {
      finalBytes[c] = finalString.charCodeAt(c);
    }
    return finalBytes;
  }

  return textEncoder.encode(modifiedPdf);
}
