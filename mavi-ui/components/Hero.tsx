
import React from 'react';

interface HeroProps {
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onContactClick }) => {
  return (
    <section id="home" className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center py-20 bg-slate-50 dark:bg-transparent transition-colors duration-300">
      <div className="scanline dark:block hidden"></div>

      {/* Background visual elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/5 dark:bg-green-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-left flex flex-col items-start w-full">
        {/* Professional Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-[0.2em]">Reliability Protocols Active</span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-10 tracking-tighter max-w-5xl">
          <span className="text-moving-gradient">We help startups and businesses achieve </span>
          <span className="text-slate-950 dark:text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] select-none">99.99%</span>
          <span className="text-moving-gradient"> uptime with our SRE managed services.</span>
        </h1>

        <p className="text-lg md:text-xl font-normal text-slate-600 dark:text-slate-200 mb-6 max-w-4xl leading-relaxed">
          Maxi Vision bridges the gap between <span className="text-slate-900 dark:text-white font-bold transition-colors">Web Development</span> and <span className="text-slate-900 dark:text-white font-bold transition-colors">Site Reliability</span>. We don't just build websites; we engineer high-performance platforms that are: <span className="text-[#2E7CF6] font-bold">Ultra-Fast</span>, <span className="text-slate-900 dark:text-white font-bold transition-colors">Secure</span>, and <span className="text-[#42E695] font-bold">Scalable</span>.
        </p>

        {/* Credibility micro-line */}
        <div className="flex items-center gap-3 mb-14 group">
          <div className="h-px w-8 bg-blue-500/30 dark:bg-blue-500/50 group-hover:w-12 transition-all duration-500"></div>
          <span className="text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
            Trusted by startups and enterprises for mission-critical infrastructure.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-start gap-6 mb-20 w-full">
          <button
            onClick={onContactClick}
            className="px-12 py-5 bg-gradient-to-r from-[#42E695] to-[#3BB2B8] text-slate-950 font-black rounded-xl hover:scale-105 transition-all duration-300 uppercase tracking-[0.1em] shadow-2xl shadow-green-500/20 inline-block text-center"
          >
            Secure Your Infrastructure
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('resources');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-12 py-5 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="uppercase text-[12px] tracking-widest">View Tools</span>
            <i className="fa-solid fa-microchip text-blue-500 group-hover:rotate-90 transition-transform"></i>
          </button>
        </div>
      </div>
    </section>
  );
};
