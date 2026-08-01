// POST /api/chat-lead — save a lead (name/email/company) captured in the chat.
import { getPool, ensureChatLeadsTable } from '../server/db.js';
import { readBody, validateChatLead, escapeHtml, sendMail, BRAND } from '../server/helpers.js';

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
    return res.status(500).json({ error: 'Server error' });
  }

  // Best-effort admin notification; never fails the request.
  if (process.env.ADMIN_EMAIL) {
    try {
      await sendMail({
        from: `${BRAND} Assistant <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: process.env.ADMIN_EMAIL,
        replyTo: email,
        subject: '💬 New chat lead from the SRE Assistant',
        html: `
          <h2 style="color:#2563eb;">New Chat Lead</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
          <p><strong>Message:</strong> ${escapeHtml(message || 'Not provided')}</p>
          <hr/>
          <p style="font-size:12px;color:gray;">Captured by the ${BRAND} SRE Assistant</p>
        `,
      });
    } catch (err) {
      console.error('⚠️  Chat lead admin email failed:', err?.message || err);
    }
  }

  res.status(201).json({ message: 'Lead saved', id: saved.id });
}
