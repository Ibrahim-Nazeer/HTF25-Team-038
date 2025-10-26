import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin,
  ArrowLeft,
  Save,
  Edit
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    organization: '',
    jobRole: '',
    phoneNumber: '',
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    location: '',
    role: 'INTERVIEWER'
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${user.id}`);
      const data = await response.json();
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        organization: data.organization || '',
        jobRole: data.jobRole || '',
        phoneNumber: data.phoneNumber || '',
        bio: data.bio || '',
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        location: data.location || '',
        role: data.role || 'INTERVIEWER'
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/${user.id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your account information</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Organization */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Building2 className="w-4 h-4" />
                  Organization
                </label>
                <input
                  type="text"
                  value={profileData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Your company or organization"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4" />
                  Job Role
                </label>
                <input
                  type="text"
                  value={profileData.jobRole}
                  onChange={(e) => handleChange('jobRole', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="e.g., Senior Developer, Tech Lead"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 characters</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Social Links</h2>
            
            <div className="space-y-4">
              {/* LinkedIn */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={profileData.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={profileData.githubUrl}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-300">Account Type</p>
                  <p className="text-xs text-gray-500 mt-1">Your role in the platform</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profileData.role === 'INTERVIEWER' 
                    ? 'bg-blue-900 text-blue-300' 
                    : 'bg-green-900 text-green-300'
                }`}>
                  {profileData.role === 'INTERVIEWER' ? 'Interviewer' : 'Candidate'}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-300">Member Since</p>
                  <p className="text-xs text-gray-500 mt-1">Your account creation date</p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
