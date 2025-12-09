
import React, { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconHome, IconZap, IconWallet, IconHistory, IconShop } from './Icons';
import { useLanguage } from '../App';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const showNav = location.pathname !== '/login';
  const { t } = useLanguage();

  return (
    <div className="relative h-[100dvh] w-full bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col overflow-hidden perspective-2000">
      
      {/* CRT & VIGNETTE OVERLAYS */}
      <div className="scanlines"></div>
      <div className="vignette"></div>

      {/* FIXED Background Layer - Stays behind everything with negative z-index */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Deep Space Background Base */}
        <div className="absolute inset-0 bg-[#050b14]"></div>

        {/* Fun Animated Blobs / Space Junk */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-purple-900/10 rounded-full blur-[80px] animate-float"></div>
        <div className="absolute bottom-[20%] right-[5%] w-72 h-72 bg-blue-900/10 rounded-full blur-[90px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[60%] w-40 h-40 bg-cyan-900/10 rounded-full blur-[60px] animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Rolling Cubes (Decorations) */}
        <div className="absolute top-[15%] right-[10%] w-6 h-6 border border-white/5 rounded-sm animate-tumble opacity-20"></div>
        <div className="absolute bottom-[15%] left-[5%] w-8 h-8 border border-white/5 rounded-full animate-float opacity-20"></div>
        
        {/* New Crazy Elements */}
        <div className="absolute top-[50%] left-[20%] w-4 h-4 bg-white/5 rotate-45 animate-spin-slow opacity-10"></div>
        <div className="absolute bottom-[40%] right-[30%] w-2 h-12 bg-white/5 -rotate-12 animate-float opacity-10" style={{ animationDuration: '4s' }}></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [transform:perspective(500px)_rotateX(20deg)]"></div>
      </div>

      {/* Main Content Area - Scrollable z-10 */}
      <main className={`relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 max-w-md mx-auto w-full ${showNav ? 'pb-32 pt-6' : 'pb-6 pt-6'}`}>
        {/* Page Transition Wrapper - ZOOM IN ENTRY */}
        <div key={location.pathname} className="animate-zoom-bounce origin-center min-h-full">
            {children}
        </div>
      </main>

      {/* Glass Navigation - Fixed at bottom z-50 */}
      {showNav && (
        <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none animate-slide-up-fade">
          <nav className="relative w-[92%] max-w-sm pointer-events-auto group">
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-white/20"></div>
            
            {/* Nav Items */}
            <div className="relative flex justify-between items-center p-3 px-6">
              <NavItem to="/" icon={<IconHome className="w-5 h-5" />} label={t('nav_home')} />
              <NavItem to="/earn" icon={<IconZap className="w-5 h-5" />} label={t('nav_earn')} activeClass="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-wobble" />
              <NavItem to="/wallet" icon={<IconWallet className="w-5 h-5" />} label={t('nav_wallet')} />
              <NavItem to="/shop" icon={<IconShop className="w-5 h-5" />} label={t('nav_shop')} />
              <NavItem to="/history" icon={<IconHistory className="w-5 h-5" />} label={t('nav_hist')} />
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
      `flex flex-col items-center gap-1.5 transition-all duration-300 group/item relative p-1 ${
        isActive 
          ? activeClass || 'text-white scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
          : 'text-slate-500 hover:text-white hover:scale-110'
      }`
    }
  >
    <div className="transform transition-transform duration-300 group-hover/item:-translate-y-1 group-active/item:scale-90">
      {icon}
    </div>
  </NavLink>
);

export default Layout;