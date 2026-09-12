# Smart Queue System — Screenshot Manifest

**Directory:** `demo-output/screenshots/`  
**Total Screenshots Captured:** 30  
**Viewports:** Desktop (1920×1080 @1x) & Mobile iPhone (390×844 @2x)  
**QA Status:** Approved — 100% Verified

---

## Desktop Viewport (1920 × 1080)

### Patient Experience Flow (Shawky Ahmad Contribution)

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `01-patient-clinics.png` | `/patient/clinics` | Public / Patient | Flagship clinic cards (PulseCare, Apex, NovaCare), search bar, queue counts, active ticket indicator banner. |
| `02-patient-clinic-detail.png` | `/patient/clinic/:id` | Public / Patient | PulseCare clinic overview, address, active doctor queues with live waiting counts & estimated wait times. |
| `03-patient-join-modal.png` | `/patient/clinic/:id` (Modal) | Public / Patient | Queue booking modal for patient name entry and virtual ticket request. |
| `04-patient-ticket-confirm.png` | `/patient/ticket/:id?mode=confirm` | Public / Patient | Confirmation state featuring dynamic QR Code for phone handoff, ticket number (#13), and clinic details. |
| `05-patient-ticket-track.png` | `/patient/ticket/:id?mode=track` | Public / Patient | Live queue tracker showing current queue position (people ahead), dynamic ETA, and leave queue modal trigger. |
| `06-patient-ticket-called.png` | `/patient/ticket/:id?mode=track` | Public / Patient | Real-time **YOUR TURN** alert state (Ticket #12) indicating doctor readiness. |
| `07-patient-smartbot-active.png` | `/patient/clinics` | Public / Patient | SmartBot AI conversational assistant executing real-time queue lookup tools in active chat overlay. |

### Authentication

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `08-auth-login.png` | `/auth/login` | Public | Modern split-pane login interface with form validation, role-based redirect, and error states. |
| `09-auth-register.png` | `/auth/register` | Public | Clinic onboarding & admin registration with validation and plan selection. |

### Clinic Admin Portal

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `10-admin-dashboard.png` | `/admin/dashboard` | Admin | KPI overview (719 total patients, 4 active queues, 14m avg wait), active queue progress, recent activity feed. |
| `11-admin-queues.png` | `/admin/queues` | Admin | Multi-doctor queue management table showing status, served count, waiting count, avg wait, and actions. |
| `12-admin-queue-modal.png` | `/admin/queues` (Modal) | Admin | Modal dialog for creating a new doctor queue with average service window configuration. |
| `13-admin-staff.png` | `/admin/staff` | Admin | Reception staff accounts list, role badges, active status indicators, and password reset actions. |
| `14-admin-staff-modal.png` | `/admin/staff` (Modal) | Admin | Front-desk staff invitation and credential provisioning modal. |
| `15-admin-settings.png` | `/admin/settings` | Admin | Clinic details, contact information, branding settings, and clinic activation controls. |
| `16-admin-activity.png` | `/admin/activity` | Admin | Complete immutable audit trail logging queue creations, ticket calls, staff additions, and system events. |
| `17-admin-analytics.png` | `/admin/analytics` | Admin | Operational intelligence dashboard: Date range picker, Today/Week/Month metrics, Daily ticket trendline, 24h Peak hours distribution. |
| `18-admin-billing.png` | `/admin/billing` | Admin | Credit balance widget (250 credits), top-up credit packages, payment history transactions with Stripe session IDs. |

### Reception Desk & Public Display

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `19-reception-dashboard.png` | `/reception/dashboard` | Reception | Receptionist queue overview showing all department queues with active patient counts and quick action buttons. |
| `20-reception-queue-control.png` | `/reception/queue/:id` | Reception | High-focus counter control room: "Now Serving" counter (A-012), waiting list, Call Next, Skip, Recall, Mark Done action bar with keyboard shortcuts. |
| `21-reception-public-display.png` | `/reception/display` | Reception | Large-screen waiting room board displaying all active doctors, called tickets, live clock, dark-mode styling, and speech synthesis chime. |

### System Fallback Views

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `22-system-unauthorized.png` | `/unauthorized` | System | Role guard enforcement fallback screen preventing unauthorized access. |
| `23-system-not-found.png` | `/**` | System | Clean branded 404 Not Found error view. |

---

## Mobile Viewport (390 × 844 — iPhone 14 / 15)

### Patient Experience Flow (Shawky Ahmad Contribution)

| Filename | Route | Role | Purpose & Features Visible |
|---|---|---|---|
| `m01-patient-clinics.png` | `/patient/clinics` | Public / Patient | Responsive mobile clinic discovery cards with sticky search and SmartBot FAB. |
| `m02-patient-clinic-detail.png` | `/patient/clinic/:id` | Public / Patient | Mobile doctor queue listings with real-time waiting badges. |
| `m03-patient-join-modal.png` | `/patient/clinic/:id` (Modal) | Public / Patient | Mobile bottom-sheet booking modal for ticket intake. |
| `m04-patient-ticket-confirm.png` | `/patient/ticket/:id?mode=confirm` | Public / Patient | Mobile virtual ticket slip with high-contrast scannable QR Code. |
| `m05-patient-ticket-track.png` | `/patient/ticket/:id?mode=track` | Public / Patient | Mobile live position tracking screen with estimated wait time and leave queue option. |
| `m06-patient-ticket-called.png` | `/patient/ticket/:id?mode=track` | Public / Patient | Mobile instant "YOUR TURN" alert screen with arrival instructions. |
| `m07-patient-smartbot.png` | `/patient/clinics` | Public / Patient | Mobile conversational AI assistant answering queue status questions in Arabic. |
