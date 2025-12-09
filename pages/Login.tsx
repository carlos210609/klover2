import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-k-bg text-center p-6 animate-fade-in">
      <div className="w-24 h-24 mb-6">
        <svg viewBox="0 0 24 24" className="text-k-accent">
          <path fill="currentColor" d="M12 2a10 10 0 0 0-7.5 16.5A10 10 0 0 0 12 22a10 10 0 0 0 7.5-3.5A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-5.6-13.6A8 8 0 0 1 12 4a8 8 0 0 1 5.6 2.4A8 8 0 0 1 12 20z"/>
          <path fill="currentColor" d="M12 6a.9.9 0 0 0-1 1v4h-4a.9.9 0 0 0 0 2h4v4a.9.9 0 0 0 2 0v-4h4a.9.9 0 0 0 0-2h-4V7a.9.9 0 0 0-1-1z"/>
        </svg>
      </div>
      <h1 className="font-display text-4xl font-bold text-k-text-primary tracking-wider">
        KLOVER 2.0
      </h1>
      <p className="text-k-text-secondary mt-3 max-w-sm">
        Aguardando autenticação com o Telegram...
      </p>
      <div className="mt-8">
        <div className="w-8 h-8 border-2 border-k-border border-t-k-accent rounded-full animate-spin"></div>
      </div>
      <p className="text-k-text-tertiary mt-4 text-xs">
        Por favor, certifique-se de que você está abrindo o aplicativo através do Telegram.
      </p>
    </div>
  );
};

export default Login;
