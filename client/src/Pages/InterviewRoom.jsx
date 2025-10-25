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
  Video, 
  MessageSquare, 
  Clock,
  Users 
} from 'lucide-react';

const InterviewRoom = () => {
  const { sessionId } = useParams();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('code');
  const [sessionData, setSessionData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session data
    const fetchSession = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}`);
        const data = await response.json();
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
      }
    };
  }, [sessionId, socket, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading interview session...</div>
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
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Main Workspace */}
        <div className="flex-1 flex flex-col">
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
            <TabButton
              icon={Video}
              label="Video Call"
              active={activeTab === 'video'}
              onClick={() => setActiveTab('video')}
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
            {activeTab === 'video' && (
              <VideoChat 
                sessionId={sessionId} 
                dailyRoomUrl={sessionData?.dailyRoomUrl}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        {showChat && (
          <div className="w-80 border-l border-gray-700 bg-gray-800">
            <ChatBox sessionId={sessionId} />
          </div>
        )}
      </div>

      {/* Floating Chat Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
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