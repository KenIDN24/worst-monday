import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const LINE =
  "My agent spent Monday re-deploying the staging build it deployed Friday, then discovered the real outage was a printer in Fresno.";

const MIN = 1;
const MAX = 140;

if (LINE.length < MIN || LINE.length > MAX) {
  console.error(`entry must be ${MIN}-${MAX} characters, got ${LINE.length}`);
  process.exit(1);
}
// Reject control characters (other than the trailing newline we add),
// leading/trailing whitespace, and multi-line content.
if (/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(LINE) || LINE !== LINE.trim() || LINE.includes("\n")) {
  console.error("entry must be a single clean line with no control characters or surrounding whitespace");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the line + newline.
const onDisk = readFileSync("/output/entry.txt", "utf8");
if (onDisk !== LINE + "\n") {
  console.error("read-back mismatch: entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote /output/entry.txt (${LINE.length} chars)`);
