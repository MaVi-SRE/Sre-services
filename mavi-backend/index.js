require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { GoogleGenAI } = require("@google/genai");
const rateLimit = require("express-rate-limit");

// ✅ Mailgun Setup
// Built lazily: mailgun.client() throws when the key is missing, and doing that
// at module scope would crash the whole server (chat included) on boot.
const Mailgun = require("mailgun.js");
const formData = require("form-data");

let mgClient = null;
function getMailgun() {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) return null;
    if (!mgClient) {
        mgClient = new Mailgun(formData).client({
            username: "api",
            key: process.env.MAILGUN_API_KEY,
        });
    }
    return mgClient;
}

function sendMail(payload) {
    const mg = getMailgun();
    if (!mg) {
        return Promise.reject(new Error("Mailgun is not configured (MAILGUN_API_KEY/DOMAIN)"));
    }
    return mg.messages.create(process.env.MAILGUN_DOMAIN, payload);
}

const app = express();

// Render / other proxies sit in front of us; needed for correct rate-limit IPs.
app.set("trust proxy", 1);

// -------------------------
// CONSTANTS
// -------------------------
const SUPPORT_EMAIL = "support@mavisolution.com";
const BRAND = "MaVi";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Set GOOGLE_SHEETS_WEBHOOK_URL in the environment. The literal below is only a
// fallback so existing deployments keep working — rotate it (redeploy the Apps
// Script with a new URL) since the old one is already public in git history.
const SHEETS_WEBHOOK_URL =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbxbQiOF97HqVc4RRQ3bLgYtEIHiz0feAVDplcMuTKFr4K4wV-u3u039laF6GiRlPJRn/exec";

// -------------------------
// MIDDLEWARE
// -------------------------
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "https://mavisolution.com,https://www.mavisolution.com,http://localhost:3000,http://localhost:5173"
)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // Allow same-origin / server-to-server calls that send no Origin header.
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error(`Origin not allowed: ${origin}`));
        },
        methods: ["GET", "POST"],
    })
);

app.use(express.json({ limit: "100kb" }));

// -------------------------
// GEMINI SETUP
// -------------------------
// Lazy for the same reason as Mailgun: the constructor throws without a key,
// which would take the whole server down at boot.
let aiClient = null;
function getAI() {
    if (!process.env.GEMINI_API_KEY) return null;
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
}

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { reply: "Too many messages. Please wait a moment and try again." },
});

// The form endpoint writes to the DB, sends two emails and hits a webhook, so
// it needs its own (tighter) budget.
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many submissions. Please try again later." },
});

// Chat lead capture: one per conversation normally, so keep it modest.
const leadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many submissions. Please try again later." },
});

// -------------------------
// HELPERS
// -------------------------
const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const isNonEmptyString = (value, max) =>
    typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateServiceRequest(body) {
    const errors = [];

    if (!isNonEmptyString(body.full_name, 100)) errors.push("full_name is required (max 100 chars)");
    if (typeof body.email !== "string" || !EMAIL_RE.test(body.email.trim()))
        errors.push("A valid email is required");
    if (!/^\+\d{1,4}$/.test(String(body.country_code || "")))
        errors.push("country_code must look like +91");
    if (!/^\d{6,15}$/.test(String(body.contact_number || "")))
        errors.push("contact_number must be 6-15 digits");
    if (!isNonEmptyString(body.service_requirement, 200))
        errors.push("service_requirement is required");
    if (body.preferred_time && !isNonEmptyString(body.preferred_time, 100))
        errors.push("preferred_time is too long");
    if (body.project_details && String(body.project_details).length > 5000)
        errors.push("project_details must be under 5000 characters");

    return errors;
}

function validateChatLead(body) {
    const errors = [];

    if (!isNonEmptyString(body.name, 100)) errors.push("name is required (max 100 chars)");
    if (typeof body.email !== "string" || !EMAIL_RE.test(body.email.trim()))
        errors.push("A valid email is required");
    if (body.company && String(body.company).length > 150)
        errors.push("company must be under 150 characters");
    if (body.message && String(body.message).length > 2000)
        errors.push("message must be under 2000 characters");

    return errors;
}

