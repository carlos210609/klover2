import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`relative group perspective-1000 ${className}`}>
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      {/* Content */}
      <div className="relative h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-white/20 hover:bg-black/50">
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