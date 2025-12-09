
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const commonIconProps: Omit<IconProps, 'className'> = {
  strokeWidth: 1.5,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
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

export const IconChart: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

export const IconSwap: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
        <path d="M16 3l4 4l-4 4"/>
        <path d="M20 7H4"/>
        <path d="M8 21l-4-4l4-4"/>
        <path d="M4 17h16"/>
    </svg>
);

export const IconUser: React.FC<IconProps> = ({ className, ...props }) => (
  <svg className={`w-6 h-6 ${className ?? ''}`} {...commonIconProps} {...props}>
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
    <svg className={`w-5 h-5 ${className ?? ''}`} {...commonIconProps} strokeWidth="2" >
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export const IconChevronDown: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={`w-5 h-5 ${className ?? ''}`} {...commonIconProps} strokeWidth="2" >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);
