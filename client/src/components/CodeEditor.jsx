import React, { useState, useEffect, useRef, useContext } from 'react';
import Editor from '@monaco-editor/react';
import { SocketContext } from '../context/SocketContext';
import { Play, RotateCcw, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

const CodeEditor = ({ sessionId, problem, isInterviewer }) => {
  const socket = useContext(SocketContext);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [rawOutput, setRawOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Initialize code based on language and problem
  useEffect(() => {
    if (problem?.starterCode) {
      const starterCode = typeof problem.starterCode === 'object' 
        ? (problem.starterCode[language] || problem.starterCode.javascript || '// Start coding here...\n')
        : (problem.starterCode || '// Start coding here...\n');
      setCode(starterCode);
    } else {
      setCode(getDefaultStarterCode(language));
    }
  }, [problem?.id, language]);

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
    
    if (socket && sessionId) {
      console.log('📤 Emitting code change:', { length: value?.length, language });
      socket.emit('code-change', {
        sessionId,
        code: value,
        language
      });
    }
  };

  // Listen for remote code updates
  useEffect(() => {
    if (!socket || !sessionId) return;

    const handleCodeUpdate = ({ code: remoteCode, language: remoteLang }) => {
      console.log('📝 Received code update:', { length: remoteCode?.length, language: remoteLang });
      isRemoteUpdate.current = true;
      setCode(remoteCode);
      if (remoteLang && remoteLang !== language) {
        setLanguage(remoteLang);
      }
    };

    socket.on('code-update', handleCodeUpdate);

    return () => {
      socket.off('code-update', handleCodeUpdate);
    };
  }, [socket, sessionId]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    // Load language-specific starter code
    if (problem?.starterCode && typeof problem.starterCode === 'object') {
      const newCode = problem.starterCode[newLang] || getDefaultStarterCode(newLang);
      setCode(newCode);
      
      if (socket) {
        socket.emit('code-change', {
          sessionId,
          code: newCode,
          language: newLang
        });
      }
    } else {
      if (socket) {
        socket.emit('code-change', {
          sessionId,
          code,
          language: newLang
        });
      }
    }
  };

  // Get default starter code for language
  const getDefaultStarterCode = (lang) => {
    const templates = {
      javascript: '// Start coding here...\n\nfunction solution() {\n  // Your code here\n}\n',
      python: '# Start coding here...\n\ndef solution():\n    # Your code here\n    pass\n',
      java: '// Start coding here...\n\npublic class Solution {\n    public void solution() {\n        // Your code here\n    }\n}\n',
      cpp: '// Start coding here...\n\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    // Your code here\n}\n',
      typescript: '// Start coding here...\n\nfunction solution(): void {\n  // Your code here\n}\n',
      go: '// Start coding here...\n\npackage main\n\nimport "fmt"\n\nfunc solution() {\n    // Your code here\n}\n'
    };
    return templates[lang] || '// Start coding here...\n';
  };

  // Reset to starter code
  const handleReset = () => {
    let starterCode;
    if (problem?.starterCode) {
      starterCode = typeof problem.starterCode === 'object'
        ? (problem.starterCode[language] || getDefaultStarterCode(language))
        : problem.starterCode;
    } else {
      starterCode = getDefaultStarterCode(language);
    }
    
    setCode(starterCode);
    setOutput('');
    setTestResults([]);
    setShowOutput(false);
    
    if (socket) {
      socket.emit('code-change', {
        sessionId,
        code: starterCode,
        language
      });
    }
  };

  // Update code when problem changes
  useEffect(() => {
    if (problem?.starterCode) {
      const starterCode = typeof problem.starterCode === 'object'
        ? (problem.starterCode[language] || getDefaultStarterCode(language))
        : problem.starterCode;
      setCode(starterCode);
      setOutput('');
      setTestResults([]);
      setShowOutput(false);
    }
  }, [problem?.id]);

  // Run code with test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running tests...');
    setRawOutput('');
    setShowOutput(true);
    setTestResults([]);
    
    try {
      if (problem?.testCases && Array.isArray(problem.testCases) && problem.testCases.length > 0) {
        // Run test cases
        const results = await runTestCases(problem.testCases);
        setTestResults(results);
        
        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        const visibleTotal = isInterviewer ? total : results.filter(r => !r.hidden).length;
        const visiblePassed = isInterviewer 
          ? passed 
          : results.filter(r => !r.hidden && r.passed).length;
        
        setOutput(`Test Results: ${visiblePassed}/${visibleTotal} visible tests passed`);
        
        // Collect all raw outputs
        const allOutputs = results.map((r, i) => 
          `Test ${i + 1}: ${r.passed ? 'PASSED' : 'FAILED'}\nOutput: ${JSON.stringify(r.actual)}`
        ).join('\n\n');
        setRawOutput(allOutputs);
      } else {
        // Execute code directly without test cases
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: getLanguageForPiston(),
            version: '*',
            files: [{ content: code }]
          })
        });

        const result = await response.json();
        
        if (result.run) {
          const stdout = result.run.stdout || '';
          const stderr = result.run.stderr || '';
          
          if (stderr) {
            setOutput(`Error:\n${stderr}`);
            setRawOutput(stderr);
          } else {
            setOutput(`Output:\n${stdout || 'No output'}`);
            setRawOutput(stdout || 'No output');
          }
        } else {
          setOutput('Execution failed. Please check your code.');
          setRawOutput('Execution failed');
        }
      }
      
      setIsRunning(false);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setRawOutput(error.message);
      setIsRunning(false);
    }
  };

  // Run test cases
  const runTestCases = async (testCases) => {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Prepare code with test case input based on language
        const testCode = generateTestCode(testCase);

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: getLanguageForPiston(),
            version: '*',
            files: [{ content: testCode }]
          })
        });

        const result = await response.json();
        const output = result.run?.stdout?.trim() || '';
        const stderr = result.run?.stderr?.trim() || '';
        
        if (stderr) {
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: `Error: ${stderr}`,
            passed: false,
            hidden: testCase.hidden,
            description: testCase.description
          });
          continue;
        }
        
        let actualOutput;
        try {
          actualOutput = JSON.parse(output);
        } catch {
          actualOutput = output;
        }

        const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expected);
        
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: actualOutput,
          passed,
          hidden: testCase.hidden,
          description: testCase.description
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: `Error: ${error.message}`,
          passed: false,
          hidden: testCase.hidden,
          description: testCase.description
        });
      }
    }
    
    return results;
  };

  // Generate test code based on language
  const generateTestCode = (testCase) => {
    const functionName = problem?.functionName || 'solution';
    
    if (language === 'javascript' || language === 'typescript') {
      const args = Array.isArray(testCase.input) 
        ? testCase.input.map(arg => JSON.stringify(arg)).join(', ')
        : JSON.stringify(testCase.input);
      
      return `${code}

// Test case execution
const result = ${functionName}(${args});
console.log(JSON.stringify(result));
`;
    } else if (language === 'python') {
      const args = Array.isArray(testCase.input)
        ? testCase.input.map(arg => JSON.stringify(arg)).join(', ')
        : JSON.stringify(testCase.input);
      
      return `${code}
import json

# Test case execution
result = ${functionName}(${args})
print(json.dumps(result))
`;
    } else if (language === 'java') {
      // For Java, we'll just run the code as-is and capture output
      return code;
    } else if (language === 'cpp') {
      // For C++, we'll just run the code as-is
      return code;
    }
    
    return code;
  };

  // Get language name for Piston API
  const getLanguageForPiston = () => {
    const languageMap = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'go': 'go'
    };
    return languageMap[language] || 'javascript';
  };

  // Get function call based on input and problem
  const getFunctionCall = (input) => {
    const functionName = problem?.functionName || 'solution';
    
    if (Array.isArray(input)) {
      // Multiple arguments
      const args = input.map(arg => JSON.stringify(arg)).join(', ');
      return `${functionName}(${args})`;
    }
    // Single argument
    return `${functionName}(${JSON.stringify(input)})`;
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
      <div className="flex-1 flex flex-col">
        {/* Code Editor */}
        <div className={showOutput ? "h-2/3" : "h-full"}>
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
        {showOutput && (
          <div className="h-1/3 border-t border-gray-700 bg-gray-900 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Output & Test Results</h3>
              <button
                onClick={() => setShowOutput(false)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Hide output"
              >
                <EyeOff className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Test Cases:</h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      // Show all tests to interviewer, hide hidden ones from candidate
                      (!result.hidden || isInterviewer) && (
                        <div
                          key={index}
                          className={`p-3 rounded border ${
                            result.passed
                              ? 'bg-green-900/20 border-green-700'
                              : 'bg-red-900/20 border-red-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {result.passed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium text-gray-300">
                                Test {index + 1}
                                {result.hidden && (
                                  <span className="ml-2 text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded">
                                    Hidden
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className={`text-xs ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                          {result.description && (
                            <p className="text-xs text-gray-400 mb-2">{result.description}</p>
                          )}
                          <div className="text-xs space-y-1 font-mono">
                            <div>
                              <span className="text-gray-500">Input: </span>
                              <span className="text-gray-300">{JSON.stringify(result.input)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expected: </span>
                              <span className="text-gray-300">{JSON.stringify(result.expected)}</span>
                            </div>
                            {!result.passed && (
                              <div>
                                <span className="text-gray-500">Got: </span>
                                <span className="text-red-400">{JSON.stringify(result.actual)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {/* Console Output */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Console Output:</h4>
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap bg-gray-800 p-3 rounded">
                  {output || 'No output'}
                </pre>
              </div>

              {/* Raw Output */}
              {rawOutput && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Raw Output:</h4>
                  <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap bg-gray-800 p-3 rounded border border-green-700">
                    {rawOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;