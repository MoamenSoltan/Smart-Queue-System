# Repository Audit & Architectural Analysis
**Project:** Smart Queue System  
**Audit Date:** September 12, 2026  
**Auditor / Roles:** Senior Full-Stack Engineer, QA Engineer, Product Specialist  
**Attribution Scope:** Team Project • Personal Contribution: Patient Queue Flow (Shawky Ahmad)

---

## 1. Technical Stack Overview

### Frontend
- **Framework:** Angular 21.2.0 (Standalone Component Architecture with Angular Signals)
- **Component Libraries:** Angular CDK & Angular Material 21.2.9
- **Data Visualization:** Chart.js 4.5.1 & ng2-charts 5.0.4
- **Real-Time Client:** Socket.IO Client 4.8.3
- **Utilities:** QRCode 1.5.4, RxJS 7.8.0, TypeScript 5.9.2
- **Build Tool:** `@angular/build:application` (esbuild-powered Angular CLI 21.2.7)

### Backend
- **Runtime:** Node.js (v24.13.0, ECMAScript Modules `"type": "module"`)
- **Web Framework:** Express 5.2.1
- **Database ORM:** Mongoose 9.5.0 (MongoDB 8.2.5 engine)
- **Real-Time Engine:** Socket.IO 4.8.3 (Room-based clinic isolation `clinic:<clinicId>`)
- **Security & Authentication:** JWT (`jsonwebtoken` 9.0.3), Password Hashing (`bcrypt` 6.0.0), `cookie-parser` 1.4.7, CORS 2.8.6
- **Validation:** Zod 4.3.6 & Joi 18.1.2
- **Payment Processing:** Stripe 22.1.0 with built-in development fallback/mock checkout session
- **AI Integration:** Groq SDK / OpenAI-compatible endpoint with model `llama-3.3-70b-versatile` utilizing agentic function/tool calling
- **Push Notifications:** `web-push` 3.6.7 (VAPID protocol)

---

## 2. Architecture & Data Model Inventory

| Model | Schema File | Key Fields | Indexes | Notes |
|---|---|---|---|---|
| **Clinic** | `server/models/clinicModel.js` | `name`, `description`, `address`, `logoUrl`, `isActive` | `name: 1` | Post-save hook upserts corresponding `Credits` record |
| **User** | `server/models/userModel.js` | `name`, `email`, `password`, `role` (`admin` \| `reception`), `clinicId`, `refreshToken` | `clinicId: 1`, `email: 1 (unique)` | Bcrypt pre-save hashing; scoped to specific clinic |
| **Queue** | `server/models/queueModel.js` | `clinicId`, `name`, `currentNumber`, `avgServiceTime`, `isActive`, `totalServedCount` | `clinicId: 1`, `{clinicId: 1, isActive: 1}` | Represents doctor/department queue |
| **Ticket** | `server/models/ticketModel.js` | `clinicId`, `queueId`, `number`, `status` (`waiting` \| `called` \| `done` \| `cancelled`), `customerName`, `calledAt`, `completedAt` | Compound indexes on `{queueId: 1, status: 1}`, unique `{queueId: 1, number: 1}` | Live queue position calculated dynamically from timestamp |
| **Credits** | `server/models/creditsModel.js` | `clinicId`, `balance`, `updatedAt` | `clinicId: 1 (unique)` | Atomic `$inc` operations; required for patient ticket issuance |
| **AuditLog** | `server/models/auditLogModel.js` | `clinic`, `user`, `action`, `details`, `ipAddress` | `clinic: 1`, `user: 1`, `action: 1` | Enum actions: `CREATE_QUEUE`, `CALL_TICKET`, `COMPLETE_TICKET`, etc. |
| **Payment** | `server/models/paymentModel.js` | `clinicId`, `amount`, `credits` (50, 100, 200), `method`, `status`, `stripeSessionId`, `creditsApplied` | `clinicId: 1` | Integrates with Stripe checkout sessions |
| **Subscription** | `server/models/subscriptionModel.js` | `clinicId`, `plan` (`starter`, `pro`, `enterprise`), `startDate`, `endDate`, `status` | — | Clinic billing tier tracking |

---

## 3. Real-Time Socket.IO Infrastructure

- **Room Partitioning:** Clients join room `clinic:<clinicId>`.
- **Broadcast Events:**
  - `ticketCreated`: Broadcast when a patient generates a virtual ticket (`ticketId`, `queueId`, `clinicId`, `number`, `createdAt`).
  - `queueUpdated`: Broadcast on ticket issuance, call-next, skip, or cancel (`queueId`, `currentNumber`, `waitingCount`, `currentlyServing`).
  - `ticketCalled`: Broadcast when reception calls a ticket (`ticketId`, `queueId`, `number`). Triggers Web Notification and audio chime.
  - `ticketDone`: Broadcast when ticket is marked completed (`ticketId`, `queueId`).

---

## 4. Feature Matrix: Implementation vs. README Claims

