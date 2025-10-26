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
  Users,
  BookOpen,
  X,
  Search
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
  const [showProblemLibrary, setShowProblemLibrary] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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
        setCurrentProblem(data.problem);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setLoading(false);
      }
    };

    fetchSession();

    // Fetch all problems for the library
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problems`);
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    fetchProblems();

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

    // Listen for problem changes
    socket.on('problem-changed', ({ problem }) => {
      setCurrentProblem(problem);
    });

    return () => {
      socket.off('session-ended');
      socket.off('problem-changed');
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

  const handleSelectProblem = async (problem) => {
    try {
      // Update session with new problem
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}/problem`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update problem');
      }

      setCurrentProblem(problem);
      setShowProblemLibrary(false);

      // Notify all participants via socket
      if (socket) {
        socket.emit('change-problem', { sessionId, problem });
      }
    } catch (error) {
      console.error('Failed to set problem:', error);
      alert('Failed to set problem. Please try again.');
    }
  };

  // Filter problems based on search and filters
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'ALL' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'ALL' || problem.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Get unique categories
  const categories = ['ALL', ...new Set(problems.map(p => p.category).filter(Boolean))];

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

            {/* Problem Library Button - Only for Interviewer */}
            {user?.role === 'INTERVIEWER' && (
              <button
                onClick={() => setShowProblemLibrary(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Problem Library
              </button>
            )}

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
                problem={currentProblem}
                isInterviewer={user?.role === 'INTERVIEWER'}
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

      {/* Problem Library Modal */}
      {showProblemLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Problem Library</h3>
              <button
                onClick={() => setShowProblemLibrary(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-4 border-b border-gray-700 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search problems by title or description..."
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'ALL' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-gray-400 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600">
                    {filteredProblems.length} problems
                  </div>
                </div>
              </div>
            </div>

            {/* Problems List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className={`bg-gray-700 rounded-lg p-4 border-2 transition-all cursor-pointer hover:border-purple-500 ${
                      currentProblem?.id === problem.id ? 'border-purple-500 bg-gray-600' : 'border-transparent'
                    }`}
                    onClick={() => handleSelectProblem(problem)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-semibold text-white flex-1 pr-2">{problem.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                        problem.difficulty === 'EASY' ? 'bg-green-900 text-green-300' :
                        problem.difficulty === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    
                    {problem.category && (
                      <div className="mb-2">
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                          {problem.category}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-300 line-clamp-2 mb-2">{problem.description}</p>
                    
                    {currentProblem?.id === problem.id && (
                      <div className="mt-2 flex items-center gap-2 text-purple-400 text-xs">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Currently Active
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredProblems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No problems match your search</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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