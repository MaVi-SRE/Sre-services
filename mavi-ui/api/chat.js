// POST /api/chat — Vercel serverless function.
//
// The bot works entirely on built-in answers (the FAQ here + the richer
// knowledge base in the widget). Gemini is an OPTIONAL enhancement for
// open-ended questions and is OFF by default — set ENABLE_AI=1 (plus a valid
// GEMINI_API_KEY / GEMINI_MODEL) to turn it on. If the AI is off or fails for
// any reason, we return a graceful built-in reply — never a 500 — so the
// widget always works.
import { GoogleGenAI } from '@google/genai';
import {
  readBody,
  faq,
  SYSTEM_PROMPT,
  GEMINI_MODEL,
  SUPPORT_EMAIL,
  toGeminiHistory,
} from '../server/helpers.js';

let aiClient = null;
function getAI() {
  if (process.env.ENABLE_AI !== '1') return null; // opt-in
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return aiClient;
}

// Built-in replies for anything not covered by the FAQ. Rotated so repeated
// off-topic questions don't return the exact same line, and each nudges the
// visitor toward a real topic or toward sharing their details.
const FALLBACKS = [
  `I can help with our SRE services, cloud audits, uptime & monitoring, multi-cloud, security, and pricing — just ask about any of those. Prefer a human? Say "contact me" and I'll take your details.`,
  `Good question — our SRE team can dig into the specifics. Try asking about our services, a cloud audit, how we reach 99.99% uptime, or pricing. Or say "share my details" and we'll follow up.`,
  `Happy to help! I can cover monitoring, incident response, migrations, CI/CD, and data residency. Want a person to reach out? Just say "contact me" or email ${SUPPORT_EMAIL}.`,
];

const fallbackReply = () => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  const { message, history } = readBody(req);

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ reply: 'Please enter a message.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ reply: 'That message is too long. Please shorten it.' });
  }

  const trimmed = message.trim();
  const lowerMessage = trimmed.toLowerCase();

  // 1. FAQ fast-path — no model call.
  const matchedFAQ = faq.find((item) =>
    item.keywords.some((keyword) => lowerMessage.includes(keyword))
  );
  if (matchedFAQ) {
    return res.json({ reply: matchedFAQ.answer });
  }

  // 2. Optional AI. If it's off, answer from built-ins immediately.
  const ai = getAI();
  if (!ai) {
    return res.json({ reply: fallbackReply() });
  }

  // 3. Best-effort AI — any failure degrades to the built-in reply (still 200).
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 512,
        // gemini-2.5-* are "thinking" models: left on, they can spend the whole
        // output budget on internal reasoning and return no text.
        thinkingConfig: { thinkingBudget: 0 },
      },
      contents: [
        ...toGeminiHistory(history),
        { role: 'user', parts: [{ text: trimmed }] },
      ],
    });

    const reply = response.text?.trim();
    if (!reply) {
      console.error(
        'Chat: empty Gemini response. finishReason:',
        response.candidates?.[0]?.finishReason
      );
      return res.json({ reply: fallbackReply() });
    }

    res.json({ reply });
  } catch (error) {
    // Log for diagnostics, but the visitor still gets a usable answer.
    console.error('Chat AI error (using fallback):', error?.message || error);
    const body = { reply: fallbackReply() };
    if (process.env.DEBUG_CHAT === '1') {
      body.debug = { model: GEMINI_MODEL, message: error?.message || String(error) };
    }
    res.json(body);
  }
}
