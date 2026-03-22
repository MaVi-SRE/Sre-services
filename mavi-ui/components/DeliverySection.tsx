
import React from 'react';

export const DeliverySection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="glass-card rounded-[40px] shadow-2xl p-8 md:p-16 border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/[0.03] to-green-500/[0.03] pointer-events-none"></div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 group">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600" alt="Cyber Security" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 translate-y-12 group">
                  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600" alt="Global Data" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay"></div>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-4 rounded-2xl border border-slate-300 dark:border-white/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Systems Nominal</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-4">Value Proposition</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 uppercase leading-tight">WHAT WE DELIVER</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-light text-lg transition-colors">
                At Monitronix, we deliver end-to-end reliability and performance for your systems. Our team ensures proactive monitoring, fast incident response, and clear RCA insights to keep your services running smoothly.
              </p>
              
              <div className="space-y-6 mb-12">
                {[
                  'Efficient CI/CD pipelines & automated deployments',
                  'Cloud infrastructure management using IaC',
                  'Custom dashboards & distributed tracing',
                  'Load testing & performance tuning'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <i className="fa-solid fa-check text-sm"></i>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium tracking-wide transition-colors">{item}</p>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl text-white dark:text-slate-950 shadow-2xl shadow-blue-500/20">
                <p className="font-black text-center uppercase tracking-wider text-sm">
                  We optimize every layer of your system to ensure speed, scalability, and seamless user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
