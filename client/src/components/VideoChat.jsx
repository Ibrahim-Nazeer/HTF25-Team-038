import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

const VideoChat = ({ sessionId, dailyRoomUrl }) => {
  const callFrameRef = useRef(null);
  const containerRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dailyRoomUrl) {
      setError('No video room URL available. Please create a Daily.co room first.');
      return;
    }

    // Create Daily call frame
    const initializeCall = async () => {
      try {
        callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
          showLeaveButton: false,
          showFullscreenButton: true,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '8px',
          },
        });

        // Event listeners
        callFrameRef.current
          .on('joined-meeting', () => {
            console.log('Joined meeting');
            setIsJoined(true);
          })
          .on('left-meeting', () => {
            console.log('Left meeting');
            setIsJoined(false);
          })
          .on('error', (e) => {
            console.error('Daily error:', e);
            setError('Video call error occurred');
          });

        // Join the room
        await callFrameRef.current.join({ url: dailyRoomUrl });
      } catch (err) {
        console.error('Failed to initialize call:', err);
        setError('Failed to initialize video call');
      }
    };

    initializeCall();

    // Cleanup
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, [dailyRoomUrl]);

  const toggleMicrophone = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (callFrameRef.current) {
      callFrameRef.current.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const leaveCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
    }
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Video className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-medium">{error}</p>
          </div>
          <p className="text-gray-500 text-sm">
            Daily.co room URL: {dailyRoomUrl || 'Not configured'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gray-900">
      {/* Video Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Control Bar */}
      {isJoined && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-full shadow-lg">
          <button
            onClick={toggleMicrophone}
            className={`p-3 rounded-full transition-colors ${
              isMicOn 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isMicOn ? 'Mute' : 'Unmute'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${
              isCameraOn 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={leaveCall}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            title="Leave call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {!isJoined && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Joining video call...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoChat;