import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "http://localhost:4200";
const outputAdminDir = path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "admin");

async function captureModals() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log("Logging in as Admin...");
  await page.goto(`${BASE_URL}/auth/login`);
  await page.waitForLoadState("networkidle");
  await page.fill('#email', "admin@pulsecare.com");
  await page.fill('#password', "Demo@12345");
  await page.click('button.btn-auth');
  await page.waitForURL("**/admin/**", { timeout: 10000 });

  // 12. Admin Queue Modal
  console.log("Capturing 12-admin-queue-modal.png");
  await page.goto(`${BASE_URL}/admin/queues`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  const addQueueBtn = page.locator("app-admin-button:has-text('New queue'), button:has-text('New queue')").first();
  await addQueueBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputAdminDir, "12-admin-queue-modal.png") });

  // 14. Admin Staff Modal
  console.log("Capturing 14-admin-staff-modal.png");
  await page.goto(`${BASE_URL}/admin/staff`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  const addStaffBtn = page.locator("app-admin-button:has-text('Invite user'), button:has-text('Invite user')").first();
  await addStaffBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputAdminDir, "14-admin-staff-modal.png") });

  await browser.close();
  console.log("Admin modals captured successfully.");
}

captureModals().catch(console.error);
