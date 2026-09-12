import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rawDir = path.join(__dirname, "..", "..", "demo-output", "recordings", "raw");

const files = fs.readdirSync(rawDir).filter(f => f.endsWith(".webm"));

console.log("Raw Recordings Inventory:");
for (const file of files) {
  const filePath = path.join(rawDir, file);
  const stat = fs.statSync(filePath);
  try {
    const duration = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`).toString().trim();
    const streams = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=s=x:p=0 "${filePath}"`).toString().trim();
    console.log(`- ${file}: ${parseFloat(duration).toFixed(1)}s, ${streams}, ${(stat.size / 1024).toFixed(0)} KB, modified: ${stat.mtime.toLocaleTimeString()}`);
  } catch (e) {
    console.log(`- ${file}: error probing`);
  }
}
