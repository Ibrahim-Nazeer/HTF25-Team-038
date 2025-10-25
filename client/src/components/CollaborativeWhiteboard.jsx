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
    editor.store.listen((entry) => {
      if (isRemoteUpdate.current) {
        isRemoteUpdate.current = false;
        return;
      }

      if (socket) {
        const snapshot = editor.store.getSnapshot();
        socket.emit('whiteboard-change', {
          sessionId,
          drawingData: snapshot
        });
      }
    }, { scope: 'document' });
  };

  // Listen for remote whiteboard updates
  useEffect(() => {
    if (!socket) return;

    socket.on('whiteboard-update', ({ drawingData }) => {
      if (editorRef.current && drawingData) {
        isRemoteUpdate.current = true;
        try {
          editorRef.current.store.loadSnapshot(drawingData);
        } catch (err) {
          console.error('Failed to apply whiteboard update:', err);
        }
      }
    });

    return () => {
      socket.off('whiteboard-update');
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