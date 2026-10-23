#!/usr/bin/env node
// Lock AiRE Estate course content with an access code, in the format the live course
// pages already decrypt (see decrypt() in docs/lead-to-keys-course.html):
//   AES-256-GCM; key from PBKDF2-HMAC-SHA256, 250,000 iterations, 16-byte salt; 12-byte IV.
//   The page trims and upper-cases the code before using it, so this does too.
//
//   node lock.mjs text  lesson.html          print {"salt","iv","ct"} JSON for a PAYLOAD
//   node lock.mjs media video.mp4 out.bin    write salt(16) + iv(12) + ciphertext (like l2k-m1.bin)
//   node lock.mjs open  payload.json         decrypt a payload to check it
//
// The code comes from the AIRE_LOCK_CODE environment variable or a hidden prompt. It is
// never an argument (shell history) and never written to a file. Never commit a code.
// No dependencies: Node 18+ only.
import { webcrypto as wc, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const ITER = 250000;

async function code() {
  let c = process.env.AIRE_LOCK_CODE;
  if (!c) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl._writeToOutput = () => {};
    process.stdout.write('Access code: ');
    c = await new Promise((r) => rl.question('', (a) => { rl.close(); process.stdout.write('\n'); r(a); }));
  }
  c = c.trim().toUpperCase();
  if (c.length < 6) { console.error('Access code is too short.'); process.exit(1); }
  return c;
}

async function key(c, salt, use) {
  const base = await wc.subtle.importKey('raw', new TextEncoder().encode(c), 'PBKDF2', false, ['deriveKey']);
  return wc.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base,
    { name: 'AES-GCM', length: 256 }, false, [use]);
}

async function seal(data, c) {
  const salt = randomBytes(16), iv = randomBytes(12);
  const ct = Buffer.from(await wc.subtle.encrypt({ name: 'AES-GCM', iv }, await key(c, salt, 'encrypt'), data));
  return { salt, iv, ct };
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'text' && a) {
  const { salt, iv, ct } = await seal(readFileSync(a), await code());
  console.log(JSON.stringify({ salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') }));
} else if (cmd === 'media' && a && b) {
  const { salt, iv, ct } = await seal(readFileSync(a), await code());
  writeFileSync(b, Buffer.concat([salt, iv, ct]));
  console.log(`Wrote ${b} (${ct.length} bytes of ciphertext).`);
} else if (cmd === 'open' && a) {
  const p = JSON.parse(readFileSync(a, 'utf8')), d = (x) => Buffer.from(x, 'base64');
  const pt = await wc.subtle.decrypt({ name: 'AES-GCM', iv: d(p.iv) }, await key(await code(), d(p.salt), 'decrypt'), d(p.ct));
  process.stdout.write(Buffer.from(pt).toString('utf8') + '\n');
} else {
  console.log('Usage: node lock.mjs text <file> | media <in> <out.bin> | open <payload.json>');
  process.exit(1);
}
