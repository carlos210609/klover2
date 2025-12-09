import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const commonIconProps: Omit<IconProps, 'className'> = {
  strokeWidth: 1.5,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
};

export const IconHome: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconWallet: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
    <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7" />
    <path d="M16 12h5" />
    <path d="M18 10l3 2-3 2" />
    <path d="M3 10h4" />
    <path d="M5 8l-2 2 2 2" />
  </svg>
);

export const IconMissions: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="M12 18L12 12" />
    <path d="M12 8L12.01 8" />
  </svg>
);

export const IconRanking: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);


export const IconKlover: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 21.5c-5-5-5-13 0-18" />
        <path d="M14 21.5c5-5 5-13 0-18" />
        <path d="M2.5 10c5 5 13 5 18 0" />
        <path d="M2.5 14c5-5 13-5 18 0" />
    </svg>
);

export const IconUser: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-5 h-5 ${className ?? ''}`} {...commonIconProps} {...props}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconLogout: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-5 h-5 ${className ?? ''}`} {...commonIconProps} {...props}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={`w-5 h-5 ${className ?? ''}`} {...commonIconProps} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);