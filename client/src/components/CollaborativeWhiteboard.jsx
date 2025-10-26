import React, { useEffect, useContext, useRef } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { SocketContext } from '../context/SocketContext';

const CollaborativeWhiteboard = ({ sessionId }) => {
  const socket = useContext(SocketContext);
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const handleMount = (editor) => {
    editorRef.current = editor;

    // Listen for changes and broadcast
    const unsubscribe = editor.store.listen((entry) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }

      if (socket && sessionId) {
        console.log('🎨 Emitting whiteboard change');
        const snapshot = editor.store.getSnapshot();
        socket.emit('whiteboard-change', {
          sessionId,
          drawingData: snapshot
        });
      }
    }, { scope: 'document' });

    return unsubscribe;
  };

  // Listen for remote whiteboard updates
  useEffect(() => {
    if (!socket || !sessionId) return;

    const handleWhiteboardUpdate = ({ drawingData }) => {
      console.log('🎨 Received whiteboard update');
      if (editorRef.current && drawingData) {
        isRemoteUpdate.current = true;
        try {
          editorRef.current.store.loadSnapshot(drawingData);
        } catch (err) {
          console.error('Failed to apply whiteboard update:', err);
        }
      }
    };

    socket.on('whiteboard-update', handleWhiteboardUpdate);

    return () => {
      socket.off('whiteboard-update', handleWhiteboardUpdate);
    };
  }, [socket, sessionId]);

  return (
    <div className="h-full w-full">
      <Tldraw
        onMount={handleMount}
        autoFocus
      />
    </div>
  );
};

export default CollaborativeWhiteboard;