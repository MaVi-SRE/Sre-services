// Shared server-side helpers for the Vercel serverless API functions.
// This code runs on Vercel's Node runtime — never in the browser — so secrets
// (Gemini key, DB URL) read from process.env here stay private.

export const SUPPORT_EMAIL = 'support@mavisolution.com';
export const BRAND = 'MaVi';
// A rolling alias that tracks a current Flash model, so it doesn't get retired
// out from under us like a pinned version does. Override with GEMINI_MODEL.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isNonEmptyString = (value, max) =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;

// Vercel usually parses JSON bodies, but guard for the string case just in case.
export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

// ---- FAQ fast-path (no model call needed) ----
export const faq = [
  {
    keywords: ['uptime', '99.99', 'sla', 'error budget'],
    answer:
      'We achieve 99.99% uptime using proactive monitoring, auto-healing infrastructure, redundancy, and SRE best practices.',
  },
  {
    keywords: ['sre as a service', 'managed sre'],
    answer:
      'SRE as a Service provides reliability engineering expertise to optimize uptime, performance, and incident response.',
  },
  {
    keywords: ['tech stack', 'technology', 'which tools'],
    answer:
      'We support AWS, GCP, Azure, Kubernetes, Docker, Terraform, CI/CD pipelines, and modern DevOps tooling.',
  },
  {
    keywords: ['audit', 'book a call', 'health check'],
    answer: `You can book an infrastructure audit by contacting ${SUPPORT_EMAIL}.`,
  },
];

export const regionMap = {
  '+91': 'India',
  '+971': 'UAE',
  '+1': 'USA',
  '+44': 'UK',
  '+61': 'Australia',
  '+65': 'Singapore',
  '+49': 'Germany',
  '+33': 'France',
  '+81': 'Japan',
  '+86': 'China',
};

export const SYSTEM_PROMPT = `You are the ${BRAND} SRE assistant for mavisolution.com, a Site Reliability Engineering firm serving India and the UAE.

Rules:
- Answer briefly and professionally (under 80 words).
- Only discuss infrastructure, DevOps, reliability, SRE, cloud, monitoring, and MaVi's services.
- If a question is unrelated to those topics, reply exactly: "That's outside what I can help with here. Please contact us at ${SUPPORT_EMAIL}."
- Never invent pricing, SLAs, or client names. Point pricing questions to ${SUPPORT_EMAIL}.`;

// Gemini requires the conversation to start with a user turn and alternate, so
// drop any leading assistant messages (e.g. the widget's greeting).
export function toGeminiHistory(history) {
  if (!Array.isArray(history)) return [];

  const turns = history
    .filter((h) => h && typeof h.text === 'string' && h.text.trim())
    .slice(-8)
    .map((h) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text.slice(0, 2000) }],
    }));

  const firstUser = turns.findIndex((t) => t.role === 'user');
  return firstUser === -1 ? [] : turns.slice(firstUser);
}

export function validateChatLead(body) {
  const errors = [];
  if (!isNonEmptyString(body.name, 100)) errors.push('name is required (max 100 chars)');
  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim()))
    errors.push('A valid email is required');
  if (body.company && String(body.company).length > 150)
    errors.push('company must be under 150 characters');
  if (body.message && String(body.message).length > 2000)
    errors.push('message must be under 2000 characters');
  return errors;
}

export function validateServiceRequest(body) {
  const errors = [];
  if (!isNonEmptyString(body.full_name, 100)) errors.push('full_name is required (max 100 chars)');
  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim()))
    errors.push('A valid email is required');
  if (!/^\+\d{1,4}$/.test(String(body.country_code || '')))
    errors.push('country_code must look like +91');
  if (!/^\d{6,15}$/.test(String(body.contact_number || '')))
    errors.push('contact_number must be 6-15 digits');
  if (!isNonEmptyString(body.service_requirement, 200))
    errors.push('service_requirement is required');
  if (body.project_details && String(body.project_details).length > 5000)
    errors.push('project_details must be under 5000 characters');
  return errors;
}

// ---- Best-effort Mailgun sender (no-op if not configured) ----
let mgClient = null;
export async function sendMail(payload) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    return { skipped: true };
  }
  if (!mgClient) {
    const [{ default: Mailgun }, { default: formData }] = await Promise.all([
      import('mailgun.js'),
      import('form-data'),
    ]);
    mgClient = new Mailgun(formData).client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });
  }
  return mgClient.messages.create(process.env.MAILGUN_DOMAIN, payload);
}
