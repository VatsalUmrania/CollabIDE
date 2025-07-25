// import { Editor } from '@monaco-editor/react';
// import { Terminal, File, Plus, Loader2, X, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { languageConfigs } from '../utils/languageConfigs';
// import { useCallback, useEffect, useRef } from 'react';

// interface CursorData {
//   userId: string;
//   userName: string;
//   fileId: string;
//   position: {
//     lineNumber: number;
//     column: number;
//   };
//   selection?: {
//     startLineNumber: number;
//     startColumn: number;
//     endLineNumber: number;
//     endColumn: number;
//   };
//   color: string;
//   timestamp: number;
// }

// export default function EditorArea({
//   activeFile,
//   handleEditorChange,
//   handleEditorDidMount,
//   isHost,
//   showNewFileModal,
//   fileCreationLoading,
//   showOutput,
//   setShowOutput,
//   isExecuting,
//   executionResult,
//   // New props for cursor functionality
//   socket,
//   connected,
//   sessionId,
//   user,
//   cursors,
//   setCursors,
//   getUserColor
// }: {
//   activeFile: any;
//   handleEditorChange: (value: string | undefined) => void;
//   handleEditorDidMount: (editor: any, monaco: any) => void;
//   isHost: boolean;
//   showNewFileModal: () => void;
//   fileCreationLoading: boolean;
//   showOutput: boolean;
//   setShowOutput: (show: boolean) => void;
//   isExecuting: boolean;
//   executionResult: any;
//   // New props
//   socket?: any;
//   connected?: boolean;
//   sessionId?: string;
//   user?: any;
//   cursors?: { [key: string]: CursorData };
//   setCursors?: (cursors: { [key: string]: CursorData }) => void;
//   getUserColor?: (userId: string) => string;
// }) {
//   const editorRef = useRef<any>(null);
//   const monacoRef = useRef<any>(null);
//   const decorationsRef = useRef<{ [key: string]: string[] }>({});

//   // Enhanced editor mount handler with cursor tracking
//   const handleEditorDidMountWithCursors = useCallback((editor: any, monaco: any) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
    
//     // Call the original handler
//     handleEditorDidMount(editor, monaco);

//     // Add cursor tracking if socket is available
//     if (socket && connected && sessionId && user) {
//       // Track cursor position changes
//       editor.onDidChangeCursorPosition((e: any) => {
//         const position = e.position;
//         const selection = editor.getSelection();
        
//         // Emit cursor position to other users
//         socket.emit('cursor-position', {
//           sessionId,
//           fileId: activeFile?.id,
//           userId: user.id,
//           userName: user.displayName || user.name || 'Anonymous',
//           position: {
//             lineNumber: position.lineNumber,
//             column: position.column
//           },
//           selection: selection ? {
//             startLineNumber: selection.startLineNumber,
//             startColumn: selection.startColumn,
//             endLineNumber: selection.endLineNumber,
//             endColumn: selection.endColumn
//           } : null,
//           timestamp: Date.now()
//         });
//       });

//       // Track selection changes
//       editor.onDidChangeCursorSelection((e: any) => {
//         const selection = e.selection;
        
//         socket.emit('cursor-selection', {
//           sessionId,
//           fileId: activeFile?.id,
//           userId: user.id,
//           userName: user.displayName || user.name || 'Anonymous',
//           selection: {
//             startLineNumber: selection.startLineNumber,
//             startColumn: selection.startColumn,
//             endLineNumber: selection.endLineNumber,
//             endColumn: selection.endColumn
//           },
//           timestamp: Date.now()
//         });
//       });
//     }
//   }, [handleEditorDidMount, socket, connected, sessionId, user, activeFile?.id]);

//   // Cursor decoration functions
//   const updateCursorDecorations = useCallback((cursorData: CursorData, color: string) => {
//     if (!editorRef.current || !monacoRef.current) return;
    
//     const { userId, userName, position } = cursorData;
    
//     // Remove previous decorations for this user
//     if (decorationsRef.current[userId]) {
//       editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
//     }
    
//     // Create cursor decoration
//     const decorations = [
//       {
//         range: new monacoRef.current.Range(
//           position.lineNumber,
//           position.column,
//           position.lineNumber,
//           position.column
//         ),
//         options: {
//           className: `cursor-${userId}`,
//           stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
//           beforeContentClassName: `cursor-line-${userId}`,
//           afterContentClassName: `cursor-label-${userId}`,
//         }
//       }
//     ];
    
