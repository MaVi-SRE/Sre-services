
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SREPhilosophy } from './components/SREPhilosophy';
import { ServicesTable } from './components/ServicesTable';
import { AIAdvantage } from './components/AIAdvantage';
import { ServicePortfolio } from './components/ServicePortfolio';
import { ClientsSection } from './components/ClientsSection';
import { CaseStudy } from './components/CaseStudy';
import { TechStack } from './components/TechStack';
import { ContactSection } from './components/ContactSection';
import { ContactPage } from './components/ContactPage';
import { LegalPage } from './components/LegalPage';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'contact' | 'privacy' | 'terms'>('home');

  // Handle back button / hash changes for a better SPA feel
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#contact-page') {
        setView('contact');
      } else if (window.location.hash === '#privacy') {
        setView('privacy');
      } else if (window.location.hash === '#terms') {
        setView('terms');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newView: 'home' | 'contact' | 'privacy' | 'terms') => {
    setView(newView);
    if (newView === 'contact') {
      window.location.hash = 'contact-page';
    } else if (newView === 'privacy') {
      window.location.hash = 'privacy';
    } else if (newView === 'terms') {
      window.location.hash = 'terms';
    } else {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#050B14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header currentView={view} onNavigate={navigateTo} />
      <main className="flex-grow">
        {view === 'home' ? (
          <>
            <Hero onContactClick={() => navigateTo('contact')} />
            <About />
            <SREPhilosophy />
            <section id="what-we-do">
              <ServicePortfolio />
              <ClientsSection />
              <ServicesTable />
              <AIAdvantage />
            </section>
            <CaseStudy />
            <TechStack />
            <ContactSection onContactClick={() => navigateTo('contact')} />
          </>
        ) : view === 'contact' ? (
          <ContactPage />
        ) : (
          <LegalPage type={view as 'privacy' | 'terms'} onBack={() => navigateTo('home')} />
        )}
      </main>
      <ThemeToggle />
      <Chatbot />
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;