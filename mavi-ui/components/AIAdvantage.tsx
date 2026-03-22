
import React from 'react';

export const AIAdvantage: React.FC = () => {
  return (
    <section id="ai-advantage" className="py-24 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-green-500/10 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-[0.3em] mb-4">Intelligence Layer</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase">THE Maxi Vision AI ADVANTAGE</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Feature 1: Smart Alert Aggregation */}
          <div className="glass-card p-10 rounded-[40px] border border-slate-200 dark:border-blue-500/10 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8">
                <i className="fa-solid fa-filter text-xl"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Smart Alert Aggregation</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                "When a server goes down, it often sends hundreds of different alerts. This creates panic. Our AI tools group these into one single 'Root Cause' incident."
              </p>

              <div className="relative h-24 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <div className="flex flex-col gap-2 relative">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`w-2 h-2 rounded-full bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse [animation-delay:${i * 0.3}s]`}></div>
                    ))}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-red-500/40 uppercase rotate-90">CHAOS</div>
                  </div>

                  <div className="flex-grow mx-4 relative h-px bg-slate-200 dark:bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/40 via-blue-500 to-green-500/40 animate-[gradient-move_3s_linear_infinite]"></div>
                  </div>

                  <div className="relative group-hover:scale-110 transition-transform duration-500">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <i className="fa-solid fa-microchip text-blue-600 dark:text-blue-400 text-lg animate-spin-slow"></i>
                    </div>
                    <div className="absolute -inset-2 rounded-xl border border-blue-500/20 animate-ping opacity-20"></div>
                  </div>

                  <div className="flex-grow mx-4 h-px bg-gradient-to-r from-blue-500/20 to-green-500/40"></div>

                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                      <i className="fa-solid fa-check text-green-600 dark:text-green-400 text-sm"></i>
                    </div>
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-green-500/60 uppercase -rotate-90">STABLE</div>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 italic transition-colors">
                <p className="text-blue-700 dark:text-blue-400 font-bold text-sm">"We turn 500 screams into one calm conversation."</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-2">Before Maxi Vision</span>
                  <p className="text-[10px] text-slate-500">450 alerts sent to the CEO's phone.</p>
                </div>
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <span className="text-[8px] font-black text-green-600 uppercase tracking-widest block mb-2">After Maxi Vision</span>
                  <p className="text-[10px] text-slate-900 dark:text-white">1 clean notification: 'DB auto-restarted. Zero impact.'</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benefit:</span>
              <span className="text-xs font-black text-white bg-blue-600 px-3 py-1 rounded">PANIC-FREE MANAGEMENT</span>
            </div>
          </div>

          {/* Feature 2: AI-Powered Log Analysis */}
          <div className="glass-card p-10 rounded-[40px] border border-slate-200 dark:border-green-500/10 hover:border-green-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 mb-8">
                <i className="fa-solid fa-magnifying-glass-chart text-xl"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">AI-Powered Log Analysis</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                "Reading thousands of lines of server logs is impossible for humans. Our AI engine scans them in seconds to find the 'needle in the haystack' that triggered an issue."
              </p>

              <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/5 italic transition-colors">
                <p className="text-green-700 dark:text-green-400 font-bold text-sm">"What used to take 4 hours of debugging now takes our AI 4 seconds."</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-bolt text-green-600 text-xs"></i>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">MTTR Reduced by 85%</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-bolt text-green-600 text-xs"></i>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Automated Pattern Matching</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-bolt text-green-600 text-xs"></i>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Continuous Log Learning</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benefit:</span>
              <span className="text-xs font-black text-slate-950 bg-neon-green px-3 py-1 rounded">RAPID RECOVERY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
