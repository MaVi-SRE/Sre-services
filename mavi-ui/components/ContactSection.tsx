
import React from 'react';

interface ContactSectionProps {
  onContactClick: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onContactClick }) => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="glass-card border border-slate-200 dark:border-white/10 rounded-[50px] p-10 md:p-20 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/5 to-green-500/5 pointer-events-none"></div>

          <div className="grid lg:grid-cols-2 gap-16 relative text-left">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter uppercase">
                Talk to our <br />
                <span className="text-moving-gradient">SRE team today</span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-md font-medium leading-relaxed">
                Whether you're looking to optimize cloud costs or need 24/7 infrastructure monitoring, we're ready to engineer your reliability roadmap.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  "24×7 SRE coverage and global support",
                  "Cost-effective alternative to in-house SRE",
                  "Onboarding completion within 3–5 days",
                  "Guaranteed SLAs with detailed reporting"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <i className="fa-solid fa-check text-[8px]"></i>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="grid gap-4">

                {/* Email Channel */}
                <a href="mailto:support@mavisolution.com" className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-500/40 hover:scale-[1.02] transition-all group shadow-sm">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-solid fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Direct Email</span>
                    <span className="text-slate-900 dark:text-white font-bold tracking-wide text-sm transition-colors">Connect With Email</span>
                  </div>
                </a>

                {/* WhatsApp Channel */}
                {/*<a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-green-500/40 hover:scale-[1.02] transition-all group shadow-sm">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-green-500 group-hover:text-white dark:group-hover:text-slate-950 transition-all">
                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">WhatsApp Business</span>
                    <span className="text-slate-900 dark:text-white font-bold tracking-wide text-sm transition-colors">Message Our Engineers</span>
                  </div>
                </a>*/}

                {/* LinkedIn Channel */}
                <a href="https://www.linkedin.com/company/mavisoulutions/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-400/40 hover:scale-[1.02] transition-all group shadow-sm">
                  <div className="w-12 h-12 bg-slate-900 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-600 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <i className="fa-brands fa-linkedin-in text-lg"></i>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Professional Network</span>
                    <span className="text-slate-900 dark:text-white font-bold tracking-wide text-sm transition-colors">Connect on LinkedIn</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
