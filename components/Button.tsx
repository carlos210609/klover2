import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyle = "relative w-full py-4 px-6 rounded-xl font-mono font-bold uppercase tracking-wider text-sm transition-all duration-500 transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group perspective-1000 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-white text-black border border-transparent hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:border-white/50",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/40 backdrop-blur-md hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* 3D Hover Depth Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"></div>
      
      {/* Shimmer effect */}
      {!isLoading && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none w-[200%]"></div>
      )}
      
      {/* Loading Overlay - Cyber Style */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[2px] z-30">
          <div className="flex gap-1">
             <div className="w-1.5 h-6 bg-white animate-[pulse_0.6s_ease-in-out_infinite]"></div>
             <div className="w-1.5 h-6 bg-white animate-[pulse_0.6s_ease-in-out_0.2s_infinite]"></div>
             <div className="w-1.5 h-6 bg-white animate-[pulse_0.6s_ease-in-out_0.4s_infinite]"></div>
          </div>
        </div>
      )}

      <span className={`relative z-20 flex items-center justify-center gap-2 transition-all duration-300 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;