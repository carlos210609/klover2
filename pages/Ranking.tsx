import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { RankEntry, User } from '../types';
import { useLanguage } from '../App';

const RankRow = ({ entry, isCurrentUser }: { entry: RankEntry; isCurrentUser: boolean }) => (
    <div 
      className={`flex items-center p-3 rounded-lg transition-all duration-300 animate-fade-in-up ${isCurrentUser ? 'bg-k-accent/10 border border-k-accent' : 'border border-transparent'}`}
      style={{ animationDelay: `${entry.rank * 50}ms` }}
    >
        <div className="w-10 font-display text-lg font-bold text-center text-k-text-secondary">{entry.rank}</div>
        <div className="flex items-center gap-3 flex-1">
            <img 
              src={entry.photoUrl || `https://api.dicebear.com/8.x/bottts/svg?seed=${entry.username}`}
              alt={entry.username} 
              className="w-10 h-10 rounded-full border-2 border-k-border"
            />
            <div>
                <p className="font-bold text-k-text-primary">{entry.username}</p>
                <p className="text-sm text-k-text-secondary">Nível {entry.level}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold font-mono text-k-text-primary">{entry.xp.toLocaleString()}</p>
            <p className="text-xs text-k-text-tertiary">XP</p>
        </div>
    </div>
);


const Ranking = () => {
    const { t } = useLanguage();
    const [ranking, setRanking] = useState<RankEntry[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rankData, userData] = await Promise.all([
                backendService.getRanking(),
                backendService.getUser(),
            ]);
            setRanking(rankData);
            setCurrentUser(userData);
        } catch (error) {
            console.error("Failed to fetch ranking data:", error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-4">
            <h1 className="font-display text-3xl font-bold text-k-text-primary mb-6">{t('nav_ranking')}</h1>

            {loading ? (
                <div className="flex justify-center mt-12">
                    <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {ranking.map((entry) => (
                        <RankRow key={entry.userId} entry={entry} isCurrentUser={entry.userId === currentUser?.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Ranking;