# Smart Queue System — Local Demo Runbook

This runbook contains complete, self-contained instructions to run the Smart Queue System locally, seed deterministic demo data, execute all automated QA captures, and reproduce the portfolio video deliverables.

---

## 1. Prerequisites

* **Operating System:** Windows 10/11, macOS, or Linux
* **Node.js:** v18+ (tested on Node.js v24.13.0)
* **MongoDB:** Local MongoDB instance running on port `27017`
* **FFmpeg:** Available on system path (tested on FFmpeg v8.1.1)
* **Web Browser:** Playwright Chromium (installed via `npx playwright install chromium`)

---

## 2. Environment Configuration

### Backend Configuration (`server/.env`)
Ensure `server/.env` contains the following local variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart_queue_demo
JWT_SECRET=super_secret_jwt_key_for_smart_queue_demo_2026
JWT_REFRESH_SECRET=super_secret_refresh_key_for_smart_queue_demo_2026
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
NODE_ENV=development
```

### Frontend Configuration (`client/src/environments/`)
Verify that both `client/src/environments/environment.ts` and `client/src/environments/environment.development.ts` point to the local Express backend:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  socketUrl: 'http://localhost:3000'
};
```

---

## 3. Deterministic Database Seeding

To populate the local MongoDB with deterministic healthcare clinics, doctor queues, accounts, active waiting tickets, and 30 days of analytics:

```bash
# Seed deterministic demo data
npm run demo:seed

# Or to reset and re-seed from scratch
npm run demo:reset
```

### Demo Accounts Created

| Role | Email | Password | Assigned Clinic |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pulsecare.com` | `Demo@12345` | PulseCare Medical Center |
| **Receptionist** | `reception@pulsecare.com` | `Demo@12345` | PulseCare Medical Center |
| **Doctor** | `doctor@pulsecare.com` | `Demo@12345` | PulseCare Medical Center |

---

## 4. Starting the Application

Open two terminal windows:

### Terminal 1: Backend Server
```bash
cd server
node server.js
# Listening on http://localhost:3000
```

### Terminal 2: Frontend Angular Application
```bash
cd client
npm start
# Available at http://localhost:4200
```

---

## 5. Automated Screenshot Capture Pipeline

To capture all 30 high-resolution screenshots across Desktop (1920x1080) and Mobile (390x844):

```bash
# Ensure dev server is running, then execute:
node demo/scripts/capture-all-screenshots.mjs
```

Screenshots are saved directly to:
* `demo-output/screenshots/desktop/` (23 views)
* `demo-output/screenshots/mobile/` (7 views)

---

## 6. Video Demo Production Pipeline

The complete automated video production workflow consists of three automated scripts:

### Step 1: Record Raw High-Resolution Demo Scenes
```bash
node demo/scripts/record-demo-scenes.mjs
```
Records:
* `Scene A`: Patient Journey (Clinic search, queue booking as Shawky Ahmad, QR ticket, live tracker waiting state)
* `Scene B`: Reception Queue Desk (Call next ticket #13, Socket.IO real-time trigger to "YOUR TURN", mark done, public display)
* `Scene C`: SmartBot AI Assistant (Bilingual English + Arabic ticket status inquiries)
* `Scene D`: Admin Portal (KPI overview, queue modal, staff, 30-day analytics charts, billing, activity logs)

Raw video recordings are saved to `demo-output/recordings/raw/`.

### Step 2: Render Title Cards & Lower-Third Overlays
```bash
node demo/scripts/generate-video-assets.mjs
```
Renders 1080p slide PNGs in `demo-output/video/assets/`:
* `intro_slide.png` (Production title card with Shawky Ahmad attribution)
* `outro_slide.png` (Platform architecture & highlights)
* Lower-third overlays `lt1` through `lt7` with semi-transparent glassmorphic styling.

### Step 3: Video Assembly & Normalization
```bash
node demo/scripts/assemble-videos.mjs
```
Processes clips, binds lower-third overlays, and outputs:
* `demo-output/video/Smart-Queue-System-Full-Demo.mp4` (~104s, 1080p @ 30fps)
* `demo-output/video/Smart-Queue-System-CV-Demo.mp4` (~77s, 1080p @ 30fps)

---

## 7. Quality Assurance Validation

Verify video stream integrity:
```bash
ffmpeg -v error -i demo-output/video/Smart-Queue-System-Full-Demo.mp4 -f null -
ffmpeg -v error -i demo-output/video/Smart-Queue-System-CV-Demo.mp4 -f null -
```
Expected output: No errors, exit code `0`.
