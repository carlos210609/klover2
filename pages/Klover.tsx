import React from 'react';
import { useLanguage } from '../App';
import { IconKlover } from '../components/Icons';

const Klover = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
      
      <div 
        className="relative w-48 h-48 flex items-center justify-center mb-8 animate-pop-in"
        style={{ '--glow-color': 'rgba(0, 168, 255, 0.5)' } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-k-accent rounded-full animate-pulse-glow opacity-75"></div>
        <div className="relative bg-k-bg p-8 rounded-full">
           <IconKlover className="w-24 h-24 text-k-accent" />
        </div>
      </div>
      
      <h1 className="font-display text-2xl font-bold text-k-text-primary uppercase tracking-widest">
        {t('klover_omega_protocol')}
      </h1>
      <p className="text-k-text-secondary mt-4 max-w-md mx-auto">
        {t('klover_description')}
      </p>

      <div className="mt-12 w-full max-w-sm">
        <button
          disabled
          className="w-full h-14 rounded-xl font-display text-lg font-bold transition-all duration-300
                     bg-k-surface text-k-text-tertiary cursor-not-allowed border-2 border-dashed border-k-border"
        >
          <div className="flex items-center justify-center gap-3">
             <div className="w-3 h-3 bg-k-text-tertiary rounded-full animate-pulse"></div>
            {t('protocol_offline')}
          </div>
        </button>
      </div>
       <p className="text-xs text-k-text-tertiary mt-4">
        Em breve.
      </p>
    </div>
  );
};

export default Klover;