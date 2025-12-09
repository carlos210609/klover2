import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { Mission, ChestRarity } from '../types';
import { useLanguage } from '../App';
import { CHEST_DEFINITIONS } from '../constants';

const MissionCard = ({ mission, onClaim }: { mission: Mission; onClaim: (id: string) => void }) => {
  const { t } = useLanguage();
  const isComplete = mission.progress >= mission.goal;
  const progressPercentage = Math.min(100, (mission.progress / mission.goal) * 100);

  const getRewardLabel = () => {
    if (mission.reward.type === 'XP') {
      return `${mission.reward.value} XP`;
    }
    const chestInfo = CHEST_DEFINITIONS[mission.reward.value as ChestRarity];
    return chestInfo ? chestInfo.name : 'Baú';
  };

  return (
    <div className="bg-k-surface border border-k-border rounded-lg p-4 flex flex-col gap-3 animate-fade-in-up">
      <div>
        <h3 className="font-bold text-k-text-primary">{mission.title}</h3>
        <p className="text-sm text-k-text-secondary">{mission.description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="w-full bg-k-bg h-2 rounded-full border border-k-border">
            <div
              className="h-full bg-k-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-right mt-1 text-k-text-tertiary">
            {mission.progress} / {mission.goal}
          </p>
        </div>
        <button
          onClick={() => onClaim(mission.id)}
          disabled={!isComplete || mission.isComplete}
          className={`px-4 py-2 rounded-md font-bold text-sm transition-all duration-200
            ${mission.isComplete
              ? 'bg-k-surface text-k-text-tertiary border border-k-border'
              : isComplete
              ? 'bg-k-accent text-k-bg'
              : 'bg-k-bg text-k-text-secondary border border-k-border cursor-not-allowed'
            }`}
        >
          {mission.isComplete ? t('claimed') : t('claim')}
        </button>
      </div>
       <div className="text-center text-xs font-semibold bg-k-bg py-1 px-2 rounded-md border border-k-border self-start">
        Recompensa: <span className="text-k-accent">{getRewardLabel()}</span>
      </div>
    </div>
  );
};

const Missions = () => {
  const { t } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [view, setView] = useState<'DAILY' | 'WEEKLY'>('DAILY');
  const [loading, setLoading] = useState(true);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const allMissions = await backendService.getMissions();
      setMissions(allMissions);
    } catch (error) {
      console.error("Failed to fetch missions:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const handleClaim = async (missionId: string) => {
    try {
      await backendService.claimMissionReward(missionId);
      // Refresh missions list to update state
      fetchMissions();
    } catch (error) {
      console.error("Failed to claim mission reward:", error);
    }
  };

  const filteredMissions = missions.filter((m) => m.type === view);

  return (
    <div className="p-4">
      <h1 className="font-display text-3xl font-bold text-k-text-primary mb-4">{t('missions')}</h1>

      <div className="flex items-center bg-k-surface border border-k-border rounded-lg p-1 mb-6">
        <button
          onClick={() => setView('DAILY')}
          className={`w-1/2 py-2 rounded-md font-bold transition-colors ${view === 'DAILY' ? 'bg-k-accent text-k-bg' : 'text-k-text-secondary'}`}
        >
          {t('daily')}
        </button>
        <button
          onClick={() => setView('WEEKLY')}
          className={`w-1/2 py-2 rounded-md font-bold transition-colors ${view === 'WEEKLY' ? 'bg-k-accent text-k-bg' : 'text-k-text-secondary'}`}
        >
          {t('weekly')}
        </button>
      </div>

      {loading ? (
         <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
         </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Missions;
