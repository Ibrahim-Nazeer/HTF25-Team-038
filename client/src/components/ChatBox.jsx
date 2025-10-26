import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';

const ChatBox = ({ sessionId, onClose }) => {
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for chat messages
  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', ({ message, userId, userName, timestamp }) => {
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        message,
        userId,
        userName,
        timestamp,
        isOwn: userId === user?.id
      }]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socket) return;

    socket.emit('chat-message', {
      sessionId,
      message: inputMessage.trim(),
      userId: user?.id,
      userName: user?.name || user?.email
    });

    setInputMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Chat</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {!msg.isOwn && (
                  <p className="text-xs font-medium mb-1 opacity-75">
                    {msg.userName}
                  </p>
                )}
                <p className="text-sm break-words">{msg.message}</p>
                <p className="text-xs opacity-60 mt-1">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 placeholder-gray-400"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;