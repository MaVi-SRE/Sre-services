
import React from 'react';

interface FooterProps {
  onNavigate: (view: 'home' | 'contact' | 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent, href: string, isHome?: boolean) => {
    e.preventDefault();
    if (href === '#contact') {
      onNavigate('contact');
    } else {
      onNavigate('home');
      if (!isHome) {
        setTimeout(() => {
          const id = href.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  };

  return (
    <footer className="bg-white dark:bg-black py-16 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-left">

          {/* Column 1: Logo & Tagline */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
              <img
                src="https://i.postimg.cc/kgkTTnFH/Picsart-26-01-24-22-46-24-348.png"
                alt="Monitronix Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="text-xl font-black tracking-tighter flex items-baseline font-sans">
                <span className="text-[#0066CC]">Ma</span>
                <span className="text-[#65D249]">Vi</span>

              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
              Engineering high-performance, ultra-reliable infrastructure for modern enterprises.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Explore</h4>
            <nav className="flex flex-col gap-4">
              <a href="#home" onClick={(e) => handleNavClick(e, '#home', true)} className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Home</a>
              <a href="#about-us" onClick={(e) => handleNavClick(e, '#about-us')} className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">About Us</a>
              <a href="#what-we-do" onClick={(e) => handleNavClick(e, '#what-we-do')} className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Our Services</a>
              <a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Case Studies</a>
            </nav>
          </div>

          {/* Column 3: Quick Links (Contact) */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Contact</h4>
            <nav className="flex flex-col gap-4">
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Contact Us</a>
              <a href="mailto:support@mavisolution.com" className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">Support</a>
            </nav>
          </div>

          {/* Column 4: Social / LinkedIn */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/mavisoulutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#0077b5] hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(0,119,181,0.4)] hover:border-transparent transition-all duration-300 ease-out"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in text-lg"></i>
              </a>
              <a
                href="mailto:support@mavisolution.com"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:border-transparent transition-all duration-300 ease-out"
                aria-label="Email Support"
              >
                <i className="fa-solid fa-envelope text-lg"></i>
              </a>

              {/*<a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#25D366] hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] hover:border-transparent transition-all duration-300 ease-out"
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i>
              </a>*/}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Trust Line */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col items-center md:items-start gap-4">
          <p className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em]">
            Engineered for reliability. Built for scale.
          </p>
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-bold">
              © {currentYear} Mavi Solution Pvt. Ltd. All Rights Reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <button
                onClick={() => onNavigate('terms')}
                className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms and conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
