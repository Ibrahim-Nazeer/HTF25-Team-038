import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Copy, ExternalLink, Clock, User, LogOut, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    problemId: '',
    timerDuration: 45
  });

  useEffect(() => {
    // Only interviewers can create/list sessions
    if (user?.role === 'INTERVIEWER') {
      fetchSessions();
      fetchProblems();
    } else {
      // Candidates still need the problems list for context (optional)
      fetchProblems();
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sessions?userId=${user.id}`
      );
      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setLoading(false);
    }
  };

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problems`);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSession,
          interviewerId: user.id
        })
      });

      const session = await response.json();
      navigate(`/interview/${session.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const [joinSessionId, setJoinSessionId] = useState('');

  const handleJoinSession = () => {
    if (!joinSessionId) return alert('Please enter a session id');
    navigate(`/interview/${joinSessionId}`);
  };

  const copyInviteLink = (sessionId) => {
    const inviteLink = `${window.location.origin}/interview/${sessionId}`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">CodeSync Interview</h1>
            <p className="text-sm text-gray-400 mt-1">Real-time Collaborative Coding Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full" />
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="My Profile"
            >
              <UserCircle className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-white">Your Past Interview Sessions</h2>
          {user?.role === 'INTERVIEWER' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Session
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <input value={joinSessionId} onChange={(e) => setJoinSessionId(e.target.value)} placeholder="Enter session ID" className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700" />
              <button onClick={handleJoinSession} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Join Session</button>
            </div>
          )}
        </div>

        {/* Sessions Grid (Interviewers) or Instructions (Candidates) */}
        {user?.role === 'INTERVIEWER' ? (
          sessions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-400 mb-4">No sessions yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-blue-500 hover:text-blue-400"
              >
                Create your first session →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{session.title}</h3>

                  <div className="space-y-2 mb-4">
                    {session.problem && (
                      <p className="text-sm text-gray-400">
                        Problem: {session.problem.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{session.timerDuration || 45} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{session.candidate ? 'In Progress' : 'Waiting for candidate'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/interview/${session.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join
                    </button>
                    <button
                      onClick={() => copyInviteLink(session.id)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                      title="Copy invite link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-300 mb-4">As a candidate you can only join an existing session.</p>
            <p className="text-gray-400 mb-6">Enter the session id provided by your interviewer or use the invite link.</p>
            <div className="flex items-center justify-center gap-3">
              <input value={joinSessionId} onChange={(e) => setJoinSessionId(e.target.value)} placeholder="Session ID" className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600" />
              <button onClick={handleJoinSession} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Join</button>
            </div>
          </div>
        )}
      </main>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Session</h3>
            
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Frontend Developer Interview"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Problem
                </label>
                <select
                  value={newSession.problemId}
                  onChange={(e) => setNewSession({ ...newSession, problemId: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="">No specific problem</option>
                  {problems.map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.title} ({problem.difficulty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timer Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newSession.timerDuration}
                  onChange={(e) => setNewSession({ ...newSession, timerDuration: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                  min="5"
                  max="180"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Create Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;