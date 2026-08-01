// POST /api/service-request — contact form: save to DB + best-effort notifications.
import { getPool } from '../server/db.js';
import {
  readBody,
  validateServiceRequest,
  escapeHtml,
  regionMap,
  sendMail,
  SUPPORT_EMAIL,
  BRAND,
} from '../server/helpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = readBody(req);
  const errors = validateServiceRequest(body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid submission', details: errors });
  }

  const full_name = body.full_name.trim();
  const country_code = body.country_code.trim();
  const contact_number = body.contact_number.trim();
  const email = body.email.trim();
  const service_requirement = body.service_requirement.trim();
  const preferred_time = (body.preferred_time || '').trim();
  const project_details = (body.project_details || '').trim();

  const region = regionMap[country_code] || 'Global';
  const full_contact_number = `${country_code}${contact_number}`;

  // 1. Save to DB — the only step that can fail the request.
  let saved;
  try {
    const result = await getPool().query(
      `INSERT INTO service_requests
       (full_name, country_code, contact_number, email, service_requirement, preferred_time, project_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [full_name, country_code, contact_number, email, service_requirement, preferred_time, project_details]
    );
    saved = result.rows[0];
  } catch (error) {
    console.error('❌ Service request insert failed:', error?.message || error);
    return res.status(500).json({ error: 'Server error' });
  }

  const e = {
    full_name: escapeHtml(full_name),
    email: escapeHtml(email),
    contact: escapeHtml(full_contact_number),
    service: escapeHtml(service_requirement),
    preferred_time: escapeHtml(preferred_time || 'Not specified'),
    project_details: escapeHtml(project_details || 'Not provided'),
    region: escapeHtml(region),
  };

  // 2. Notifications are best-effort — a captured lead must not 500 on a failed email.
  const adminEmail = sendMail({
    from: `${BRAND} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: '📩 New Service Request Submission',
    html: `
      <h2 style="color:#2563eb;">New Service Request</h2>
      <p><strong>Name:</strong> ${e.full_name}</p>
      <p><strong>Email:</strong> ${e.email}</p>
      <p><strong>Contact Number:</strong> ${e.contact}</p>
      <p><strong>Service Required:</strong> ${e.service}</p>
      <p><strong>Preferred Time:</strong> ${e.preferred_time}</p>
      <p><strong>Project Details:</strong></p>
      <p>${e.project_details}</p>
    `,
  });

  const userEmail = sendMail({
    from: `${BRAND} SRE <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "🛡️ We've received your architecture details – MaVi SRE Review in progress",
    html: `
      <h2>Hi ${e.full_name},</h2>
      <p>Thank you for reaching out to <strong>${BRAND}</strong>. We've received your project
      details and our SRE team is already taking a <strong>"Maxi Vision"</strong> look.</p>
      <p><strong>Architecture Sync:</strong> We will reach out within <strong>4 business hours</strong>.</p>
      <hr/>
      <p><strong>Project Goal:</strong> ${e.project_details}</p>
      <p><strong>Primary Region:</strong> ${e.region}</p>
      <p><strong>Reliability Target:</strong> ${e.service}</p>
      <hr/>
      <p>Reply anytime at <strong>${SUPPORT_EMAIL}</strong>.</p>
      <p><strong>Stay reliable,</strong><br/>The ${BRAND} Team<br/>www.mavisolution.com</p>
    `,
  });

  const sheets = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    ? fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: full_name,
          email,
          phone: full_contact_number,
          service: service_requirement,
          message: project_details,
          token: process.env.SHEETS_WEBHOOK_TOKEN,
        }),
        signal: AbortSignal.timeout(10_000),
      })
    : Promise.resolve({ skipped: true });

  const results = await Promise.allSettled([adminEmail, userEmail, sheets]);
  const labels = ['Admin email', 'Confirmation email', 'Google Sheets sync'];
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`⚠️  ${labels[i]} failed:`, r.reason?.message || r.reason);
  });

  res.status(201).json({ message: 'Service request submitted successfully', data: saved });
}
