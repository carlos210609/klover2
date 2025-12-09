
import React, { useState, useEffect, useCallback } from 'react';
import { backendService } from '../services/mockBackend';
import { useLanguage } from '../App';
import { User } from '../types';
import { IconLogout } from '../components/Icons';

const Profile = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const userData = await backendService.getUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleLogout = () => {
      backendService.logout();
  }

  if (!user) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 pt-12 animate-fade-in">
        <img
            src={user.photoUrl || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.username}`}
            alt="User"
            className="w-24 h-24 rounded-full border-4 border-k-accent shadow-lg shadow-k-accent-glow"
        />
        <h1 className="mt-4 font-display text-2xl font-bold text-k-text-primary">
            {user.firstName || user.username}
        </h1>
        <p className="text-k-text-secondary">@{user.username}</p>
        
        <div className="w-full max-w-sm mt-10 bg-k-surface border border-k-border rounded-lg p-4 text-center">
            <p className="text-sm text-k-text-secondary">{t('user_id')}</p>
            <p className="font-mono text-k-text-primary break-all">{user.id}</p>
        </div>

        <div className="mt-8 w-full max-w-sm">
            <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-lg font-bold transition-colors duration-300 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
                <IconLogout className="w-5 h-5"/>
                {t('disconnect')}
            </button>
        </div>
    </div>
  );
};

export default Profile;
