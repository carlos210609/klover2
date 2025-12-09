
import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconMissions, IconWallet, IconRanking, IconProfile, IconKlover } from './Icons';
import { useLanguage } from '../App';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';
  const { t } = useLanguage();

  return (
    <div className="relative h-[100dvh] w-full bg-k-bg text-k-text-primary font-sans flex flex-col overflow-hidden">
      
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-k-black">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,27,1)_0%,rgba(13,13,18,1)_100%)]"></div>
         {/* Subtle Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50"></div>
         {/* Top Glow */}
         <div className="absolute top-0 left-0 right-0 h-[40vh] bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(0,168,255,0.15)_0%,rgba(0,168,255,0)_100%)]"></div>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar px-4 max-w-lg mx-auto w-full ${showNav ? 'pb-28 pt-6' : 'py-6'}`}>
        <div key={location.pathname} className="animate-fade-in">
            {children}
        </div>
      </main>

      {/* Navigation */}
      {showNav && (
        <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center p-4 animate-slide-up">
          <nav className="relative w-full max-w-md bg-k-surface/50 backdrop-blur-xl border border-k-border rounded-xl flex justify-around items-center h-16 shadow-2xl shadow-black/50">
            <NavItem to="/" icon={<IconHome className="w-6 h-6" />} label={t('nav_home')} />
            <NavItem to="/missions" icon={<IconMissions className="w-6 h-6" />} label={t('nav_missions')} />
            <NavItem to="/klover" icon={<IconKlover className="w-6 h-6" />} label={t('nav_klover')} />
            <NavItem to="/wallet" icon={<IconWallet className="w-6 h-6" />} label={t('nav_wallet')} />
            <NavItem to="/ranking" icon={<IconRanking className="w-6 h-6" />} label={t('nav_ranking')} />
            {/* <NavItem to="/profile" icon={<IconProfile className="w-6 h-6" />} label={t('nav_profile')} /> */}
          </nav>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string; }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center h-full w-full transition-all duration-300 relative ${
        isActive 
          ? 'text-k-accent' 
          : 'text-k-text-tertiary hover:text-k-text-primary'
      }`
    }
  >
    {({ isActive }) => (
        <>
            {icon}
            <span className="text-[10px] mt-0.5 font-bold">
                {label}
            </span>
            {isActive && <div className="absolute bottom-1 w-1.5 h-1.5 bg-k-accent rounded-full"></div>}
        </>
    )}
  </NavLink>
);

export default Layout;
