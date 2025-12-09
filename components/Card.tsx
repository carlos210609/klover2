import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, padding = 'p-4 sm:p-6' }) => {
  return (
    <div className={`relative bg-k-surface border border-k-border rounded-xl backdrop-blur-lg ${className}`}>
      {title && (
        <h3 className="text-k-text-secondary font-display text-xs uppercase tracking-widest p-4 border-b border-k-border">
          {title}
        </h3>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
};

export default Card;
