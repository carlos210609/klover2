import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome, IconZap, IconWallet, IconHistory, IconUser } from './Icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* 3D Parallax Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] animate-float"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen flex flex-col">
        {children}
      </main>

      {/* Glass Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"></div>
        <div className="relative flex justify-around items-center p-4">
          <NavItem to="/" icon={<IconHome className="w-6 h-6" />} label="Home" />
          <NavItem to="/earn" icon={<IconZap className="w-6 h-6" />} label="Earn" activeClass="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <NavItem to="/wallet" icon={<IconWallet className="w-6 h-6" />} label="Wallet" />
          <NavItem to="/history" icon={<IconHistory className="w-6 h-6" />} label="History" />
          <NavItem to="/profile" icon={<IconUser className="w-6 h-6" />} label="Profile" />
        </div>
      </nav>
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