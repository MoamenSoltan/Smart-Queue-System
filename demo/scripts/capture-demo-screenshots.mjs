import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "../../server/node_modules/mongoose/index.js";

import Clinic from "../../server/models/clinicModel.js";
import Queue from "../../server/models/queueModel.js";
import Ticket from "../../server/models/ticketModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URL = "mongodb://localhost:27017/smart_queue_demo";
const BASE_URL = "http://localhost:4200";

const outputDirs = {
  desktopPatient: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "patient"),
  desktopAuth: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "auth"),
  desktopAdmin: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "admin"),
  desktopReception: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "reception"),
  desktopDisplay: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "display"),
  desktopSystem: path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "system"),
  mobilePatient: path.join(__dirname, "..", "..", "demo-output", "screenshots", "mobile", "patient"),
};

Object.values(outputDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function run() {
  console.log("Connecting to database to retrieve live seed IDs...");
  await mongoose.connect(MONGODB_URL);

  const pulseCare = await Clinic.findOne({ name: "PulseCare Medical Center" });
  if (!pulseCare) throw new Error("PulseCare clinic not found in database! Please seed first.");

  const cardioQueue = await Queue.findOne({ clinicId: pulseCare._id, name: /Cardiology/i });
  const calledTicket = await Ticket.findOne({ queueId: cardioQueue._id, status: "called" });
  const waitingTicket = await Ticket.findOne({ queueId: cardioQueue._id, status: "waiting" }).sort({ number: 1 });

  console.log("Found Demo Entities:");
  console.log("Clinic ID:", pulseCare._id.toString());
  console.log("Cardio Queue ID:", cardioQueue._id.toString());
  console.log("Called Ticket (#12):", calledTicket._id.toString());
  console.log("Waiting Ticket (#13):", waitingTicket._id.toString());

  await mongoose.disconnect();

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none"],
  });

  const stabilize = async (page, delay = 1500) => {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(delay);
  };

  // ==========================================
  // 1. DESKTOP VIEWPORT (1920x1080)
  // ==========================================
  console.log("\n==========================================");
  console.log("Capturing Desktop Screenshots (1920x1080)...");
  console.log("==========================================");

  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await desktopContext.newPage();

  // 01. Patient Clinics
  console.log("1. Capturing 01-patient-clinics.png");
  await page.goto(`${BASE_URL}/patient/clinics`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopPatient, "01-patient-clinics.png") });

  // 02. Patient Clinic Detail
  console.log("2. Capturing 02-patient-clinic-detail.png");
  await page.goto(`${BASE_URL}/patient/clinic/${pulseCare._id}`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopPatient, "02-patient-clinic-detail.png") });

  // 03. Patient Join Modal
  console.log("3. Capturing 03-patient-join-modal.png");
  const joinBtn = page.locator(".queue-card button.btn-primary, button:has-text('Take Ticket'), button:has-text('Join')").first();
  if (await joinBtn.isVisible()) {
    await joinBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDirs.desktopPatient, "03-patient-join-modal.png") });
    const closeBtn = page.locator(".modal-close, button:has-text('Cancel')").first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // 04. Patient Ticket Confirmation (QR Code)
  console.log("4. Capturing 04-patient-ticket-confirm.png");
  await page.goto(`${BASE_URL}/patient/ticket/${waitingTicket._id}?mode=confirm`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopPatient, "04-patient-ticket-confirm.png") });

  // 05. Patient Live Ticket Tracker
  console.log("5. Capturing 05-patient-ticket-track.png");
  await page.goto(`${BASE_URL}/patient/ticket/${waitingTicket._id}?mode=track`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopPatient, "05-patient-ticket-track.png") });

  // 06. Patient Ticket Called (YOUR TURN alert)
  console.log("6. Capturing 06-patient-ticket-called.png");
  await page.goto(`${BASE_URL}/patient/ticket/${calledTicket._id}?mode=track`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopPatient, "06-patient-ticket-called.png") });

  // 07. SmartBot AI Assistant Active
  console.log("7. Capturing 07-patient-smartbot-active.png");
  await page.goto(`${BASE_URL}/patient/clinics`);
  await stabilize(page, 1200);
  const botBtn = page.locator("#chatbot-toggle-btn");
  if (await botBtn.isVisible()) {
    await botBtn.click();
    await page.waitForTimeout(800);
    const input = page.locator(".chatbot-input, input[type='text']").last();
    const sendBtn = page.locator(".chatbot-send-btn, button[type='submit']").last();
    await input.fill("How long do I have to wait for ticket #13?");
    await sendBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(outputDirs.desktopPatient, "07-patient-smartbot-active.png") });
    // Close bot
    await botBtn.click();
    await page.waitForTimeout(400);
  }

  // 08. Auth Login
  console.log("8. Capturing 08-auth-login.png");
  await page.goto(`${BASE_URL}/auth/login`);
  await stabilize(page, 1200);
  await page.screenshot({ path: path.join(outputDirs.desktopAuth, "08-auth-login.png") });

  // 09. Auth Register
  console.log("9. Capturing 09-auth-register.png");
  await page.goto(`${BASE_URL}/auth/register`);
  await stabilize(page, 1200);
  await page.screenshot({ path: path.join(outputDirs.desktopAuth, "09-auth-register.png") });

  // Log in as Admin to capture Admin views
  console.log("Logging in as Admin (admin@pulsecare.com)...");
  await page.goto(`${BASE_URL}/auth/login`);
  await stabilize(page, 800);
  await page.fill('input[type="email"]', "admin@pulsecare.com");
  await page.fill('input[type="password"]', "Demo@12345");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/**", { timeout: 10000 });
  await stabilize(page, 2000);

  // 10. Admin Dashboard
  console.log("10. Capturing 10-admin-dashboard.png");
  await page.goto(`${BASE_URL}/admin/dashboard`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "10-admin-dashboard.png") });

  // 11. Admin Queues
  console.log("11. Capturing 11-admin-queues.png");
  await page.goto(`${BASE_URL}/admin/queues`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "11-admin-queues.png") });

  // 12. Admin Queue Create Modal
  console.log("12. Capturing 12-admin-queue-modal.png");
  const createQueueBtn = page.locator("button:has-text('Add Queue'), button:has-text('Create Queue'), .btn-primary").first();
  if (await createQueueBtn.isVisible()) {
    await createQueueBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "12-admin-queue-modal.png") });
    const cancelModal = page.locator(".modal-close, button:has-text('Cancel')").first();
    if (await cancelModal.isVisible()) await cancelModal.click();
  }

  // 13. Admin Staff
  console.log("13. Capturing 13-admin-staff.png");
  await page.goto(`${BASE_URL}/admin/staff`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "13-admin-staff.png") });

  // 14. Admin Staff Modal
  console.log("14. Capturing 14-admin-staff-modal.png");
  const addStaffBtn = page.locator("button:has-text('Add Staff'), button:has-text('New Staff'), .btn-primary").first();
  if (await addStaffBtn.isVisible()) {
    await addStaffBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "14-admin-staff-modal.png") });
    const cancelStaff = page.locator(".modal-close, button:has-text('Cancel')").first();
    if (await cancelStaff.isVisible()) await cancelStaff.click();
  }

  // 15. Admin Settings
  console.log("15. Capturing 15-admin-settings.png");
  await page.goto(`${BASE_URL}/admin/settings`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "15-admin-settings.png") });

  // 16. Admin Activity Log
  console.log("16. Capturing 16-admin-activity.png");
  await page.goto(`${BASE_URL}/admin/activity`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "16-admin-activity.png") });

  // 17. Admin Analytics
  console.log("17. Capturing 17-admin-analytics.png");
  await page.goto(`${BASE_URL}/admin/analytics`);
  await stabilize(page, 2500); // Allow Chart.js charts to finish rendering
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "17-admin-analytics.png") });

  // 18. Admin Billing
  console.log("18. Capturing 18-admin-billing.png");
  await page.goto(`${BASE_URL}/admin/billing`);
  await stabilize(page, 1500);
  await page.screenshot({ path: path.join(outputDirs.desktopAdmin, "18-admin-billing.png") });

  await desktopContext.close();

  // ==========================================
  // 2. RECEPTION DESKTOP CONTEXT
  // ==========================================
  console.log("\nLogging in as Reception (reception@pulsecare.com)...");
  const receptionContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const receptionPage = await receptionContext.newPage();

  await receptionPage.goto(`${BASE_URL}/auth/login`);
  await stabilize(receptionPage, 800);
  await receptionPage.fill('input[type="email"]', "reception@pulsecare.com");
  await receptionPage.fill('input[type="password"]', "Demo@12345");
  await receptionPage.click('button[type="submit"]');
  await receptionPage.waitForURL("**/reception/**", { timeout: 10000 });
  await stabilize(receptionPage, 1500);

  // 19. Reception Dashboard
  console.log("19. Capturing 19-reception-dashboard.png");
  await receptionPage.goto(`${BASE_URL}/reception/dashboard`);
  await stabilize(receptionPage, 1500);
  await receptionPage.screenshot({ path: path.join(outputDirs.desktopReception, "19-reception-dashboard.png") });

  // 20. Reception Queue Control
  console.log("20. Capturing 20-reception-queue-control.png");
  await receptionPage.goto(`${BASE_URL}/reception/queue/${cardioQueue._id}`);
  await stabilize(receptionPage, 1500);
  await receptionPage.screenshot({ path: path.join(outputDirs.desktopReception, "20-reception-queue-control.png") });

  // 21. Public Waiting Room Display
  console.log("21. Capturing 21-reception-public-display.png");
  await receptionPage.goto(`${BASE_URL}/reception/display`);
  await stabilize(receptionPage, 2000);
  await receptionPage.screenshot({ path: path.join(outputDirs.desktopDisplay, "21-reception-public-display.png") });

  await receptionContext.close();

  // ==========================================
  // 3. SYSTEM VIEWS
  // ==========================================
  console.log("\nCapturing System Views...");
  const systemContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const systemPage = await systemContext.newPage();

  // 22. System Unauthorized
  console.log("22. Capturing 22-system-unauthorized.png");
  await systemPage.goto(`${BASE_URL}/unauthorized`);
  await stabilize(systemPage, 1000);
  await systemPage.screenshot({ path: path.join(outputDirs.desktopSystem, "22-system-unauthorized.png") });

  // 23. System Not Found (404)
  console.log("23. Capturing 23-system-not-found.png");
  await systemPage.goto(`${BASE_URL}/404-page-not-found-demo`);
  await stabilize(systemPage, 1000);
  await systemPage.screenshot({ path: path.join(outputDirs.desktopSystem, "23-system-not-found.png") });

  await systemContext.close();

  // ==========================================
  // 4. MOBILE VIEWPORT (390x844 - iPhone 14/15)
  // ==========================================
  console.log("\n==========================================");
  console.log("Capturing Mobile Patient Views (390x844)...");
  console.log("==========================================");

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const mPage = await mobileContext.newPage();

  // m01. Mobile Patient Clinics
  console.log("m1. Capturing m01-patient-clinics.png");
  await mPage.goto(`${BASE_URL}/patient/clinics`);
  await stabilize(mPage, 1500);
  await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m01-patient-clinics.png") });

  // m02. Mobile Patient Clinic Detail
  console.log("m2. Capturing m02-patient-clinic-detail.png");
  await mPage.goto(`${BASE_URL}/patient/clinic/${pulseCare._id}`);
  await stabilize(mPage, 1500);
  await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m02-patient-clinic-detail.png") });

  // m03. Mobile Patient Join Modal
  console.log("m3. Capturing m03-patient-join-modal.png");
  const mJoinBtn = mPage.locator(".queue-card button.btn-primary, button:has-text('Take Ticket'), button:has-text('Join')").first();
  if (await mJoinBtn.isVisible()) {
    await mJoinBtn.click();
    await mPage.waitForTimeout(600);
    await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m03-patient-join-modal.png") });
    const mCloseBtn = mPage.locator(".modal-close, button:has-text('Cancel')").first();
    if (await mCloseBtn.isVisible()) await mCloseBtn.click();
    await mPage.waitForTimeout(400);
  }

  // m04. Mobile Patient Ticket Confirmation (QR Code)
  console.log("m4. Capturing m04-patient-ticket-confirm.png");
  await mPage.goto(`${BASE_URL}/patient/ticket/${waitingTicket._id}?mode=confirm`);
  await stabilize(mPage, 1500);
  await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m04-patient-ticket-confirm.png") });

  // m05. Mobile Patient Live Ticket Tracker
  console.log("m5. Capturing m05-patient-ticket-track.png");
  await mPage.goto(`${BASE_URL}/patient/ticket/${waitingTicket._id}?mode=track`);
  await stabilize(mPage, 1500);
  await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m05-patient-ticket-track.png") });

  // m06. Mobile Patient Ticket Called (YOUR TURN)
  console.log("m6. Capturing m06-patient-ticket-called.png");
  await mPage.goto(`${BASE_URL}/patient/ticket/${calledTicket._id}?mode=track`);
  await stabilize(mPage, 1500);
  await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m06-patient-ticket-called.png") });

  // m07. Mobile Patient SmartBot
  console.log("m7. Capturing m07-patient-smartbot.png");
  await mPage.goto(`${BASE_URL}/patient/clinics`);
  await stabilize(mPage, 1200);
  const mBotBtn = mPage.locator("#chatbot-toggle-btn");
  if (await mBotBtn.isVisible()) {
    await mBotBtn.click();
    await mPage.waitForTimeout(800);
    const mInput = mPage.locator(".chatbot-input, input[type='text']").last();
    const mSendBtn = mPage.locator(".chatbot-send-btn, button[type='submit']").last();
    await mInput.fill("فاضلي قد إيه على دوري في التذكرة 13؟");
    await mSendBtn.click();
    await mPage.waitForTimeout(2000);
    await mPage.screenshot({ path: path.join(outputDirs.mobilePatient, "m07-patient-smartbot.png") });
  }

  await mobileContext.close();
  await browser.close();

  console.log("\n==========================================");
  console.log("All 30 Screenshots Captured Successfully!");
  console.log("==========================================");
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
