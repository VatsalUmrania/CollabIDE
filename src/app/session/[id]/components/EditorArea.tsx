// import { Editor } from '@monaco-editor/react';
// import { Terminal, File, Plus, Loader2, X, RefreshCw, AlertCircle, CheckCircle, Lock } from 'lucide-react';
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

// interface FileLock {
//   lockedBy: string;
//   lockedByUser: {
//     id: string;
//     displayName: string;
//   };
// }

// interface EditorAreaProps {
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
//   // Cursor props
//   socket?: any;
//   connected?: boolean;
//   sessionId?: string;
//   user?: any;
//   cursors?: { [key: string]: CursorData };
//   setCursors?: (cursors: any) => void;
//   getUserColor?: (userId: string) => string;
//   // File lock props
//   fileLocks?: { [fileId: string]: FileLock | null };
//   lockRequests?: { [fileId: string]: boolean };
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
//   // Cursor props
//   socket,
//   connected,
//   sessionId,
//   user,
//   cursors = {},
//   setCursors,
//   getUserColor,
//   // File lock props
//   fileLocks = {},
//   lockRequests = {}
// }: EditorAreaProps) {
//   const editorRef = useRef<any>(null);
//   const monacoRef = useRef<any>(null);
//   const decorationsRef = useRef<{ [key: string]: string[] }>({});

//   // Check if current file is locked by another user
//   const currentLock = activeFile ? fileLocks[activeFile.id] : null;
//   const isLockedByOther = currentLock && currentLock.lockedBy !== user?.id;
//   const isRequestingLock = activeFile ? lockRequests[activeFile.id] : false;
//   const canEdit = !isLockedByOther && !isRequestingLock;

//   // Enhanced editor mount handler with cursor tracking
//   const handleEditorDidMountWithCursors = useCallback((editor: any, monaco: any) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
    
//     // Call the original handler
//     handleEditorDidMount(editor, monaco);

//     console.log('🎯 Editor mounted with cursor tracking enabled');

//     // Add cursor tracking if socket is available
//     if (socket && connected && sessionId && user) {
//       console.log('✅ Setting up cursor tracking for user:', user.displayName);
      
//       // Track cursor position changes
//       editor.onDidChangeCursorPosition((e: any) => {
//         // Only emit cursor position if user can edit (has lock)
//         if (!canEdit) return;
        
//         const position = e.position;
//         const selection = editor.getSelection();
        
//         console.log('📍 Cursor moved to:', position);
        
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
//         // Only emit cursor selection if user can edit (has lock)
//         if (!canEdit) return;
        
//         const selection = e.selection;
        
//         console.log('🔤 Selection changed:', selection);
        
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
//     } else {
//       console.log('❌ Cursor tracking not enabled - missing dependencies:', {
//         socket: !!socket,
//         connected,
//         sessionId: !!sessionId,
//         user: !!user
//       });
//     }
//   }, [handleEditorDidMount, socket, connected, sessionId, user, activeFile?.id, canEdit]);

//   // Cursor decoration functions
//   const updateCursorDecorations = useCallback((cursorData: CursorData, color: string) => {
//     if (!editorRef.current || !monacoRef.current) {
//       console.log('❌ Cannot update cursor decorations - editor not ready');
//       return;
//     }
    
//     const { userId, userName, position } = cursorData;
    
//     console.log('🎨 Creating cursor decoration for:', userName, 'at line:', position.lineNumber, 'column:', position.column);
    
//     // Remove previous decorations for this user
//     if (decorationsRef.current[userId]) {
//       editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
//     }
    
//     // Create cursor decoration at exact position
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
//           showIfCollapsed: true,
//           isWholeLine: false,
//         }
//       }
//     ];
    
//     // Apply decorations
//     const newDecorations = editorRef.current.deltaDecorations([], decorations);
//     decorationsRef.current[userId] = newDecorations;
    
//     console.log('✅ Cursor decoration applied for:', userName, 'with', newDecorations.length, 'decorations');
    
//     // Add custom CSS for cursor
//     addCursorStyles(userId, userName, color);
//   }, []);

