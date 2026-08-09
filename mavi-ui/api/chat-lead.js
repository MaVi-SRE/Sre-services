// POST /api/chat-lead — save a lead captured in the chat and notify the team.
import { getPool, ensureChatLeadsTable } from '../server/db.js';
import {
  readBody,
  validateChatLead,
  escapeHtml,
  sendMail,
  BRAND,
  SUPPORT_EMAIL,
} from '../server/helpers.js';

// Who receives lead notifications. Defaults to the support inbox; override with
// LEAD_NOTIFY_EMAIL (comma-separated) to send elsewhere / to multiple people.
function notifyRecipients() {
  const raw = process.env.LEAD_NOTIFY_EMAIL || process.env.ADMIN_EMAIL || SUPPORT_EMAIL;
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

// Render the chat transcript (array of {role, text}) as simple email HTML.
function renderTranscript(transcript) {
  if (!Array.isArray(transcript) || transcript.length === 0) return '';
  const rows = transcript
    .slice(-30)
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .map((m) => {
      const who = m.role === 'user' ? 'Visitor' : 'Assistant';
      const color = m.role === 'user' ? '#2563eb' : '#475569';
      return `<p style="margin:4px 0;"><strong style="color:${color};">${who}:</strong> ${escapeHtml(
        m.text.slice(0, 1000)
      )}</p>`;
    })
    .join('');
  return `<hr/><h3>Conversation</h3>${rows}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = readBody(req);
  const errors = validateChatLead(body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Invalid submission', details: errors });
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const company = (body.company || '').trim() || null;
  const message = (body.message || '').trim() || null;
  const transcript = Array.isArray(body.transcript) ? body.transcript : [];

  let saved;
  try {
    await ensureChatLeadsTable();
    const result = await getPool().query(
      `INSERT INTO chat_leads (name, email, company, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name, email, company, message]
    );
    saved = result.rows[0];
    console.log('✅ Chat lead saved:', saved.id);
  } catch (error) {
    console.error('❌ Chat lead insert failed:', error?.message || error);
    const out = { error: 'Server error' };
    if (process.env.DEBUG_CHAT === '1') out.debug = error?.message || String(error);
    return res.status(500).json(out);
  }

  // Notify the support team with the details captured in the chat.
  // Best-effort: the lead is already saved, so a failed email must not 500.
  try {
    const result = await sendMail({
      from: `${BRAND} Assistant <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: notifyRecipients(),
      replyTo: email, // so the team can reply straight to the visitor
      subject: `💬 New chat lead: ${name}${company ? ` — ${company}` : ''}`,
      html: `
        <h2 style="color:#2563eb;">New Chat Lead</h2>
        <p>A visitor shared their details with the ${BRAND} SRE Assistant.</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
        <p><strong>First question:</strong> ${escapeHtml(message || 'Not provided')}</p>
        <p><strong>Received:</strong> ${escapeHtml(new Date(saved.created_at).toISOString())}</p>
        ${renderTranscript(transcript)}
        <hr/>
        <p style="font-size:12px;color:gray;">Captured by the ${BRAND} SRE Assistant · Reply to this email to reach the visitor.</p>
      `,
    });
    if (result?.skipped) {
      console.warn('⚠️  Lead email skipped — Mailgun not configured (MAILGUN_API_KEY/DOMAIN).');
    } else {
      console.log('✅ Lead notification emailed to:', notifyRecipients().join(', '));
    }
  } catch (err) {
    console.error('⚠️  Lead notification email failed:', err?.message || err);
  }

  res.status(201).json({ message: 'Lead saved', id: saved.id });
}
