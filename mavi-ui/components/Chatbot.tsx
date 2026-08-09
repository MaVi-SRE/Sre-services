import React, { useState, useRef, useEffect, useCallback } from 'react';
import { apiUrl, SUPPORT_EMAIL, REQUEST_TIMEOUT_MS } from '../config/api';

type Message = {
  role: 'user' | 'bot';
  text: string;
  isError?: boolean;
};

// Lead capture kicks in once the visitor is engaged (has sent this many turns).
const LEAD_TRIGGER_AFTER_TURNS = 2;
const LEAD_STORAGE_KEY = 'mavi_lead_captured';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SKIP_RE = /^(skip|no thanks|no|later|not now|maybe later)$/i;

// idle → name → email → company → done
type LeadStage = 'idle' | 'name' | 'email' | 'company' | 'done';

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
      ['about mavi'],
    ],
    answer:
      'We provide "Maxi Vision" for your infrastructure. We automate scaling, monitoring, and incident response to ensure 99.99% uptime for startups in India and the UAE.',
  },
  {
    patterns: [
      ['services'],
      ['your services'],
      ['services you offer'],
      ['offerings'],
      ['what can you help'],
    ],
    answer:
      'Our core services: SRE-as-a-Service, 24/7 monitoring & incident response, cloud reliability & cost audits, CI/CD and Infrastructure-as-Code automation, and production L1 support.',
  },
  {
    patterns: [['outage'], ['incident'], ['downtime'], ['mttr'], ['on call'], ['on-call'], ['pager']],
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
    patterns: [['uptime'], ['99.99'], ['sla'], ['error budget'], ['reliability']],
    answer:
      'We hit 99.99% uptime with proactive monitoring, redundancy, Error Budgets, and AIOps — if your system drifts from a healthy state, MaVi agents trigger self-healing protocols.',
  },
  {
    patterns: [['monitoring'], ['observability'], ['alerting'], ['prometheus'], ['grafana'], ['dashboard']],
    answer:
      'We set up full-stack observability — metrics, logs, traces, and alerting with tools like Prometheus, Grafana, Datadog, and CloudWatch — so issues surface before your users notice.',
  },
  {
    patterns: [['security'], ['compliance'], ['soc 2'], ['soc2'], ['iso 27001']],
    answer:
      'We harden infrastructure with least-privilege IAM, secrets management, encrypted networking, and audit trails, aligning with SOC 2 and ISO 27001 practices.',
  },
  {
    patterns: [['migrate'], ['migration'], ['move to'], ['re-platform']],
    answer:
      'We plan and run near-zero-downtime migrations to and across AWS, Azure, and Vercel, with rollback safety and cost optimization built in.',
  },
  {
    patterns: [['tech stack'], ['technology'], ['tooling'], ['kubernetes'], ['terraform'], ['docker']],
    answer:
      'Our toolkit: Kubernetes, Docker, Terraform, GitHub Actions/GitLab CI, Prometheus, and Grafana across AWS, Azure, GCP, and Vercel.',
  },
  {
    patterns: [['pipeline'], ['ci cd'], ['cicd'], ['devops'], ['deployment automation'], ['iac']],
    answer:
      'We build reliable CI/CD pipelines and Infrastructure-as-Code so deployments are repeatable, fast, and safe to roll back.',
  },
  {
    patterns: [['data residency'], ['residency'], ['gdpr'], ['data protection']],
    answer:
      'We support data residency in India and the UAE, and design for regional failover across providers to meet your compliance needs.',
  },
  {
    patterns: [['get started'], ['getting started'], ['onboard'], ['how do we start'], ['begin']],
    answer:
      'Getting started is easy — we begin with a System Health Check of your setup, then propose a reliability roadmap. Share your details and our team will set it up.',
  },
  {
    patterns: [['contact'], ['talk to', 'human'], ['sales'], ['reach you'], ['support'], ['email']],
    answer: `Happy to help. You can reach our team at ${SUPPORT_EMAIL}, or use the Contact page to book a slot at your preferred time.`,
  },
  {
    patterns: [['pricing'], ['cost'], ['how much'], ['quote'], ['price'], ['budget']],
    answer: `Pricing depends on your stack size, environments, and on-call coverage. Share a few details and we'll send a scoped quote within 4 business hours.`,
  },
];