| Feature Area | Specific Feature | Route / API | Role | Status | Truthful Attribution |
|---|---|---|---|---|---|
| **Patient Experience** | Browse & Search Clinics | `/patient/clinics` (`GET /api/v1/patient/clinics`) | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Clinic Details & Queues | `/patient/clinic/:id` (`GET /api/v1/patient/clinics/:id`) | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Take Virtual Ticket | Modal in `/patient/clinic/:id` (`POST /api/v1/patient/tickets`) | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Virtual QR Ticket Slip | `/patient/ticket/:id?mode=confirm` | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Live Position & Wait Tracking | `/patient/ticket/:id?mode=track` (`GET /api/v1/patient/tickets/:id`) | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Real-Time "YOUR TURN" Alert | Socket event `ticketCalled` | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Leave / Cancel Queue Flow | `DELETE /api/v1/patient/tickets/:id` | Public | Implemented & Demo-Ready | **Shawky Ahmad** |
| **Patient Experience** | Push Notifications | `POST /api/v1/patient/notifications/subscribe` | Public | Implemented (Requires VAPID keys) | **Shawky Ahmad** |
| **Reception** | Reception Dashboard | `/reception/dashboard` (`GET /api/v1/reception/queues`) | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Queue Control Center | `/reception/queue/:id` | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Call Next Ticket | `POST /api/v1/reception/queues/:id/call-next` | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Call Specific Ticket | `PATCH /api/v1/reception/tickets/:id/call` | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Mark Ticket Done | `PATCH /api/v1/reception/tickets/:id/done` | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Skip Ticket | `PATCH /api/v1/reception/tickets/:id/skip` | Reception | Implemented & Demo-Ready | Team Project |
| **Reception** | Recall Ticket | `PATCH /api/v1/reception/tickets/:id/recall` | Reception | Implemented & Demo-Ready | Team Project |
| **Public Display** | Waiting Room Screen | `/reception/display` | Reception | Implemented & Demo-Ready | Team Project |
| **Public Display** | Audio & Speech Synthesis | Web Speech API (`SpeechSynthesisUtterance`) | Reception | Implemented & Demo-Ready | Team Project |
| **AI SmartBot** | Chat Window & Tool Calling | Floating FAB (`POST /api/v1/chatbot/chat`) | Public | Implemented (Fallback provider needed if no Groq key) | Team Project |
| **Admin** | KPI Dashboard | `/admin/dashboard` (`GET /api/v1/admin/overview`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Queue Management (CRUD) | `/admin/queues` (`/api/v1/admin/queues`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Staff Management (CRUD) | `/admin/staff` (`/api/v1/admin/staff`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Clinic Settings | `/admin/settings` (`/api/v1/admin/clinic`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Activity / Audit Log | `/admin/activity` (`GET /api/v1/admin/activity`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Operational Analytics | `/admin/analytics` (`/api/v1/admin/analytics/*`) | Admin | Implemented & Demo-Ready | Team Project |
| **Admin** | Billing & Credit Purchases | `/admin/billing` (`/api/v1/payments/*`) | Admin | Implemented (Supports Mock Checkout) | Team Project |
| **Admin** | Legacy Credits Route | `/admin/credits` | Admin | Under Construction (Superseded by `/admin/billing`) | Team Project |
| **Auth** | Login & JWT Cookie Handling | `/auth/login` (`POST /api/v1/auth/login`) | Public | Implemented & Demo-Ready | Team Project |
| **Auth** | Clinic Registration | `/auth/register` (`POST /api/v1/auth/register`) | Public | Implemented & Demo-Ready | Team Project |

---

## 5. Critical Observations & Discrepancies

1. **Seed Script Missing in Source Code:**
   - Root `package.json` defines `"seed": "cd server && node scripts/seed.js"`, but `server/scripts/` directory was completely missing from git. A deterministic seed engine (`server/scripts/seed-demo.js`) must be engineered.
2. **Environment URLs:**
   - `client/src/environments/environment.development.ts` was hardcoded to `https://smart-queue-system-production.up.railway.app/api/v1`. For reliable local execution and zero remote data leakage, this must point to `http://localhost:3000/api/v1`.
3. **Clinic Logo Fallback:**
   - When a clinic logo is missing or relative, `ClinicDetailComponent` attempts to load `assets/default-clinic.jpg`. That asset was missing from `client/public/`. Supplying high quality clinic logos in `server/uploads/` and a clean fallback in `client/public/assets/` prevents broken image icons.
4. **Credit Requirement for Ticket Issuance:**
   - `patientController.takeTicket` executes `await deductOneCredit(clinicId);`. If clinic balance is zero, HTTP 402 is returned. Deterministic demo seed must allocate at least 250 credits to the demo clinic.
5. **Stripe & Groq API Isolation:**
   - `stripe.config.js` already includes an elegant local mock session builder.
   - For `chatbotService.js`, an isolated fallback mode will be ensured so that queries like *"How long do I have to wait for ticket #12?"* invoke the actual `toolExecutors.get_ticket_by_number` without failing even if an external Groq API key is absent.
