import React, { useState, useRef, useEffect } from 'react';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    {
      role: 'bot',
      text: "Hi, I'm the MaVi Assistant. Are you looking for Cloud/SRE Services or Website Development / Production L1 Support?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "What does MaVi SRE do?",
    "Do you offer Cloud Audits?",
    "What is MaVi AI?",
    "Do you support Multi-Cloud?"
  ]);
  const knowledgeBase: Record<string, string> = {
    "what does mavi sre do":
      'We provide "Maxi Vision" for your infrastructure. We automate scaling, monitoring, and incident response to ensure 99.99% uptime for startups in India and the UAE.',

    "how do you handle outages":
      "Our agents use AIOps to detect anomalies in real-time. We reduce MTTR (Mean Time To Recovery) by automating self-healing protocols before a human even needs to wake up.",

    "do you offer cloud audits":
      "Yes! We perform a System Health Check on your AWS, Azure, or Vercel setup to identify bottlenecks and cost-saving opportunities.",

    "why maxi vision":
      "Maxi Vision means seeing the big picture of your infrastructure while monitoring each microservice for total system harmony.",

    "what is mavi ai":
      "MaVi is a specialized SRE firm bridging the Chennai-Dubai tech corridor. We treat infrastructure as code and operations as a software problem.",

    "do you support multi cloud":
      "Yes. We specialize in AWS, Azure, and Vercel deployments ensuring resilience across providers and geographic regions.",

    "how do you guarantee uptime":
      "We implement Error Budgets and AIOps. If your system drifts from its healthy state, MaVi agents trigger self-healing protocols."
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = textToSend.trim();

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    if (!customText) setInput('');
    setIsTyping(true);

    /* ---------- KNOWLEDGE BASE CHECK ---------- */

    const lowerText = userMessage.toLowerCase();

    for (const key in knowledgeBase) {
      if (lowerText.includes(key)) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: "bot", text: knowledgeBase[key] },
          ]);
          setIsTyping(false);
        }, 800);

        return;
      }
    }
    /* ---------- LEAD GENERATION FLOW ---------- */

    if (lowerText.includes("build") || lowerText.includes("website")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Great! Is this for a Web-only project or a Full App ecosystem?"
          }
        ]);
        setIsTyping(false);
      }, 800);

      return;
    }

    if (lowerText.includes("optimize") || lowerText.includes("sre")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Before we proceed, does your infrastructure require specific data residency (for example keeping data inside UAE or India)?"
          }
        ]);
        setIsTyping(false);
      }, 800);

      return;
    }
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Thanks for your question. I am unable to answer any further queries. Please contact us through support@mavisolution.com",
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

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
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-grow p-5 overflow-y-auto space-y-4 bg-white dark:bg-[#050B14]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
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

          {/* Suggested Prompts */}
          {suggestedPrompts.length > 0 && !isTyping && (
            <div className="px-5 pb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSend(prompt);
                    setSuggestedPrompts(prev => prev.filter(p => p !== prompt));
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask our SRE expert..."
                className="flex-grow bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale"
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
