
import React from 'react';

export const ServiceCategories: React.FC = () => {
  const steps = [
    { label: 'Code', icon: 'fa-brands fa-gitlab', color: 'text-blue-600 dark:text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { label: 'Build', icon: 'fa-solid fa-box-open', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
    { label: 'Deploy', icon: 'fa-solid fa-cloud-arrow-up', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
    { label: 'Monitor', icon: 'fa-solid fa-heart-pulse', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
    { label: 'Uptime', icon: 'fa-solid fa-earth-americas', color: 'text-green-700 dark:text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  ];

  return (
    <section id="categories" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-[0.3em] mb-4">Automation Flow</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase">THE AUTOMATION STACK</h3>
        </div>

        <div className="relative py-20 px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-green-500 -translate-y-1/2 rounded-full hidden md:block opacity-30 shadow-[0_0_15px_rgba(37,99,235,0.3)]"></div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 ${step.border} ${step.bg} flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-6`}>
                   <i className={`${step.icon} text-3xl ${step.color}`}></i>
                   {idx === steps.length - 1 && (
                     <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
                   )}
                </div>
                <div className="text-center">
                  <span className={`text-xs font-black uppercase tracking-widest ${step.color}`}>{step.label}</span>
                  <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 mx-auto mt-2 bg-current ${step.color} opacity-50`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-white/5 transition-colors">
               <h4 className="text-blue-700 dark:text-blue-400 font-bold mb-4 uppercase tracking-widest">CI/CD Pipeline</h4>
               <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                 Every commit triggers a rigorous automated validation process. We ensure that code transitions from local development to production environments with zero manual intervention.
               </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-white/5 transition-colors">
               <h4 className="text-green-700 dark:text-green-400 font-bold mb-4 uppercase tracking-widest">Global Availability</h4>
               <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                 Post-deployment, our SRE layer takes over. Continuous health checks and self-healing protocols ensure that your service remains globally accessible, maintaining 99.99% uptime.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