// -------------------------
// FAQ DATA
// -------------------------
const faq = [
    {
        keywords: ["uptime", "99.99", "sla", "error budget"],
        answer:
            "We achieve 99.99% uptime using proactive monitoring, auto-healing infrastructure, redundancy, and SRE best practices.",
    },
    {
        keywords: ["sre as a service", "managed sre"],
        answer:
            "SRE as a Service provides reliability engineering expertise to optimize uptime, performance, and incident response.",
    },
    {
        keywords: ["tech stack", "technology", "which tools"],
        answer:
            "We support AWS, GCP, Azure, Kubernetes, Docker, Terraform, CI/CD pipelines, and modern DevOps tooling.",
    },
    {
        keywords: ["audit", "book a call", "health check"],
        answer: `You can book an infrastructure audit by contacting ${SUPPORT_EMAIL}.`,
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
    "+86": "China",
};

// -------------------------
// PostgreSQL Connection
// -------------------------
// Supply DATABASE_CA_CERT (the provider's CA bundle) to get real certificate
// verification. Without it we fall back to an unverified TLS connection.
if (!process.env.DATABASE_CA_CERT) {
    console.warn(
        "⚠️  DATABASE_CA_CERT not set — database TLS certificates are NOT being verified."
    );
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_CA_CERT
        ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
        : { rejectUnauthorized: false },
});

pool.query("SELECT NOW()")
    .then((res) => console.log("Database connected at:", res.rows[0]))
    .catch((err) => console.error("Database connection error:", err));

// Ensure the chatbot lead table exists (created on boot, idempotent).
async function ensureSchema() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat_leads (
                id          SERIAL PRIMARY KEY,
                name        TEXT NOT NULL,
                email       TEXT NOT NULL,
                company     TEXT,
                message     TEXT,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        console.log("✅ chat_leads table is ready");
    } catch (err) {
        console.error("⚠️  Could not ensure chat_leads table:", err.message);
    }
}
ensureSchema();

// -------------------------
// BASIC ROUTES
// -------------------------
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok", model: GEMINI_MODEL });
});

