import React from 'react';
import { Video, ExternalLink } from 'lucide-react';

/**
 * WHEREBY VIDEO INTEGRATION - EASIEST & FASTEST
 * 
 * Setup Steps:
 * 1. Go to https://whereby.com/
 * 2. Sign up (free)
 * 3. Create a room (you get 1 free room)
 * 4. Copy the room URL
 * 5. Use it below
 * 
 * That's it! No API keys, no backend needed.
 */

const VideoChat = ({ sessionId }) => {
  // Generate a unique room URL based on session ID
  // Replace 'your-subdomain' with your Whereby subdomain
  const wherebyRoomUrl = `https://codesync.whereby.com/codesync52cb56cf-8a69-4b3e-b2a1-5f37d2817081 `;
  
  return (
    <div className="h-full relative bg-gray-900 flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative">
        <iframe
          src={`${wherebyRoomUrl}?embed&displayName=CodeSync User&background=off`}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          className="w-full h-full border-0"
          title="Whereby Video Chat"
        />
      </div>

      {/* Helper Text */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 text-center">
        <p className="text-sm text-gray-400">
          <Video className="w-4 h-4 inline mr-2" />
          Video powered by Whereby • 
          <a 
            href={wherebyRoomUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 ml-2 inline-flex items-center gap-1"
          >
            Open in new tab <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default VideoChat;