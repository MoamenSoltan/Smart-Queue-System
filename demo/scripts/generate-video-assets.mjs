import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "..", "..", "demo-output", "video", "assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const introHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Intro Slide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      background: radial-gradient(circle at 80% 20%, #1e1b4b 0%, #090d16 60%, #030712 100%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #f8fafc;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(circle at center, black, transparent 80%);
    }
    .glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
      filter: blur(60px);
      top: 10%;
      left: 20%;
    }
    .glow-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
      filter: blur(60px);
      bottom: 10%;
      right: 20%;
    }
    .container {
      position: relative;
      z-index: 10;
      text-align: center;
      max-width: 1380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }
    .top-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.35);
      border-radius: 100px;
      padding: 10px 24px;
      font-size: 17px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #38bdf8;
      backdrop-filter: blur(12px);
    }
    .pulse-dot {
      width: 10px;
      height: 10px;
      background: #38bdf8;
      border-radius: 50%;
      box-shadow: 0 0 12px #38bdf8;
    }
    .main-title {
      font-family: 'Outfit', sans-serif;
      font-size: 88px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -2px;
      background: linear-gradient(135deg, #ffffff 30%, #cbd5e1 70%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: -8px;
    }
    .highlight-span {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 26px;
      color: #94a3b8;
      font-weight: 500;
      max-width: 980px;
      line-height: 1.4;
    }
    .attribution-card {
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85));
      border: 1px solid rgba(56, 189, 248, 0.28);
      border-radius: 20px;
      padding: 24px 44px;
      display: flex;
      align-items: center;
      gap: 36px;
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px rgba(14, 165, 233, 0.1);
      backdrop-filter: blur(16px);
      margin-top: 10px;
    }
    .attr-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      text-align: left;
    }
    .attr-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #64748b;
    }
    .attr-value {
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
    }
    .attr-value.highlight {
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .divider {
      width: 1px;
      height: 48px;
      background: rgba(255, 255, 255, 0.12);
    }
    .tech-stack {
      display: flex;
      gap: 14px;
      margin-top: 8px;
    }
    .tech-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 8px 18px;
      font-size: 15px;
      font-weight: 600;
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>
  <div class="glow-2"></div>

  <div class="container">
    <div class="top-badge">
      <div class="pulse-dot"></div>
      Official Product Demonstration
    </div>

    <h1 class="main-title">
      Smart <span class="highlight-span">Queue System</span>
    </h1>

    <p class="subtitle">
      Real-Time Healthcare Virtual Ticketing, Automated Counter Routing & AI Assistance
    </p>

    <div class="attribution-card">
      <div class="attr-item">
        <span class="attr-label">Patient Experience</span>
        <span class="attr-value highlight">
          Virtual QR Tickets &bull; Live Tracker
        </span>
      </div>
      <div class="divider"></div>
      <div class="attr-item">
        <span class="attr-label">Counter Operations</span>
        <span class="attr-value">
          Real-Time Desk &bull; Digital Signage
        </span>
      </div>
      <div class="divider"></div>
      <div class="attr-item">
        <span class="attr-label">Clinic Intelligence</span>
        <span class="attr-value">
          SmartBot AI (EN/AR) &bull; Analytics
        </span>
      </div>
    </div>

    <div class="tech-stack">
      <div class="tech-pill">Angular 21</div>
      <div class="tech-pill">Node.js / Express</div>
      <div class="tech-pill">MongoDB</div>
      <div class="tech-pill">Socket.IO (< 50ms)</div>
      <div class="tech-pill">Chart.js Analytics</div>
    </div>
  </div>
</body>
</html>
`;

const outroHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Outro Slide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      background: radial-gradient(circle at 20% 80%, #1e1b4b 0%, #090d16 60%, #030712 100%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #f8fafc;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(circle at center, black, transparent 80%);
    }
    .glow {
      position: absolute;
      width: 650px;
      height: 650px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
      filter: blur(70px);
      bottom: 10%;
      left: 15%;
    }
    .container {
      position: relative;
      z-index: 10;
      text-align: center;
      max-width: 1400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 36px;
    }
    .main-title {
      font-family: 'Outfit', sans-serif;
      font-size: 68px;
      font-weight: 900;
      letter-spacing: -1.5px;
      color: #ffffff;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      width: 100%;
    }
    .card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 28px;
      text-align: left;
      backdrop-filter: blur(12px);
    }
    .card.primary-highlight {
      border-color: rgba(56, 189, 248, 0.45);
      background: linear-gradient(145deg, rgba(14, 165, 233, 0.15), rgba(30, 41, 59, 0.8));
    }
    .card-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 14px;
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
    }
    .card h3 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 10px;
      color: #ffffff;
    }
    .card p {
      font-size: 15px;
      line-height: 1.5;
      color: #94a3b8;
    }
    .footer-box {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(56, 189, 248, 0.3);
      border-radius: 16px;
      padding: 20px 48px;
      display: flex;
      align-items: center;
      gap: 40px;
      width: 100%;
      justify-content: space-between;
    }
    .f-left {
      text-align: left;
    }
    .f-title {
      font-size: 19px;
      font-weight: 700;
      color: #f8fafc;
    }
    .f-desc {
      font-size: 14px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .f-badge {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      font-weight: 700;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>

  <div class="container">
    <h2 class="main-title">Architecture & Platform Highlights</h2>

    <div class="cards-grid">
      <div class="card primary-highlight">
        <span class="card-badge">Patient Flow</span>
        <h3>Virtual Ticketing & Tracker</h3>
        <p>Clinic discovery, doctor queue selection, instant QR ticket generation, live position tracking, and automated real-time "YOUR TURN" push alerts.</p>
      </div>

      <div class="card">
        <span class="card-badge">Desk Operations</span>
        <h3>Reception Console & Signage</h3>
        <p>Real-time queue desk controls with "Call Next", "Mark Done", and audio-enabled multi-counter waiting room public display boards.</p>
      </div>

      <div class="card">
        <span class="card-badge">AI & Intelligence</span>
        <h3>SmartBot & Admin Analytics</h3>
        <p>Bilingual (EN/AR) AI queue assistant powered by function calling, paired with comprehensive 30-day operational analytics and audit trails.</p>
      </div>
    </div>

    <div class="footer-box">
      <div class="f-left">
        <div class="f-title">Smart Queue System &bull; Real-Time Healthcare Queue Platform</div>
        <div class="f-desc">Full-Stack Architecture: Angular 21, Node.js, Express, MongoDB, Socket.IO, Chart.js</div>
      </div>
      <div class="f-badge">Open Source Platform Demo</div>
    </div>
  </div>
</body>
</html>
`;

// Lower-Third Templates
function getLowerThirdHtml(category, headline, subtext) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1920px;
      height: 1080px;
      background: transparent;
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow: hidden;
      position: relative;
    }
    .banner {
      position: absolute;
      bottom: 50px;
      left: 60px;
      background: rgba(10, 15, 29, 0.88);
      border: 1px solid rgba(56, 189, 248, 0.4);
      border-left: 6px solid #38bdf8;
      border-radius: 14px;
      padding: 18px 32px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(14, 165, 233, 0.15);
      backdrop-filter: blur(16px);
      max-width: 1100px;
    }
    .category-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 10px;
      border-radius: 6px;
    }
    .badge.mine {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }
    .headline {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.5px;
    }
    .subtext {
      font-size: 16px;
      color: #94a3b8;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="banner">
    <div class="category-row">
      <span class="badge">${category}</span>
    </div>
    <div class="headline">${headline}</div>
    <div class="subtext">${subtext}</div>
  </div>
</body>
</html>`;
}

const lowerThirds = [
  {
    id: "lt1_patient_discovery",
    category: "Patient Experience",
    headline: "Clinic Discovery & Specialized Doctor Queues",
    subtext: "Instant multi-clinic discovery, specialized doctor queue schedules, and live wait time estimates."
  },
  {
    id: "lt2_patient_ticket",
    category: "Patient Experience",
    headline: "Virtual Ticket Generation & Dynamic QR Pass",
    subtext: "Paperless queue booking with instant numeric ticket generation, QR validation, and direct tracker access."
  },
  {
    id: "lt3_live_sync",
    category: "Real-Time Synchronization",
    headline: "Live Position Tracking & Socket.IO 'YOUR TURN' Alert",
    subtext: "Bi-directional WebSocket sync automatically updates position count and triggers instant turn notification (<50ms)."
  },
  {
    id: "lt4_reception_desk",
    category: "Reception Operations",
    headline: "Counter Queue Console & Multi-Action Controls",
    subtext: "Desk operator manages active queues, calls next patient, marks visits complete, and manages waitlists."
  },
  {
    id: "lt5_public_display",
    category: "Digital Signage",
    headline: "Live Multi-Counter Public Display Board",
    subtext: "Digital signage display with real-time room routing and audio bell chimes for called patients."
  },
  {
    id: "lt6_smartbot",
    category: "AI Healthcare Assistant",
    headline: "SmartBot AI &mdash; Bilingual Function-Calling Queue Inquiries",
    subtext: "Natural language queue status, remaining wait time, and clinic lookup in English and Arabic."
  },
  {
    id: "lt7_admin_analytics",
    category: "Enterprise Administration",
    headline: "Clinic Operations, Historical Analytics & Credit Billing",
    subtext: "Comprehensive queue configuration, staff access control, 30-day analytics charts, and activity audit logs."
  }
];

async function generateAssets() {
  console.log("Launching Playwright to render title slides and lower-third overlays...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // 1. Render Intro Slide
  await page.setContent(introHtml);
  await page.waitForTimeout(1000);
  const introPath = path.join(assetsDir, "intro_slide.png");
  await page.screenshot({ path: introPath });
  console.log("Saved intro slide:", introPath);

  // 2. Render Outro Slide
  await page.setContent(outroHtml);
  await page.waitForTimeout(1000);
  const outroPath = path.join(assetsDir, "outro_slide.png");
  await page.screenshot({ path: outroPath });
  console.log("Saved outro slide:", outroPath);

  // 3. Render Lower-Thirds
  for (const lt of lowerThirds) {
    const html = getLowerThirdHtml(lt.category, lt.headline, lt.subtext);
    await page.setContent(html);
    await page.waitForTimeout(500);
    const ltPath = path.join(assetsDir, `${lt.id}.png`);
    await page.screenshot({ path: ltPath, omitBackground: true });
    console.log(`Saved lower third [${lt.id}]:`, ltPath);
  }

  await browser.close();
  console.log("All video assets rendered successfully!");
}

generateAssets().catch(console.error);
