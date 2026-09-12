# Smart Queue System — Deterministic Demo Credentials

> [!WARNING]
> **DEMO DATA ONLY — NOT PRODUCTION CREDENTIALS**
> These accounts and credentials are created solely for local portfolio showcases, technical interview demonstrations, visual QA, and screening walkthroughs. Never use these credentials in a live production environment.

---

## Flagship Clinic Information

- **Clinic Name:** PulseCare Medical Center
- **Address:** 450 Medical Heights Blvd, Suite 200
- **Type:** Multi-Specialty Ambulatory Care & Smart Clinic
- **Starting Credits:** 250 credits
- **Active Queues:** 4 Doctor Queues (Cardiology, Pediatrics, Orthopedics, Dermatology)

---

## Demo Accounts

| Role | Name | Email | Password | Access Routes |
|---|---|---|---|---|
| **Clinic Admin** | Dr. Alexander Wright | `admin@pulsecare.com` | `Demo@12345` | `/admin/dashboard`<br>`/admin/queues`<br>`/admin/staff`<br>`/admin/settings`<br>`/admin/activity`<br>`/admin/analytics`<br>`/admin/billing` |
| **Lead Reception** | Elena Rostova | `reception@pulsecare.com` | `Demo@12345` | `/reception/dashboard`<br>`/reception/queue/:id`<br>`/reception/display` |
| **Secondary Reception** | Marcus Vance | `reception2@pulsecare.com` | `Demo@12345` | `/reception/dashboard`<br>`/reception/queue/:id`<br>`/reception/display` |

---

## Patient Demo Flows (No Login Required)

- **Browse Clinics:** `http://localhost:4200/patient/clinics`
- **Clinic Detail & Queue Join:** `http://localhost:4200/patient/clinic/:clinicId`
- **Direct Join:** `http://localhost:4200/join`
- **Track Active Ticket:** `http://localhost:4200/patient/ticket/:ticketId?mode=track`
- **Ticket Confirmation & QR Code:** `http://localhost:4200/patient/ticket/:ticketId?mode=confirm`

---

## Deterministic Seeding Commands

To reset and re-seed the local demo database at any time:

```bash
# From workspace root
npm run demo:seed

# Or reset alias
npm run demo:reset
```