//     // Apply decorations
//     const newDecorations = editorRef.current.deltaDecorations([], decorations);
//     decorationsRef.current[userId] = newDecorations;
    
//     // Add custom CSS for cursor
//     addCursorStyles(userId, userName, color);
//   }, []);

//   const updateSelectionDecorations = useCallback((selectionData: CursorData, color: string) => {
//     if (!editorRef.current || !monacoRef.current) return;
    
//     const { userId, selection } = selectionData;
    
//     if (!selection || (
//       selection.startLineNumber === selection.endLineNumber &&
//       selection.startColumn === selection.endColumn
//     )) return;
    
//     const selectionDecorations = [
//       {
//         range: new monacoRef.current.Range(
//           selection.startLineNumber,
//           selection.startColumn,
//           selection.endLineNumber,
//           selection.endColumn
//         ),
//         options: {
//           className: `selection-${userId}`,
//           stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
//         }
//       }
//     ];
    
//     // Apply selection decorations
//     if (decorationsRef.current[`${userId}-selection`]) {
//       editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], []);
//     }
    
//     const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations);
//     decorationsRef.current[`${userId}-selection`] = newSelectionDecorations;
    
//     // Add selection styles
//     addSelectionStyles(userId, color);
//   }, []);

//   const addCursorStyles = (userId: string, userName: string, color: string) => {
//     // Remove existing styles for this user
//     const existingStyle = document.getElementById(`cursor-style-${userId}`);
//     if (existingStyle) {
//       existingStyle.remove();
//     }
    
//     const style = document.createElement('style');
//     style.id = `cursor-style-${userId}`;
//     style.textContent = `
//       .cursor-line-${userId}::before {
//         content: '';
//         position: absolute;
//         top: 0;
//         left: -1px;
//         width: 2px;
//         height: 100%;
//         background: linear-gradient(to bottom, ${color}, ${color}aa);
//         z-index: 1000;
//         animation: cursor-pulse-${userId} 1.5s ease-in-out infinite;
//         box-shadow: 0 0 3px ${color}50;
//       }
      
//       .cursor-label-${userId}::after {
//         content: '${userName.replace(/'/g, "\\'")}';
//         position: absolute;
//         top: -28px;
//         left: -1px;
//         background: linear-gradient(135deg, ${color}, ${color}dd);
//         color: white;
//         padding: 4px 8px;
//         border-radius: 6px;
//         font-size: 11px;
//         font-weight: 600;
//         white-space: nowrap;
//         z-index: 1001;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.1);
//         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
//         line-height: 1.2;
//         max-width: 120px;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         pointer-events: none;
//         letter-spacing: 0.5px;
//         border: 1px solid ${color}aa;
//         transform: translateY(0);
//         transition: all 0.2s ease;
//       }
      
//       .cursor-label-${userId}:hover::after {
//         transform: translateY(-2px);
//         box-shadow: 0 4px 12px rgba(0,0,0,0.3);
//       }
      
//       @keyframes cursor-pulse-${userId} {
//         0%, 100% { 
//           opacity: 1; 
//           transform: scaleX(1);
//         }
//         50% { 
//           opacity: 0.7; 
//           transform: scaleX(1.2);
//         }
//       }
      
//       .cursor-${userId} {
//         position: relative;
//       }
//     `;
    
//     document.head.appendChild(style);
//   };

//   const addSelectionStyles = (userId: string, color: string) => {
//     const existingStyle = document.getElementById(`selection-style-${userId}`);
//     if (existingStyle) {
//       existingStyle.remove();
//     }
    
//     const style = document.createElement('style');
//     style.id = `selection-style-${userId}`;
//     style.textContent = `
//       .selection-${userId} {
//         background: linear-gradient(90deg, ${color}25, ${color}35) !important;
//         border: 1px solid ${color}60;
//         border-radius: 3px;
//         box-shadow: inset 0 1px 2px ${color}20;
//       }
//     `;
    
//     document.head.appendChild(style);
//   };

//   // Update cursor decorations when cursors change
//   useEffect(() => {
//     if (editorRef.current && activeFile && cursors && getUserColor) {
//       // Clear all existing decorations
//       Object.keys(decorationsRef.current).forEach(key => {
//         if (decorationsRef.current[key]) {
//           editorRef.current.deltaDecorations(decorationsRef.current[key], []);
//         }
//       });
//       decorationsRef.current = {};
      
