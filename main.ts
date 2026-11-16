import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const EXPECTED_SHA256 =
  "d54b0998a6602c4a416e5b45b77356d4a65d5ac5eeb4dab78382b2eed090c5d7";
const MAX_BYTES = 1048576;
const MAX_EDGE = 1024;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function pngSize(buf) {
  if (buf.length < 24) fail("PNG too short");
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return [width, height];
}

function jpegSize(buf) {
  let i = 2;
  while (i + 1 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = buf.readUInt16BE(i + 5);
      const width = buf.readUInt16BE(i + 7);
      return [width, height];
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  fail("JPEG SOF marker not found");
}

function imageSize(buf) {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50) {
    return pngSize(buf);
  }
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    return jpegSize(buf);
  }
  fail("entry is neither PNG nor JPEG");
}

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}
const bytes = readFileSync(join(here, "entry.png"));
if (bytes.length > MAX_BYTES) {
  fail("entry exceeds 1 MiB");
}
const [width, height] = imageSize(bytes);
if (width > MAX_EDGE || height > MAX_EDGE) {
  fail("entry exceeds 1024x1024");
}
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.png");
writeFileSync(target, bytes);
const written = readFileSync(target);
const digest = createHash("sha256").update(written).digest("hex");
if (digest !== EXPECTED_SHA256) {
  console.error("output sha256 mismatch");
  process.exit(1);
}