// -------------------------
// SERVICE REQUEST ROUTE
// -------------------------
app.post("/api/service-request", formLimiter, async (req, res) => {
    const validationErrors = validateServiceRequest(req.body || {});
    if (validationErrors.length > 0) {
        return res.status(400).json({ error: "Invalid submission", details: validationErrors });
    }

    const full_name = req.body.full_name.trim();
    const country_code = req.body.country_code.trim();
    const contact_number = req.body.contact_number.trim();
    const email = req.body.email.trim();
    const service_requirement = req.body.service_requirement.trim();
    const preferred_time = (req.body.preferred_time || "").trim();
    const project_details = (req.body.project_details || "").trim();

    const region = regionMap[country_code] || "Global";
    const full_contact_number = `${country_code}${contact_number}`;

    let saved;

    // 1️⃣ Save to DB — this is the only step that may fail the request.
    try {
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
        saved = result.rows[0];
        console.log("✅ Data saved to database");
    } catch (error) {
        console.error("❌ Database insert failed:", error);
        return res.status(500).json({ error: "Server error" });
    }

    // Escaped copies for use inside HTML emails.
    const e = {
        full_name: escapeHtml(full_name),
        email: escapeHtml(email),
        contact: escapeHtml(full_contact_number),
        service: escapeHtml(service_requirement),
        preferred_time: escapeHtml(preferred_time || "Not specified"),
        project_details: escapeHtml(project_details || "Not provided"),
        region: escapeHtml(region),
    };

    // 2️⃣–4️⃣ Notifications are best-effort: the lead is already captured, so a
    // failing email or webhook must not turn a successful submission into a 500.
    const adminEmail = sendMail({
        from: `${BRAND} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: "📩 New Service Request Submission",
        html: `
            <h2 style="color:#2563eb;">New Service Request</h2>
            <p><strong>Name:</strong> ${e.full_name}</p>
            <p><strong>Email:</strong> ${e.email}</p>
            <p><strong>Contact Number:</strong> ${e.contact}</p>
            <p><strong>Service Required:</strong> ${e.service}</p>
            <p><strong>Preferred Time:</strong> ${e.preferred_time}</p>
            <p><strong>Project Details:</strong></p>
            <p>${e.project_details}</p>
            <hr/>
            <p style="font-size:12px;color:gray;">
            Sent from ${BRAND} Service Portal
            </p>
        `,
    });

    const userEmail = sendMail({
        from: `${BRAND} SRE <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: "🛡️ We've received your architecture details – MaVi SRE Review in progress",
        html: `
  <h2>Hi ${e.full_name},</h2>

  <p>
  Thank you for reaching out to <strong>${BRAND}</strong>.
  We've received your project discovery details and our SRE team
  is already taking a <strong>"Maxi Vision"</strong> look at your requirements.
  </p>

  <p>
  As an SRE-first firm, we don't just look at code.
  We analyze the entire lifecycle of your system to ensure
  <strong>99.99% reliability from day one.</strong>
  </p>

  <h3>What happens next?</h3>

  <p>
  <strong>Technical Triage:</strong> Our engineers are reviewing the
  scaling requirements you shared for <strong>${e.service}</strong>.
  </p>

  <p>
  <strong>Architecture Sync:</strong> We will reach out within
  <strong>4 business hours</strong>.
  </p>

  <hr/>

  <h3>A quick summary of what you shared</h3>

  <p><strong>Project Goal:</strong> ${e.project_details}</p>

  <p><strong>Primary Region:</strong> ${e.region}</p>

  <p><strong>Reliability Target:</strong> ${e.service}</p>

  <hr/>

  <p>
  We are excited about the possibility of building a resilient
  future for <strong>${e.full_name}</strong>.
  </p>

  <p>
  If you have any urgent technical documents or diagrams,
  simply reply to this email at
  <strong>${SUPPORT_EMAIL}</strong>.
  </p>

  <br/>

  <p><strong>Stay reliable,</strong></p>

  <p>
  The ${BRAND} Team<br/>
  Smart SRE and Monitoring Solutions<br/>
  www.mavisolution.com
  </p>
`,
    });

    const sheets = fetch(SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(process.env.SHEETS_WEBHOOK_TOKEN
                ? { "X-Webhook-Token": process.env.SHEETS_WEBHOOK_TOKEN }
                : {}),
        },
        body: JSON.stringify({
            name: full_name,
            email,
            phone: full_contact_number,
            service: service_requirement,
            message: project_details,
            token: process.env.SHEETS_WEBHOOK_TOKEN,
        }),
        signal: AbortSignal.timeout(10_000),
    });

    const [adminResult, userResult, sheetsResult] = await Promise.allSettled([
        adminEmail,
        userEmail,
        sheets,
    ]);

    const labels = ["Admin email", "Confirmation email", "Google Sheets sync"];
    [adminResult, userResult, sheetsResult].forEach((result, i) => {
        if (result.status === "fulfilled") {
            console.log(`✅ ${labels[i]} succeeded`);
        } else {
            console.error(`⚠️  ${labels[i]} failed:`, result.reason);
        }
    });

    res.status(201).json({
        message: "Service request submitted successfully",
        data: saved,
    });
});

