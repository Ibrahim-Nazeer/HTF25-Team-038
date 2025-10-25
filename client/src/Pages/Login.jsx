import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Github, Code2, Users, Video, MessageSquare } from 'lucide-react';

const Login = () => {
  const { user, signInWithGithub } = useContext(AuthContext);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6">
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