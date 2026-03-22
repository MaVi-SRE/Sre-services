
import React from 'react';

export const CoreThemes: React.FC = () => {
  const themes = [
    {
      title: 'ULTRA-FAST',
      description: 'Optimized for Core Web Vitals and lightning-speed processing. We eliminate bottlenecks at the infrastructure layer.',
      icon: 'fa-bolt-lightning',
      glowClass: 'glow-blue',
      iconColor: 'text-blue-600 dark:text-blue-500'
    },
    {
      title: 'SECURE',
      description: 'Hardened against modern threats. Our reliability engineering includes security-by-design at every node.',
      icon: 'fa-user-shield',
      glowClass: 'glow-white',
      iconColor: 'text-slate-900 dark:text-white'
    },
    {
      title: 'SCALABLE',
      description: 'Built to handle your growth. From 100 to 100M users, our systems adapt dynamically to traffic surges.',
      icon: 'fa-chart-area',
      glowClass: 'glow-green',
      iconColor: 'text-green-600 dark:text-green-500'
    }
  ];

  return (
    <section id="themes" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">The Monitronix Standard</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">ENGINEERED FOR EXCELLENCE</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <div key={theme.title} className={`group glass-card p-10 rounded-3xl transition-all duration-500 hover:-translate-y-3 border-slate-200 dark:border-white/5 ${theme.glowClass}`}>
              <div className={`mb-8 text-4xl ${theme.iconColor}`}>
                <i className={`fa-solid ${theme.icon}`}></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{theme.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-sm md:text-base">
                {theme.description}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <i className="fa-solid fa-chevron-right text-[8px]"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