//   const debugCursorState = useCallback(() => {
//     console.log('🔍 Debug Cursor State:');
//     console.log('Active File ID:', activeFile?.id);
//     console.log('User ID:', user?.id);
//     console.log('Cursors Object:', cursors);
//     console.log('Decorations Ref:', decorationsRef.current);
    
//     // Force re-render cursor decorations
//     if (editorRef.current && cursors && Object.keys(cursors).length > 0) {
//       Object.values(cursors).forEach(cursor => {
//         if (cursor.fileId === activeFile?.id && cursor.userId !== user?.id) {
//           const userColor = getUserColor?.(cursor.userId) || '#FF6B6B';
//           console.log('🔧 Force updating cursor for:', cursor.userName);
//           updateCursorDecorations(cursor, userColor);
//         }
//       });
//     }
//   }, [cursors, activeFile, user?.id, getUserColor, updateCursorDecorations]);
  
//   // Add this useEffect to debug cursor state
//   useEffect(() => {
//     if (Object.keys(cursors).length > 0) {
//       console.log('🔍 Cursors changed, debugging state...');
//       debugCursorState();
//     }
//   }, [cursors, debugCursorState]);

//   const updateSelectionDecorations = useCallback((selectionData: CursorData, color: string) => {
//     if (!editorRef.current || !monacoRef.current) return;
    
//     const { userId, selection } = selectionData;
    
//     if (!selection || (
//       selection.startLineNumber === selection.endLineNumber &&
//       selection.startColumn === selection.endColumn
//     )) return;
    
//     console.log('🔤 Updating selection decoration for user:', userId);
    
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
//         background: ${color};
//         z-index: 1000;
//         animation: cursor-blink-${userId} 1s ease-in-out infinite;
//         box-shadow: 0 0 4px ${color}80;
//         border-radius: 1px;
//       }
      
//       .cursor-label-${userId}::after {
//         content: '${userName.replace(/'/g, "\\'")}';
//         position: absolute;
//         top: -32px;
//         left: -1px;
//         background: ${color};
//         color: white;
//         padding: 4px 8px;
//         border-radius: 4px;
//         font-size: 12px;
//         font-weight: 600;
//         white-space: nowrap;
//         z-index: 1001;
//         box-shadow: 0 2px 8px rgba(0,0,0,0.3);
//         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
//         line-height: 1.2;
//         pointer-events: none;
//         border: 1px solid ${color};
//         max-width: 150px;
//         overflow: hidden;
//         text-overflow: ellipsis;
//       }
      
//       @keyframes cursor-blink-${userId} {
//         0%, 50% { opacity: 1; }
//         51%, 100% { opacity: 0.3; }
//       }
      
//       .cursor-${userId} {
//         position: relative;
//       }
//     `;
    
//     document.head.appendChild(style);
//     console.log('🎨 Enhanced cursor styles added for:', userName);
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
//       console.log('🔄 Updating cursor decorations, cursor count:', Object.keys(cursors).length);
      
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
//           console.log('👁️ Showing cursor for:', cursor.userName, 'in file:', activeFile.name);
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

//   // Request file lock when user tries to edit
//   const requestFileLock = useCallback(() => {
//     if (socket && activeFile && !currentLock && !isRequestingLock) {
//       console.log('🔒 Requesting lock for file:', activeFile.name);
//       socket.emit('request-file-lock', { fileId: activeFile.id });
//     }
//   }, [socket, activeFile, currentLock, isRequestingLock]);

