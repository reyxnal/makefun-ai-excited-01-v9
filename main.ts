import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const EXPECTED_SHA256 =
  "d54b0998a6602c4a416e5b45b77356d4a65d5ac5eeb4dab78382b2eed090c5d7";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}
const bytes = readFileSync(join(here, "entry.png"));
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.png");
writeFileSync(target, bytes);
const written = readFileSync(target);
const digest = createHash("sha256").update(written).digest("hex");
if (digest !== EXPECTED_SHA256) {
  console.error("output sha256 mismatch");
  process.exit(1);
}