// -------------------------
// CHAT LEAD ROUTE
// Captures name / email / company collected inside the chat widget.
// -------------------------
app.post("/api/chat-lead", leadLimiter, async (req, res) => {
    const validationErrors = validateChatLead(req.body || {});
    if (validationErrors.length > 0) {
        return res.status(400).json({ error: "Invalid submission", details: validationErrors });
    }

    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const company = (req.body.company || "").trim() || null;
    const message = (req.body.message || "").trim() || null;

    let saved;

    // The insert is the only thing that can fail the request.
    try {
        const result = await pool.query(
            `INSERT INTO chat_leads (name, email, company, message)
             VALUES ($1, $2, $3, $4)
             RETURNING id, created_at`,
            [name, email, company, message]
        );
        saved = result.rows[0];
        console.log("✅ Chat lead saved:", saved.id);
    } catch (error) {
        console.error("❌ Chat lead insert failed:", error);
        return res.status(500).json({ error: "Server error" });
    }

    // Best-effort admin notification; never fails the request.
    if (process.env.ADMIN_EMAIL) {
        sendMail({
            from: `${BRAND} Assistant <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: "💬 New chat lead from the SRE Assistant",
            html: `
                <h2 style="color:#2563eb;">New Chat Lead</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
                <p><strong>Message:</strong> ${escapeHtml(message || "Not provided")}</p>
                <hr/>
                <p style="font-size:12px;color:gray;">Captured by the ${BRAND} SRE Assistant</p>
            `,
        }).catch((err) => console.error("⚠️  Chat lead admin email failed:", err.message));
    }

    res.status(201).json({ message: "Lead saved", id: saved.id });
});

// -------------------------
// CHAT ROUTE
// -------------------------
const SYSTEM_PROMPT = `You are the ${BRAND} SRE assistant for mavisolution.com, a Site Reliability Engineering firm serving India and the UAE.

Rules:
- Answer briefly and professionally (under 80 words).
- Only discuss infrastructure, DevOps, reliability, SRE, cloud, monitoring, and MaVi's services.
- If a question is unrelated to those topics, reply exactly: "That's outside what I can help with here. Please contact us at ${SUPPORT_EMAIL}."
- Never invent pricing, SLAs, or client names. Point pricing questions to ${SUPPORT_EMAIL}.`;

// Gemini requires the conversation to start with a user turn and alternate from
// there, so drop any leading assistant messages (e.g. the widget's greeting).
function toGeminiHistory(history) {
    if (!Array.isArray(history)) return [];

    const turns = history
        .filter((h) => h && typeof h.text === "string" && h.text.trim())
        .slice(-8)
        .map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text.slice(0, 2000) }],
        }));

    const firstUser = turns.findIndex((t) => t.role === "user");
    return firstUser === -1 ? [] : turns.slice(firstUser);
}

app.post("/api/chat", chatLimiter, async (req, res) => {
    const { message, history } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ reply: "Please enter a message." });
    }
    if (message.length > 1000) {
        return res.status(400).json({ reply: "That message is too long. Please shorten it." });
    }

    const trimmed = message.trim();
    const lowerMessage = trimmed.toLowerCase();

    const matchedFAQ = faq.find((item) =>
        item.keywords.some((keyword) => lowerMessage.includes(keyword))
    );

    if (matchedFAQ) {
        return res.json({ reply: matchedFAQ.answer });
    }

    const ai = getAI();
    if (!ai) {
        console.error("Chat Error: GEMINI_API_KEY is not configured");
        return res.status(503).json({
            reply: `I'm not able to answer that right now. Please contact us at ${SUPPORT_EMAIL}.`,
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.4,
                maxOutputTokens: 512,
                // gemini-2.5-* are "thinking" models: left on, they can spend the
                // whole output budget on internal reasoning and return no text.
                // We want short, direct answers, so disable thinking.
                thinkingConfig: { thinkingBudget: 0 },
            },
            contents: [
                ...toGeminiHistory(history),
                { role: "user", parts: [{ text: trimmed }] },
            ],
        });

        const reply = response.text?.trim();

        if (!reply) {
            // Log why the model returned nothing (safety block, MAX_TOKENS, etc.)
            // so this is diagnosable from the server logs.
            const finishReason = response.candidates?.[0]?.finishReason;
            console.error("Chat Error: empty Gemini response. finishReason:", finishReason);
            // Don't dead-end the visitor with a 500 — hand back a usable reply so
            // the conversation (and lead capture) can continue.
            return res.json({
                reply: `I couldn't generate a full answer to that one. Could you rephrase, or reach our team at ${SUPPORT_EMAIL}?`,
            });
        }

        res.json({ reply });
    } catch (error) {
        console.error("Chat Error:", error?.message || error);
        const body = {
            reply: `I apologize, I am experiencing a temporary issue. Please contact us at ${SUPPORT_EMAIL}.`,
        };
        // Set DEBUG_CHAT=1 in the environment to surface the real cause via the
        // API response (handy for diagnosing; turn it off afterwards).
        if (process.env.DEBUG_CHAT === "1") {
            body.debug = { model: GEMINI_MODEL, message: error?.message || String(error) };
        }
        res.status(500).json(body);
    }
});

// -------------------------
// ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
    if (err && /Origin not allowed/.test(err.message)) {
        return res.status(403).json({ error: "Origin not allowed" });
    }
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Server error" });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
