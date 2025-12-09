
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
    >
        <div 
            className="bg-k-surface rounded-xl border border-k-border w-full max-w-sm m-4 flex flex-col animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
        >
            <header className="flex items-center justify-between p-4 border-b border-k-border">
                <h2 className="font-display font-bold text-lg text-k-text-primary">{title}</h2>
                <button 
                    onClick={onClose} 
                    className="text-k-text-tertiary hover:text-k-text-primary transition-colors"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>
            <main className="p-4 flex-grow">
                {children}
            </main>
        </div>
    </div>
  );
};

export default Modal;
