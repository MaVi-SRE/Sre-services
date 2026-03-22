
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Zap, Target, ArrowRight } from 'lucide-react';

interface ServiceDetail {
  overview: string;
  features: string[];
  benefits: string[];
}

interface Offering {
  title: string;
  desc: string;
  icon: string;
  color: 'blue' | 'green';
  details: ServiceDetail;
}

export const ServicePortfolio: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Offering | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'benefits'>('overview');

  const offerings: Offering[] = [
    {
      title: 'SRE as a Service',
      desc: 'Proactive incident management, 24/7 on-call response, and deep Root Cause Analysis to ensure maximum stability.',
      icon: 'fa-server',
      color: 'blue',
      details: {
        overview: 'Our SRE as a Service provides a comprehensive approach to reliability, combining engineering discipline with operational excellence. We don\'t just fix problems; we build systems that prevent them.',
        features: ['24/7 Incident Response & On-call', 'Deep Root Cause Analysis (RCA)', 'Service Level Objectives (SLOs) Management', 'Error Budget Tracking & Management'],
        benefits: ['Maximum System Stability', 'Reduced Mean Time To Recovery (MTTR)', 'Data-Driven Reliability Decisions', 'Improved Engineering Velocity']
      }
    },
    {
      title: 'Monitoring & Observability',
      desc: 'Building "single panes of glass" with real-time dashboards, distributed tracing, and intelligent logging.',
      icon: 'fa-eye',
      color: 'green',
      details: {
        overview: 'We provide full-stack visibility into your systems, enabling you to understand not just IF something is broken, but WHY it happened and HOW it affects users.',
        features: ['Real-time Custom Dashboards', 'Distributed Request Tracing', 'Centralized Log Aggregation', 'Intelligent Alerting & Anomaly Detection'],
        benefits: ['Proactive Issue Detection', 'Complete System Visibility', 'Faster Troubleshooting', 'Enhanced User Experience Insights']
      }
    },
    {
      title: 'DevOps Automation',
      desc: 'Streamlining deployment cycles with high-performance CI/CD pipelines and Infrastructure as Code (IaC).',
      icon: 'fa-gears',
      color: 'blue',
      details: {
        overview: 'We automate the path from code to production, ensuring that every deployment is predictable, repeatable, and safe.',
        features: ['High-Performance CI/CD Pipelines', 'Infrastructure as Code (Terraform, Ansible)', 'Automated Security Scanning', 'Container Orchestration (Kubernetes)'],
        benefits: ['Faster Time-to-Market', 'Consistent Environments', 'Reduced Human Error', 'Scalable Deployment Processes']
      }
    },
    {
      title: 'CloudOps',
      desc: 'Comprehensive cloud management including cost optimization, dynamic scaling, and robust disaster recovery.',
      icon: 'fa-cloud',
      color: 'blue',
      details: {
        overview: 'We manage your cloud infrastructure to ensure it is cost-effective, secure, and resilient enough to handle any load.',
        features: ['Cloud Cost Optimization & FinOps', 'Multi-cloud & Hybrid Cloud Strategy', 'Dynamic Auto-scaling Policies', 'Robust Disaster Recovery Planning'],
        benefits: ['Significant Cost Savings', 'High Availability & Resilience', 'Seamless Scalability', 'Compliance & Security Alignment']
      }
    },
    {
      title: 'Performance Engineering',
      desc: 'Rigorous load testing, capacity planning, and fine-tuning to eliminate bottlenecks at the infrastructure layer.',
      icon: 'fa-gauge-high',
      color: 'green',
      details: {
        overview: 'We ensure your systems can handle the pressure of growth by identifying and eliminating performance bottlenecks before they impact users.',
        features: ['Continuous Load & Stress Testing', 'Accurate Capacity Planning', 'Application Performance Tuning', 'Database Optimization'],
        benefits: ['Future-Proof Scalability', 'Optimized Resource Usage', 'Blazing Fast Response Times', 'Reduced Infrastructure Over-provisioning']
      }
    },
    {
      title: 'Web Hosting for SMBs',
      desc: 'Reliable, high-speed hosting environments engineered for growing brands. Secure, fully managed, and optimized for conversion.',
      icon: 'fa-laptop-code',
      color: 'green',
      details: {
        overview: 'We provide enterprise-grade hosting solutions tailored for small and medium businesses, focusing on security, speed, and reliability.',
        features: ['Fully Managed Security & WAF', 'Daily Automated Backups', 'Global Content Delivery Network (CDN)', 'Free SSL & Performance Optimization'],
        benefits: ['Peace of Mind Security', 'Improved SEO & Conversion Rates', 'Zero-Maintenance Infrastructure', 'Expert Technical Support']
      }
    }
  ];

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-slate-100/30 dark:bg-slate-950/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="mb-16">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">CORE OFFERINGS</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((item, idx) => {
            const isGreen = item.color === 'green';
            return (
              <div key={idx} className={`group glass-card p-10 rounded-[40px] border border-slate-200 dark:border-white/5 hover:border-${isGreen ? 'green' : 'blue'}-500/30 transition-all duration-500 flex flex-col justify-between h-full`}>
                <div>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-8 transition-all duration-500 ${isGreen ? 'bg-green-500/10 text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-slate-950'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
                    }`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-8 text-sm md:text-base">{item.desc}</p>
                </div>

                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => {
                      setSelectedService(item);
                      setActiveTab('overview');
                    }}
                    className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 dark:group-hover:text-white transition-colors self-start"
                  >
                    Know More <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>
                  </button>
                  <div className={`h-1 w-8 rounded-full transition-all duration-500 group-hover:w-full ${isGreen ? 'bg-green-500/30' : 'bg-blue-500/30'
                    }`}></div>
                </div>
              </div>
            );
          })}

          {/* Call to action card */}
          <div className="p-10 rounded-[40px] border-2 border-dashed border-slate-300 dark:border-white/5 flex flex-col items-center justify-center text-center group hover:border-blue-500/20 transition-all h-full min-h-[380px]">
            <div className="w-12 h-12 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 mb-4">
              <i className="fa-solid fa-plus"></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custom Requirements?</p>
            <a href="#contact-page" className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white transition-colors">Let's Talk Strategy</a>
          </div>
        </div>
      </div>

      {/* Detailed Service View (Modal-like) */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-xl"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-white dark:bg-void-navy rounded-[40px] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                {/* Sidebar Info */}
                <div className="w-full md:w-1/3 bg-slate-50 dark:bg-white/5 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10">
                  <div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-8 ${selectedService.color === 'green' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                      <i className={`fa-solid ${selectedService.icon}`}></i>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-4">
                      {selectedService.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {selectedService.desc}
                    </p>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => {
                        setSelectedService(null);
                        window.location.hash = 'contact-page';
                      }}
                      className="w-full py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Get Started <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Content Area with Tabs */}
                <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col">
                  {/* Tabs Navigation */}
                  <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
                    {(['overview', 'features', 'benefits'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all relative py-2 ${activeTab === tab
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                          }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-grow">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {activeTab === 'overview' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <Zap size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">The Strategy</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed">
                              {selectedService.details.overview}
                            </p>
                          </div>
                        )}

                        {activeTab === 'features' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                              <Target size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Key Capabilities</span>
                            </div>
                            <ul className="grid grid-cols-1 gap-3">
                              {selectedService.details.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeTab === 'benefits' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                              <Zap size={18} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Business Impact</span>
                            </div>
                            <ul className="grid grid-cols-1 gap-3">
                              {selectedService.details.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" />
                                  <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

