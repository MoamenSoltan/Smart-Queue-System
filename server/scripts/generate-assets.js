import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "uploads");
const clientAssetsDir = path.join(__dirname, "..", "..", "client", "public", "assets");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(clientAssetsDir)) fs.mkdirSync(clientAssetsDir, { recursive: true });

// PulseCare Medical Center SVG
const pulseCareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="24" fill="url(#bgGrad)" />
  <circle cx="300" cy="160" r="70" fill="#0369a1" fill-opacity="0.4" />
  <path d="M 160 210 L 230 210 L 250 170 L 275 250 L 305 130 L 335 240 L 355 190 L 375 210 L 440 210" 
        fill="none" stroke="url(#pulseGrad)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
  <text x="300" y="310" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">PulseCare</text>
  <text x="300" y="345" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#94a3b8" text-anchor="middle" letter-spacing="3">MEDICAL CENTER</text>
</svg>`;

// Apex Health Clinic SVG
const apexSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="apexBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="24" fill="url(#apexBg)" />
  <polygon points="300,100 230,220 370,220" fill="#34d399" opacity="0.85" />
  <polygon points="300,140 260,210 340,210" fill="#064e3b" />
  <circle cx="300" cy="205" r="15" fill="#a7f3d0" />
  <text x="300" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">Apex Health</text>
  <text x="300" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#a7f3d0" text-anchor="middle" letter-spacing="2">FAMILY CLINIC</text>
</svg>`;

// NovaCare Specialty Center SVG
const novaCareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="novaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="24" fill="url(#novaBg)" />
  <circle cx="300" cy="160" r="50" fill="none" stroke="#c084fc" stroke-width="8" />
  <circle cx="300" cy="160" r="30" fill="#c084fc" opacity="0.8" />
  <text x="300" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">NovaCare</text>
  <text x="300" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#ddd6fe" text-anchor="middle" letter-spacing="2">SPECIALTY CENTER</text>
</svg>`;

fs.writeFileSync(path.join(uploadsDir, "pulsecare.svg"), pulseCareSvg);
fs.writeFileSync(path.join(uploadsDir, "apex.svg"), apexSvg);
fs.writeFileSync(path.join(uploadsDir, "novacare.svg"), novaCareSvg);

// Write default fallback asset
fs.writeFileSync(path.join(clientAssetsDir, "default-clinic.jpg"), pulseCareSvg);
fs.writeFileSync(path.join(clientAssetsDir, "default-clinic.svg"), pulseCareSvg);

console.log("Successfully generated medical clinic assets.");