//   return (
//     <div className="flex-1 flex">
//       {/* Code Editor */}
//       <div className="flex-1 relative">
//         {activeFile ? (
//           <>
//             {/* Lock Status Indicators */}
//             {isLockedByOther && (
//               <div className="absolute top-4 right-4 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 z-20 shadow-sm">
//                 <Lock className="h-4 w-4 text-yellow-600" />
//                 <div>
//                   <div className="font-medium text-yellow-800">File Locked</div>
//                   <div className="text-yellow-600 text-xs">
//                     {currentLock?.lockedByUser?.displayName} is editing this file
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {isRequestingLock && (
//               <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 z-20 shadow-sm">
//                 <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
//                 <div>
//                   <div className="font-medium text-blue-800">Requesting Access</div>
//                   <div className="text-blue-600 text-xs">Waiting for edit permission...</div>
//                 </div>
//               </div>
//             )}

//             {/* Edit Access Button */}
//             {isLockedByOther && (
//               <div className="absolute top-20 right-4 z-20">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={requestFileLock}
//                   disabled={isRequestingLock}
//                   className="bg-white shadow-sm"
//                 >
//                   {isRequestingLock ? (
//                     <>
//                       <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                       Requesting...
//                     </>
//                   ) : (
//                     <>
//                       <Lock className="h-3 w-3 mr-1" />
//                       Request Edit Access
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}

//             {/* Monaco Editor */}
//             <Editor
//               height="100%"
//               language={activeFile.language}
//               value={activeFile.content}
//               onChange={handleEditorChange}
//               onMount={handleEditorDidMountWithCursors}
//               theme="vs-dark"
//               options={{
//                 minimap: { enabled: false },
//                 fontSize: 14,
//                 wordWrap: 'on',
//                 automaticLayout: true,
//                 scrollBeyondLastLine: false,
//                 tabSize: 2,
//                 insertSpaces: true,
//                 cursorBlinking: 'smooth',
//                 cursorSmoothCaretAnimation: 'on',
//                 smoothScrolling: true,
//                 readOnly: !canEdit, // Make read-only when locked by others
//                 // Enhanced options for better cursor visibility
//                 renderLineHighlight: 'line',
//                 selectOnLineNumbers: true,
//                 roundedSelection: false,
//                 cursorStyle: 'line',
//                 cursorWidth: 2,
//                 mouseWheelScrollSensitivity: 1,
//                 fastScrollSensitivity: 5,
//                 scrollBeyondLastColumn: 5,
//                 glyphMargin: true,
//                 folding: true,
//                 foldingStrategy: 'indentation',
//                 showFoldingControls: 'mouseover',
//                 disableLayerHinting: true,
//                 fontLigatures: true,
//                 renderWhitespace: 'boundary',
//                 renderControlCharacters: false,
//                 renderIndentGuides: true,
//                 highlightActiveIndentGuide: true,
//                 // Show a different cursor style when read-only
//                 ...(isLockedByOther && {
//                   rulers: [],
//                   overviewRulerBorder: false,
//                 }),
//               }}
//             />

//             {/* Read-only overlay message */}
//             {!canEdit && (
//               <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none flex items-center justify-center z-10">
//                 <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md mx-4">
//                   <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {isRequestingLock ? 'Requesting Edit Access' : 'File is Locked'}
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     {isRequestingLock 
//                       ? 'Please wait while we request edit permissions for this file.'
//                       : `${currentLock?.lockedByUser?.displayName} is currently editing this file. You can view the content but cannot make changes.`
//                     }
//                   </p>
//                 </div>
//               </div>
//             )}
//           </>
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
import { Terminal, File, Plus, Loader2, X, RefreshCw, AlertCircle, CheckCircle, Lock, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { languageConfigs } from '../utils/languageConfigs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

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
  
  // Responsive state
  const [isOutputFullscreen, setIsOutputFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if current file is locked by another user
  const currentLock = activeFile ? fileLocks[activeFile.id] : null;
  const isLockedByOther = currentLock && currentLock.lockedBy !== user?.id;
  const isRequestingLock = activeFile ? lockRequests[activeFile.id] : false;
  const canEdit = !isLockedByOther && !isRequestingLock;

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    
    console.log('🎨 Creating cursor decoration for:', userName, 'at line:', position.lineNumber, 'column:', position.column);
    
    // Remove previous decorations for this user
    if (decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
    }
    
    // Create cursor decoration at exact position
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
          showIfCollapsed: true,
          isWholeLine: false,
        }
      }
    ];
    
    // Apply decorations
    const newDecorations = editorRef.current.deltaDecorations([], decorations);
    decorationsRef.current[userId] = newDecorations;
    
    console.log('✅ Cursor decoration applied for:', userName, 'with', newDecorations.length, 'decorations');
    
    // Add custom CSS for cursor
    addCursorStyles(userId, userName, color);
  }, []);

  const debugCursorState = useCallback(() => {
    console.log('🔍 Debug Cursor State:');
    console.log('Active File ID:', activeFile?.id);
    console.log('User ID:', user?.id);
    console.log('Cursors Object:', cursors);
    console.log('Decorations Ref:', decorationsRef.current);
    
    // Force re-render cursor decorations
    if (editorRef.current && cursors && Object.keys(cursors).length > 0) {
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile?.id && cursor.userId !== user?.id) {
          const userColor = getUserColor?.(cursor.userId) || '#FF6B6B';
          console.log('🔧 Force updating cursor for:', cursor.userName);
          updateCursorDecorations(cursor, userColor);
        }
      });
    }
  }, [cursors, activeFile, user?.id, getUserColor, updateCursorDecorations]);
  
  // Add this useEffect to debug cursor state
  useEffect(() => {
    if (Object.keys(cursors).length > 0) {
      console.log('🔍 Cursors changed, debugging state...');
      debugCursorState();
    }
  }, [cursors, debugCursorState]);

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
        background: ${color};
        z-index: 1000;
        animation: cursor-blink-${userId} 1s ease-in-out infinite;
        box-shadow: 0 0 4px ${color}80;
        border-radius: 1px;
      }
      
      .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}';
        position: absolute;
        top: -32px;
        left: -1px;
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.2;
        pointer-events: none;
        border: 1px solid ${color};
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @keyframes cursor-blink-${userId} {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
      
      .cursor-${userId} {
        position: relative;
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Enhanced cursor styles added for:', userName);
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

  // Responsive layout classes
  const getResponsiveLayout = () => {
    if (isMobileView) {
      return showOutput 
        ? isOutputFullscreen 
          ? "flex flex-col h-full" // Output fullscreen on mobile
          : "flex flex-col h-full" // Stacked layout on mobile
        : "flex flex-col h-full"; // Just editor on mobile
    }
    return "flex h-full"; // Side-by-side on desktop
  };

  const getEditorClasses = () => {
    if (isMobileView && showOutput) {
      return isOutputFullscreen ? "hidden" : "flex-1 min-h-0";
    }
    return "flex-1 min-h-0";
  };

  const getOutputClasses = () => {
    if (isMobileView) {
      return isOutputFullscreen ? "flex-1" : "h-1/2 min-h-[200px]";
    }
    return "w-2/5 min-w-[300px] max-w-[50%]";
  };

  return (
    <div className={cn("relative", getResponsiveLayout())}>
      {/* Code Editor */}
      <div className={cn("relative bg-gray-900", getEditorClasses())}>
        {activeFile ? (
          <>
            {/* Lock Status Indicators - Responsive positioning */}
            {isLockedByOther && (
              <div className={cn(
                "absolute z-20 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-sm",
                isMobileView ? "top-2 left-2 right-2" : "top-4 right-4"
              )}>
                <Lock className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-yellow-800">File Locked</div>
                  <div className="text-yellow-600 text-xs truncate">
                    {currentLock?.lockedByUser?.displayName} is editing this file
                  </div>
                </div>
              </div>
            )}
            
            {isRequestingLock && (
              <div className={cn(
                "absolute z-20 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 shadow-sm",
                isMobileView ? "top-2 left-2 right-2" : "top-4 right-4"
              )}>
                <Loader2 className="h-4 w-4 text-blue-600 animate-spin flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-blue-800">Requesting Access</div>
                  <div className="text-blue-600 text-xs">Waiting for edit permission...</div>
                </div>
              </div>
            )}

            {/* Edit Access Button - Responsive positioning */}
            {isLockedByOther && (
              <div className={cn(
                "absolute z-20",
                isMobileView 
                  ? "bottom-4 left-1/2 transform -translate-x-1/2" 
                  : "top-20 right-4"
              )}>
                <Button
                  size={isMobileView ? "default" : "sm"}
                  variant="outline"
                  onClick={requestFileLock}
                  disabled={isRequestingLock}
                  className="bg-white shadow-sm"
                >
                  {isRequestingLock ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {isMobileView ? "Requesting..." : "Requesting..."}
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      {isMobileView ? "Request Access" : "Request Edit Access"}
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
                minimap: { enabled: !isMobileView }, // Disable minimap on mobile
                fontSize: isMobileView ? 12 : 14, // Smaller font on mobile
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                insertSpaces: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                readOnly: !canEdit,
                // Enhanced options for better cursor visibility
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                cursorStyle: 'line',
                cursorWidth: 2,
                mouseWheelScrollSensitivity: 1,
                fastScrollSensitivity: 5,
                scrollBeyondLastColumn: 5,
                glyphMargin: !isMobileView, // Less margin on mobile
                folding: !isMobileView, // Disable folding on mobile for space
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                disableLayerHinting: true,
                fontLigatures: true,
                renderWhitespace: 'boundary',
                renderControlCharacters: false,
                renderIndentGuides: !isMobileView,
                highlightActiveIndentGuide: !isMobileView,
                lineNumbers: isMobileView ? 'off' : 'on', // Hide line numbers on mobile
                lineDecorationsWidth: isMobileView ? 0 : 10,
                lineNumbersMinChars: isMobileView ? 0 : 3,
                // Show a different cursor style when read-only
                ...(isLockedByOther && {
                  rulers: [],
                  overviewRulerBorder: false,
                }),
              }}
            />

            {/* Read-only overlay message - Responsive */}
            {!canEdit && (
              <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none flex items-center justify-center z-10">
                <div className={cn(
                  "bg-white rounded-lg shadow-lg p-6 text-center max-w-md",
                  isMobileView ? "mx-4 text-sm" : "mx-4"
                )}>
                  <Lock className={cn("mx-auto mb-4 text-gray-400", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                  <h3 className={cn("font-semibold text-gray-900 mb-2", isMobileView ? "text-base" : "text-lg")}>
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
          <div className="flex items-center justify-center h-full bg-gray-900 text-white p-4">
            <div className="text-center max-w-md">
              <File className={cn("mx-auto mb-4 opacity-50", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
              <h3 className={cn("font-medium mb-2", isMobileView ? "text-base" : "text-lg")}>No file selected</h3>
              <p className={cn("text-gray-400 mb-4", isMobileView ? "text-sm" : "text-base")}>
                {isHost ? 'Create your first file to start coding' : 'Select a file to start editing'}
              </p>
              {isHost && (
                <Button 
                  onClick={showNewFileModal}
                  disabled={fileCreationLoading}
                  size={isMobileView ? "default" : "default"}
                  className="w-full sm:w-auto"
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

      {/* Output Panel - Responsive */}
      {showOutput && (
        <div className={cn(
          "bg-white flex flex-col border-gray-200",
          getOutputClasses(),
          isMobileView ? "border-t" : "border-l"
        )}>
          <div className="bg-gray-900 text-white px-4 py-3 border-b flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Terminal className="h-4 w-4 flex-shrink-0" />
              <h3 className="font-medium">Output</h3>
              {activeFile && (
                <Badge className="bg-gray-700 text-gray-200 text-xs hidden sm:inline-flex">
                  {languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile fullscreen toggle */}
              {isMobileView && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsOutputFullscreen(!isOutputFullscreen)}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                  title={isOutputFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isOutputFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowOutput(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {isExecuting ? (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center p-4">
                  <RefreshCw className={cn("mx-auto mb-4 animate-spin text-blue-600", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                  <p className="text-blue-700 font-medium">Executing code...</p>
                </div>
              </div>
            ) : executionResult ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className={cn(
                  "px-4 py-3 text-sm border-b flex-shrink-0",
                  executionResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                )}>
                  {executionResult.error ? (
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Execution failed</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">Executed successfully in {executionResult.executionTime}ms</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-auto p-4 min-h-0">
                  {executionResult.error ? (
                    <pre className={cn(
                      "text-red-600 whitespace-pre-wrap font-mono bg-red-50 p-3 rounded border",
                      isMobileView ? "text-xs" : "text-sm"
                    )}>
                      {executionResult.error}
                    </pre>
                  ) : (
                    <pre className={cn(
                      "text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border min-h-32",
                      isMobileView ? "text-xs" : "text-sm"
                    )}>
                      {executionResult.output || 'No output generated'}
                    </pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center p-4">
                  <Terminal className={cn("mx-auto mb-3 opacity-50", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                  <p className={isMobileView ? "text-sm" : "text-base"}>Click "Run Code" to execute</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
