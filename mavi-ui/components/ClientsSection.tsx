
import React from 'react';

const clients = [
  {
    id: 1,
    name: 'Placibo technologies Pvt Ltd',
    //url: 'https://www.placibo.in/',
    logoUrl: 'https://i.postimg.cc/nLnXXpBD/Logo_(1).png',
  },
  {
    id: 2,
    name: 'Rainbow Gate Marketing',
    // url: 'https://www.rainbowgate.online/',
    logoUrl: 'https://i.postimg.cc/mrcysmXc/Picsart_26_02_20_12_45_52_806.png',
  },
];

export const ClientsSection: React.FC = () => {
  return (
    <section id="clients" className="py-24 relative overflow-hidden bg-white dark:bg-void-navy transition-colors duration-300">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="mb-16 text-left">
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Our Clients
          </h3>
        </div>

        <div className="flex justify-start items-center gap-12 md:gap-24 flex-wrap">
          {clients.map((client) => (
            <a
              key={client.id}
              //href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                src={client.logoUrl}
                alt={`${client.name} logo`}
                className="max-h-[60px]  hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 ease-in-out"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};


