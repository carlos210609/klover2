
import React from 'react';
import Button from '../components/Button';
import { useLanguage } from '../App';
import { IconKlover } from '../components/Icons';

const Klover: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-4 pb-12">
      <div className="space-y-6 animate-fade-in-up">
        {/* Central Icon */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-k-accent rounded-full animate-pulse-glow blur-3xl opacity-50"
            style={{ '--glow-color': 'rgba(0, 168, 255, 0.5)' } as React.CSSProperties}
          ></div>
          <IconKlover className="w-40 h-40 text-k-accent drop-shadow-2xl" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-k-text-primary tracking-wide">
            {t('klover_omega_protocol')}
          </h1>
          <p className="text-sm text-k-text-secondary max-w-xs mx-auto">
            {t('klover_description')}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <Button disabled={true} className="!w-auto px-12 mx-auto">
            {t('protocol_offline')}
          </Button>
           <p className="text-xs text-k-text-tertiary font-mono mt-4">
            REQUER NÍVEL 15
          </p>
        </div>
      </div>
    </div>
  );
};

export default Klover;
