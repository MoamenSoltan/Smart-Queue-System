import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { seedDemoData } from "../../server/scripts/seed-demo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "http://localhost:4200";
const rawRecordingsDir = path.join(__dirname, "..", "..", "demo-output", "recordings", "raw");

if (!fs.existsSync(rawRecordingsDir)) fs.mkdirSync(rawRecordingsDir, { recursive: true });

// Mouse cursor simulation helper for clean demo presentation
async function smoothMove(page, selector, delay = 800) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: "visible" });
  const box = await el.boundingBox();
  if (box) {
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y, { steps: 20 });
    await page.waitForTimeout(300);
  }
}

async function runRecording() {
  console.log("==========================================");
  console.log("Starting Automated Demo Recording Pipeline");
  console.log("==========================================");

  // 1. Reset database to guaranteed clean state
  console.log("Resetting database to deterministic initial state...");
  const seedInfo = await seedDemoData();
  const clinicId = seedInfo.clinicId;
  const cardioQueueId = seedInfo.cardioQueueId;

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  // ==========================================
  // SCENE A: PATIENT JOURNEY (Discovery -> Join -> QR Ticket -> Live Tracker)
  // ==========================================
  console.log("\n[Recording] Scene A: Patient Journey...");
  const patientContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: rawRecordingsDir, size: { width: 1920, height: 1080 } },
    permissions: ["notifications"],
  });
  const patientPage = await patientContext.newPage();
  patientPage.on("dialog", async (dialog) => {
    console.log("Patient dialog auto-accepted:", dialog.message());
    await dialog.accept().catch(() => {});
  });

  // 1. Discovery
  await patientPage.goto(`${BASE_URL}/patient/clinics`);
  await patientPage.waitForLoadState("networkidle");
  await patientPage.waitForTimeout(2000);

  // Smooth search demo
  await smoothMove(patientPage, ".search-input-wrapper input, input[placeholder*='Search']");
  await patientPage.fill(".search-input-wrapper input, input[placeholder*='Search']", "PulseCare");
  await patientPage.waitForTimeout(1000);
  await patientPage.fill(".search-input-wrapper input, input[placeholder*='Search']", "");
  await patientPage.waitForTimeout(1000);

  // Click on PulseCare Medical Center
  const viewClinicBtn = patientPage.locator(".clinic-card:has-text('PulseCare') .btn-primary, .clinic-card button, a:has-text('View')").first();
  await smoothMove(patientPage, ".clinic-card:has-text('PulseCare') .btn-primary, .clinic-card button, a:has-text('View')");
  await viewClinicBtn.click();
  await patientPage.waitForLoadState("networkidle");
  await patientPage.waitForTimeout(2000);

  // 2. Select Cardiology Queue & Take Ticket
  const takeTicketBtn = patientPage.locator(".queue-card:has-text('Cardiology') button, .queue-card button.btn-primary").first();
  await smoothMove(patientPage, ".queue-card:has-text('Cardiology') button, .queue-card button.btn-primary");
  await takeTicketBtn.click();
  await patientPage.waitForTimeout(1000);

  // Type Customer Name: "Shawky Ahmad"
  const nameInput = patientPage.locator("#customerName");
  if (await nameInput.isVisible()) {
    await nameInput.fill("Shawky Ahmad");
    await patientPage.waitForTimeout(800);
  }

  // Click Confirm in modal
  const confirmModalBtn = patientPage.locator(".modal-footer button.btn-primary, button:has-text('Confirm')").first();
  await confirmModalBtn.click();
  await patientPage.waitForURL("**/patient/ticket/**", { timeout: 10000 });
  await patientPage.waitForLoadState("networkidle");
  await patientPage.waitForTimeout(3000); // Highlight QR Ticket

  // 3. Click "Track my ticket" to view Live Tracker
  const trackBtn = patientPage.locator("a:has-text('Track my ticket'), button:has-text('Track my ticket')").first();
  if (await trackBtn.isVisible()) {
    await smoothMove(patientPage, "a:has-text('Track my ticket'), button:has-text('Track my ticket')");
    await trackBtn.click();
    await patientPage.waitForTimeout(2500); // Show live position and wait time
  }

  // Keep patientPage active in background for real-time sync demonstration!
  console.log("Patient ticket tracker is now connected and waiting for real-time call...");

  // ==========================================
  // SCENE B: RECEPTION & REAL-TIME SYNC
  // ==========================================
  console.log("\n[Recording] Scene B: Reception Operation & Real-Time Sync...");
  const receptionContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: rawRecordingsDir, size: { width: 1920, height: 1080 } },
  });
  const receptionPage = await receptionContext.newPage();

  // 1. Reception Login
  await receptionPage.goto(`${BASE_URL}/auth/login`);
  await receptionPage.waitForLoadState("networkidle");
  await receptionPage.fill('#email', "reception@pulsecare.com");
  await receptionPage.fill('#password', "Demo@12345");
  await receptionPage.click('button.btn-auth');
  await receptionPage.waitForURL("**/reception/**", { timeout: 10000 });
  await receptionPage.waitForLoadState("networkidle");
  await receptionPage.waitForTimeout(2000);

  // 2. Open Cardiology Queue Control
  await receptionPage.goto(`${BASE_URL}/reception/queue/${cardioQueueId}`);
  await receptionPage.waitForLoadState("networkidle");
  await receptionPage.waitForTimeout(2000);

  // 3. Call Next Ticket (Calls the newly created ticket!)
  const callNextBtn = receptionPage.locator("button:has-text('Call next'), button:has-text('Call Next')").first();
  await smoothMove(receptionPage, "button:has-text('Call next'), button:has-text('Call Next')");
  await callNextBtn.click();
  await receptionPage.waitForTimeout(2500); // Show now serving update

  // Check patient page has received the real-time YOUR TURN update!
  await patientPage.waitForTimeout(3000); // Patient view now displays "YOUR TURN"
  await patientContext.close(); // Save patient video
  console.log("Patient journey video recorded.");

  // 4. Demonstrate Reception Actions: Mark Done & Skip
  const markDoneBtn = receptionPage.locator("button:has-text('Mark done'), button:has-text('Done')").first();
  if (await markDoneBtn.isVisible()) {
    await smoothMove(receptionPage, "button:has-text('Mark done'), button:has-text('Done')");
    await markDoneBtn.click();
    await receptionPage.waitForTimeout(2000);
  }

  // 5. Open Public Display
  await receptionPage.goto(`${BASE_URL}/reception/display`);
  await receptionPage.waitForLoadState("networkidle");
  await receptionPage.waitForTimeout(1000);
  // Unlock audio
  const overlay = receptionPage.locator(".audio-overlay");
  if (await overlay.isVisible()) {
    await overlay.click();
    await receptionPage.waitForTimeout(600);
  }
  await receptionPage.waitForTimeout(3500); // Display illuminated public waiting room

  await receptionContext.close(); // Save reception video
  console.log("Reception and public display recorded.");

  // ==========================================
  // SCENE C: SMARTBOT AI ASSISTANT
  // ==========================================
  console.log("\n[Recording] Scene C: SmartBot AI Assistant...");
  const botContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: rawRecordingsDir, size: { width: 1920, height: 1080 } },
  });
  const botPage = await botContext.newPage();

  await botPage.goto(`${BASE_URL}/patient/clinics`);
  await botPage.waitForLoadState("networkidle");
  await botPage.waitForTimeout(1500);

  // Open SmartBot FAB
  const fab = botPage.locator("#chatbot-toggle-btn");
  await smoothMove(botPage, "#chatbot-toggle-btn");
  await fab.click();
  await botPage.waitForTimeout(1000);

  // English query: "How long do I have to wait for ticket #22?"
  const chatInput = botPage.locator(".chatbot-input, input[type='text']").last();
  const sendBtn = botPage.locator(".chatbot-send-btn, button[type='submit']").last();
  await chatInput.fill("How long do I have to wait for ticket #22?");
  await botPage.waitForTimeout(500);
  await sendBtn.click();
  await botPage.waitForTimeout(3500); // Show AI tool-calling answer

  // Arabic query demonstration
  await chatInput.fill("فاضلي قد إيه على دوري في التذكرة 22؟");
  await botPage.waitForTimeout(500);
  await sendBtn.click();
  await botPage.waitForTimeout(3500); // Show Arabic answer

  await botContext.close(); // Save bot video
  console.log("SmartBot AI video recorded.");

  // ==========================================
  // SCENE D: ADMIN PORTAL & OPERATIONAL ANALYTICS
  // ==========================================
  console.log("\n[Recording] Scene D: Admin Portal, Analytics & Billing...");
  const adminContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: rawRecordingsDir, size: { width: 1920, height: 1080 } },
  });
  const adminPage = await adminContext.newPage();

  // Login as Admin
  await adminPage.goto(`${BASE_URL}/auth/login`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.fill('#email', "admin@pulsecare.com");
  await adminPage.fill('#password', "Demo@12345");
  await adminPage.click('button.btn-auth');
  await adminPage.waitForURL("**/admin/**", { timeout: 10000 });
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(2500); // Show Dashboard KPIs

  // Queues Management
  await adminPage.goto(`${BASE_URL}/admin/queues`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(2000);

  // Open "New queue" modal briefly
  const addQueue = adminPage.locator("app-admin-button:has-text('New queue'), button:has-text('New queue')").first();
  if (await addQueue.isVisible()) {
    await addQueue.click();
    await adminPage.waitForTimeout(1500);
    const cancelQueue = adminPage.locator(".modal-close, button:has-text('Cancel')").first();
    if (await cancelQueue.isVisible()) await cancelQueue.click();
    await adminPage.waitForTimeout(800);
  }

  // Staff Management
  await adminPage.goto(`${BASE_URL}/admin/staff`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(2000);

  // Operational Analytics
  await adminPage.goto(`${BASE_URL}/admin/analytics`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(3500); // Showcase charts and KPIs

  // Billing & Credits
  await adminPage.goto(`${BASE_URL}/admin/billing`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(2500);

  // Activity Log
  await adminPage.goto(`${BASE_URL}/admin/activity`);
  await adminPage.waitForLoadState("networkidle");
  await adminPage.waitForTimeout(2500);

  await adminContext.close(); // Save admin video
  await browser.close();

  console.log("\n==========================================");
  console.log("All Raw Demo Scenes Recorded Successfully!");
  console.log("Raw files saved to:", rawRecordingsDir);
  console.log("==========================================");
}

runRecording().catch((err) => {
  console.error("Recording failed:", err);
  process.exit(1);
});
