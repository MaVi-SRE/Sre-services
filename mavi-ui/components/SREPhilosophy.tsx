
import React from 'react';

export const SREPhilosophy: React.FC = () => {
  const goals = [
    { 
      id: '01', 
      title: 'Observability & Monitoring', 
      desc: 'Building "single panes of glass" using industry-leading tools like Grafana, Prometheus, or Datadog for real-time insights.', 
      icon: 'fa-eye',
      accent: 'blue'
    },
    { 
      id: '02', 
      title: 'Incident Management', 
      desc: 'Implementing 24/7 proactive response protocols using PagerDuty or Opsgenie to minimize downtime and business impact.', 
      icon: 'fa-bell-slash',
      accent: 'blue'
    },
    { 
      id: '03', 
      title: 'Infrastructure as Code (IaC)', 
      desc: 'Automating environments with Terraform or Ansible to ensure repeatable, version-controlled, and error-free deployments.', 
      icon: 'fa-code-branch',
      accent: 'green'
    },
    { 
      id: '04', 
      title: 'Performance Engineering', 
      desc: 'Continuous optimization of application code and cloud resources to maximize speed while minimizing operational costs.', 
      icon: 'fa-bolt',
      accent: 'green'
    },
    { 
      id: '05', 
      title: 'Cloud-Native Scaling', 
      desc: 'Architecting systems to handle traffic surges automatically, ensuring your platform scales from 100 to 1M+ users seamlessly.', 
      icon: 'fa-cloud-arrow-up',
      accent: 'green'
    }
  ];

  return (
    <section id="goals" className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-left">
        <div className="mb-16">
          <h2 className="text-[10px] font-black text-[#42E695] uppercase tracking-[0.4em] mb-4 text-center md:text-left">Strategic Execution</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-center md:text-left">Our Goals</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <div 
              key={idx} 
              className="glass-card p-10 rounded-[32px] border border-slate-200 dark:border-white/5 hover:border-blue-500/20 transition-all duration-500 group flex flex-col h-full hover:bg-white/[0.02]"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-4xl font-black text-slate-300 dark:text-slate-800/40 group-hover:text-[#2E7CF6]/20 transition-colors duration-500 font-mono-tech">
                  {goal.id}
                </span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  goal.accent === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-green-500/10 text-green-600 dark:text-green-400'
                } group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${goal.icon}`}></i>
                </div>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-sm mb-4">
                {goal.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">
                {goal.desc}
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${goal.accent === 'blue' ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></div>
                  <span className="text-[9px] font-mono-tech text-slate-500 dark:text-slate-400 uppercase tracking-widest">Enterprise Ready</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="hidden lg:flex glass-card p-10 rounded-[32px] border border-dashed border-slate-300 dark:border-white/5 items-center justify-center text-center opacity-40 hover:opacity-60 transition-opacity">
            <div className="flex flex-col items-center">
              <i className="fa-solid fa-microchip text-slate-400 dark:text-slate-600 text-3xl mb-4"></i>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Future-Proof Engineering</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
