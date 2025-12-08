import React, { useState } from 'react';

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
  onClick,
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300); // Reset animation
    if (onClick) onClick(e);
  };

  const baseStyle = "relative w-full py-4 px-6 rounded-xl font-mono font-bold uppercase tracking-wider text-sm transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group active:scale-90 hover:scale-[1.02] hover:rotate-1";
  
  const variants = {
    primary: "bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-transparent hover:animate-jelly",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30 backdrop-blur-md hover:animate-wobble",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:rotate-3"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${isClicked ? 'animate-rubber-band' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Shimmer effect */}
      {!isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none skew-x-12"></div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit z-30">
          <svg className="animate-spin h-5 w-5 opacity-80" viewBox="0 0 24 24" fill="none">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      <span className={`relative z-20 flex items-center justify-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;