import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../App';
import { ROUTES } from '../constants';
import { IconHome, IconWallet, IconMissions, IconRanking, IconKlover } from './Icons';

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
        isActive ? 'text-k-accent scale-110' : 'text-k-text-tertiary hover:text-k-text-secondary'
      }`
    }
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium tracking-wide">{label}</span>
  </NavLink>
);

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useLanguage();
  const location = useLocation();

  const showNavbar = location.pathname !== '/login';

  const navItems = [
    { to: ROUTES.HOME, label: t('nav_home'), icon: <IconHome /> },
    { to: ROUTES.MISSIONS, label: t('nav_missions'), icon: <IconMissions /> },
    { to: ROUTES.KLOVER, label: t('nav_klover'), icon: <IconKlover /> },
    { to: ROUTES.WALLET, label: t('nav_wallet'), icon: <IconWallet /> },
    { to: ROUTES.RANKING, label: t('nav_ranking'), icon: <IconRanking /> },
  ];

  return (
    <div className="h-screen w-screen bg-k-bg text-k-text-primary flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        {children}
      </main>

      {showNavbar && (
        <footer className="w-full h-16 bg-k-surface border-t border-k-border flex-shrink-0">
          <nav className="h-full flex items-center justify-around">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </footer>
      )}
    </div>
  );
};

export default Layout;
