import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconZap, IconWallet, IconHistory, IconShop } from './Icons';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';

  return (
    <div className="relative h-[100dvh] w-full bg-transparent text-white overflow-hidden font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
      {/* 3D Parallax Background Effects - COLORED NOW */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Purple Glow */}
        <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen"></div>
        
        {/* Bottom Blue/Cyan Glow */}
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] animate-float mix-blend-screen"></div>
        
        {/* Center Accent */}
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px]"></div>

        {/* Grid Overlay - Slightly lighter to show depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      </div>

      {/* Main Content Area - Scrollable */}
      <main className={`relative z-10 flex-1 overflow-y-auto no-scrollbar px-4 max-w-md mx-auto w-full ${showNav ? 'pb-32 pt-6' : 'pb-6 pt-6'}`}>
        {children}
      </main>

      {/* Glass Navigation - Fixed at bottom */}
      {showNav && (
        <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="relative w-[90%] max-w-sm pointer-events-auto">
            {/* Glass Effect - Darker Slate Tint */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"></div>
            
            {/* Nav Items */}
            <div className="relative flex justify-between items-center p-4 px-6">
              <NavItem to="/" icon={<IconHome className="w-6 h-6" />} label="Home" />
              <NavItem to="/earn" icon={<IconZap className="w-6 h-6" />} label="Earn" activeClass="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <NavItem to="/wallet" icon={<IconWallet className="w-6 h-6" />} label="Wallet" />
              <NavItem to="/shop" icon={<IconShop className="w-6 h-6" />} label="Shop" />
              <NavItem to="/history" icon={<IconHistory className="w-6 h-6" />} label="Hist" />
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
          ? activeClass || 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
          : 'text-slate-400 hover:text-white'
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