import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "http://localhost:4200";
const outputDisplayDir = path.join(__dirname, "..", "..", "demo-output", "screenshots", "desktop", "display");

async function captureDisplay() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log("Logging in as Reception...");
  await page.goto(`${BASE_URL}/auth/login`);
  await page.waitForLoadState("networkidle");
  await page.fill('#email', "reception@pulsecare.com");
  await page.fill('#password', "Demo@12345");
  await page.click('button.btn-auth');
  await page.waitForURL("**/reception/**", { timeout: 10000 });

  console.log("Navigating to public display...");
  await page.goto(`${BASE_URL}/reception/display`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);

  // Click audio overlay to unlock
  const overlay = page.locator(".audio-overlay");
  if (await overlay.isVisible()) {
    await overlay.click();
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: path.join(outputDisplayDir, "21-reception-public-display.png") });
  await browser.close();
  console.log("Public display recaptured with audio unlocked.");
}

captureDisplay().catch(console.error);
