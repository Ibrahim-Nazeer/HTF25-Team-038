import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use environment variable or fallback to Railway URL
    const backendURL =
      import.meta.env.VITE_API_URL || ' ';

    if (!import.meta.env.VITE_API_URL) {
      console.warn('⚠️ VITE_API_URL not set, using fallback:', backendURL);
    }

    console.log('🔌 Connecting to backend:', backendURL);

    const socketInstance = io(backendURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      secure: true,
      rejectUnauthorized: false,
      timeout: 20000,
      forceNew: true
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('⚠️ Socket connection error:', error.message);
      console.error('   Backend URL:', backendURL);
      console.error('   Error type:', error.type);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed after all attempts');
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
      {/* Connection Status Indicator */}
      {!isConnected && socket && (
        <div className="fixed bottom-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          ⚠️ Reconnecting to server... Check console for details
        </div>
      )}
      {/* No Socket Warning */}
      {!socket && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          ❌ Cannot connect to backend server
        </div>
      )}
    </SocketContext.Provider>
  );
};

export default SocketContext;