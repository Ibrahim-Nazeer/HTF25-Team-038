import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import CollaborativeWhiteboard from '../components/CollaborativeWhiteboard';
import VideoChat from '../components/VideoChat';
import Timer from '../components/Timer';
import ChatBox from '../components/ChatBox';
import { 
  Code, 
  Palette, 
  Users 
} from 'lucide-react';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('code');
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    // Fetch session data
    const fetchSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}`);
        const data = await response.json();
        
        // Check if session is already completed
        if (data.status === 'COMPLETED' || data.status === 'CANCELLED') {
          setSessionEnded(true);
          setLoading(false);
          return;
        }
        
        setSessionData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setLoading(false);
      }
    };

    fetchSession();

    // Join Socket.IO room
    if (socket && user) {
      socket.emit('join-session', {
        sessionId,
        userId: user.id,
        userName: user.name || user.email
      });

      // Listen for user join/leave events
      socket.on('user-joined', ({ userId, userName }) => {
        setParticipants(prev => [...prev, { userId, userName }]);
      });

      socket.on('user-left', ({ userId }) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId));
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave-session', { sessionId, userId: user?.id });
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('session-ended');
      }
    };
  }, [sessionId, socket, user]);

  // Listen for session end event
  useEffect(() => {
    if (!socket) return;

    socket.on('session-ended', () => {
      setSessionEnded(true);
    });

    return () => {
      socket.off('session-ended');
    };
  }, [socket]);

  const handleEndSession = async () => {
    if (!window.confirm('Are you sure you want to end this interview session? This action cannot be undone.')) {
      return;
    }

    setIsEnding(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to end session');
      }

      // Notify all participants via socket
      if (socket) {
        socket.emit('end-session', { sessionId });
      }

      setSessionEnded(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('Failed to end session. Please try again.');
      setIsEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading interview session...</div>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">Session Ended</div>
          <p className="text-gray-400 mb-4">This interview session has been concluded and saved to history.</p>
          <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              {sessionData?.title || 'Interview Session'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Session ID: {sessionId}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Participants indicator */}
            <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-gray-300" />
              <span className="text-sm text-gray-300">
                {participants.length + 1} online
              </span>
            </div>

            {/* Timer */}
            <Timer sessionId={sessionId} isInterviewer={user?.role === 'INTERVIEWER'} />

            {/* End Session Button - Only for Interviewer */}
            {user?.role === 'INTERVIEWER' && (
              <button
                onClick={handleEndSession}
                disabled={isEnding}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isEnding ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ending...
                  </>
                ) : (
                  'End Session'
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Main Workspace */}
        <div className="flex-1 flex flex-col" style={{ marginRight: '400px' }}>
          {/* Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 flex gap-1">
            <TabButton
              icon={Code}
              label="Code Editor"
              active={activeTab === 'code'}
              onClick={() => setActiveTab('code')}
            />
            <TabButton
              icon={Palette}
              label="Whiteboard"
              active={activeTab === 'whiteboard'}
              onClick={() => setActiveTab('whiteboard')}
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden bg-gray-900">
            {activeTab === 'code' && (
              <CodeEditor 
                sessionId={sessionId} 
                problem={sessionData?.problem}
              />
            )}
            {activeTab === 'whiteboard' && (
              <CollaborativeWhiteboard sessionId={sessionId} />
            )}
          </div>
        </div>

        {/* Right Side Panel - Video & Chat (Fixed/Constant) */}
        <div className="absolute top-0 right-0 bottom-0 w-[400px] flex flex-col border-l border-gray-700 bg-gray-800">
          {/* Video Chat - Top Half */}
          <div className="h-1/2 border-b border-gray-700">
            <VideoChat 
              sessionId={sessionId} 
              dailyRoomUrl={sessionData?.dailyRoomUrl}
            />
          </div>

          {/* Text Chat - Bottom Half */}
          <div className="h-1/2">
            <ChatBox sessionId={sessionId} onClose={null} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
      active
        ? 'border-blue-500 text-blue-500'
        : 'border-transparent text-gray-400 hover:text-gray-300'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="font-medium">{label}</span>
  </button>
);

export default InterviewRoom;