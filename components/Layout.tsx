import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome, IconZap, IconWallet, IconHistory, IconUser } from './Icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* 3D Parallax Background Effects - Refined */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Smoother, slower moving orbs */}
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[100px] animate-float opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s', animationDuration: '12s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[90px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        {/* Refined Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-70"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pb-28 pt-4 px-4 max-w-md mx-auto min-h-screen flex flex-col perspective-1000">
        {children}
      </main>

      {/* Glass Navigation - Ultra Minimal */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] z-50 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Glass Layer */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,1)]"></div>
        
        <div className="relative flex justify-around items-center p-3.5">
          <NavItem to="/" icon={<IconHome className="w-5 h-5" />} label="Home" />
          <NavItem to="/earn" icon={<IconZap className="w-5 h-5" />} label="Earn" activeClass="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
          <NavItem to="/wallet" icon={<IconWallet className="w-5 h-5" />} label="Wallet" />
          <NavItem to="/history" icon={<IconHistory className="w-5 h-5" />} label="History" />
          <NavItem to="/profile" icon={<IconUser className="w-5 h-5" />} label="Profile" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label, activeClass }: { to: string; icon: React.ReactNode; label: string; activeClass?: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1.5 transition-all duration-300 group px-2 py-1 ${
        isActive 
          ? activeClass || 'text-white scale-105' 
          : 'text-white/30 hover:text-white/70'
      }`
    }
  >
    <div className={`transform transition-all duration-300 ${activeClass ? '-translate-y-1' : 'group-hover:-translate-y-0.5'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-mono tracking-widest uppercase transition-opacity duration-300 ${activeClass ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'} hidden sm:block`}>
      {label}
    </span>
  </NavLink>
);

export default Layout;