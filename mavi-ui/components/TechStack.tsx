
import React from 'react';

export const TechStack: React.FC = () => {
  const categories = [
    {
      label: 'Cloud Infrastructure',
      tools: [
        { name: 'AWS', icon: 'fa-brands fa-aws', color: 'text-orange-400' },
        { name: 'Azure', icon: 'fa-brands fa-microsoft', color: 'text-blue-400' },
        { name: 'GCP', icon: 'fa-brands fa-google', color: 'text-red-400' }
      ]
    },
    {
      label: 'Containerization',
      tools: [
        { name: 'Kubernetes', icon: 'fa-solid fa-dharmachakra', color: 'text-blue-500' },
        { name: 'Docker', icon: 'fa-brands fa-docker', color: 'text-cyan-400' }
      ]
    },
    {
      label: 'Monitoring & Observability',
      tools: [
        { name: 'Prometheus', icon: 'fa-solid fa-fire-flame-curved', color: 'text-orange-500' },
        { name: 'Grafana', icon: 'fa-solid fa-chart-line', color: 'text-orange-300' },
        { name: 'Datadog', icon: 'fa-solid fa-dog', color: 'text-purple-400' }
      ]
    },
    {
      label: 'Automation & IaC',
      tools: [
        { name: 'Terraform', icon: 'fa-solid fa-layer-group', color: 'text-purple-500' },
        { name: 'Jenkins', icon: 'fa-brands fa-jenkins', color: 'text-slate-300' }
      ]
    }
  ];

  return (
    <section id="resources" className="py-24 relative overflow-hidden bg-white/[0.01] dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black text-[#2E7CF6] uppercase tracking-[0.4em] mb-4">The Monitronix Stack</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">TRUSTED BY INDUSTRY STANDARDS</h3>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Reliability through world-class tooling</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-4 mb-1">
                {cat.label}
              </h4>
              <div className="space-y-3">
                {cat.tools.map((tool, tIdx) => (
                  <div 
                    key={tIdx} 
                    className="group glass-card flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/40 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-blue-500/10"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl transition-all duration-300 group-hover:scale-110 ${tool.color}`}>
                      <i className={tool.icon}></i>
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{tool.name}</span>
                      <div className="h-0.5 w-0 group-hover:w-full bg-blue-500/50 transition-all duration-500 mt-0.5"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global Connectivity Visualization */}
        <div className="mt-16 flex justify-center opacity-20 pointer-events-none">
          <div className="relative w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 blur-sm"></div>
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 blur-sm"></div>
            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 blur-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
