require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { GoogleGenAI } = require("@google/genai");
const rateLimit = require("express-rate-limit");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ✅ Mailgun Setup
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// -------------------------
// GEMINI SETUP
// -------------------------
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
});


// -------------------------
// FAQ DATA
// -------------------------
const faq = [
    {
        keywords: ["uptime", "99.99"],
        answer:
            "We achieve 99.99% uptime using proactive monitoring, auto-healing infrastructure, redundancy, and SRE best practices.",
    },
    {
        keywords: ["sre as a service"],
        answer:
            "SRE as a Service provides reliability engineering expertise to optimize uptime, performance, and incident response.",
    },
    {
        keywords: ["tech stack", "technology"],
        answer:
            "We support AWS, GCP, Azure, Kubernetes, Docker, Terraform, CI/CD pipelines, and modern DevOps tooling.",
    },
    {
        keywords: ["audit", "book"],
        answer:
            "You can book an infrastructure audit by contacting connect@monitronix.com.",
    },
];

// -------------------------
// REGION MAPPING
// -------------------------
const regionMap = {
    "+91": "India",
    "+971": "UAE",
    "+1": "USA",
    "+44": "UK",
    "+61": "Australia",
    "+65": "Singapore",
    "+49": "Germany",
    "+33": "France",
    "+81": "Japan",
    "+86": "china",
};

// -------------------------
// PostgreSQL Connection
// -------------------------

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query("SELECT NOW()")
    .then(res => console.log("Database connected at:", res.rows[0]))
    .catch(err => console.error("Database connection error:", err));


// -------------------------
// BASIC ROUTE
// -------------------------
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});


// -------------------------
// SERVICE REQUEST ROUTE (FINAL UPDATED)
// -------------------------
app.post("/api/service-request", async (req, res) => {
    try {
        const {
            full_name,
            country_code,
            contact_number,
            email,
            service_requirement,
            preferred_time,
            project_details,
        } = req.body;

        // -------------------------
        // DERIVED EMAIL VARIABLES
        // -------------------------
        const region = regionMap[country_code] || "Global";

        const clientName = full_name;

        const applicationName = service_requirement;

        const reliabilityTarget = service_requirement;

        const projectGoal = project_details;

        // Combine country code + number for email display
        const full_contact_number = `${country_code}${contact_number}`;

        // 1️⃣ Save to DB
        const result = await pool.query(
            `INSERT INTO service_requests
            (full_name, country_code, contact_number, email, service_requirement, preferred_time, project_details)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                full_name,
                country_code,
                contact_number,
                email,
                service_requirement,
                preferred_time,
                project_details,
            ]
        );

        console.log("✅ Data saved to database");

        // 2️⃣ Send Email (Mailgun Sandbox Safe)
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `Monitronix <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "📩 New Service Request Submission",
            html: `
                <h2 style="color:#2563eb;">New Service Request</h2>
                <p><strong>Name:</strong> ${full_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contact Number:</strong> ${full_contact_number}</p>
                <p><strong>Service Required:</strong> ${service_requirement}</p>
                <p><strong>Preferred Time:</strong> ${preferred_time}</p>
                <p><strong>Project Details:</strong></p>
                <p>${project_details}</p>
                <hr/>
                <p style="font-size:12px;color:gray;">
                Sent from Monitronix Service Portal
                </p>
            `,
        });

        console.log("✅ Email sent via Mailgun");

        // 3️⃣ SEND DATA TO GOOGLE SHEETS (NEW)
        await fetch('https://script.google.com/macros/s/AKfycbxbQiOF97HqVc4RRQ3bLgYtEIHiz0feAVDplcMuTKFr4K4wV-u3u039laF6GiRlPJRn/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: full_name,
                email: email,
                phone: `${country_code}${contact_number}`,
                service: service_requirement,
                message: project_details,
            }),
        });

        console.log("✅ Data sent to Google Sheets");

        // -------------------------
        // SEND CONFIRMATION EMAIL TO USER
        // -------------------------
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `MaVi SRE <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: "🛡️ We’ve received your architecture details – MaVi SRE Review in progress",

            html: `
  <h2>Hi ${clientName},</h2>

  <p>
  Thank you for reaching out to <strong>MaVi</strong>. 
  We’ve received your project discovery details and our SRE team 
  is already taking a <strong>"Maxi Vision"</strong> look at your requirements.
  </p>

  <p>
  As an SRE-first firm, we don’t just look at code. 
  We analyze the entire lifecycle of your system to ensure 
  <strong>99.99% reliability from day one.</strong>
  </p>

  <h3>What happens next?</h3>

  <p>
  <strong>Technical Triage:</strong> Our engineers are reviewing the 
  scaling requirements you shared for <strong>${applicationName}</strong>.
  </p>

  <p>
  <strong>Architecture Sync:</strong> We will reach out within the 
  <strong>4 business hours</strong>.
  </p>

  <hr/>

  <h3>A quick summary of what you shared</h3>

  <p><strong>Project Goal:</strong> ${projectGoal}</p>

  <p><strong>Primary Region:</strong> ${region}</p>

  <p><strong>Reliability Target:</strong> ${reliabilityTarget}</p>

  <hr/>

  <p>
  We are excited about the possibility of building a resilient 
  future for <strong>${clientName}</strong>.
  </p>

  <p>
  If you have any urgent technical documents or diagrams, 
  simply reply to this email at 
  <strong>support@mavisolution.com</strong>.
  </p>

  <br/>

  <p><strong>Stay reliable,</strong></p>

  <p>
  The MaVi Team<br/>
  Smart SRE and Monitoring Solutions<br/>
  www.mavisolution.com
  </p>
`,
        });

        console.log("✅ Confirmation email sent to user");

        res.status(201).json({
            message: "Service request submitted successfully",
            data: result.rows[0],
        });

    } catch (error) {
        console.error("❌ Service Request Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// -------------------------
// CHAT ROUTE
// -------------------------
app.post("/api/chat", chatLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMessage = message.toLowerCase();

        const matchedFAQ = faq.find(item =>
            item.keywords.some(keyword =>
                lowerMessage.includes(keyword)
            )
        );

        if (matchedFAQ) {
            return res.json({ reply: matchedFAQ.answer });
        }

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `
You are a professional SRE assistant for Monitronix.

Rules:
- Answer briefly (under 80 words).
- Only talk about infrastructure, DevOps, reliability, SRE, cloud.
- If question unrelated, respond:
"Please contact connect@monitronix.com"

User: ${message}
`,
        });

        res.json({ reply: response.text });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({
            reply:
                "I apologize, I am experiencing a temporary issue. Please contact connect@monitronix.com.",
        });
    }
});


// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});