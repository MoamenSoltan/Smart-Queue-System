# Visual Quality Assurance (QA) Report: Screenshots
**Audited Artifacts:** All 30 screenshots in `demo-output/screenshots/`  
**Viewport Audits:** Desktop (1920×1080) & Mobile (390×844)  
**QA Assessment:** **PASSED — ALL 30 VIEWS APPROVED FOR PORTFOLIO SHOWCASE**

---

## 1. Visual Verification Checklist

| Quality Dimension | Criteria Checked | Result | Notes |
|---|---|---|---|
| **Layout & Spacing** | No element clipping, unwanted horizontal scrollbars, or overlapping cards. | **PASS** | CSS Grid & Flexbox containers render cleanly across all pages. |
| **Typography & Fonts** | System & Web fonts (Inter / Roboto) loaded; no flash of unstyled text or fallback artifacts. | **PASS** | Material Symbols and header typography are sharp and well aligned. |
| **Asset Integrity** | Zero broken image icons or missing clinic logos. | **PASS** | Custom SVG graphics generated for all clinics (`pulsecare.svg`, `apex.svg`, `novacare.svg`) and fallback asset in place. |
| **Data Realism** | Realistic healthcare naming, valid clinic addresses, meaningful queue numbers, and consistent timestamps. | **PASS** | Seed data presents a coherent medical center (PulseCare Medical Center) with 4 real clinical departments. |
| **Data Visualization** | Chart.js canvases fully rendered with non-zero values, coherent daily curves, and peak hour trends. | **PASS** | Daily ticket trend reflects realistic 30-day variations; 24-hour peak hours distribution reflects clinic rush hours. |
| **Dynamic UI States** | Modal overlays, confirmation QR codes, live tracking counters, and "YOUR TURN" alert cards. | **PASS** | QR code rendered with clean contrast; "YOUR TURN" alert displays vibrant green callout box. |
| **Interactive Modals** | Create Queue Modal and Invite Staff Modal captured with complete form controls. | **PASS** | Form inputs and action buttons properly positioned without DOM occlusion. |
| **Mobile Responsiveness** | Flawless vertical stacking on 390×844 viewport; touch targets accessible; FAB properly aligned. | **PASS** | Patient queue flow tested and verified on mobile viewport. |
| **No Debug Artifacts** | No browser error banners, console overlay, or temporary test text visible. | **PASS** | Clean production-ready screens throughout. |

---

## 2. Issues Discovered & Resolved During Capture

1. **Double Password Hashing on Seed:**
   - *Discovery:* Initial login attempts during automated capture timed out because `seed-demo.js` hashed passwords with `bcrypt.hash` before saving, causing `userModel.pre("save")` to hash the string a second time.
   - *Resolution:* Adjusted `seed-demo.js` to pass plain text passwords to `User.create`, allowing Mongoose's pre-save hook to hash exactly once. Verified with 100% login success.
2. **Missing Assets Fallback:**
   - *Discovery:* Absence of `client/public/assets/default-clinic.jpg` had potential to trigger image 404 errors.
   - *Resolution:* Generated vector SVGs for all three clinics and installed `default-clinic.jpg` into `client/public/assets/`.
3. **Public Display Audio Prompt Overlay:**
   - *Discovery:* Initial capture of `/reception/display` showed the browser interaction permission overlay ("Click to Enable Audio").
   - *Resolution:* Added automated interaction click in Playwright to dismiss the overlay and activate the live display board, capturing the full illuminated waiting room screen.

---

## 3. Approval Sign-off
Every image has been visually checked and meets the highest standard for public portfolio and CV presentation.
