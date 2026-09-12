import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, "..", "..");
const rawDir = path.join(rootDir, "demo-output", "recordings", "raw");
const assetsDir = path.join(rootDir, "demo-output", "video", "assets");
const tempDir = path.join(rootDir, "demo-output", "video", "temp");
const outDir = path.join(rootDir, "demo-output", "video");

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Raw clips mapped by timestamp and content
const sceneFiles = {
  patient: path.join(rawDir, "page@ffe3149daf66f37ffe1204233e79161e.webm"),
  reception: path.join(rawDir, "page@fda332ffcc2b7a568b9b1a72e081ba85.webm"),
  bot: path.join(rawDir, "page@07f83bdee482e1cb124f182839384075.webm"),
  admin: path.join(rawDir, "page@33d78580f8442ecc86eef5c2d92897ad.webm"),
};

const introImg = path.join(assetsDir, "intro_slide.png");
const outroImg = path.join(assetsDir, "outro_slide.png");

const lt1 = path.join(assetsDir, "lt1_patient_discovery.png");
const lt2 = path.join(assetsDir, "lt2_patient_ticket.png");
const lt3 = path.join(assetsDir, "lt3_live_sync.png");
const lt4 = path.join(assetsDir, "lt4_reception_desk.png");
const lt5 = path.join(assetsDir, "lt5_public_display.png");
const lt6 = path.join(assetsDir, "lt6_smartbot.png");
const lt7 = path.join(assetsDir, "lt7_admin_analytics.png");

