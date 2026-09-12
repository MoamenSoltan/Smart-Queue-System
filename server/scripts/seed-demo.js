import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import Clinic from "../models/clinicModel.js";
import User from "../models/userModel.js";
import Queue from "../models/queueModel.js";
import Ticket from "../models/ticketModel.js";
import Credits from "../models/creditsModel.js";
import AuditLog from "../models/auditLogModel.js";
import Payment from "../models/paymentModel.js";
import Subscription from "../models/subscriptionModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/smart_queue_demo";

export async function seedDemoData() {
  console.log("==========================================");
  console.log("Smart Queue System — Deterministic Demo Seeder");
  console.log("Database target:", MONGODB_URL);
  console.log("==========================================");

  // Safety check: Ensure we are only touching a demo or local database
  if (!MONGODB_URL.includes("localhost") && !MONGODB_URL.includes("127.0.0.1") && !MONGODB_URL.includes("demo")) {
    throw new Error("ABORT: Target database does not appear to be a local or demo database!");
  }

  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB successfully.");

  // Clear existing collections safely
  console.log("Resetting existing demo collections...");
  await Promise.all([
    Clinic.deleteMany({}),
    User.deleteMany({}),
    Queue.deleteMany({}),
    Ticket.deleteMany({}),
    Credits.deleteMany({}),
    AuditLog.deleteMany({}),
    Payment.deleteMany({}),
    Subscription.deleteMany({}),
  ]);

  // 1. Create Flagship Clinic & Secondary Clinics
  console.log("Seeding clinics...");
  const pulseCareClinic = await Clinic.create({
    name: "PulseCare Medical Center",
    description: "Premier multi-specialty ambulatory healthcare and smart clinic offering seamless digital queue management.",
    address: "450 Medical Heights Blvd, Suite 200",
    logoUrl: "/uploads/pulsecare.svg",
    isActive: true,
  });

  const apexClinic = await Clinic.create({
    name: "Apex Family Health Clinic",
    description: "Comprehensive primary healthcare, routine consultations, and immediate family care services.",
    address: "128 Wellness Parkway, West District",
    logoUrl: "/uploads/apex.svg",
    isActive: true,
  });

  const novaCareClinic = await Clinic.create({
    name: "NovaCare Specialty Clinic",
    description: "Advanced diagnostic imaging, specialized physical therapy, and outpatient surgical consultations.",
    address: "89 Innovation Center Way, East Wing",
    logoUrl: "/uploads/novacare.svg",
    isActive: true,
  });

  // 2. Set Credits for PulseCare (250 credits balance)
  await Credits.findOneAndUpdate(
    { clinicId: pulseCareClinic._id },
    { balance: 250, updatedAt: new Date() },
    { upsert: true }
  );
  await Credits.findOneAndUpdate(
    { clinicId: apexClinic._id },
    { balance: 120, updatedAt: new Date() },
    { upsert: true }
  );
  await Credits.findOneAndUpdate(
    { clinicId: novaCareClinic._id },
    { balance: 80, updatedAt: new Date() },
    { upsert: true }
  );

  // 3. Create Demo Users (Password: Demo@12345)
  console.log("Seeding staff and admin users...");
  const demoPassword = "Demo@12345";

  const adminUser = await User.create({
    name: "Dr. Alexander Wright",
    email: "admin@pulsecare.com",
    password: demoPassword,
    role: "admin",
    clinicId: pulseCareClinic._id,
  });

  const receptionUser = await User.create({
    name: "Elena Rostova",
    email: "reception@pulsecare.com",
    password: demoPassword,
    role: "reception",
    clinicId: pulseCareClinic._id,
  });

  const reception2User = await User.create({
    name: "Marcus Vance",
    email: "reception2@pulsecare.com",
    password: demoPassword,
    role: "reception",
    clinicId: pulseCareClinic._id,
  });

  // 4. Create Doctor Queues for PulseCare
  console.log("Seeding doctor queues...");
  const cardioQueue = await Queue.create({
    clinicId: pulseCareClinic._id,
    name: "Dr. Omar Hassan - Cardiology",
    currentNumber: 12,
    avgServiceTime: 15,
    isActive: true,
    totalServedCount: 42,
  });

  const pedsQueue = await Queue.create({
    clinicId: pulseCareClinic._id,
    name: "Dr. Sarah Ahmed - Pediatrics",
    currentNumber: 22,
    avgServiceTime: 10,
    isActive: true,
    totalServedCount: 58,
  });

  const orthoQueue = await Queue.create({
    clinicId: pulseCareClinic._id,
    name: "Dr. Youssef Khaled - Orthopedics",
    currentNumber: 11,
    avgServiceTime: 20,
    isActive: true,
    totalServedCount: 36,
  });

  const dermaQueue = await Queue.create({
    clinicId: pulseCareClinic._id,
    name: "Dr. Mariam Ali - Dermatology",
    currentNumber: 18,
    avgServiceTime: 12,
    isActive: true,
    totalServedCount: 49,
  });

  // Add a queue to secondary clinics so they display live queue counts
  await Queue.create({
    clinicId: apexClinic._id,
    name: "Dr. David Miller - General Practice",
    currentNumber: 8,
    avgServiceTime: 15,
    isActive: true,
    totalServedCount: 19,
  });
  await Queue.create({
    clinicId: novaCareClinic._id,
    name: "Dr. Hannah Lin - Neurology",
    currentNumber: 6,
    avgServiceTime: 25,
    isActive: true,
    totalServedCount: 14,
  });

  // 5. Seed Active Tickets for PulseCare Queues
  console.log("Seeding active tickets for demo queue operations...");
  const now = new Date();

  // Cardio Queue Active Tickets:
  // Ticket #12 was served and completed (so no ticket is currently blocking 'call-next')
  const calledTicket = await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: cardioQueue._id,
    number: 12,
    status: "done",
    customerName: "Tariq Mansour",
    calledAt: new Date(now.getTime() - 20 * 60000),
    completedAt: new Date(now.getTime() - 5 * 60000),
    createdAt: new Date(now.getTime() - 35 * 60000),
  });

  // Pediatrics Queue:
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: pedsQueue._id,
    number: 20,
    status: "called",
    customerName: "Lucas Brown",
    calledAt: new Date(now.getTime() - 2 * 60000),
    createdAt: new Date(now.getTime() - 20 * 60000),
  });
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: pedsQueue._id,
    number: 21,
    status: "waiting",
    customerName: "Sophia Martinez",
    createdAt: new Date(now.getTime() - 15 * 60000),
  });
  const ticket22 = await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: pedsQueue._id,
    number: 22,
    status: "waiting",
    customerName: "Liam Johnson",
    createdAt: new Date(now.getTime() - 10 * 60000),
  });
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: pedsQueue._id,
    number: 23,
    status: "waiting",
    customerName: "Nour El-Din",
    createdAt: new Date(now.getTime() - 3 * 60000),
  });

  // Orthopedics Queue:
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: orthoQueue._id,
    number: 10,
    status: "called",
    customerName: "Zaid Kareem",
    calledAt: new Date(now.getTime() - 8 * 60000),
    createdAt: new Date(now.getTime() - 35 * 60000),
  });
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: orthoQueue._id,
    number: 11,
    status: "waiting",
    customerName: "Emma Watson",
    createdAt: new Date(now.getTime() - 15 * 60000),
  });

  // Dermatology Queue:
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: dermaQueue._id,
    number: 17,
    status: "called",
    customerName: "Adam Smith",
    calledAt: new Date(now.getTime() - 5 * 60000),
    createdAt: new Date(now.getTime() - 22 * 60000),
  });
  await Ticket.create({
    clinicId: pulseCareClinic._id,
    queueId: dermaQueue._id,
    number: 18,
    status: "waiting",
    customerName: "Layla Nasser",
    createdAt: new Date(now.getTime() - 8 * 60000),
  });

  // 6. Generate Coherent 30-Day Historical Analytics Data
  console.log("Generating 30-day realistic historical tickets for analytics...");
  const historicalTickets = [];
  const queues = [cardioQueue, pedsQueue, orthoQueue, dermaQueue];
  const patientNames = [
    "Adam Vance", "Beatrice Gomez", "Charles King", "Diana Prince", "Edward Norton",
    "Fatima Zahra", "George Clark", "Hala Farouk", "Ibrahim Ali", "Jessica Taylor",
    "Karim Mostafa", "Leila Hosny", "Michael Scott", "Nadia Kamal", "Omar Sherif",
    "Patricia Brown", "Qasim Al-Sayed", "Rania Youssef", "Sami Zaki", "Tamer Hosny"
  ];

  let ticketCounter = 100;
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dayOffset);

    // Variation by day: weekdays higher (20-35 tickets), weekends lower (10-18 tickets)
    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday / Saturday in region
    const ticketsCount = isWeekend ? Math.floor(10 + Math.random() * 8) : Math.floor(22 + Math.random() * 14);

    for (let i = 0; i < ticketsCount; i++) {
      ticketCounter++;
      const queue = queues[i % queues.length];
      
      // Peak hour bias: 9am - 1pm (hours 9-13) and 5pm - 8pm (hours 17-20)
      let hour;
      const rand = Math.random();
      if (rand < 0.55) {
        hour = 9 + Math.floor(Math.random() * 5); // 9, 10, 11, 12, 13
      } else if (rand < 0.85) {
        hour = 16 + Math.floor(Math.random() * 4); // 16, 17, 18, 19
      } else {
        hour = 8 + Math.floor(Math.random() * 12); // random between 8 and 20
      }

      const minute = Math.floor(Math.random() * 60);
      const ticketCreated = new Date(targetDate);
      ticketCreated.setHours(hour, minute, Math.floor(Math.random() * 60), 0);

      // Average wait time: 10 - 25 minutes
      const waitMinutes = Math.floor(queue.avgServiceTime * (0.8 + Math.random() * 0.5));
      const ticketCalled = new Date(ticketCreated.getTime() + waitMinutes * 60000);
      const serviceMinutes = Math.floor(queue.avgServiceTime * (0.7 + Math.random() * 0.6));
      const ticketDone = new Date(ticketCalled.getTime() + serviceMinutes * 60000);

      historicalTickets.push({
        clinicId: pulseCareClinic._id,
        queueId: queue._id,
        number: ticketCounter,
        status: "done",
        customerName: patientNames[(i + dayOffset) % patientNames.length],
        calledAt: ticketCalled,
        completedAt: ticketDone,
        createdAt: ticketCreated,
        updatedAt: ticketDone,
      });
    }
  }

  await Ticket.insertMany(historicalTickets);
  console.log(`Inserted ${historicalTickets.length} historical analytics tickets.`);

  // 7. Seed Payments History for PulseCare
  console.log("Seeding billing payments history...");
  const paymentDates = [
    new Date(now.getTime() - 25 * 86400000),
    new Date(now.getTime() - 14 * 86400000),
    new Date(now.getTime() - 3 * 86400000),
  ];

  await Payment.create([
    {
      clinicId: pulseCareClinic._id,
      amount: 89,
      credits: 200,
      method: "stripe",
      status: "completed",
      stripeSessionId: "cs_demo_starter_200",
      creditsApplied: true,
      createdAt: paymentDates[0],
    },
    {
      clinicId: pulseCareClinic._id,
      amount: 49,
      credits: 100,
      method: "stripe",
      status: "completed",
      stripeSessionId: "cs_demo_pro_100",
      creditsApplied: true,
      createdAt: paymentDates[1],
    },
    {
      clinicId: pulseCareClinic._id,
      amount: 29,
      credits: 50,
      method: "stripe",
      status: "completed",
      stripeSessionId: "cs_demo_topup_50",
      creditsApplied: true,
      createdAt: paymentDates[2],
    },
  ]);

  // 8. Seed Subscription
  await Subscription.create({
    clinicId: pulseCareClinic._id,
    plan: "pro",
    startDate: new Date(now.getTime() - 60 * 86400000),
    endDate: new Date(now.getTime() + 305 * 86400000),
    status: "active",
  });

  // 9. Seed Audit Logs
  console.log("Seeding realistic activity audit logs...");
  await AuditLog.create([
    {
      clinic: pulseCareClinic._id,
      user: adminUser._id,
      action: "UPDATE_SETTINGS",
      details: "Updated clinic operating hours and primary emergency contact information.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 10 * 86400000),
    },
    {
      clinic: pulseCareClinic._id,
      user: adminUser._id,
      action: "CREATE_QUEUE",
      details: "Configured new queue: Dr. Mariam Ali - Dermatology with 12m avg service window.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 8 * 86400000),
    },
    {
      clinic: pulseCareClinic._id,
      user: adminUser._id,
      action: "CREATE_STAFF",
      details: "Provisioned reception desk credentials for Elena Rostova.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 6 * 86400000),
    },
    {
      clinic: pulseCareClinic._id,
      user: receptionUser._id,
      action: "CALL_TICKET",
      details: "Called ticket #12 (Tariq Mansour) for Dr. Omar Hassan - Cardiology.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 4 * 60000),
    },
    {
      clinic: pulseCareClinic._id,
      user: receptionUser._id,
      action: "COMPLETE_TICKET",
      details: "Completed consultation session for ticket #11.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 10 * 60000),
    },
    {
      clinic: pulseCareClinic._id,
      user: adminUser._id,
      action: "SYSTEM_UPDATE",
      details: "Verified real-time Socket.IO synchronization channels and speech synthesizer status.",
      ipAddress: "127.0.0.1",
      createdAt: new Date(now.getTime() - 1 * 60000),
    },
  ]);

  console.log("==========================================");
  console.log("Demo Seeding Completed Successfully!");
  console.log("Flagship Clinic ID:", pulseCareClinic._id.toString());
  console.log("Flagship Clinic Name:", pulseCareClinic.name);
  console.log("Admin Email:", adminUser.email);
  console.log("Reception Email:", receptionUser.email);
  console.log("Demo Password: Demo@12345");
  console.log("Cardio Queue ID:", cardioQueue._id.toString());
  console.log("Called Ticket ID (Ticket #12):", calledTicket._id.toString());
  console.log("Pediatrics Waiting Ticket ID (Ticket #22):", ticket22._id.toString());
  console.log("==========================================");

  return {
    clinicId: pulseCareClinic._id.toString(),
    cardioQueueId: cardioQueue._id.toString(),
    pedsQueueId: pedsQueue._id.toString(),
    orthoQueueId: orthoQueue._id.toString(),
    dermaQueueId: dermaQueue._id.toString(),
    calledTicketId: calledTicket._id.toString(),
    pedsWaitingTicketId: ticket22._id.toString(),
    adminEmail: adminUser.email,
    receptionEmail: receptionUser.email,
  };
}

// Execute directly if run via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
