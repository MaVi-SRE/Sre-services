
import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  currentView: 'home' | 'contact' | 'privacy' | 'terms';
  onNavigate: (view: 'home' | 'contact' | 'privacy' | 'terms') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const scrollSnapRef = useRef<boolean>(false);

  const navLinks = [
    { name: 'HOME', id: 'home', href: '#home' },
    { name: 'ABOUT', id: 'about-us', href: '#about-us' },
    { name: 'SERVICES', id: 'what-we-do', href: '#what-we-do' },
    { name: 'CASE STUDIES', id: 'work', href: '#work' },
  ];

  // ScrollSpy Logic
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      if (scrollSnapRef.current) return;

      const sectionIds = navLinks.map(link => link.id);
      let current = 'home';

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Precise detection: if section is top-most
          if (rect.top <= 120) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavClick = (e: React.MouseEvent, id: string, href: string) => {
    e.preventDefault();

    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => scrollToElement(id), 150);
    } else {
      scrollToElement(id);
    }

    setActiveSection(id);
    setIsMenuOpen(false);
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      scrollSnapRef.current = true;
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => {
        scrollSnapRef.current = false;
      }, 800);
    }
  };

  const blueStyle = { color: '#0066CC' };
  const greenStyle = { color: '#65D249' };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img
              src="https://i.postimg.cc/kgkTTnFH/Picsart-26-01-24-22-46-24-348.png"
              alt="Monitronix Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="text-2xl md:text-3xl font-black tracking-tighter flex items-baseline font-sans">
              <span style={blueStyle}>Ma</span>
              <span style={greenStyle}>Vi</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <nav className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = currentView === 'home' && activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.id, link.href)}
                    className={`relative py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors group ${isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {link.name}
                    {/* Dynamic underline appearing only on hover, as requested */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#0066CC] to-[#65D249] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></span>
                  </a>
                );
              })}
            </nav>

            <button
              onClick={() => onNavigate('contact')}
              className={`px-8 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition-all shadow-lg ${currentView === 'contact'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                : 'bg-gradient-to-r from-[#42E695] to-[#3BB2B8] text-slate-950 shadow-green-500/20'
                }`}
            >
              CONTACT
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#050B14] border-b border-slate-200 dark:border-white/10 py-8 px-6 space-y-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.id, link.href)}
              className={`block text-sm font-bold uppercase tracking-widest transition-colors ${currentView === 'home' && activeSection === link.id ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              onNavigate('contact');
              setIsMenuOpen(false);
            }}
            className="block w-full text-center px-6 py-4 bg-gradient-to-r from-[#42E695] to-[#3BB2B8] text-slate-950 font-black rounded-xl uppercase tracking-widest"
          >
            CONTACT
          </button>
        </div>
      )}
    </header>
  );
};
