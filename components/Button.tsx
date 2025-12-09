import React from 'react';
import { IconLoader } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
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
  const baseStyle = "relative w-full h-14 px-6 rounded-xl font-sans font-bold text-sm tracking-wide transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group active:scale-95 flex items-center justify-center";
  
  const variants = {
    primary: "bg-k-accent text-k-black hover:shadow-[0_0_25px_var(--k-accent-glow)]",
    secondary: "bg-k-surface text-k-text-primary border border-k-border hover:bg-white/5 hover:border-k-border-hover",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect */}
      {!isLoading && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none"></div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
          <IconLoader className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <span className={`relative z-0 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
    </button>
  );
};

export default Button;
