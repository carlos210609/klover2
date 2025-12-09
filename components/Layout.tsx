
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../App';
import { ROUTES } from '../constants';
import { IconHome, IconChart, IconSwap, IconUser } from './Icons';

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
    { to: ROUTES.DASHBOARD, label: t('nav_dashboard'), icon: <IconHome /> },
    { to: ROUTES.MARKETS, label: t('nav_markets'), icon: <IconChart /> },
    { to: ROUTES.SWAP, label: t('nav_swap'), icon: <IconSwap /> },
    { to: ROUTES.PROFILE, label: t('nav_profile'), icon: <IconUser /> },
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