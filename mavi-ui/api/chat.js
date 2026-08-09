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

// Built-in reply for anything not covered by the FAQ. Nudges toward capture.
const fallbackReply = () =>
  `Great question! Our SRE team can give you a precise answer on that. Share a few details and I'll have them follow up — or email us anytime at ${SUPPORT_EMAIL}.`;

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
