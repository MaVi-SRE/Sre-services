
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about-us" className="py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="text-[10px] font-black text-[#2E7CF6] uppercase tracking-[0.3em]">Corporate DNA</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">MISSION OVERVIEW</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light mb-10 italic border-l-4 border-[#2E7CF6] pl-8">
              "Maxi Vision is a high-performance Site Reliability Engineering (SRE) and Web Development startup that bridges the gap between 'shipping code' and 'staying online.' We specialize in building and protecting digital infrastructure for scaling startups and established enterprises."
            </p>

            <div className="space-y-6">
              <div className="p-6 glass-card rounded-2xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                <h4 className="text-[#2E7CF6] font-bold uppercase tracking-widest text-xs mb-3">Our Core Philosophy</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  "Site Reliability Engineering (SRE) is the foundation of everything we build. At its core, SRE is about using software to solve operational problems. We move away from reactive fixes and focus on:"
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-green-500/10 blur-2xl rounded-3xl opacity-50 dark:opacity-100"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-xl transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-shield-halved text-8xl dark:text-white text-slate-900"></i>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-10 uppercase tracking-widest">SRE PILLARS</h3>

              <div className="space-y-10">
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-[#2E7CF6] group-hover:bg-[#2E7CF6] group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                    <i className="fa-solid fa-robot text-2xl"></i>
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm mb-2 transition-colors">Automated Operations</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">"Eliminating manual 'toil' through intelligent scripts and self-healing systems."</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                    <i className="fa-solid fa-network-wired text-2xl"></i>
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm mb-2 transition-colors">Scalable Architecture</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">"Ensuring your systems grow as fast as your user base without performance lag."</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-[#42E695] group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-lg shrink-0">
                    <i className="fa-solid fa-clock text-2xl"></i>
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm mb-2 transition-colors">Maximum Uptime</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">"Engineering reliability into the very fabric of your digital ecosystem."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
