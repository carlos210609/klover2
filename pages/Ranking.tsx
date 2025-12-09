
import React, { useEffect, useState } from 'react';
import { backendService } from '../services/mockBackend';
import { RankEntry, User } from '../types';
import { useLanguage } from '../App';

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    backendService.getRanking().then(setRanking);
    backendService.getUser().then(setCurrentUser);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-k-text-primary">{t('nav_ranking')}</h1>
      
      <div className="space-y-2 pb-20">
        {ranking.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUser?.id;
          return (
            <div 
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${isCurrentUser ? 'bg-k-accent/10 border-k-accent' : 'bg-k-surface border-k-border'}`}
            >
              <span className="font-display font-bold text-lg w-8 text-center text-k-text-secondary">
                {entry.rank}
              </span>
              <img src={entry.photoUrl} alt={entry.username} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className={`font-bold ${isCurrentUser ? 'text-k-accent' : 'text-k-text-primary'}`}>
                  {entry.username} {isCurrentUser && '(Você)'}
                </p>
                <p className="text-xs text-k-text-secondary">
                  Nível {entry.level}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-k-text-primary">{entry.xp} XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
