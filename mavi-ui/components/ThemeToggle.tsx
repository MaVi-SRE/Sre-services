
import React, { useState, useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="fixed bottom-[92px] right-9 z-[60] flex flex-col items-center group">
      <button 
        onClick={toggleTheme}
        className="relative w-8 h-16 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-1.5 flex flex-col items-center transition-all duration-300 hover:ring-4 ring-blue-500/10 shadow-xl"
        aria-label="Toggle theme"
      >
        <div className={`w-5 h-5 rounded-full bg-slate-900 dark:bg-blue-500 shadow-lg transform transition-transform duration-500 flex items-center justify-center ${theme === 'dark' ? 'translate-y-8' : 'translate-y-0'}`}>
          {theme === 'dark' ? 
            <i className="fa-solid fa-moon text-[10px] text-white"></i> : 
            <i className="fa-solid fa-sun text-[10px] text-yellow-500"></i>
          }
        </div>
      </button>
    </div>
  );
};