// Phrases that mean "I want to share my details / be contacted" — these start
// the lead capture flow immediately rather than returning a generic answer.
const CAPTURE_INTENT: string[][] = [
  ['share', 'detail'],
  ['my details'],
  ['contact me'],
  ['reach out to me'],
  ['call me'],
  ['get in touch'],
  ['connect me'],
  ['email me'],
  ['follow up with me'],
  ['interested'],
  ['sign me up'],
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

const wantsLeadCapture = (message: string): boolean => {
  const text = normalize(message);
  return CAPTURE_INTENT.some((group) => group.every((term) => text.includes(term)));
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
  const [leadStage, setLeadStage] = useState<LeadStage>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const userTurnsRef = useRef(0);
  // The first substantive question the visitor asked — stored with the lead.
  const leadRef = useRef({ name: '', email: '', company: '', message: '' });
  // Latest messages, readable inside callbacks without re-creating them.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Don't ask again if we already captured this visitor in a previous session.
  useEffect(() => {
    try {
      if (localStorage.getItem(LEAD_STORAGE_KEY) === '1') setLeadStage('done');
    } catch {
      /* localStorage may be unavailable (private mode) — just proceed. */
    }
  }, []);

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
    (text: string, delay = 600) => {
      const timer = setTimeout(() => pushBotMessage(text), delay);
      timeoutsRef.current.push(timer);
    },
    [pushBotMessage]
  );

  // Begin the name → email → company capture, after the answer has landed.
  const maybeStartLeadCapture = useCallback(
    (delay: number) => {
      if (leadStage !== 'idle') return;
      if (userTurnsRef.current < LEAD_TRIGGER_AFTER_TURNS) return;
      setLeadStage('name');
      replyLocally(
        "By the way — so our SRE team can follow up with the right details, may I grab your name? (or type ‘skip’)",
        delay
      );
    },
    [leadStage, replyLocally]
  );

  const finishCapture = useCallback((persist: boolean) => {
    setLeadStage('done');
    if (persist) {
      try {
        localStorage.setItem(LEAD_STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  }, []);

  const submitLead = useCallback(async () => {
    setIsTyping(true);
    try {
      // Include the conversation so the team sees the full context of the lead.
      const transcript = messagesRef.current.map((m) => ({ role: m.role, text: m.text }));
      const response = await fetch(apiUrl('/api/chat-lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadRef.current, transcript }),
      });

      if (!response.ok) throw new Error(`Save failed with status ${response.status}`);

      const firstName = leadRef.current.name.split(' ')[0];
      finishCapture(true);
      pushBotMessage(
        `Thanks, ${firstName}! I've shared your details with our team — we'll reach out to ${leadRef.current.company || 'you'} shortly. Meanwhile, ask me anything about SRE, cloud, or reliability.`
      );
    } catch (error) {
      console.error('Lead save failed:', error);
      // Don't trap the visitor in the flow if saving fails.
      finishCapture(false);
      pushBotMessage(
        `Thanks! I couldn't log that just now, but you can reach us directly at ${SUPPORT_EMAIL}. Feel free to keep asking questions.`,
        true
      );
    }
  }, [finishCapture, pushBotMessage]);

  // Route a message to the active capture step instead of the chat backend.
  const handleLeadAnswer = useCallback(
    (answer: string) => {
      const text = answer.trim();

      if (SKIP_RE.test(text)) {
        finishCapture(false);
        replyLocally(
          `No problem — ask me anything, or reach us anytime at ${SUPPORT_EMAIL}.`
        );
        return;
      }

      if (leadStage === 'name') {
        leadRef.current.name = text.slice(0, 100);
        setLeadStage('email');
        replyLocally(`Thanks, ${text.split(' ')[0]}! What's the best email to reach you?`);
        return;
      }

      if (leadStage === 'email') {
        if (!EMAIL_RE.test(text)) {
          replyLocally("That doesn't look like a valid email — could you re-enter it?");
          return;
        }
        leadRef.current.email = text;
        setLeadStage('company');
        replyLocally('Great. And which company are you with?');
        return;
      }

      if (leadStage === 'company') {
        leadRef.current.company = text.slice(0, 150);
        submitLead();
      }
    },
    [leadStage, finishCapture, replyLocally, submitLead]
  );

  const handleSend = useCallback(
    async (customText?: string) => {
      const textToSend = (customText ?? input).trim();
      if (!textToSend || isTyping) return;

      setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
      if (!customText) setInput('');
      setIsTyping(true);
      setLastFailedMessage(null);

      // If we're mid-capture, treat this message as the answer, not a query.
      if (leadStage === 'name' || leadStage === 'email' || leadStage === 'company') {
        handleLeadAnswer(textToSend);
        return;
      }

      userTurnsRef.current += 1;
      // Remember the visitor's first real question to store alongside the lead.
      if (!leadRef.current.message) leadRef.current.message = textToSend.slice(0, 2000);

      // 0. Visitor explicitly wants to share details / be contacted. Honor it
      // even if they've captured before — an explicit ask should always work.
      if (wantsLeadCapture(textToSend)) {
        leadRef.current = { name: '', email: '', company: '', message: leadRef.current.message };
        setLeadStage('name');
        replyLocally("Wonderful — I'd love to connect you with our SRE team. What's your name?");
        return;
      }

      // 1. Instant local answer for the common questions.
      const localAnswer = findLocalAnswer(textToSend);
      if (localAnswer) {
        replyLocally(localAnswer);
        // Ask for details after the answer has been shown.
        maybeStartLeadCapture(1600);
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
        // Ask for details after the answer has been shown.
        maybeStartLeadCapture(900);
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
    [input, isTyping, messages, leadStage, handleLeadAnswer, maybeStartLeadCapture, pushBotMessage, replyLocally]
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
          {suggestedPrompts.length > 0 && !isTyping && leadStage !== 'name' && leadStage !== 'email' && leadStage !== 'company' && (
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
                placeholder={
                  leadStage === 'name'
                    ? 'Type your name...'
                    : leadStage === 'email'
                      ? 'Type your email...'
                      : leadStage === 'company'
                        ? 'Type your company...'
                        : 'Ask our SRE expert...'
                }
                aria-label="Message"
                inputMode={leadStage === 'email' ? 'email' : 'text'}
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