function run(cmd) {
  console.log(`[EXEC] ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function assemble() {
  console.log("==========================================");
  console.log("Assembling Professional Product Demo Videos");
  console.log("==========================================");

  // 1. Generate Title Cards
  console.log("\n1. Rendering Intro & Outro title card clips...");
  const introFull = path.join(tempDir, "intro_full.mp4");
  const introCV = path.join(tempDir, "intro_cv.mp4");
  const outroFull = path.join(tempDir, "outro_full.mp4");
  const outroCV = path.join(tempDir, "outro_cv.mp4");

  run(`ffmpeg -y -loop 1 -t 4 -i "${introImg}" -f lavfi -t 4 -i anullsrc=r=48000:cl=stereo -vf "fps=30,scale=1920:1080,format=yuv420p" -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${introFull}"`);
  run(`ffmpeg -y -loop 1 -t 3.5 -i "${introImg}" -f lavfi -t 3.5 -i anullsrc=r=48000:cl=stereo -vf "fps=30,scale=1920:1080,format=yuv420p" -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${introCV}"`);
  run(`ffmpeg -y -loop 1 -t 5 -i "${outroImg}" -f lavfi -t 5 -i anullsrc=r=48000:cl=stereo -vf "fps=30,scale=1920:1080,format=yuv420p" -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${outroFull}"`);
  run(`ffmpeg -y -loop 1 -t 4 -i "${outroImg}" -f lavfi -t 4 -i anullsrc=r=48000:cl=stereo -vf "fps=30,scale=1920:1080,format=yuv420p" -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${outroCV}"`);

  // 2. Process Scene A (Patient Flow) with timed lower-third overlays
  console.log("\n2. Processing Scene A (Patient Journey with real-time YOUR TURN)...");
  const sceneAPath = path.join(tempDir, "scene_a_overlaid.mp4");
  const filterA = `[0:v]fps=30,scale=1920:1080,format=yuv420p[base];` +
    `[base][1:v]overlay=enable='between(t,0,13)'[tmp1];` +
    `[tmp1][2:v]overlay=enable='between(t,13,22)'[tmp2];` +
    `[tmp2][3:v]overlay=enable='between(t,22,32)'[v]`;

  run(`ffmpeg -y -i "${sceneFiles.patient}" -i "${lt1}" -i "${lt2}" -i "${lt3}" -f lavfi -t 31.44 -i anullsrc=r=48000:cl=stereo -filter_complex "${filterA}" -map "[v]" -map 4:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${sceneAPath}"`);

  // 3. Process Scene B (Reception & Public Display)
  console.log("\n3. Processing Scene B (Reception Console & Public Display)...");
  const sceneBPath = path.join(tempDir, "scene_b_overlaid.mp4");
  const filterB = `[0:v]fps=30,scale=1920:1080,format=yuv420p[base];` +
    `[base][1:v]overlay=enable='between(t,0,14.5)'[tmp1];` +
    `[tmp1][2:v]overlay=enable='between(t,14.5,23)'[v]`;

  run(`ffmpeg -y -i "${sceneFiles.reception}" -i "${lt4}" -i "${lt5}" -f lavfi -t 22.64 -i anullsrc=r=48000:cl=stereo -filter_complex "${filterB}" -map "[v]" -map 3:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${sceneBPath}"`);

  // 4. Process Scene C (SmartBot AI Assistant)
  console.log("\n4. Processing Scene C (SmartBot AI)...");
  const sceneCPath = path.join(tempDir, "scene_c_overlaid.mp4");
  const filterC = `[0:v]fps=30,scale=1920:1080,format=yuv420p[base];` +
    `[base][1:v]overlay=enable='between(t,0,14)'[v]`;

  run(`ffmpeg -y -i "${sceneFiles.bot}" -i "${lt6}" -f lavfi -t 13.16 -i anullsrc=r=48000:cl=stereo -filter_complex "${filterC}" -map "[v]" -map 2:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${sceneCPath}"`);

  // 5. Process Scene D (Admin Portal & Operational Analytics)
  console.log("\n5. Processing Scene D (Admin Portal & Analytics)...");
  const sceneDPath = path.join(tempDir, "scene_d_overlaid.mp4");
  const filterD = `[0:v]fps=30,scale=1920:1080,format=yuv420p[base];` +
    `[base][1:v]overlay=enable='between(t,0,26)'[v]`;

  run(`ffmpeg -y -i "${sceneFiles.admin}" -i "${lt7}" -f lavfi -t 25.08 -i anullsrc=r=48000:cl=stereo -filter_complex "${filterD}" -map "[v]" -map 2:a -c:v libx264 -preset fast -crf 18 -c:a aac -shortest "${sceneDPath}"`);

  // 6. Concatenate Full Demo
  console.log("\n6. Concatenating Smart-Queue-System-Full-Demo.mp4...");
  const fullConcatList = path.join(tempDir, "full_concat.txt");
  const fullClips = [introFull, sceneAPath, sceneBPath, sceneCPath, sceneDPath, outroFull];
  fs.writeFileSync(fullConcatList, fullClips.map((c) => `file '${c.replace(/\\/g, "/")}'`).join("\n"));

  const fullDemoRaw = path.join(tempDir, "full_demo_raw.mp4");
  const fullDemoOut = path.join(outDir, "Smart-Queue-System-Full-Demo.mp4");
  run(`ffmpeg -y -f concat -safe 0 -i "${fullConcatList}" -c copy "${fullDemoRaw}"`);
  // Clean normalization pass ensuring monotonic timestamps and clean decoding
  run(`ffmpeg -y -i "${fullDemoRaw}" -avoid_negative_ts make_zero -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k "${fullDemoOut}"`);

  // 7. Assemble Fast-Paced CV Recruiter Demo (~76 seconds)
  console.log("\n7. Preparing trimmed clips for Smart-Queue-System-CV-Demo.mp4...");
  const cvA1 = path.join(tempDir, "cv_a1.mp4");
  const cvA2 = path.join(tempDir, "cv_a2.mp4");
  const cvB1 = path.join(tempDir, "cv_b1.mp4");
  const cvB2 = path.join(tempDir, "cv_b2.mp4");
  const cvC = path.join(tempDir, "cv_c.mp4");
  const cvD = path.join(tempDir, "cv_d.mp4");

  // CV clips:
  // Patient Discovery & Join: 0 to 14s
  run(`ffmpeg -y -ss 0 -to 14 -i "${sceneAPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvA1}"`);
  // Patient Live Tracker & YOUR TURN: 22 to 31.44s
  run(`ffmpeg -y -ss 22 -to 31.44 -i "${sceneAPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvA2}"`);
  // Reception Desk Call Next: 0 to 14.5s
  run(`ffmpeg -y -ss 0 -to 14.5 -i "${sceneBPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvB1}"`);
  // Public Display: 14.5 to 22.64s
  run(`ffmpeg -y -ss 14.5 -to 22.64 -i "${sceneBPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvB2}"`);
  // SmartBot AI: 0 to 10s
  run(`ffmpeg -y -ss 0 -to 10 -i "${sceneCPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvC}"`);
  // Admin & Analytics: 12 to 24s
  run(`ffmpeg -y -ss 12 -to 24 -i "${sceneDPath}" -c:v libx264 -preset fast -crf 18 -c:a aac "${cvD}"`);

  const cvConcatList = path.join(tempDir, "cv_concat.txt");
  const cvClips = [introCV, cvA1, cvA2, cvB1, cvB2, cvC, cvD, outroCV];
  fs.writeFileSync(cvConcatList, cvClips.map((c) => `file '${c.replace(/\\/g, "/")}'`).join("\n"));

  const cvDemoRaw = path.join(tempDir, "cv_demo_raw.mp4");
  const cvDemoOut = path.join(outDir, "Smart-Queue-System-CV-Demo.mp4");
  run(`ffmpeg -y -f concat -safe 0 -i "${cvConcatList}" -c copy "${cvDemoRaw}"`);
  run(`ffmpeg -y -i "${cvDemoRaw}" -avoid_negative_ts make_zero -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k "${cvDemoOut}"`);

  console.log("\n==========================================");
  console.log("Both Demo Videos Assembled Successfully!");
  console.log("Full Demo:", fullDemoOut);
  console.log("CV Demo:", cvDemoOut);
  console.log("==========================================");
}

assemble().catch(console.error);
