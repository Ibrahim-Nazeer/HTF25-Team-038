import React, { useState, useEffect, useRef, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { SocketContext } from '../context/SocketContext';
import { Play, RotateCcw } from 'lucide-react';

const CodeEditor = ({ sessionId, problem }) => {
  const socket = useContext(SocketContext);
  const [code, setCode] = useState(problem?.starterCode || '// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set theme
    monaco.editor.defineTheme('codesync-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1a1a1a',
      }
    });
    monaco.editor.setTheme('codesync-dark');
  };

  // Handle local code changes
  const handleCodeChange = (value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(value);
    
    if (socket) {
      socket.emit('code-change', {
        sessionId,
        code: value,
        language
      });
    }
  };

  // Listen for remote code updates
  useEffect(() => {
    if (!socket) return;

    socket.on('code-update', ({ code: remoteCode, language: remoteLang }) => {
      isRemoteUpdate.current = true;
      setCode(remoteCode);
      if (remoteLang) setLanguage(remoteLang);
    });

    return () => {
      socket.off('code-update');
    };
  }, [socket, sessionId]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    if (socket) {
      socket.emit('code-change', {
        sessionId,
        code,
        language: newLang
      });
    }
  };

  // Reset to starter code
  const handleReset = () => {
    const starterCode = problem?.starterCode || '// Start coding here...\n';
    setCode(starterCode);
    setOutput('');
    
    if (socket) {
      socket.emit('code-change', {
        sessionId,
        code: starterCode,
        language
      });
    }
  };

  // Run code (basic demo - for hackathon)
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      // For demo purposes - just simulate execution
      setTimeout(() => {
        setOutput(`Code execution simulated.\nLanguage: ${language}\nLines: ${code.split('\n').length}\n\n✓ Code would be executed via Piston API in production`);
        setIsRunning(false);
      }, 1000);
      
      // TODO: Integrate Piston API for actual code execution
      // const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ language, version: '*', files: [{ content: code }] })
      // });
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </select>

          {/* Problem Title */}
          {problem && (
            <div className="text-sm text-gray-300">
              <span className="font-medium">{problem.title}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                problem.difficulty === 'EASY' ? 'bg-green-900 text-green-300' :
                problem.difficulty === 'MEDIUM' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {problem.difficulty}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Output Panel */}
        {output && (
          <div className="w-80 border-l border-gray-700 bg-gray-900 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-300">Output</h3>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;