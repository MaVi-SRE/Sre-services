// POST /api/chat — Vercel serverless function.
// Runs server-side: the Gemini key stays private.
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
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return aiClient;
}

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

  // FAQ fast-path — no model call.
  const matchedFAQ = faq.find((item) =>
    item.keywords.some((keyword) => lowerMessage.includes(keyword))
  );
  if (matchedFAQ) {
    return res.json({ reply: matchedFAQ.answer });
  }

  const ai = getAI();
  if (!ai) {
    console.error('Chat Error: GEMINI_API_KEY is not configured');
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
      const finishReason = response.candidates?.[0]?.finishReason;
      console.error('Chat Error: empty Gemini response. finishReason:', finishReason);
      return res.json({
        reply: `I couldn't generate a full answer to that one. Could you rephrase, or reach our team at ${SUPPORT_EMAIL}?`,
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chat Error:', error?.message || error);
    const body = {
      reply: `I apologize, I am experiencing a temporary issue. Please contact us at ${SUPPORT_EMAIL}.`,
    };
    if (process.env.DEBUG_CHAT === '1' || req.headers['x-mavi-debug'] === 'mavi2026') {
      body.debug = { model: GEMINI_MODEL, message: error?.message || String(error) };
    }
    res.status(500).json(body);
  }
}
