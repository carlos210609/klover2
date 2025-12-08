import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`relative group perspective-1000 ${className}`}>
      {/* Glow Effect on Hover - Colorful now */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
      
      {/* Content - 3D Transform on Hover */}
      <div className="relative h-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-500 transform preserve-3d group-hover:border-white/30 group-hover:bg-slate-900/80 group-hover:scale-[1.02] group-hover:rotate-1">
        {title && (
          <h3 className="text-white/60 font-mono text-xs uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;