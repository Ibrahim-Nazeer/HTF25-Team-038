import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

const Timer = ({ sessionId, isInterviewer }) => {
  const socket = useContext(SocketContext);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(45);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Timer ended - could trigger notification
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Listen for timer events from interviewer
  useEffect(() => {
    if (!socket) return;

    socket.on('timer-started', ({ duration, startTime }) => {
      setTimeLeft(duration);
      setIsRunning(true);
      startTimeRef.current = startTime;
    });

    socket.on('timer-paused', () => {
      setIsRunning(false);
    });

    socket.on('timer-reset', () => {
      setTimeLeft(45 * 60);
      setIsRunning(false);
    });

    return () => {
      socket.off('timer-started');
      socket.off('timer-paused');
      socket.off('timer-reset');
    };
  }, [socket]);

  const handleStart = () => {
    if (isInterviewer && socket) {
      socket.emit('timer-start', { sessionId, duration: timeLeft });
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isInterviewer && socket) {
      socket.emit('timer-pause', { sessionId });
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (isInterviewer && socket) {
      const newTime = customMinutes * 60;
      setTimeLeft(newTime);
      setIsRunning(false);
      socket.emit('timer-reset', { sessionId });
    }
  };

  const handleSetCustomTime = () => {
    const newTime = customMinutes * 60;
    setTimeLeft(newTime);
    setShowSettings(false);
  };

  const getTimerColor = () => {
    if (timeLeft <= 300) return 'text-red-500'; // Last 5 minutes
    if (timeLeft <= 600) return 'text-yellow-500'; // Last 10 minutes
    return 'text-green-500';
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 bg-gray-700 px-4 py-2 rounded-lg">
        <Clock className={`w-5 h-5 ${getTimerColor()}`} />
        <span className={`text-xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </span>

        {isInterviewer && (
          <div className="flex items-center gap-1 ml-2 border-l border-gray-600 pl-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                title="Start Timer"
              >
                <Play className="w-4 h-4 text-green-400" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-1.5 hover:bg-gray-600 rounded transition-colors"
                title="Pause Timer"
              >
                <Pause className="w-4 h-4 text-yellow-400" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-gray-600 rounded transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors text-gray-200"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Timer Settings Dropdown */}
      {showSettings && isInterviewer && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-50 w-64">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Set Timer Duration</h3>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              min="1"
              max="180"
            />
            <span className="text-gray-400 text-sm">minutes</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSetCustomTime}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Quick Set:</p>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => {
                    setCustomMinutes(mins);
                    setTimeLeft(mins * 60);
                    setShowSettings(false);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;