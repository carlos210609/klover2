
import React, { useEffect, useState } from 'react';
import { backendService } from '../services/mockBackend';
import { Mission } from '../types';
import { useLanguage } from '../App';
import Button from '../components/Button';

const Missions: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeTab, setActiveTab] = useState<'DAILY' | 'WEEKLY'>('DAILY');
  const { t } = useLanguage();

  useEffect(() => {
    backendService.getMissions().then(setMissions);
  }, []);

  const filteredMissions = missions.filter(m => m.type === activeTab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-k-text-primary">{t('missions')}</h1>
      
      {/* Tabs */}
      <div className="flex bg-k-surface p-1 rounded-lg border border-k-border">
        <button 
          onClick={() => setActiveTab('DAILY')}
          className={`w-1/2 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'DAILY' ? 'bg-k-accent text-k-black' : 'text-k-text-secondary'}`}
        >
          {t('daily')}
        </button>
        <button 
          onClick={() => setActiveTab('WEEKLY')}
          className={`w-1/2 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'WEEKLY' ? 'bg-k-accent text-k-black' : 'text-k-text-secondary'}`}
        >
          {t('weekly')}
        </button>
      </div>

      {/* Missions List */}
      <div className="space-y-4 pb-20">
        {filteredMissions.length > 0 ? filteredMissions.map(mission => (
          <div key={mission.id} className="bg-k-surface border border-k-border rounded-xl p-4 space-y-3 animate-fade-in-up">
            <div>
              <p className="font-bold text-k-text-primary">{mission.title}</p>
              <p className="text-sm text-k-text-secondary">{mission.description}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="w-full bg-k-black rounded-full h-2">
                <div 
                  className="bg-k-accent h-full rounded-full" 
                  style={{ width: `${Math.min(mission.progress / mission.goal * 100, 100)}%`}}
                ></div>
              </div>
              <span className="text-xs font-mono text-k-text-secondary">{mission.progress}/{mission.goal}</span>
            </div>

            <Button 
                disabled={!mission.isComplete} 
                className="!h-10 !text-xs"
                variant={mission.isComplete ? 'primary' : 'secondary'}
            >
                {mission.isComplete ? t('claim') : `${mission.reward.value} ${mission.reward.type}`}
            </Button>
          </div>
        )) : (
            <div className="text-center text-k-text-secondary py-16 border border-dashed border-k-border rounded-xl">
                <p>Nenhuma missão disponível.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
