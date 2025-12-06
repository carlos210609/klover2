import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconZap, IconWallet, IconHistory, IconUser } from './Icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';

  return (
    <div className="relative h-[100dvh] w-full bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black flex flex-col">
      {/* 3D Parallax Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-float"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Content Area - Scrollable */}
      <main className={`relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 max-w-md mx-auto w-full ${showNav ? 'pb-32 pt-6' : 'pb-6 pt-6'}`}>
        {children}
      </main>

      {/* Glass Navigation - Fixed at bottom */}
      {showNav && (
        <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="relative w-[90%] max-w-sm pointer-events-auto">
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"></div>
            
            {/* Nav Items */}
            <div className="relative flex justify-between items-center p-4 px-6">
              <NavItem to="/" icon={<IconHome className="w-6 h-6" />} label="Home" />
              <NavItem to="/earn" icon={<IconZap className="w-6 h-6" />} label="Earn" activeClass="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <NavItem to="/wallet" icon={<IconWallet className="w-6 h-6" />} label="Wallet" />
              <NavItem to="/history" icon={<IconHistory className="w-6 h-6" />} label="History" />
              <NavItem to="/profile" icon={<IconUser className="w-6 h-6" />} label="Profile" />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, label, activeClass }: { to: string; icon: React.ReactNode; label: string; activeClass?: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 transition-all duration-300 group ${
        isActive 
          ? activeClass || 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' 
          : 'text-white/40 hover:text-white/80'
      }`
    }
  >
    <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
      {icon}
    </div>
    <span className="text-[10px] font-mono tracking-wider opacity-80">{label}</span>
  </NavLink>
);

export default Layout;