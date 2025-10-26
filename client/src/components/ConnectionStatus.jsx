import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ConnectionStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendURL, setBackendURL] = useState('');

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL || 'Not configured';
    setBackendURL(url);

    const checkBackend = async () => {
      if (!import.meta.env.VITE_API_URL) {
        setBackendStatus('no-config');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendStatus('offline');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected':
        return 'Backend Connected';
      case 'checking':
        return 'Checking Backend...';
      case 'no-config':
        return 'Backend URL Not Configured';
      case 'offline':
        return 'Backend Offline';
      default:
        return 'Backend Error';
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected':
        return 'bg-green-900 border-green-600';
      case 'checking':
        return 'bg-yellow-900 border-yellow-600';
      default:
        return 'bg-red-900 border-red-600';
    }
  };

  // Only show if there's an issue
  if (backendStatus === 'connected') return null;

  return (
    <div className={`fixed top-4 right-4 ${getStatusColor()} border-2 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50 max-w-md`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="font-semibold">{getStatusText()}</div>
          <div className="text-xs opacity-90 mt-1">
            URL: {backendURL}
          </div>
          {backendStatus === 'no-config' && (
            <div className="text-xs mt-2 bg-black/30 p-2 rounded">
              <strong>Fix:</strong> Set VITE_API_URL in Vercel environment variables
            </div>
          )}
          {backendStatus === 'offline' && (
            <div className="text-xs mt-2 bg-black/30 p-2 rounded">
              <strong>Fix:</strong> Check Railway deployment logs and ensure DATABASE_URL is configured
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
