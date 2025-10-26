import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ConnectionStatus from '../components/ConnectionStatus';
import { Github, Code2, Users, Video, MessageSquare } from 'lucide-react';

const Login = () => {
  const { user, signInWithGithub, signInWithGoogle, needsRole, setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleSetRole = async (role) => {
    try {
      await setUserRole(role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to set role:', error);
      alert('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6">
      <ConnectionStatus />
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold">CodeSync Interview</h1>
          </div>
          
          <p className="text-xl text-gray-300">
            Real-time collaborative coding interview platform
          </p>
          
          <div className="space-y-4 pt-6">
            <Feature 
              icon={Code2}
              title="Live Code Editor"
              description="Collaborative Monaco editor with syntax highlighting"
            />
            <Feature 
              icon={Users}
              title="Whiteboard"
              description="Visual problem-solving with TLDraw integration"
            />
            <Feature 
              icon={Video}
              title="Video Chat"
              description="HD video and audio powered by Daily.co"
            />
            <Feature 
              icon={MessageSquare}
              title="Real-time Chat"
              description="Instant messaging during interviews"
            />
          </div>
        </div>

        {/* Right Side - Login */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to start your interview session</p>
          </div>

          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-950 text-white px-6 py-4 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
          >
            <Github className="w-6 h-6" />
            <span className="font-medium">Continue with GitHub</span>
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 mt-4 bg-white text-gray-900 px-6 py-4 rounded-lg transition-colors border border-gray-200 hover:bg-gray-100"
          >
            {/* Simple Google logo */}
            <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.9 0 7.1 1.3 9.5 3.8l7-7C36.4 2 30.6 0 24 0 14.7 0 6.9 5.2 3 12.7l8.4 6.5C13.9 14.1 18.5 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12.8c-.5 2.6-2 4.9-4.2 6.4l6.5 5c3.8-3.5 6-8.7 6-15.4z"/>
              <path fill="#4A90E2" d="M10.4 29.2A14.7 14.7 0 0 1 9.2 24c0-1.3.2-2.6.6-3.8L1.5 13.7A24 24 0 0 0 0 24c0 3.9.9 7.6 2.5 10.9l7.9-5.7z"/>
              <path fill="#FBBC05" d="M24 48c6.1 0 11.3-2 15-5.4l-7.9-6.1c-2.2 1.5-5 2.4-7.1 2.4-5.6 0-10.3-3.6-12-8.6L3 35.3C6.9 42.8 14.7 48 24 48z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              Built for hackathons • Open Source • Lightning Fast
            </p>
          </div>

          <div className="mt-6 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
            <p className="text-xs text-blue-300 text-center">
              🚀 Demo Mode: Sign in with GitHub to create or join interview sessions
            </p>
          </div>

          {/* Role selection modal for first-time users */}
          {needsRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-white mb-4">Welcome! Choose your role</h3>
                <p className="text-gray-400 mb-4">Are you registering as an interviewer or a candidate?</p>

                <div className="flex flex-col gap-3">
                  <button onClick={() => handleSetRole('INTERVIEWER')} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded">I am an Interviewer</button>
                  <button onClick={() => handleSetRole('CANDIDATE')} className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded">I am a Candidate</button>
                </div>
                <p className="text-xs text-gray-500 mt-4">You can change this role later in your profile.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="bg-blue-900 bg-opacity-30 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

export default Login;