import React from 'react';

interface SvgIconProps {
  className?: string;
  children?: React.ReactNode;
}

const SvgIcon = ({ className = "w-6 h-6 text-k-text-primary", children }: SvgIconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    {children}
  </svg>
);

export const IconHome = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </SvgIcon>
);

export const IconMissions = ({ className }: { className?: string }) => (
    <SvgIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </SvgIcon>
);

export const IconWallet = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </SvgIcon>
);

export const IconRanking = ({ className }: { className?: string }) => (
    <SvgIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </SvgIcon>
);

export const IconProfile = ({ className }: { className?: string }) => (
    <SvgIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </SvgIcon>
);


export const IconChest = ({ className }: { className?: string }) => (
    <SvgIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </SvgIcon>
);

export const IconPix = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.529 2.928a2.653 2.653 0 013.318 0l2.583 2.09a2.153 2.153 0 002.222 0l2.678-1.546a2.653 2.653 0 013.318 4.095l-1.546 2.678a2.153 2.153 0 000 2.222l2.09 2.583a2.653 2.653 0 01-4.095 3.318l-2.678-1.546a2.153 2.153 0 00-2.222 0l-2.583 2.09a2.653 2.653 0 01-3.318-4.095l1.546-2.678a2.153 2.153 0 000-2.222L3.339 9.39a2.653 2.653 0 014.095-3.318l2.095 2.583a2.153 2.153 0 002.222 0l1.778-1.027z" />
  </SvgIcon>
);

export const IconChevronRight = ({ className }: { className?: string }) => (
    <SvgIcon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </SvgIcon>
);

export const IconCheck = ({ className }: { className?: string }) => (
  <SvgIcon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </SvgIcon>
);

export const IconLoader = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className || 'w-6 h-6 text-k-accent'}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
