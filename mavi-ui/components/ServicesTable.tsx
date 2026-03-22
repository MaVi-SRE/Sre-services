
import React from 'react';

export const ServicesTable: React.FC = () => {
  const services = [
    {
      category: 'IT Infrastructure Monitoring',
      details: '24×7 server uptime checks, CPU/memory alerts, disk usage, network monitoring.',
      stack: 'Prometheus, Grafana, Zabbix',
      icon: 'fa-server'
    },
    {
      category: 'Application & Website Monitoring',
      details: 'API uptime, response time alerts, user transaction monitoring.',
      stack: 'Pingdom, New Relic, Datadog',
      icon: 'fa-globe'
    },
    {
      category: 'Cloud / DevOps Support',
      details: 'AWS, Azure, GCP, Cost Optimization, Auto-scaling',
      stack: 'AWS, Azure, GCP, IaC',
      icon: 'fa-cloud-bolt'
    },
    {
      category: 'Helpdesk / Technical Support',
      details: 'Tier 1 & 2 support for customers or internal users with high availability.',
      stack: '24/7 Global, ITSM, SLA',
      icon: 'fa-headset'
    },
    {
      category: 'SRE / Managed Services',
      details: 'Proactive incident management, observability dashboards, and on-call rotation.',
      stack: 'Kubernetes, Terraform, Ansible',
      icon: 'fa-microchip'
    }
  ];

  return (
    <section id="services-table" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-left">
        <div className="mb-16">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em] mb-4">Service Catalog</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Support & Monitoring <br /><span className="text-moving-gradient">Categories</span></h3>
        </div>

        <div className="glass-card border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] w-1/4">Service Stream</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] w-1/3">Operational Coverage</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Tooling & Stack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {services.map((service, idx) => (
                  <tr 
                    key={idx} 
                    className="group hover:bg-slate-100/30 dark:hover:bg-white/[0.04] transition-all duration-300 relative"
                  >
                    <td className="px-8 py-10 relative">
                      {/* Left Border Glow Highlight */}
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#2E7CF6] to-[#42E695] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(46,124,246,0.5)]"></div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-300 shrink-0">
                          <i className={`fa-solid ${service.icon} text-lg`}></i>
                        </div>
                        <span className="text-slate-900 dark:text-white font-black tracking-wide uppercase text-[13px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {service.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-10 text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {service.details}
                    </td>
                    <td className="px-8 py-10">
                      <div className="flex flex-wrap gap-2">
                        {service.stack.split(',').map((tool, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="text-[9px] font-mono-tech font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 uppercase tracking-widest whitespace-nowrap group-hover:bg-green-500 group-hover:text-white dark:group-hover:text-slate-950 transition-all duration-300"
                          >
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