//       // Apply cursors for the current active file
//       Object.values(cursors).forEach(cursor => {
//         if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
//           const userColor = getUserColor(cursor.userId);
//           updateCursorDecorations(cursor, userColor);
//           if (cursor.selection) {
//             updateSelectionDecorations(cursor, userColor);
//           }
//         }
//       });
//     }
//   }, [cursors, activeFile, getUserColor, user?.id, updateCursorDecorations, updateSelectionDecorations]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       // Clean up cursor styles
//       if (cursors) {
//         Object.keys(cursors).forEach(cursorKey => {
//           const userId = cursorKey.split('-')[0];
//           const cursorStyle = document.getElementById(`cursor-style-${userId}`);
//           const selectionStyle = document.getElementById(`selection-style-${userId}`);
//           if (cursorStyle) cursorStyle.remove();
//           if (selectionStyle) selectionStyle.remove();
//         });
//       }
//     };
//   }, [cursors]);

//   return (
//     <div className="flex-1 flex">
//       {/* Code Editor */}
//       <div className="flex-1">
//         {activeFile ? (
//           <Editor
//             height="100%"
//             language={activeFile.language}
//             value={activeFile.content}
//             onChange={handleEditorChange}
//             onMount={handleEditorDidMountWithCursors}
//             theme="vs-dark"
//             options={{
//               minimap: { enabled: false },
//               fontSize: 14,
//               wordWrap: 'on',
//               automaticLayout: true,
//               scrollBeyondLastLine: false,
//               tabSize: 2,
//               insertSpaces: true,
//               cursorBlinking: 'smooth',
//               cursorSmoothCaretAnimation: 'on',
//               smoothScrolling: true,
//               // Enhanced options for better cursor visibility
//               renderLineHighlight: 'line',
//               selectOnLineNumbers: true,
//               roundedSelection: false,
//               readOnly: false,
//               cursorStyle: 'line',
//               cursorWidth: 2,
//               mouseWheelScrollSensitivity: 1,
//               fastScrollSensitivity: 5,
//               scrollBeyondLastColumn: 5,
//               glyphMargin: true,
//               folding: true,
//               foldingStrategy: 'indentation',
//               showFoldingControls: 'mouseover',
//               disableLayerHinting: true,
//               fontLigatures: true,
//               renderWhitespace: 'boundary',
//               renderControlCharacters: false,
//               renderIndentGuides: true,
//               highlightActiveIndentGuide: true,
//               bracketPairColorization: {
//                 enabled: true
//               }
//             }}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-900 text-white">
//             <div className="text-center">
//               <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <h3 className="text-lg font-medium mb-2">No file selected</h3>
//               <p className="text-gray-400 mb-4">
//                 {isHost ? 'Create your first file to start coding' : 'Select a file to start editing'}
//               </p>
//               {isHost && (
//                 <Button 
//                   onClick={showNewFileModal}
//                   disabled={fileCreationLoading}
//                 >
//                   {fileCreationLoading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create File
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Output Panel */}
//       {showOutput && (
//         <div className="w-2/5 border-l bg-white flex flex-col">
//           <div className="bg-gray-900 text-white px-4 py-3 border-b flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <Terminal className="h-4 w-4" />
//               <h3 className="font-medium">Output</h3>
//               {activeFile && (
//                 <Badge className="bg-gray-700 text-gray-200 text-xs">
//                   {languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language}
//                 </Badge>
//               )}
//             </div>
//             <Button 
//               size="sm" 
//               variant="ghost" 
//               onClick={() => setShowOutput(false)}
//               className="text-gray-400 hover:text-white hover:bg-gray-800"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
          
