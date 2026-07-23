import React, { useState, useRef, useEffect, useCallback } from 'react';
import { apiUrl, SUPPORT_EMAIL, REQUEST_TIMEOUT_MS } from '../config/api';

type Message = {
  role: 'user' | 'bot';
  text: string;
  isError?: boolean;
};

/**
 * Local fast-path answers. Anything that does not match here is forwarded to
 * the AI backend at /api/chat, so this only needs to cover the obvious asks.
 *
 * An entry matches when every term of any one of its `patterns` groups is
 * present in the normalized message. The longest matching group wins, so more
 * specific phrasings take precedence.
 */
const knowledgeBase: { patterns: string[][]; answer: string }[] = [
  {
    patterns: [
      ['what', 'mavi', 'do'],
      ['what do you do'],
      ['your services'],
      ['services you offer'],
      ['about mavi'],
    ],
    answer:
      'We provide "Maxi Vision" for your infrastructure. We automate scaling, monitoring, and incident response to ensure 99.99% uptime for startups in India and the UAE.',
  },
  {
    patterns: [['outage'], ['incident'], ['downtime'], ['mttr']],
    answer:
      'Our agents use AIOps to detect anomalies in real-time. We reduce MTTR (Mean Time To Recovery) by automating self-healing protocols before a human even needs to wake up.',
  },
  {
    patterns: [['cloud audit'], ['audit'], ['health check'], ['assessment']],
    answer:
      'Yes! We perform a System Health Check on your AWS, Azure, or Vercel setup to identify bottlenecks and cost-saving opportunities.',
  },
  {
    patterns: [['maxi vision'], ['why', 'maxi']],
    answer:
      'Maxi Vision means seeing the big picture of your infrastructure while monitoring each microservice for total system harmony.',
  },
  {
    patterns: [['mavi ai'], ['what is mavi'], ['who are you'], ['who is mavi']],
    answer:
      'MaVi is a specialized SRE firm bridging the Chennai-Dubai tech corridor. We treat infrastructure as code and operations as a software problem.',
  },
  {
    patterns: [['multi cloud'], ['multi-cloud'], ['multiple cloud'], ['aws', 'azure']],
    answer:
      'Yes. We specialize in AWS, Azure, and Vercel deployments ensuring resilience across providers and geographic regions.',
  },
  {
    patterns: [['uptime'], ['99.99'], ['sla'], ['error budget']],
    answer:
      'We implement Error Budgets and AIOps. If your system drifts from its healthy state, MaVi agents trigger self-healing protocols.',
  },
  {
    patterns: [['contact'], ['talk to', 'human'], ['sales'], ['reach you'], ['support']],
    answer: `Happy to help. You can reach our team at ${SUPPORT_EMAIL}, or use the Contact page to book a slot at your preferred time.`,
  },
  {
    patterns: [['pricing'], ['cost'], ['how much'], ['quote'], ['price']],
    answer: `Pricing depends on your stack size, environments, and on-call coverage. Share a few details at ${SUPPORT_EMAIL} and we'll send a scoped quote within 4 business hours.`,
  },
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const findLocalAnswer = (message: string): string | null => {
  const text = normalize(message);
  let best: { score: number; answer: string } | null = null;

  for (const entry of knowledgeBase) {
    for (const group of entry.patterns) {
      if (group.every((term) => text.includes(term))) {
        const score = group.join(' ').length;
        if (!best || score > best.score) best = { score, answer: entry.answer };
      }
    }
  }

  return best?.answer ?? null;
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "Hi, I'm the MaVi Assistant. Are you looking for Cloud/SRE Services or Website Development / Production L1 Support?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const [suggestedPrompts, setSuggestedPrompts] = useState([
    'What does MaVi SRE do?',
    'Do you offer Cloud Audits?',
    'What is MaVi AI?',
    'Do you support Multi-Cloud?',
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cancel pending timers and in-flight requests when the widget unmounts.
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      abortRef.current?.abort();
    };
  }, []);

  const pushBotMessage = useCallback((text: string, isError = false) => {
    setMessages((prev) => [...prev, { role: 'bot', text, isError }]);
    setIsTyping(false);
  }, []);

  const replyLocally = useCallback(
    (text: string) => {
      const timer = setTimeout(() => pushBotMessage(text), 600);
      timeoutsRef.current.push(timer);
    },
    [pushBotMessage]
  );

  const handleSend = useCallback(
    async (customText?: string) => {
      const textToSend = (customText ?? input).trim();
      if (!textToSend || isTyping) return;

      setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
      if (!customText) setInput('');
      setIsTyping(true);
      setLastFailedMessage(null);

      // 1. Instant local answer for the common questions.
      const localAnswer = findLocalAnswer(textToSend);
      if (localAnswer) {
        replyLocally(localAnswer);
        return;
      }

      // 2. Everything else goes to the AI backend.
      const controller = new AbortController();
      abortRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      timeoutsRef.current.push(timeoutId);

      // Send recent turns so the assistant has conversational context.
      const history = messages.slice(-8).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      try {
        const response = await fetch(apiUrl('/api/chat'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: textToSend, history }),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 429) {
            pushBotMessage(
              "You're sending messages a bit quickly. Please wait a moment and try again.",
              true
            );
            return;
          }
          throw new Error(`Request failed with status ${response.status}`);
        }

        if (!data?.reply) throw new Error('Empty response from server');

        pushBotMessage(data.reply);
      } catch (error) {
        const aborted = error instanceof DOMException && error.name === 'AbortError';
        console.error('Chat request failed:', error);
        setLastFailedMessage(textToSend);
        pushBotMessage(
          aborted
            ? `That took longer than expected. Tap retry, or reach us at ${SUPPORT_EMAIL}.`
            : `I couldn't reach the reliability engine just now. Tap retry, or reach us at ${SUPPORT_EMAIL}.`,
          true
        );
      } finally {
        clearTimeout(timeoutId);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [input, isTyping, messages, pushBotMessage, replyLocally]
  );

  const handleRetry = useCallback(() => {
    if (!lastFailedMessage) return;
    const message = lastFailedMessage;
    setLastFailedMessage(null);
    // Drop the error bubble and the original user turn before resending.
    setMessages((prev) => {
      const next = [...prev];
      if (next[next.length - 1]?.isError) next.pop();
      if (next[next.length - 1]?.role === 'user') next.pop();
      return next;
    });
    handleSend(message);
  }, [lastFailedMessage, handleSend]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[min(calc(100vw-2rem),400px)] h-[min(600px,calc(100vh-140px))] bg-white dark:bg-[#050B14] border border-slate-200 dark:border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 origin-bottom-right">

          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <i className="fa-solid fa-robot text-lg"></i>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  SRE ASSISTANT
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-green-600 dark:text-green-500 uppercase tracking-tighter">
                    Reliability Engine Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            className="flex-grow p-5 overflow-y-auto space-y-4 bg-white dark:bg-[#050B14]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium whitespace-pre-wrap ${m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                    : m.isError
                      ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200 rounded-tl-none border border-amber-200 dark:border-amber-500/20'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/10'
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Retry */}
          {lastFailedMessage && !isTyping && (
            <div className="px-5 pb-2">
              <button
                onClick={handleRetry}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
              >
                <i className="fa-solid fa-rotate-right mr-1.5"></i>
                Retry
              </button>
            </div>
          )}

          {/* Suggested Prompts */}
          {suggestedPrompts.length > 0 && !isTyping && (
            <div className="px-5 pb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSend(prompt);
                    setSuggestedPrompts((prev) => prev.filter((p) => p !== prompt));
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                maxLength={1000}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask our SRE expert..."
                aria-label="Message"
                className="flex-grow bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
                className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale shrink-0"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
            <p className="text-center text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4 font-bold">
              Maxi Vision Reliability Intelligence v2.0
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        className="relative w-14 h-14 bg-gradient-to-br from-[#2E7CF6] to-[#42E695] rounded-full shadow-[0_0_20px_rgba(46,124,246,0.3)] flex items-center justify-center text-white text-2xl hover:scale-110 transition-all active:scale-95 group shrink-0"
      >
        {isOpen ? (
          <i className="fa-solid fa-chevron-down"></i>
        ) : (
          <i className="fa-solid fa-comments"></i>
        )}
      </button>
    </div>
  );
};