//           <div className="flex-1 overflow-hidden flex flex-col">
//             {isExecuting ? (
//               <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
//                 <div className="text-center">
//                   <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//                   <p className="text-blue-700 font-medium">Executing code...</p>
//                 </div>
//               </div>
//             ) : executionResult ? (
//               <div className="flex-1 flex flex-col">
//                 <div className={`px-4 py-3 text-sm border-b ${
//                   executionResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
//                 }`}>
//                   {executionResult.error ? (
//                     <div className="flex items-center">
//                       <AlertCircle className="h-4 w-4 mr-2" />
//                       Execution failed
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Executed successfully in {executionResult.executionTime}ms
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex-1 overflow-auto p-4">
//                   {executionResult.error ? (
//                     <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono bg-red-50 p-3 rounded border">
//                       {executionResult.error}
//                     </pre>
//                   ) : (
//                     <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border min-h-32">
//                       {executionResult.output || 'No output generated'}
//                     </pre>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
//                 <div className="text-center">
//                   <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                   <p>Click "Run Code" to execute</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { Editor } from '@monaco-editor/react';
import { Terminal, File, Plus, Loader2, X, RefreshCw, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { languageConfigs } from '../utils/languageConfigs';
import { useCallback, useEffect, useRef } from 'react';

interface CursorData {
  userId: string;
  userName: string;
  fileId: string;
  position: {
    lineNumber: number;
    column: number;
  };
  selection?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  color: string;
  timestamp: number;
}

interface FileLock {
  lockedBy: string;
  lockedByUser: {
    id: string;
    displayName: string;
  };
}

interface EditorAreaProps {
  activeFile: any;
  handleEditorChange: (value: string | undefined) => void;
  handleEditorDidMount: (editor: any, monaco: any) => void;
  isHost: boolean;
  showNewFileModal: () => void;
  fileCreationLoading: boolean;
  showOutput: boolean;
  setShowOutput: (show: boolean) => void;
  isExecuting: boolean;
  executionResult: any;
  // Cursor props
  socket?: any;
  connected?: boolean;
  sessionId?: string;
  user?: any;
  cursors?: { [key: string]: CursorData };
  setCursors?: (cursors: any) => void;
  getUserColor?: (userId: string) => string;
  // File lock props
  fileLocks?: { [fileId: string]: FileLock | null };
  lockRequests?: { [fileId: string]: boolean };
}

export default function EditorArea({
  activeFile,
  handleEditorChange,
  handleEditorDidMount,
  isHost,
  showNewFileModal,
  fileCreationLoading,
  showOutput,
  setShowOutput,
  isExecuting,
  executionResult,
  // Cursor props
  socket,
  connected,
  sessionId,
  user,
  cursors = {},
  setCursors,
  getUserColor,
  // File lock props
  fileLocks = {},
  lockRequests = {}
}: EditorAreaProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<{ [key: string]: string[] }>({});

  // Check if current file is locked by another user
  const currentLock = activeFile ? fileLocks[activeFile.id] : null;
  const isLockedByOther = currentLock && currentLock.lockedBy !== user?.id;
  const isRequestingLock = activeFile ? lockRequests[activeFile.id] : false;
  const canEdit = !isLockedByOther && !isRequestingLock;

  // Enhanced editor mount handler with cursor tracking
  const handleEditorDidMountWithCursors = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Call the original handler
    handleEditorDidMount(editor, monaco);

    console.log('🎯 Editor mounted with cursor tracking enabled');

    // Add cursor tracking if socket is available
    if (socket && connected && sessionId && user) {
      console.log('✅ Setting up cursor tracking for user:', user.displayName);
      
      // Track cursor position changes
      editor.onDidChangeCursorPosition((e: any) => {
        // Only emit cursor position if user can edit (has lock)
        if (!canEdit) return;
        
        const position = e.position;
        const selection = editor.getSelection();
        
        console.log('📍 Cursor moved to:', position);
        
        // Emit cursor position to other users
        socket.emit('cursor-position', {
          sessionId,
          fileId: activeFile?.id,
          userId: user.id,
          userName: user.displayName || user.name || 'Anonymous',
          position: {
            lineNumber: position.lineNumber,
            column: position.column
          },
          selection: selection ? {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          } : null,
          timestamp: Date.now()
        });
      });

      // Track selection changes
      editor.onDidChangeCursorSelection((e: any) => {
        // Only emit cursor selection if user can edit (has lock)
        if (!canEdit) return;
        
        const selection = e.selection;
        
        console.log('🔤 Selection changed:', selection);
        
        socket.emit('cursor-selection', {
          sessionId,
          fileId: activeFile?.id,
          userId: user.id,
          userName: user.displayName || user.name || 'Anonymous',
          selection: {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          },
          timestamp: Date.now()
        });
      });
    } else {
      console.log('❌ Cursor tracking not enabled - missing dependencies:', {
        socket: !!socket,
        connected,
        sessionId: !!sessionId,
        user: !!user
      });
    }
  }, [handleEditorDidMount, socket, connected, sessionId, user, activeFile?.id, canEdit]);

  // Cursor decoration functions
  const updateCursorDecorations = useCallback((cursorData: CursorData, color: string) => {
    if (!editorRef.current || !monacoRef.current) {
      console.log('❌ Cannot update cursor decorations - editor not ready');
      return;
    }
    
    const { userId, userName, position } = cursorData;
    
    console.log('🎨 Updating cursor decoration for:', userName, 'at position:', position);
    
    // Remove previous decorations for this user
    if (decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
    }
    
    // Create cursor decoration
    const decorations = [
      {
        range: new monacoRef.current.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: `cursor-${userId}`,
          stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          beforeContentClassName: `cursor-line-${userId}`,
          afterContentClassName: `cursor-label-${userId}`,
        }
      }
    ];
    
    // Apply decorations
    const newDecorations = editorRef.current.deltaDecorations([], decorations);
    decorationsRef.current[userId] = newDecorations;
    
    console.log('✅ Cursor decoration applied for:', userName);
    
    // Add custom CSS for cursor
    addCursorStyles(userId, userName, color);
  }, []);

  const updateSelectionDecorations = useCallback((selectionData: CursorData, color: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const { userId, selection } = selectionData;
    
    if (!selection || (
      selection.startLineNumber === selection.endLineNumber &&
      selection.startColumn === selection.endColumn
    )) return;
    
    console.log('🔤 Updating selection decoration for user:', userId);
    
    const selectionDecorations = [
      {
        range: new monacoRef.current.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        ),
        options: {
          className: `selection-${userId}`,
          stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      }
    ];
    
    // Apply selection decorations
    if (decorationsRef.current[`${userId}-selection`]) {
      editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], []);
    }
    
    const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations);
    decorationsRef.current[`${userId}-selection`] = newSelectionDecorations;
    
    // Add selection styles
    addSelectionStyles(userId, color);
  }, []);

  const addCursorStyles = (userId: string, userName: string, color: string) => {
    // Remove existing styles for this user
    const existingStyle = document.getElementById(`cursor-style-${userId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = `cursor-style-${userId}`;
    style.textContent = `
      .cursor-line-${userId}::before {
        content: '';
        position: absolute;
        top: 0;
        left: -1px;
        width: 2px;
        height: 100%;
        background: linear-gradient(to bottom, ${color}, ${color}aa);
        z-index: 1000;
        animation: cursor-pulse-${userId} 1.5s ease-in-out infinite;
        box-shadow: 0 0 3px ${color}50;
      }
      
      .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}';
        position: absolute;
        top: -28px;
        left: -1px;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.2;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        letter-spacing: 0.5px;
        border: 1px solid ${color}aa;
        transform: translateY(0);
        transition: all 0.2s ease;
      }
      
      .cursor-label-${userId}:hover::after {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      @keyframes cursor-pulse-${userId} {
        0%, 100% { 
          opacity: 1; 
          transform: scaleX(1);
        }
        50% { 
          opacity: 0.7; 
          transform: scaleX(1.2);
        }
      }
      
      .cursor-${userId} {
        position: relative;
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Cursor styles added for:', userName);
  };

  const addSelectionStyles = (userId: string, color: string) => {
    const existingStyle = document.getElementById(`selection-style-${userId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = `selection-style-${userId}`;
    style.textContent = `
      .selection-${userId} {
        background: linear-gradient(90deg, ${color}25, ${color}35) !important;
        border: 1px solid ${color}60;
        border-radius: 3px;
        box-shadow: inset 0 1px 2px ${color}20;
      }
    `;
    
    document.head.appendChild(style);
  };

  // Update cursor decorations when cursors change
  useEffect(() => {
    if (editorRef.current && activeFile && cursors && getUserColor) {
      console.log('🔄 Updating cursor decorations, cursor count:', Object.keys(cursors).length);
      
      // Clear all existing decorations
      Object.keys(decorationsRef.current).forEach(key => {
        if (decorationsRef.current[key]) {
          editorRef.current.deltaDecorations(decorationsRef.current[key], []);
        }
      });
      decorationsRef.current = {};
      
      // Apply cursors for the current active file
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
          console.log('👁️ Showing cursor for:', cursor.userName, 'in file:', activeFile.name);
          const userColor = getUserColor(cursor.userId);
          updateCursorDecorations(cursor, userColor);
          if (cursor.selection) {
            updateSelectionDecorations(cursor, userColor);
          }
        }
      });
    }
  }, [cursors, activeFile, getUserColor, user?.id, updateCursorDecorations, updateSelectionDecorations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up cursor styles
      if (cursors) {
        Object.keys(cursors).forEach(cursorKey => {
          const userId = cursorKey.split('-')[0];
          const cursorStyle = document.getElementById(`cursor-style-${userId}`);
          const selectionStyle = document.getElementById(`selection-style-${userId}`);
          if (cursorStyle) cursorStyle.remove();
          if (selectionStyle) selectionStyle.remove();
        });
      }
    };
  }, [cursors]);

  // Request file lock when user tries to edit
  const requestFileLock = useCallback(() => {
    if (socket && activeFile && !currentLock && !isRequestingLock) {
      console.log('🔒 Requesting lock for file:', activeFile.name);
      socket.emit('request-file-lock', { fileId: activeFile.id });
    }
  }, [socket, activeFile, currentLock, isRequestingLock]);

  return (
    <div className="flex-1 flex">
      {/* Code Editor */}
      <div className="flex-1 relative">
        {activeFile ? (
          <>
            {/* Lock Status Indicators */}
            {isLockedByOther && (
              <div className="absolute top-4 right-4 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 z-20 shadow-sm">
                <Lock className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-800">File Locked</div>
                  <div className="text-yellow-600 text-xs">
                    {currentLock?.lockedByUser?.displayName} is editing this file
                  </div>
                </div>
              </div>
            )}
            
            {isRequestingLock && (
              <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 z-20 shadow-sm">
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                <div>
                  <div className="font-medium text-blue-800">Requesting Access</div>
                  <div className="text-blue-600 text-xs">Waiting for edit permission...</div>
                </div>
              </div>
            )}

            {/* Edit Access Button */}
            {isLockedByOther && (
              <div className="absolute top-20 right-4 z-20">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={requestFileLock}
                  disabled={isRequestingLock}
                  className="bg-white shadow-sm"
                >
                  {isRequestingLock ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Request Edit Access
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Monaco Editor */}
            <Editor
              height="100%"
              language={activeFile.language}
              value={activeFile.content}
              onChange={handleEditorChange}
              onMount={handleEditorDidMountWithCursors}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                insertSpaces: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                readOnly: !canEdit, // Make read-only when locked by others
                // Enhanced options for better cursor visibility
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                cursorStyle: 'line',
                cursorWidth: 2,
                mouseWheelScrollSensitivity: 1,
                fastScrollSensitivity: 5,
                scrollBeyondLastColumn: 5,
                glyphMargin: true,
                folding: true,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                disableLayerHinting: true,
                fontLigatures: true,
                renderWhitespace: 'boundary',
                renderControlCharacters: false,
                renderIndentGuides: true,
                highlightActiveIndentGuide: true,
                // Show a different cursor style when read-only
                ...(isLockedByOther && {
                  rulers: [],
                  overviewRulerBorder: false,
                }),
              }}
            />

            {/* Read-only overlay message */}
            {!canEdit && (
              <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none flex items-center justify-center z-10">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md mx-4">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isRequestingLock ? 'Requesting Edit Access' : 'File is Locked'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isRequestingLock 
                      ? 'Please wait while we request edit permissions for this file.'
                      : `${currentLock?.lockedByUser?.displayName} is currently editing this file. You can view the content but cannot make changes.`
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            <div className="text-center">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No file selected</h3>
              <p className="text-gray-400 mb-4">
                {isHost ? 'Create your first file to start coding' : 'Select a file to start editing'}
              </p>
              {isHost && (
                <Button 
                  onClick={showNewFileModal}
                  disabled={fileCreationLoading}
                >
                  {fileCreationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create File
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Output Panel */}
      {showOutput && (
        <div className="w-2/5 border-l bg-white flex flex-col">
          <div className="bg-gray-900 text-white px-4 py-3 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <h3 className="font-medium">Output</h3>
              {activeFile && (
                <Badge className="bg-gray-700 text-gray-200 text-xs">
                  {languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language}
                </Badge>
              )}
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowOutput(false)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {isExecuting ? (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
                  <p className="text-blue-700 font-medium">Executing code...</p>
                </div>
              </div>
            ) : executionResult ? (
              <div className="flex-1 flex flex-col">
                <div className={`px-4 py-3 text-sm border-b ${
                  executionResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}>
                  {executionResult.error ? (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Execution failed
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Executed successfully in {executionResult.executionTime}ms
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-auto p-4">
                  {executionResult.error ? (
                    <pre className="text-sm text-red-600 whitespace-pre-wrap font-mono bg-red-50 p-3 rounded border">
                      {executionResult.error}
                    </pre>
                  ) : (
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border min-h-32">
                      {executionResult.output || 'No output generated'}
                    </pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center">
                  <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Click "Run Code" to execute</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
