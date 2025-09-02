
// 'use client'

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context';
// import { useSocket } from '@/hooks/useSocket';
// import JSZip from 'jszip';
// import { 
//   Users, MessageSquare, Download, Share2, Save, Play, 
//   Plus, X, FileText, Terminal, UserPlus, Crown, Send, RefreshCw, 
//   CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Copy, Eye, 
//   EyeOff, MoreVertical, UserMinus, File, Code2, Settings, 
//   StopCircle, Loader2, Menu, Maximize2, Minimize2, Globe, 
//   Lock, Hash, UserCheck, Sparkles, Layout, ArrowLeft,
//   Zap, Grid3X3, PanelLeft, PanelRight, MessageCircle 
// } from 'lucide-react';

// import SessionHeader from './components/SessionHeader';
// import FileTabs from './components/FileTabs';
// import EditorArea from './components/EditorArea';
// import PreviewPanel from './components/PreviewPanel';
// import NewFileModal from './components/NewFileModal';
// import InviteModal from './components/InviteModal';
// import EndSessionModal from './components/EndSessionModal';
// import SessionEndedModal from './components/SessionEndedModal';
// import Sidebar from './components/Sidebar';
// import { languageConfigs } from './utils/languageConfigs';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';

// import { cn } from '@/lib/utils';

// // Interfaces
// interface Participant {
//   id: string;
//   user: {
//     id: string;
//     displayName: string;
//     email: string;
//   };
//   role: 'HOST' | 'COLLABORATOR';
//   isActive: boolean;
//   joinedAt: string;
// }

// interface Message {
//   id: string;
//   content: string;
//   createdAt: string;
//   user: {
//     id: string;
//     displayName: string;
//   };
// }

// interface OnlineUser {
//   userId: string;
//   userEmail: string;
//   displayName: string;
//   socketId: string;
//   joinedAt: Date;
//   isOnline: boolean;
// }

// interface CursorPosition {
//   userId: string;
//   userName: string;
//   fileId: string;
//   position: { lineNumber: number; column: number };
//   selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
//   color: string;
//   timestamp: number;
//   isActive: boolean;
//   lastActivity: number;
// }

// interface FileData {
//   id: string;
//   name: string;
//   language: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   createdBy: string;
// }

// interface ExecutionResult {
//   output: string;
//   error?: string;
//   executionTime: number;
//   language: string;
// }

// interface SessionData {
//   id: string;
//   title: string;
//   description?: string;
//   type: 'PUBLIC' | 'PRIVATE';
//   isActive: boolean;
//   files: FileData[];
//   participants: Participant[];
//   messages: Message[];
//   owner: {
//     id: string;
//     displayName: string;
//     email: string;
//   };
//   _count: {
//     participants: number;
//     files: number;
//   };
//   createdAt: string;
// }

// type SidebarMode = 'hidden' | 'participants' | 'chat';
// type PanelState = 'hidden' | 'expanded';

// interface LayoutState {
//   sidebar: SidebarMode;
//   preview: PanelState;
//   output: PanelState;
// }

// // Custom hooks
// const useLayoutManager = () => {
//   const [layout, setLayout] = useState<LayoutState>({
//     sidebar: 'hidden',
//     preview: 'hidden',
//     output: 'hidden',
//   });

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkLayout = () => {
//       const width = window.innerWidth;
//       const mobile = width < 768;
      
//       setIsMobile(mobile);
      
//       if (mobile) {
//         setLayout(prev => ({
//           ...prev,
//           sidebar: 'hidden',
//           preview: 'hidden',
//           output: 'hidden'
//         }));
//       }
//     };
    
//     checkLayout();
//     window.addEventListener('resize', checkLayout);
//     return () => window.removeEventListener('resize', checkLayout);
//   }, []);

//   const setSidebarMode = useCallback((mode: SidebarMode) => {
//     setLayout(prev => ({ ...prev, sidebar: mode }));
//   }, []);

//   const togglePanel = useCallback((panel: 'preview' | 'output') => {
//     setLayout(prev => ({
//       ...prev,
//       [panel]: prev[panel] === 'hidden' ? 'expanded' : 'hidden'
//     }));
//   }, []);

//   return {
//     layout,
//     isMobile,
//     setSidebarMode,
//     togglePanel,
//     setLayout
//   };
// };

// const usePanelManager = () => {
//   const [sidebarWidth, setSidebarWidth] = useState(350);
//   const [outputWidth, setOutputWidth] = useState(450);
  
//   const sidebarPanel = {
//     width: sidebarWidth,
//     startResize: (e: React.MouseEvent) => {
//       e.preventDefault();
//       const startX = e.clientX;
//       const startWidth = sidebarWidth;
      
//       const handleMouseMove = (e: MouseEvent) => {
//         const newWidth = Math.max(280, Math.min(600, startWidth + (e.clientX - startX)));
//         setSidebarWidth(newWidth);
//       };
      
//       const handleMouseUp = () => {
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);
//       };
      
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }
//   };

//   const outputPanel = {
//     width: outputWidth,
//     startResize: (e: React.MouseEvent) => {
//       e.preventDefault();
//       const startX = e.clientX;
//       const startWidth = outputWidth;
      
//       const handleMouseMove = (e: MouseEvent) => {
//         const newWidth = Math.max(350, Math.min(800, startWidth - (e.clientX - startX)));
//         setOutputWidth(newWidth);
//       };
      
//       const handleMouseUp = () => {
//         document.removeEventListener('mousemove', handleMouseMove);
//         document.removeEventListener('mouseup', handleMouseUp);
//       };
      
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleMouseUp);
//     }
//   };

//   return { sidebarPanel, outputPanel };
// };

// export default function SessionPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const { socket, connected, connecting } = useSocket();
  
//   const { layout, isMobile, setSidebarMode, togglePanel } = useLayoutManager();
//   const { sidebarPanel, outputPanel } = usePanelManager();
  
//   // State
//   const [sessionJoined, setSessionJoined] = useState(false);
//   const [sessionId] = useState(params.id as string);
//   const [session, setSession] = useState<SessionData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [participantCount, setParticipantCount] = useState(1);
//   const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  
//   const [files, setFiles] = useState<FileData[]>([]);
//   const [activeFileId, setActiveFileId] = useState<string | null>(null);
//   const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
  
//   const [showNewFileModal, setShowNewFileModal] = useState(false);
//   const [newFileName, setNewFileName] = useState('');
//   const [newFileLanguage, setNewFileLanguage] = useState('javascript');
//   const [fileCreationLoading, setFileCreationLoading] = useState(false);
  
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [chatError, setChatError] = useState('');
//   const [isSendingMessage, setIsSendingMessage] = useState(false);
  
//   const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null);
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [showEndSessionModal, setShowEndSessionModal] = useState(false);
//   const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
//   const [sessionEndedReason, setSessionEndedReason] = useState('');
//   const [endSessionLoading, setEndSessionLoading] = useState(false);
  
//   // Refs
//   const editorRef = useRef<any>(null);
//   const monacoRef = useRef<any>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
//   const messageIdRef = useRef<Set<string>>(new Set());
//   const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
//   const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
//   const cursorElementsRef = useRef<{ [key: string]: HTMLElement }>({});

//   // Derived state
//   const isHost = session?.owner?.id === user?.id;
//   const activeFile = files.find(file => file.id === activeFileId);

//   const userColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'];
  
//   const getUserColor = useCallback((userId: string) => {
//     const hash = userId.split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
//     return userColors[Math.abs(hash) % userColors.length];
//   }, []);

//   // Cursor management
//   const updateCursorPosition = useCallback((userId: string, userName: string, color: string, lineNumber: number, columnPosition: number) => {
//     if (!editorRef.current || !monacoRef.current) return;
    
//     try {
//       const existingCursor = cursorElementsRef.current[userId];
//       if (existingCursor) {
//         existingCursor.remove();
//         delete cursorElementsRef.current[userId];
//       }

//       const editorDomNode = editorRef.current.getDomNode();
//       if (!editorDomNode) return;

//       const editorContainer = editorDomNode.querySelector('.monaco-editor') || editorDomNode;
//       const model = editorRef.current.getModel();
//       if (!model) return;

//       const lineCount = model.getLineCount();
//       const validLine = Math.max(1, Math.min(lineNumber, lineCount));
//       const lineLength = model.getLineMaxColumn(validLine);
//       const validColumn = Math.max(1, Math.min(columnPosition, lineLength));

//       const position = editorRef.current.getScrolledVisiblePosition({
//         lineNumber: validLine,
//         column: validColumn
//       });

//       if (!position) return;

//       const lineHeight = editorRef.current.getOption(monacoRef.current.editor.EditorOption.lineHeight);
      
//       const cursorWrapper = document.createElement('div');
//       cursorWrapper.id = `cursor-wrapper-${userId}`;
//       cursorWrapper.style.cssText = `
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         pointer-events: none;
//         z-index: 1000;
//         overflow: hidden;
//       `;

//       const cursorElement = document.createElement('div');
//       cursorElement.style.cssText = `
//         position: absolute;
//         top: ${position.top}px;
//         left: ${position.left}px;
//         width: 2px;
//         height: ${lineHeight}px;
//         background: ${color};
//         pointer-events: none;
//         opacity: 1;
//         animation: blink-${userId} 1s ease-in-out infinite;
//       `;

//       const labelElement = document.createElement('span');
//       labelElement.textContent = userName;
//       labelElement.style.cssText = `
//         position: absolute;
//         top: ${position.top - 16}px;
//         left: ${position.left}px;
//         background: ${color} !important;
//         color: white !important;
//         padding: 2px 4px !important;
//         border-radius: 2px !important;
//         font-size: 10px !important;
//         font-weight: normal !important;
//         white-space: nowrap !important;
//         pointer-events: none !important;
//         font-family: system-ui, -apple-system, sans-serif !important;
//         line-height: 1 !important;
//         display: inline-block !important;
//         z-index: 1001 !important;
//       `;

//       if (!document.getElementById(`cursor-anim-${userId}`)) {
//         const style = document.createElement('style');
//         style.id = `cursor-anim-${userId}`;
//         style.textContent = `
//           @keyframes blink-${userId} {
//             0%, 70% { opacity: 1; }
//             71%, 100% { opacity: 0.3; }
//           }
//         `;
//         document.head.appendChild(style);
//       }

//       cursorWrapper.appendChild(cursorElement);
//       cursorWrapper.appendChild(labelElement);
//       editorContainer.appendChild(cursorWrapper);
      
//       cursorElementsRef.current[userId] = cursorWrapper;

//       setTimeout(() => {
//         if (cursorElementsRef.current[userId]) {
//           cursorElementsRef.current[userId].remove();
//           delete cursorElementsRef.current[userId];
          
//           const animStyle = document.getElementById(`cursor-anim-${userId}`);
//           if (animStyle) animStyle.remove();
//         }
//       }, 3000);

//     } catch (error) {
//       console.error(`Error positioning cursor for ${userName}:`, error);
//     }
//   }, []);

//   const removeCursorStyles = useCallback((userId: string) => {
//     if (cursorElementsRef.current[userId]) {
//       cursorElementsRef.current[userId].remove();
//       delete cursorElementsRef.current[userId];
//     }
    
//     const animStyle = document.getElementById(`cursor-anim-${userId}`);
//     if (animStyle) animStyle.remove();
//   }, []);

//   const cleanupInactiveCursors = useCallback(() => {
//     const now = Date.now();
//     const inactiveTimeout = 3000;
    
//     setCursors(prev => {
//       const newCursors = { ...prev };
//       let hasChanges = false;
      
//       Object.keys(newCursors).forEach(cursorKey => {
//         const cursor = newCursors[cursorKey];
//         const timeSinceActivity = now - (cursor.lastActivity || cursor.timestamp);
        
//         if (timeSinceActivity > inactiveTimeout) {
//           delete newCursors[cursorKey];
//           removeCursorStyles(cursor.userId);
//           hasChanges = true;
//         }
//       });
      
//       return hasChanges ? newCursors : prev;
//     });
//   }, [removeCursorStyles]);

//   useEffect(() => {
//     const cleanupInterval = setInterval(cleanupInactiveCursors, 1000);
//     return () => clearInterval(cleanupInterval);
//   }, [cleanupInactiveCursors]);

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
//         switch (e.key) {
//           case 's':
//             e.preventDefault();
//             saveAllFiles();
//             break;
//           case 'e':
//             e.preventDefault();
//             if (activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable) {
//               executeCode();
//             }
//             break;
//           case 'p':
//             e.preventDefault();
//             togglePanel('preview');
//             break;
//           case 'k':
//             e.preventDefault();
//             setSidebarMode(layout.sidebar === 'chat' ? 'hidden' : 'chat');
//             break;
//           case 'n':
//             e.preventDefault();
//             if (isHost) setShowNewFileModal(true);
//             break;
//           case 'i':
//             e.preventDefault();
//             if (isHost) setShowInviteModal(true);
//             break;
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [activeFile, isHost, layout.sidebar, setSidebarMode, togglePanel]);

//   // Data fetching
//   const fetchSessionData = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch(`/api/sessions/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setSession(data.session);
        
//         if (data.session.files) {
//           setFiles(data.session.files);
//           if (!activeFileId && data.session.files.length > 0) {
//             setActiveFileId(data.session.files[0].id);
//           }
//         }
        
//         setParticipantCount(data.session._count?.participants || 1);
        
//         if (data.session.messages && Array.isArray(data.session.messages)) {
//           messageIdRef.current.clear();
//           const loadedMessages = data.session.messages.map((msg: Message) => {
//             messageIdRef.current.add(msg.id);
//             return msg;
//           });
//           setMessages(loadedMessages);
//         } else {
//           setMessages([]);
//         }
        
//         data.session.files?.forEach((file: FileData) => {
//           lastCodeChangeRef.current[file.id] = file.content;
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching session:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionId, activeFileId]);

//   // Socket handlers
//   useEffect(() => {
//     if (!socket || !connected || !sessionId || !user?.id) {
//       if (socket && !connected) setSyncStatus('offline');
//       return;
//     }

//     socket.emit('join-session', sessionId);

//     socket.on('session-joined', (data) => {
//       setSessionJoined(true);
//       setParticipantCount(data.participantCount || 1);
//       setSyncStatus('synced');
//       fetchSessionData();
//     });

//     socket.on('user-joined', (data) => {
//       if (data.participantCount !== undefined) setParticipantCount(data.participantCount);
      
//       const newUser: OnlineUser = {
//         userId: data.userId,
//         userEmail: data.userEmail,
//         displayName: data.userDisplayName || data.userEmail?.split('@')[0] || 'Anonymous',
//         socketId: data.socketId || socket.id!,
//         joinedAt: new Date(data.timestamp),
//         isOnline: true
//       };
      
//       setOnlineUsers(prev => {
//         const filtered = prev.filter(u => u.userId !== data.userId);
//         return [...filtered, newUser];
//       });
//     });

//     socket.on('user-left', (data) => {
//       if (data.participantCount !== undefined) setParticipantCount(data.participantCount);
      
//       setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      
//       setCursors(prev => {
//         const newCursors = { ...prev };
//         Object.keys(newCursors).forEach(key => {
//           if (key.startsWith(data.userId)) delete newCursors[key];
//         });
//         return newCursors;
//       });
      
//       removeCursorStyles(data.userId);
//     });

//     socket.on('cursor-position', (data) => {      
//       if (data.userId === user?.id) return;
      
//       if (!data.position || typeof data.position.lineNumber !== 'number' || typeof data.position.column !== 'number') return;
      
//       const userColor = getUserColor(data.userId);
//       const validLine = Math.max(1, Math.floor(data.position.lineNumber));
//       const validColumn = Math.max(1, Math.floor(data.position.column));
      
//       if (data.fileId === activeFileId) {
//         updateCursorPosition(data.userId, data.userName, userColor, validLine, validColumn);
//       }
//     });

//     socket.on('file-update', (data) => {
//       if (data.userId === user.id) return;
      
//       isRemoteUpdateRef.current[data.fileId] = true;
      
//       setFiles(prev => prev.map(file => 
//         file.id === data.fileId ? { ...file, content: data.content } : file
//       ));
      
//       lastCodeChangeRef.current[data.fileId] = data.content;
      
//       if (data.fileId === activeFileId && editorRef.current) {
//         const currentValue = editorRef.current.getValue();
//         if (currentValue !== data.content) {
//           const position = editorRef.current.getPosition();
//           editorRef.current.setValue(data.content);
//           if (position) editorRef.current.setPosition(position);
//         }
//       }
      
//       setTimeout(() => {
//         isRemoteUpdateRef.current[data.fileId] = false;
//       }, 100);
//     });

//     socket.on('chat-message', (message) => {
//       setChatError('');
//       if (!messageIdRef.current.has(message.id)) {
//         messageIdRef.current.add(message.id);
//         setMessages(prev => [...prev, message]);
//       }
//     });

//     socket.on('session-ended', (data) => {
//       setShowSessionEndedModal(true);
//       setSessionEndedReason(data.reason || 'The host has ended this session');
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 3000);
//     });

//     return () => {
//       socket.off('session-joined');
//       socket.off('user-joined');
//       socket.off('user-left');
//       socket.off('cursor-position');
//       socket.off('file-update');
//       socket.off('chat-message');
//       socket.off('session-ended');
//     };
//   }, [socket, connected, sessionId, user?.id, router, activeFileId, fetchSessionData, getUserColor, updateCursorPosition, removeCursorStyles]);

//   // Editor handlers
//   const handleEditorChange = useCallback((value: string | undefined) => {
//     if (!value || !socket || !connected || !activeFileId) return;
    
//     if (isRemoteUpdateRef.current[activeFileId]) return;
    
//     setFiles(prev => prev.map(file => 
//       file.id === activeFileId ? { ...file, content: value } : file
//     ));
    
//     if (lastCodeChangeRef.current[activeFileId] !== value) {
//       lastCodeChangeRef.current[activeFileId] = value;
//       setSyncStatus('syncing');
      
//       if (syncTimeoutRef.current[activeFileId]) {
//         clearTimeout(syncTimeoutRef.current[activeFileId]);
//       }
      
//       syncTimeoutRef.current[activeFileId] = setTimeout(() => {
//         if (socket && connected && lastCodeChangeRef.current[activeFileId] === value) {
//           socket.emit('file-update', {
//             fileId: activeFileId,
//             content: value,
//             sessionId,
//             timestamp: Date.now()
//           });
//           setSyncStatus('synced');
//         }
//       }, 200);
//     }
//   }, [socket, connected, sessionId, activeFileId]);

//   const handleEditorDidMount = (editor: any, monaco: any) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
    
//     editor.updateOptions({
//       fontSize: isMobile ? 13 : 15,
//       fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
//       lineHeight: 1.6,
//       minimap: { enabled: !isMobile },
//       scrollBeyondLastLine: false,
//       wordWrap: 'on',
//       automaticLayout: true,
//       theme: 'vs-dark',
//       tabSize: 2,
//       insertSpaces: true,
//       cursorBlinking: 'smooth',
//       lineNumbers: isMobile ? 'off' : 'on',
//       glyphMargin: !isMobile,
//       folding: !isMobile,
//       readOnly: false,
//       renderValidationDecorations: 'on',
//     });

//     if (activeFile) {
//       editor.setValue(activeFile.content);
//     }

//     setTimeout(() => {
//       editor.focus();
//     }, 100);

//     if (socket && connected && sessionId && user && activeFileId) {
//       let lastCursorUpdate = 0;
      
//       editor.onDidChangeCursorPosition((e: any) => {
//         const now = Date.now();
        
//         if (now - lastCursorUpdate < 100) return;
//         lastCursorUpdate = now;
        
//         const position = e.position;
//         const selection = editor.getSelection();
        
//         if (!position || typeof position.lineNumber !== 'number' || typeof position.column !== 'number' || position.lineNumber < 1 || position.column < 1) return;
        
//         const cursorData = {
//           sessionId,
//           fileId: activeFileId,
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
//           timestamp: now
//         };
        
//         socket.emit('cursor-position', cursorData);
//       });
//     }
//   };

//   // Actions
//   const executeCode = useCallback(async () => {
//     if (!activeFile || isExecuting) return;

//     setIsExecuting(true);
//     setExecutionResult(null);
    
//     try {
//       const startTime = performance.now();
      
//       let codeToExecute = activeFile.content;
//       if (editorRef.current) {
//         codeToExecute = editorRef.current.getValue();
//       }

//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await fetch('/api/execute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           code: codeToExecute,
//           language: activeFile.language,
//           sessionId: sessionId
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
//       }

//       const result = await response.json();
//       const executionTime = Math.round(performance.now() - startTime);

//       setExecutionResult({
//         output: result.output || '',
//         error: result.error || '',
//         executionTime,
//         language: activeFile.language
//       });

//       togglePanel('output');

//     } catch (error) {
//       setExecutionResult({
//         output: '',
//         error: error instanceof Error ? error.message : 'Unknown execution error',
//         executionTime: 0,
//         language: activeFile.language
//       });

//       togglePanel('output');
//     } finally {
//       setIsExecuting(false);
//     }
//   }, [activeFile, isExecuting, sessionId, togglePanel]);

//   const createNewFile = async () => {
//     if (!newFileName.trim() || !socket || !connected) return;
    
//     if (files.some(f => f.name.toLowerCase() === newFileName.toLowerCase())) {
//       alert('A file with this name already exists!');
//       return;
//     }
    
//     setFileCreationLoading(true);
    
//     try {
//       const token = localStorage.getItem('accessToken');
//       const config = languageConfigs[newFileLanguage as keyof typeof languageConfigs];
      
//       const response = await fetch('/api/sessions/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           sessionId,
//           name: newFileName.trim(),
//           language: newFileLanguage,
//           content: config?.defaultContent || `// New ${newFileLanguage} file\nconsole.log('Hello World!');`
//         })
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         const newFile = data.file;
        
//         setFiles(prev => [...prev, newFile]);
//         setActiveFileId(newFile.id);
//         lastCodeChangeRef.current[newFile.id] = newFile.content;
        
//         setNewFileName('');
//         setNewFileLanguage('javascript');
//         setShowNewFileModal(false);
        
//         socket?.emit('file-created', { sessionId, file: newFile });
        
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to create file');
//       }
//     } catch (error) {
//       console.error('Failed to create file:', error);
//       alert('Failed to create file. Please try again.');
//     } finally {
//       setFileCreationLoading(false);
//     }
//   };

//   const deleteFile = async (fileId: string) => {
//     if (!isHost) return;
    
//     if (files.length === 1) {
//       alert('Cannot delete the last file in the session');
//       return;
//     }
    
//     if (!confirm('Are you sure you want to delete this file?')) return;
    
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch(`/api/sessions/files/${fileId}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         setFiles(prev => prev.filter(f => f.id !== fileId));
        
//         if (fileId === activeFileId) {
//           const remainingFiles = files.filter(f => f.id !== fileId);
//           if (remainingFiles.length > 0) {
//             setActiveFileId(remainingFiles[0].id);
//           } else {
//             setActiveFileId(null);
//           }
//         }
        
//         socket?.emit('file-deleted', { sessionId, fileId });
//       }
//     } catch (error) {
//       console.error('Failed to delete file:', error);
//     }
//   };

//   const saveAllFiles = async () => {
//     try {
//       if (activeFileId && editorRef.current) {
//         const currentContent = editorRef.current.getValue();
//         const updatedFiles = files.map(file => 
//           file.id === activeFileId ? { ...file, content: currentContent } : file
//         );
        
//         const token = localStorage.getItem('accessToken');
//         await fetch(`/api/sessions/${sessionId}/save`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ files: updatedFiles })
//         });
//       }
//     } catch (error) {
//       console.error('Failed to save files:', error);
//     }
//   };

//   // Chat handlers
//   const sendMessage = useCallback(() => {
//     if (!newMessage.trim() || !socket || !connected || isSendingMessage) return;

//     setIsSendingMessage(true);
//     setChatError('');

//     socket.emit('chat-message', {
//       content: newMessage.trim(),
//       sessionId,
//       timestamp: Date.now()
//     });

//     setNewMessage('');
    
//     setTimeout(() => {
//       setIsSendingMessage(false);
//     }, 5000);
//   }, [newMessage, socket, connected, sessionId, isSendingMessage]);

//   const handleChatKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Participant management
//   const removeParticipant = useCallback((participantId: string) => {
//     if (!isHost || !socket || !connected) return;
    
//     socket.emit('remove-participant', {
//       sessionId,
//       participantId
//     });
    
//     setShowParticipantMenu(null);
//   }, [isHost, socket, connected, sessionId]);

//   // Session actions
//   const copySessionLink = () => {
//     const link = `${window.location.origin}/session/${sessionId}`;
//     navigator.clipboard.writeText(link);
//   };

//   const exportSession = async () => {
//     if (!session) return;

//     const JSZip = (await import('jszip')).default;
//     const zip = new JSZip();
    
//     const currentFiles = files.map(file => {
//       if (file.id === activeFileId && editorRef.current) {
//         return { ...file, content: editorRef.current.getValue() };
//       }
//       return file;
//     });
    
//     currentFiles.forEach(file => {
//       zip.file(file.name, file.content);
//     });
    
//     const readme = `# ${session.title}

// ## Description
// ${session.description || 'No description provided'}

// ## Files
// ${currentFiles.map(f => `- ${f.name} (${f.language})`).join('\n')}

// ## Session Info
// - Created: ${new Date(session.createdAt).toLocaleString()}
// - Type: ${session.type}
// - Status: ${session.isActive ? 'Active' : 'Ended'}
// `;
//     zip.file('README.md', readme);
    
//     const blob = await zip.generateAsync({ type: 'blob' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   const generatePreview = () => {
//     const htmlFile = files.find(f => f.language === 'html');
//     const cssFile = files.find(f => f.language === 'css');
//     const jsFile = files.find(f => f.language === 'javascript');
    
//     const getFileContent = (file: FileData) => {
//       if (file.id === activeFileId && editorRef.current) {
//         return editorRef.current.getValue();
//       }
//       return file.content;
//     };
    
//     const htmlContent = htmlFile ? getFileContent(htmlFile) : '';
//     const cssContent = cssFile ? getFileContent(cssFile) : '';
//     const jsContent = jsFile ? getFileContent(jsFile) : '';
    
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Preview - ${session?.title || 'CollabIDE'}</title>
//     <style>
//         ${cssContent}
//     </style>
// </head>
// <body>
//     ${htmlContent.replace(/<html.*?>|<\/html>|<head.*?>[\s\S]*?<\/head>|<body.*?>|<\/body>|<!DOCTYPE.*?>/gi, '') || '<h1>No HTML file found</h1>'}
//     <script>
//         try {
//             ${jsContent}
//         } catch (error) {
//             console.error('JavaScript Error:', error);
//         }
//     </script>
// </body>
// </html>`;
//   };

//   const handleEndSession = async () => {
//     if (!isHost || !session) return;

//     setEndSessionLoading(true);
    
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch(`/api/sessions/${sessionId}/end`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           reason: 'Session ended by host'
//         })
//       });

//       if (response.ok) {
//         socket?.emit('end-session-broadcast', { 
//           sessionId,
//           reason: 'Session ended by host',
//           hostName: user?.displayName || 'Host'
//         });
        
//         await new Promise(resolve => setTimeout(resolve, 500));
//         router.push('/dashboard');
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to end session');
//       }
//     } catch (error) {
//       console.error('Failed to end session:', error);
//       alert('Failed to end session. Please try again.');
//     } finally {
//       setEndSessionLoading(false);
//       setShowEndSessionModal(false);
//     }
//   };

//   // Quick Actions Bar Component
//   const QuickActionsBar = () => (
//     <div className="flex items-center justify-between h-8 px-3 border-b border-slate-800/50 bg-slate-900/30">
//       {/* Left Section */}
//       <div className="flex items-center space-x-0.5">
//         <button
//           onClick={() => setSidebarMode(layout.sidebar === 'participants' ? 'hidden' : 'participants')}
//           className={cn(
//             "h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors relative",
//             layout.sidebar === 'participants'
//               ? "bg-slate-600/80 text-slate-100"
//               : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//           )}
//           title="Participants"
//         >
//           <Users className="h-3 w-3" />
//           <span className="hidden sm:inline">People</span>
//           {participantCount > 1 && (
//             <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[9px] rounded-full h-3 w-3 flex items-center justify-center font-medium">
//               {participantCount}
//             </span>
//           )}
//         </button>

//         <button
//           onClick={() => setSidebarMode(layout.sidebar === 'chat' ? 'hidden' : 'chat')}
//           className={cn(
//             "h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors relative",
//             layout.sidebar === 'chat'
//               ? "bg-slate-600/80 text-slate-100"
//               : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//           )}
//           title="Chat"
//         >
//           <MessageSquare className="h-3 w-3" />
//           <span className="hidden sm:inline">Chat</span>
//           {messages.length > 0 && layout.sidebar !== 'chat' && (
//             <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full" />
//           )}
//         </button>

//         <div className="w-px h-4 bg-slate-700/50 mx-1" />

//         <button
//           onClick={() => togglePanel('preview')}
//           className={cn(
//             "h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors",
//             layout.preview === 'expanded'
//               ? "bg-slate-600/80 text-slate-100"
//               : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//           )}
//           title="Preview"
//         >
//           <Eye className="h-3 w-3" />
//           <span className="hidden md:inline">Preview</span>
//         </button>

//         <button
//           onClick={() => togglePanel('output')}
//           className={cn(
//             "h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors",
//             layout.output === 'expanded'
//               ? "bg-slate-600/80 text-slate-100"
//               : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//           )}
//           title="Output"
//         >
//           <Terminal className="h-3 w-3" />
//           <span className="hidden md:inline">Output</span>
//         </button>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center space-x-1">
//         {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//           <button
//             onClick={executeCode}
//             disabled={isExecuting}
//             className={cn(
//               "h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors",
//               isExecuting
//                 ? "bg-blue-500/20 text-blue-400 cursor-not-allowed"
//                 : "bg-blue-600/90 hover:bg-blue-600 text-white"
//             )}
//             title="Run Code (Ctrl+E)"
//           >
//             {isExecuting ? (
//               <Loader2 className="h-3 w-3 animate-spin" />
//             ) : (
//               <Play className="h-3 w-3" />
//             )}
//             <span className="hidden sm:inline text-xs">Run</span>
//           </button>
//         )}

//         {isHost && (
//           <button
//             onClick={() => setShowNewFileModal(true)}
//             className="h-6 px-2 text-xs rounded flex items-center gap-1.5 transition-colors text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//             title="New File (Ctrl+N)"
//           >
//             <Plus className="h-3 w-3" />
//             <span className="hidden sm:inline">New</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   // Cleanup
//   useEffect(() => {
//     return () => {
//       if (socket && sessionId) {
//         socket.emit('leave-session', sessionId);
//       }
      
//       Object.values(syncTimeoutRef.current).forEach(timeout => {
//         if (timeout) clearTimeout(timeout);
//       });
      
//       Object.keys(cursors).forEach(cursorKey => {
//         const userId = cursorKey.split('-')[0];
//         removeCursorStyles(userId);
//       });
//     };
//   }, [socket, sessionId, cursors, removeCursorStyles]);

//   // Loading states
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="p-8 max-w-md mx-4 bg-card/95 border-card border-2 backdrop-blur-xl rounded-lg">
//           <div className="text-center space-y-6">
//             <div className="p-4 bg-blue-500/20 rounded-full w-fit mx-auto">
//               <Lock className="h-16 w-16 text-blue-400" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-card-foreground mb-2">Authentication Required</h2>
//               <p className="text-muted-foreground mb-4">Please log in to access this collaboration session.</p>
//               <Button onClick={() => router.push('/auth/login')} className="bg-primary hover:bg-primary-foreground shadow-lg shadow-primary/25 rounded-md">
//                 Sign In
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </div>

//     );
//   }

//   if (loading || connecting) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//   <Card className="p-8 max-w-md mx-4 bg-card/95 border-card border-2 backdrop-blur-xl rounded-lg">
//     <div className="text-center space-y-6">
//       <div className="p-4 bg-blue-500/20 rounded-full w-fit mx-auto">
//         <Loader2 className="h-16 w-16 animate-spin text-blue-400" />
//       </div>
//       <div>
//         <h2 className="text-xl font-bold text-card-foreground mb-2">Joining Session</h2>
//         <p className="text-muted-foreground">{loading ? 'Loading session data...' : 'Establishing connection...'}</p>
//       </div>
//     </div>
//   </Card>
// </div>

//     );
//   }

//   if (!connected) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
//           <div className="text-center space-y-6">
//             <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
//               <WifiOff className="h-16 w-16 text-red-400" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-red-400 mb-2">Connection Failed</h2>
//               <p className="text-slate-400 mb-6">Unable to connect to the collaboration server.</p>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <Button onClick={() => window.location.reload()} className="flex-1">
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Retry Connection
//                 </Button>
//                 <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
//                   Back to Dashboard
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   if (!sessionJoined || !session) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
//         <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
//           <div className="text-center space-y-6">
//             <div className="p-4 bg-emerald-500/20 rounded-full w-fit mx-auto">
//               <Loader2 className="h-16 w-16 animate-spin text-emerald-400" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-100 mb-2">Joining Session</h2>
//               <p className="text-slate-400">Setting up your collaborative workspace...</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
//       <SessionHeader 
//         session={session}
//         isHost={isHost}
//         connected={connected}
//         syncStatus={syncStatus}
//         participantCount={participantCount}
//         copySessionLink={copySessionLink}
//         saveAllFiles={saveAllFiles}
//         exportSession={exportSession}
//         isPreviewVisible={layout.preview === 'expanded'}
//         togglePreview={() => togglePanel('preview')}
//         showInviteModal={() => setShowInviteModal(true)}
//         showEndSessionModal={() => setShowEndSessionModal(true)}
//         endSessionLoading={endSessionLoading}
//       />

//       <QuickActionsBar />

//       <div className="flex-1 flex overflow-hidden">
//         {/* Single Sidebar - only shows one mode at a time */}
//         {layout.sidebar !== 'hidden' && (
//           <>
//             <div className="flex-shrink-0 transition-all duration-300 ease-out" style={{ width: `${sidebarPanel.width}px` }}>
//               <Sidebar
//                 mode={layout.sidebar}
//                 user={user}
//                 session={session}
//                 isHost={isHost}
//                 onlineUsers={onlineUsers}
//                 participantCount={participantCount}
//                 getUserColor={getUserColor}
//                 showParticipantMenu={showParticipantMenu}
//                 setShowParticipantMenu={setShowParticipantMenu}
//                 removeParticipant={removeParticipant}
//                 messages={messages}
//                 newMessage={newMessage}
//                 setNewMessage={setNewMessage}
//                 chatError={chatError}
//                 connected={connected}
//                 isSendingMessage={isSendingMessage}
//                 sendMessage={sendMessage}
//                 handleChatKeyPress={handleChatKeyPress}
//                 messagesEndRef={messagesEndRef}
//                 isMobile={isMobile}
//                 onInviteUsers={() => setShowInviteModal(true)}
//                 onClose={() => setSidebarMode('hidden')}
//                 className="h-full"
//               />
//             </div>
//             <div className="w-1 bg-slate-700/50 hover:bg-slate-500/50 cursor-col-resize transition-all duration-200 relative group" onMouseDown={sidebarPanel.startResize}>
//               <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-slate-500/10" />
//             </div>
//           </>
//         )}

//         <div className="flex-1 flex flex-col min-w-0">
//           <FileTabs
//             files={files}
//             activeFileId={activeFileId}
//             setActiveFileId={setActiveFileId}
//             isHost={isHost}
//             showNewFileModal={() => setShowNewFileModal(true)}
//             fileCreationLoading={fileCreationLoading}
//             deleteFile={deleteFile}
//             executeCode={executeCode}
//             isExecuting={isExecuting}
//             activeFile={activeFile}
//           />

//           <div className="flex-1 flex overflow-hidden">
//             <div className={cn("flex-1 min-w-0", (layout.preview === 'expanded' || layout.output === 'expanded') && !isMobile && "border-r border-slate-700/50")}>
//               <EditorArea
//                 activeFile={activeFile}
//                 handleEditorChange={handleEditorChange}
//                 handleEditorDidMount={handleEditorDidMount}
//                 isHost={isHost}
//                 showNewFileModal={() => setShowNewFileModal(true)}
//                 fileCreationLoading={fileCreationLoading}
//                 showOutput={false}
//                 setShowOutput={() => {}}
//                 isExecuting={isExecuting}
//                 executionResult={executionResult}
//                 socket={socket}
//                 connected={connected}
//                 sessionId={sessionId}
//                 user={user}
//                 cursors={cursors}
//                 setCursors={setCursors}
//                 getUserColor={getUserColor}
//                 fileLocks={{}}
//                 lockRequests={{}}
//               />
//             </div>

//             {/* Preview Panel */}
//             {layout.preview === 'expanded' && (
//               <>
//                 <div className="w-1 bg-slate-700/50 hover:bg-purple-500/50 cursor-col-resize transition-all duration-200 relative group" onMouseDown={outputPanel.startResize}>
//                   <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-purple-500/10" />
//                 </div>
//                 <div className="flex-shrink-0 transition-all duration-300 ease-out" style={{ width: `${outputPanel.width}px` }}>
//                   <PreviewPanel
//                     isPreviewVisible={true}
//                     setIsPreviewVisible={() => togglePanel('preview')}
//                     generatePreview={generatePreview}
//                     session={session}
//                     activeFile={activeFile}
//                     files={files}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Output Panel */}
//             {layout.output === 'expanded' && (
//               <>
//                 <div className="w-1 bg-slate-700/50 hover:bg-orange-500/50 cursor-col-resize transition-all duration-200 relative group" onMouseDown={outputPanel.startResize}>
//                   <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-orange-500/10" />
//                 </div>
//                 <div className="flex-shrink-0 transition-all duration-300 ease-out bg-slate-900/95 border-l border-slate-700/50 backdrop-blur-xl" style={{ width: `${outputPanel.width}px` }}>
//                   <div className="h-full flex flex-col">
//                     <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
//                             <Terminal className="h-4 w-4 text-orange-400" />
//                           </div>
//                           <div>
//                             <h3 className="text-sm font-semibold text-slate-100">Code Output</h3>
//                             <p className="text-xs text-slate-400">{activeFile ? `${activeFile.language} execution` : 'No active file'}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Button size="sm" variant="outline" onClick={executeCode} disabled={isExecuting || !activeFile} className="hover:bg-orange-500/10 hover:text-orange-400 border-slate-700/50 transition-all duration-200" title="Re-run code">
//                             {isExecuting ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
//                           </Button>
                          
//                           <Button size="sm" variant="ghost" onClick={() => togglePanel('output')} className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200" title="Close Output">
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 p-4 overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
//                       {isExecuting ? (
//                         <div className="flex items-center justify-center h-full min-h-[200px]">
//                           <div className="text-center space-y-4">
//                             <div className="p-4 bg-orange-500/10 rounded-full w-fit mx-auto">
//                               <Loader2 className="h-12 w-12 animate-spin text-orange-400" />
//                             </div>
//                             <div>
//                               <p className="font-semibold text-slate-100">Executing Code</p>
//                               <p className="text-sm text-slate-400">Running {activeFile?.language} code...</p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : executionResult ? (
//                         <div className="space-y-4">
//                           <div className={cn("px-4 py-3 rounded-xl text-sm border backdrop-blur-sm", executionResult.error ? "bg-red-500/10 text-red-400 border-red-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30")}>
//                             <div className="flex items-center gap-3">
//                               {executionResult.error ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 flex-shrink-0" />}
//                               <div className="flex-1">
//                                 <div className="font-semibold">{executionResult.error ? "Execution Failed" : "Execution Successful"}</div>
//                                 <div className="text-xs opacity-80 mt-1">Completed in {executionResult.executionTime}ms</div>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                               <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
//                                 <Zap className="h-4 w-4" />
//                                 {executionResult.error ? "Error Details:" : "Program Output:"}
//                               </h4>
//                               <Button size="sm" variant="outline" onClick={() => {
//                                 const content = executionResult.error || executionResult.output || '';
//                                 navigator.clipboard.writeText(content);
//                               }} className="h-7 px-3 text-xs hover:bg-slate-700/50 border-slate-700/50 transition-all duration-200">
//                                 <Copy className="h-3 w-3 mr-1" />Copy
//                               </Button>
//                             </div>
                            
//                             <pre className={cn("text-sm whitespace-pre-wrap font-mono p-4 rounded-xl border overflow-auto max-h-96 backdrop-blur-sm", executionResult.error ? "bg-red-500/5 border-red-500/20 text-red-300" : "bg-slate-800/50 border-slate-700/30 text-slate-200")}>
//                               {executionResult.error || executionResult.output || 'No output generated'}
//                             </pre>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center h-full min-h-[200px] text-center">
//                           <div className="space-y-6">
//                             <div className="p-6 bg-orange-500/5 rounded-full w-fit mx-auto">
//                               <Terminal className="h-16 w-16 text-orange-400/50" />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-slate-100 mb-2 text-lg">Ready to Execute</h3>
//                               <p className="text-sm text-slate-400 mb-6 max-w-xs">Click the "Run Code" button or press Ctrl+E to execute your code</p>
//                               {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//                                 <Button onClick={executeCode} disabled={isExecuting} className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/25">
//                                   <Play className="h-4 w-4 mr-2" />Run Code
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile floating buttons */}
//       {isMobile && (
//         <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-40">
//           <Button onClick={() => setSidebarMode(layout.sidebar === 'participants' ? 'hidden' : 'participants')} className={cn("rounded-full shadow-xl backdrop-blur-xl transition-all duration-300 border-0", layout.sidebar === 'participants' ? "bg-blue-600 text-white shadow-blue-600/40" : "bg-slate-800/90 border border-slate-700/50 text-slate-300 hover:bg-slate-700/90")}>
//             <Users className="h-4 w-4 mr-2" />People
//             {participantCount > 1 && (
//               <Badge className="ml-2 bg-blue-500 text-white text-xs border-0 shadow-lg shadow-blue-500/25">{participantCount}</Badge>
//             )}
//           </Button>

//           <Button onClick={() => setSidebarMode(layout.sidebar === 'chat' ? 'hidden' : 'chat')} className={cn("rounded-full shadow-xl backdrop-blur-xl transition-all duration-300 border-0", layout.sidebar === 'chat' ? "bg-blue-600 text-white shadow-blue-600/40" : "bg-slate-800/90 border border-slate-700/50 text-slate-300 hover:bg-slate-700/90")}>
//             <MessageSquare className="h-4 w-4 mr-2" />Chat
//             {messages.length > 0 && layout.sidebar !== 'chat' && (
//               <Badge className="ml-2 bg-blue-500 text-white text-xs border-0 shadow-lg shadow-blue-500/25">{messages.length}</Badge>
//             )}
//           </Button>
          
//           {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//             <Button onClick={executeCode} disabled={isExecuting} className="rounded-full bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/40 backdrop-blur-xl border-0">
//               {isExecuting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}Run
//             </Button>
//           )}
//         </div>
//       )}

//       {/* Status bar */}
//       <div className="bg-slate-900/95 border-t border-slate-700/50 px-4 py-2 flex items-center justify-between text-xs text-slate-400 backdrop-blur-xl">
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <Badge variant="outline" className="text-xs border-slate-700/50 bg-slate-800/50">
//               {activeFile ? languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language : 'No file'}
//             </Badge>
//             {activeFile && <span className="text-slate-500">{activeFile.content.split('\n').length} lines</span>}
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <div className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-red-400")} />
//             <span>{participantCount} online</span>
//           </div>
          
//           <div className="flex items-center space-x-1">
//             <FileText className="h-3 w-3" />
//             <span>{files.length} files</span>
//           </div>

//           <Badge className={cn("text-xs border-0 shadow-sm", syncStatus === 'synced' && "bg-emerald-500/10 text-emerald-400", syncStatus === 'syncing' && "bg-blue-500/10 text-blue-400", syncStatus === 'error' && "bg-red-500/10 text-red-400", syncStatus === 'offline' && "bg-slate-700 text-slate-400")}>
//             {syncStatus === 'syncing' && <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />}
//             {syncStatus === 'synced' && <CheckCircle className="h-2.5 w-2.5 mr-1" />}
//             {syncStatus === 'error' && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
//             {syncStatus === 'offline' && <WifiOff className="h-2.5 w-2.5 mr-1" />}
//             {syncStatus}
//           </Badge>
//         </div>
//       </div>

//       {/* Modals */}
//       {showNewFileModal && (
//         <NewFileModal
//           newFileName={newFileName}
//           setNewFileName={setNewFileName}
//           newFileLanguage={newFileLanguage}
//           setNewFileLanguage={setNewFileLanguage}
//           fileCreationLoading={fileCreationLoading}
//           createNewFile={createNewFile}
//           files={files}
//           closeModal={() => setShowNewFileModal(false)}
//         />
//       )}

//       {showInviteModal && (
//         <InviteModal
//           sessionId={sessionId as string}
//           sessionTitle={session?.title}
//           isPublic={session?.type === 'PUBLIC'}
//           closeModal={() => setShowInviteModal(false)}
//         />
//       )}

//       {showEndSessionModal && (
//         <EndSessionModal
//           endSessionLoading={endSessionLoading}
//           handleEndSession={handleEndSession}
//           closeModal={() => setShowEndSessionModal(false)}
//           sessionTitle={session?.title}
//           participantCount={participantCount}
//           fileCount={files.length}
//         />
//       )}

//       {showSessionEndedModal && (
//         <SessionEndedModal
//           sessionEndedReason={sessionEndedReason}
//           goToDashboard={() => router.push('/dashboard')}
//         />
//       )}
//     </div>
//   );
// }


'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/hooks/useSocket';
import JSZip from 'jszip';
import { 
  Users, MessageSquare, Download, Share2, Save, Play, 
  Plus, X, FileText, Terminal, UserPlus, Crown, Send, RefreshCw, 
  CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Copy, Eye, 
  EyeOff, MoreVertical, UserMinus, File, Code2, Settings, 
  StopCircle, Loader2, Menu, Maximize2, Minimize2, Globe, 
  Lock, Hash, UserCheck, Sparkles, Layout, ArrowLeft,
  Zap, Grid3X3, PanelLeft, PanelRight, MessageCircle 
} from 'lucide-react';

import SessionHeader from './components/SessionHeader';
import FileTabs from './components/FileTabs';
import EditorArea from './components/EditorArea';
import PreviewPanel from './components/PreviewPanel';
import NewFileModal from './components/NewFileModal';
import InviteModal from './components/InviteModal';
import EndSessionModal from './components/EndSessionModal';
import SessionEndedModal from './components/SessionEndedModal';
import Sidebar from './components/Sidebar';
import { languageConfigs } from './utils/languageConfigs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

// Keep all your existing interfaces...
interface Participant {
  id: string;
  user: {
    id: string;
    displayName: string;
    email: string;
  };
  role: 'HOST' | 'COLLABORATOR';
  isActive: boolean;
  joinedAt: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
  };
}

interface OnlineUser {
  userId: string;
  userEmail: string;
  displayName: string;
  socketId: string;
  joinedAt: Date;
  isOnline: boolean;
}

interface CursorPosition {
  userId: string;
  userName: string;
  fileId: string;
  position: { lineNumber: number; column: number };
  selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number };
  color: string;
  timestamp: number;
  isActive: boolean;
  lastActivity: number;
}

interface FileData {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  language: string;
}

interface SessionData {
  id: string;
  title: string;
  description?: string;
  type: 'PUBLIC' | 'PRIVATE';
  isActive: boolean;
  files: FileData[];
  participants: Participant[];
  messages: Message[];
  owner: {
    id: string;
    displayName: string;
    email: string;
  };
  _count: {
    participants: number;
    files: number;
  };
  createdAt: string;
}

type SidebarMode = 'hidden' | 'participants' | 'chat';
type PanelState = 'hidden' | 'expanded';

interface LayoutState {
  sidebar: SidebarMode;
  preview: PanelState;
  output: PanelState;
}

// Enhanced Layout Manager with Terminal Support
const useLayoutManager = () => {
  const [layout, setLayout] = useState<LayoutState>({
    sidebar: 'hidden',
    preview: 'hidden',
    output: 'hidden',
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      
      setIsMobile(mobile);
      
      if (mobile) {
        setLayout(prev => ({
          ...prev,
          sidebar: 'hidden',
          preview: 'hidden',
          output: 'hidden'
        }));
      }
    };
    
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  const setSidebarMode = useCallback((mode: SidebarMode) => {
    setLayout(prev => ({ ...prev, sidebar: mode }));
  }, []);

  const togglePanel = useCallback((panel: 'preview' | 'output') => {
    setLayout(prev => ({
      ...prev,
      [panel]: prev[panel] === 'hidden' ? 'expanded' : 'hidden'
    }));
  }, []);

  const toggleTerminal = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      output: prev.output === 'hidden' ? 'expanded' : 'hidden'
    }));
  }, []);

  return {
    layout,
    isMobile,
    setSidebarMode,
    togglePanel,
    toggleTerminal,
    setLayout
  };
};

// Enhanced Panel Manager with Terminal Height
const usePanelManager = () => {
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [outputWidth, setOutputWidth] = useState(450);
  const [terminalHeight, setTerminalHeight] = useState(200);
  
  const sidebarPanel = {
    width: sidebarWidth,
    startResize: (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = sidebarWidth;
      
      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(280, Math.min(600, startWidth + (e.clientX - startX)));
        setSidebarWidth(newWidth);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const outputPanel = {
    width: outputWidth,
    startResize: (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = outputWidth;
      
      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(350, Math.min(800, startWidth - (e.clientX - startX)));
        setOutputWidth(newWidth);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const terminalPanel = {
    height: terminalHeight,
    startResize: (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = terminalHeight;
      
      const handleMouseMove = (e: MouseEvent) => {
        const newHeight = Math.max(100, Math.min(400, startHeight - (e.clientY - startY)));
        setTerminalHeight(newHeight);
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  return { sidebarPanel, outputPanel, terminalPanel };
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, connected, connecting } = useSocket();
  
  const { layout, isMobile, setSidebarMode, togglePanel, toggleTerminal } = useLayoutManager();
  const { sidebarPanel, outputPanel, terminalPanel } = usePanelManager();
  
  // All your existing state variables
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionId] = useState(params.id as string);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
  
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');
  const [fileCreationLoading, setFileCreationLoading] = useState(false);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const [sessionEndedReason, setSessionEndedReason] = useState('');
  const [endSessionLoading, setEndSessionLoading] = useState(false);
  
  // All your existing refs
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
  const messageIdRef = useRef<Set<string>>(new Set());
  const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
  const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const cursorElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  
  // Derived state
  const isHost = session?.owner?.id === user?.id;
  const activeFile = files.find(file => file.id === activeFileId);

  const userColors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#F43F5E'];
  
  const getUserColor = useCallback((userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return userColors[Math.abs(hash) % userColors.length];
  }, []);

  // Keep ALL your existing functions but I'm showing the key ones here for brevity:

  const fetchSessionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
        
        if (data.session.files) {
          setFiles(data.session.files);
          if (!activeFileId && data.session.files.length > 0) {
            setActiveFileId(data.session.files[0].id);
          }
        }
        
        setParticipantCount(data.session._count?.participants || 1);
        
        if (data.session.messages && Array.isArray(data.session.messages)) {
          messageIdRef.current.clear();
          const loadedMessages = data.session.messages.map((msg: Message) => {
            messageIdRef.current.add(msg.id);
            return msg;
          });
          setMessages(loadedMessages);
        } else {
          setMessages([]);
        }
        
        data.session.files?.forEach((file: FileData) => {
          lastCodeChangeRef.current[file.id] = file.content;
        });
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, activeFileId]);

  // Socket handlers
  useEffect(() => {
    if (!socket || !connected || !sessionId || !user?.id) {
      if (socket && !connected) setSyncStatus('offline');
      return;
    }

    socket.emit('join-session', sessionId);

    socket.on('session-joined', (data) => {
      setSessionJoined(true);
      setParticipantCount(data.participantCount || 1);
      setSyncStatus('synced');
      fetchSessionData();
    });

    // Add all your other socket handlers here...

    return () => {
      socket.off('session-joined');
      // Add other socket.off calls
    };
  }, [socket, connected, sessionId, user?.id, fetchSessionData]);

  const handleExecuteCode = useCallback(async () => {
    if (!activeFile || isExecuting) return;

    setIsExecuting(true);
    setExecutionResult(null);
    toggleTerminal(); // Auto-open terminal when executing
    
    try {
      const startTime = performance.now();
      
      let codeToExecute = activeFile.content;
      if (editorRef.current) {
        codeToExecute = editorRef.current.getValue();
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: codeToExecute,
          language: activeFile.language,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const executionTime = Math.round(performance.now() - startTime);

      setExecutionResult({
        output: result.output || '',
        error: result.error || '',
        executionTime,
        language: activeFile.language
      });

    } catch (error) {
      setExecutionResult({
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: 0,
        language: activeFile.language
      });
    } finally {
      setIsExecuting(false);
    }
  }, [activeFile, isExecuting, sessionId, toggleTerminal]);

  const handleNewFileClick = useCallback(() => {
    if (isHost && !fileCreationLoading) {
      setShowNewFileModal(true);
    }
  }, [isHost, fileCreationLoading]);

  const handleCreateFile = useCallback(async () => {
    if (!newFileName.trim() || !socket || !connected || fileCreationLoading) return;
    
    if (files.some(f => f.name.toLowerCase() === newFileName.toLowerCase())) {
      alert('A file with this name already exists!');
      return;
    }
    
    setFileCreationLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const config = languageConfigs[newFileLanguage as keyof typeof languageConfigs];
      
      const response = await fetch('/api/sessions/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          name: newFileName.trim(),
          language: newFileLanguage,
          content: config?.defaultContent || `// New ${newFileLanguage} file\nconsole.log('Hello World!');`
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const newFile = data.file;
        
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        
        setNewFileName('');
        setNewFileLanguage('javascript');
        setShowNewFileModal(false);
        
        socket?.emit('file-created', { sessionId, file: newFile });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create file');
      }
    } catch (error) {
      console.error('Failed to create file:', error);
      alert('Failed to create file. Please try again.');
    } finally {
      setFileCreationLoading(false);
    }
  }, [newFileName, socket, connected, files, newFileLanguage, sessionId, fileCreationLoading]);

  // Add all your other functions (copySessionLink, saveAllFiles, etc.)
  const copySessionLink = useCallback(() => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link);
  }, [sessionId]);

  const saveAllFiles = useCallback(async () => {
    try {
      if (activeFileId && editorRef.current) {
        const currentContent = editorRef.current.getValue();
        const updatedFiles = files.map(file => 
          file.id === activeFileId ? { ...file, content: currentContent } : file
        );
        
        const token = localStorage.getItem('accessToken');
        await fetch(`/api/sessions/${sessionId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ files: updatedFiles })
        });
      }
    } catch (error) {
      console.error('Failed to save files:', error);
    }
  }, [activeFileId, files, sessionId]);

  const exportSession = useCallback(async () => {
    if (!session) return;
    // Your export logic here
  }, [session, files, activeFileId]);

  const generatePreview = useCallback(() => {
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile = files.find(f => f.language === 'css');
    const jsFile = files.find(f => f.language === 'javascript');
    
    const getFileContent = (file: FileData) => {
      if (file.id === activeFileId && editorRef.current) {
        return editorRef.current.getValue();
      }
      return file.content;
    };
    
    const htmlContent = htmlFile ? getFileContent(htmlFile) : '';
    const cssContent = cssFile ? getFileContent(cssFile) : '';
    const jsContent = jsFile ? getFileContent(jsFile) : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - ${session?.title || 'CollabIDE'}</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent.replace(/<html.*?>|<\/html>|<head.*?>[\s\S]*?<\/head>|<body.*?>|<\/body>|<!DOCTYPE.*?>/gi, '') || '<h1>No HTML file found</h1>'}
    <script>
        try {
            ${jsContent}
        } catch (error) {
            console.error('JavaScript Error:', error);
        }
    </script>
</body>
</html>`;
  }, [files, activeFileId, session?.title]);

  const deleteFile = useCallback(async (fileId: string) => {
    if (!isHost) return;
    
    if (files.length === 1) {
      alert('Cannot delete the last file in the session');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        
        if (fileId === activeFileId) {
          const remainingFiles = files.filter(f => f.id !== fileId);
          if (remainingFiles.length > 0) {
            setActiveFileId(remainingFiles[0].id);
          }
        }
        
        socket?.emit('file-deleted', { sessionId, fileId });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }, [isHost, files, activeFileId, sessionId, socket]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socket || !connected || isSendingMessage) return;

    setIsSendingMessage(true);
    setChatError('');

    socket.emit('chat-message', {
      content: newMessage.trim(),
      sessionId,
      timestamp: Date.now()
    });

    setNewMessage('');
    
    setTimeout(() => {
      setIsSendingMessage(false);
    }, 5000);
  }, [newMessage, socket, connected, sessionId, isSendingMessage]);

  const handleChatKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const removeParticipant = useCallback((participantId: string) => {
    if (!isHost || !socket || !connected) return;
    
    socket.emit('remove-participant', {
      sessionId,
      participantId
    });
    
    setShowParticipantMenu(null);
  }, [isHost, socket, connected, sessionId]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value || !socket || !connected || !activeFileId) return;
    
    if (isRemoteUpdateRef.current[activeFileId]) return;
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content: value } : file
    ));
    
    if (lastCodeChangeRef.current[activeFileId] !== value) {
      lastCodeChangeRef.current[activeFileId] = value;
      setSyncStatus('syncing');
      
      if (syncTimeoutRef.current[activeFileId]) {
        clearTimeout(syncTimeoutRef.current[activeFileId]);
      }
      
      syncTimeoutRef.current[activeFileId] = setTimeout(() => {
        if (socket && connected && lastCodeChangeRef.current[activeFileId] === value) {
          socket.emit('file-update', {
            fileId: activeFileId,
            content: value,
            sessionId,
            timestamp: Date.now()
          });
          setSyncStatus('synced');
        }
      }, 200);
    }
  }, [socket, connected, sessionId, activeFileId]);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    editor.updateOptions({
      fontSize: isMobile ? 13 : 15,
      fontFamily: 'var(--font-mono)',
      lineHeight: 1.6,
      minimap: { enabled: !isMobile },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      theme: 'vs-dark',
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'smooth',
      lineNumbers: isMobile ? 'off' : 'on',
      glyphMargin: !isMobile,
      folding: !isMobile,
      readOnly: false,
      renderValidationDecorations: 'on',
    });

    if (activeFile) {
      editor.setValue(activeFile.content);
    }

    setTimeout(() => {
      editor.focus();
    }, 100);
  }, [activeFile, isMobile]);

  const handleEndSession = useCallback(async () => {
    if (!isHost || !session) return;

    setEndSessionLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: 'Session ended by host'
        })
      });

      if (response.ok) {
        socket?.emit('end-session-broadcast', { 
          sessionId,
          reason: 'Session ended by host',
          hostName: user?.displayName || 'Host'
        });
        
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setEndSessionLoading(false);
      setShowEndSessionModal(false);
    }
  }, [isHost, session, sessionId, socket, user, router]);

  // Clean and Professional Actions Bar with Better Spacing
  const QuickActionsBar = () => (
    <div 
      className="h-12 px-6 flex items-center justify-between font-sans border-b"
      style={{ 
        backgroundColor: 'var(--background)', 
        borderColor: 'var(--border)',
        color: 'var(--foreground)'
      }}
    >
      {/* Left Section - View Controls */}
      <div className="flex items-center gap-6">
        {/* Sidebar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarMode(layout.sidebar === 'participants' ? 'hidden' : 'participants')}
            className={cn(
              "h-8 px-4 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200",
              layout.sidebar === 'participants'
                ? "text-white shadow-sm"
                : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            )}
            style={{
              backgroundColor: layout.sidebar === 'participants' ? 'var(--primary)' : 'transparent',
              color: layout.sidebar === 'participants' ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
            }}
          >
            <Users className="h-4 w-4" />
            <span>People</span>
            {participantCount > 1 && (
              <Badge 
                className="text-[10px] h-4 min-w-[16px] px-1.5 border-0 ml-1"
                style={{ backgroundColor: 'var(--chart-1)', color: 'white' }}
              >
                {participantCount}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setSidebarMode(layout.sidebar === 'chat' ? 'hidden' : 'chat')}
            className={cn(
              "h-8 px-4 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 relative",
              layout.sidebar === 'chat'
                ? "text-white shadow-sm"
                : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            )}
            style={{
              backgroundColor: layout.sidebar === 'chat' ? 'var(--primary)' : 'transparent',
              color: layout.sidebar === 'chat' ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
            {messages.length > 0 && layout.sidebar !== 'chat' && (
              <div 
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: 'var(--chart-2)' }}
              />
            )}
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6" style={{ backgroundColor: 'var(--border)' }} />

        {/* Panel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => togglePanel('preview')}
            className={cn(
              "h-8 px-4 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200",
              layout.preview === 'expanded'
                ? "text-white shadow-sm"
                : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            )}
            style={{
              backgroundColor: layout.preview === 'expanded' ? 'var(--primary)' : 'transparent',
              color: layout.preview === 'expanded' ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
            }}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={toggleTerminal}
            className={cn(
              "h-8 px-4 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200",
              layout.output === 'expanded'
                ? "text-white shadow-sm"
                : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
            )}
            style={{
              backgroundColor: layout.output === 'expanded' ? 'var(--primary)' : 'transparent',
              color: layout.output === 'expanded' ? 'var(--primary-foreground)' : 'var(--muted-foreground)'
            }}
          >
            <Terminal className="h-4 w-4" />
            <span>Terminal</span>
          </button>
        </div>
      </div>

      {/* Right Section - Action Buttons */}
      <div className="flex items-center gap-3">
        {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
          <Button
            onClick={handleExecuteCode}
            disabled={isExecuting}
            className="h-8 px-5 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 border-0 shadow-sm"
            style={{
              backgroundColor: isExecuting ? 'var(--muted)' : 'var(--primary)',
              color: isExecuting ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
              cursor: isExecuting ? 'not-allowed' : 'pointer'
            }}
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>Run Code</span>
          </Button>
        )}

        {isHost && (
          <Button
            onClick={handleNewFileClick}
            disabled={fileCreationLoading}
            className="h-8 px-5 text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-200 border-0 shadow-sm"
            style={{ 
              backgroundColor: fileCreationLoading ? 'var(--muted)' : 'var(--secondary)', 
              color: fileCreationLoading ? 'var(--muted-foreground)' : 'var(--secondary-foreground)',
              cursor: fileCreationLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {fileCreationLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>New File</span>
          </Button>
        )}
      </div>
    </div>
  );

  // Clean Terminal Component using CSS Variables
  const TerminalOutput = () => (
    <div 
      className="border-t flex flex-col font-mono"
      style={{ 
        height: `${terminalPanel.height}px`,
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Resize Handle */}
      <div 
        className="h-1 cursor-row-resize transition-all relative group"
        style={{ backgroundColor: 'var(--border)' }}
        onMouseDown={terminalPanel.startResize}
      >
        <div className="absolute inset-0 group-hover:bg-[var(--accent)]" />
      </div>

      {/* Terminal Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ 
          backgroundColor: 'var(--card)', 
          borderColor: 'var(--border)',
          color: 'var(--card-foreground)'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--destructive)' }}
          >
            <Terminal className="h-4 w-4" style={{ color: 'var(--destructive-foreground)' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sans" style={{ color: 'var(--foreground)' }}>Terminal</h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {activeFile ? `${activeFile.language} execution` : 'Code output'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {executionResult && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigator.clipboard.writeText(executionResult.error || executionResult.output || '')}
              className="h-7 px-3 text-xs border font-sans"
              style={{ 
                borderColor: 'var(--border)', 
                backgroundColor: 'transparent',
                color: 'var(--foreground)'
              }}
            >
              <Copy className="h-3 w-3 mr-1.5" />
              Copy
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTerminal}
            className="h-7 w-7 p-0 hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)]"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        className="h-full overflow-auto p-4"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="font-mono text-sm">
          {isExecuting ? (
            <div className="flex items-center gap-3" style={{ color: 'var(--chart-1)' }}>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Executing {activeFile?.language} code...</span>
            </div>
          ) : executionResult ? (
            <div className="space-y-4">
              <div className={cn(
                "flex items-center gap-2 text-sm font-semibold"
              )}
              style={{ 
                color: executionResult.error ? 'var(--destructive)' : 'var(--chart-4)' 
              }}>
                {executionResult.error ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>
                  {executionResult.error ? "Execution Failed" : "Execution Successful"}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  ({executionResult.executionTime}ms)
                </span>
              </div>
              
              <pre 
                className="whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-lg border"
                style={{ 
                  color: executionResult.error ? 'var(--destructive)' : 'var(--chart-4)',
                  backgroundColor: executionResult.error ? 'var(--destructive)' + '10' : 'var(--muted)',
                  borderColor: 'var(--border)'
                }}
              >
                {executionResult.error || executionResult.output || 'No output generated'}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40" style={{ color: 'var(--muted-foreground)' }}>
              <div className="text-center">
                <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No output yet. Run your code to see results.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Keep all your existing loading states but use CSS variables
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Card className="p-8 max-w-md mx-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-center space-y-6">
            <div className="p-4 rounded-full w-fit mx-auto" style={{ backgroundColor: 'var(--primary)' + '20' }}>
              <Lock className="h-16 w-16" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 font-sans" style={{ color: 'var(--foreground)' }}>Authentication Required</h2>
              <p className="mb-4 font-sans" style={{ color: 'var(--muted-foreground)' }}>Please log in to access this collaboration session.</p>
              <Button 
                onClick={() => router.push('/auth/login')} 
                className="font-sans border-0"
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Sign In
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (loading || connecting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Card className="p-8 max-w-md mx-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-center space-y-6">
            <div className="p-4 rounded-full w-fit mx-auto" style={{ backgroundColor: 'var(--primary)' + '20' }}>
              <Loader2 className="h-16 w-16 animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 font-sans" style={{ color: 'var(--foreground)' }}>Joining Session</h2>
              <p className="font-sans" style={{ color: 'var(--muted-foreground)' }}>
                {loading ? 'Loading session data...' : 'Establishing connection...'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Card className="p-8 max-w-md mx-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-center space-y-6">
            <div className="p-4 rounded-full w-fit mx-auto" style={{ backgroundColor: 'var(--destructive)' + '20' }}>
              <WifiOff className="h-16 w-16" style={{ color: 'var(--destructive)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 font-sans" style={{ color: 'var(--destructive)' }}>Connection Failed</h2>
              <p className="mb-6 font-sans" style={{ color: 'var(--muted-foreground)' }}>Unable to connect to the collaboration server.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="flex-1 font-sans border-0"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')} 
                  className="flex-1 font-sans"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!sessionJoined || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Card className="p-8 max-w-md mx-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="text-center space-y-6">
            <div className="p-4 rounded-full w-fit mx-auto" style={{ backgroundColor: 'var(--chart-4)' + '20' }}>
              <Loader2 className="h-16 w-16 animate-spin" style={{ color: 'var(--chart-4)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2 font-sans" style={{ color: 'var(--foreground)' }}>Joining Session</h2>
              <p className="font-sans" style={{ color: 'var(--muted-foreground)' }}>Setting up your collaborative workspace...</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <SessionHeader 
        session={session}
        isHost={isHost}
        connected={connected}
        syncStatus={syncStatus}
        participantCount={participantCount}
        copySessionLink={copySessionLink}
        saveAllFiles={saveAllFiles}
        exportSession={exportSession}
        isPreviewVisible={layout.preview === 'expanded'}
        togglePreview={() => togglePanel('preview')}
        showInviteModal={() => setShowInviteModal(true)}
        showEndSessionModal={() => setShowEndSessionModal(true)}
        endSessionLoading={endSessionLoading}
      />

      <QuickActionsBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          {layout.sidebar !== 'hidden' && (
            <>
              <div className="flex-shrink-0 transition-all duration-300 ease-out" style={{ width: `${sidebarPanel.width}px` }}>
                <Sidebar
                  mode={layout.sidebar}
                  user={user}
                  session={session}
                  isHost={isHost}
                  onlineUsers={onlineUsers}
                  participantCount={participantCount}
                  getUserColor={getUserColor}
                  showParticipantMenu={showParticipantMenu}
                  setShowParticipantMenu={setShowParticipantMenu}
                  removeParticipant={removeParticipant}
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  chatError={chatError}
                  connected={connected}
                  isSendingMessage={isSendingMessage}
                  sendMessage={sendMessage}
                  handleChatKeyPress={handleChatKeyPress}
                  messagesEndRef={messagesEndRef}
                  isMobile={isMobile}
                  onInviteUsers={() => setShowInviteModal(true)}
                  onClose={() => setSidebarMode('hidden')}
                  className="h-full"
                  style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
                />
              </div>
              <div 
                className="w-1 cursor-col-resize transition-all duration-200 relative group" 
                style={{ backgroundColor: 'var(--border)' }}
                onMouseDown={sidebarPanel.startResize}
              >
                <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-[var(--accent)]" />
              </div>
            </>
          )}

          <div className="flex-1 flex flex-col min-w-0">
            <FileTabs
              files={files}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              isHost={isHost}
              showNewFileModal={() => setShowNewFileModal(true)}
              fileCreationLoading={fileCreationLoading}
              deleteFile={deleteFile}
              executeCode={handleExecuteCode}
              isExecuting={isExecuting}
              activeFile={activeFile}
            />

            <div className="flex-1 flex overflow-hidden">
              <div className={cn("flex-1 min-w-0", layout.preview === 'expanded' && !isMobile && "border-r")} style={{ borderColor: 'var(--border)' }}>
                <EditorArea
                  activeFile={activeFile}
                  handleEditorChange={handleEditorChange}
                  handleEditorDidMount={handleEditorDidMount}
                  isHost={isHost}
                  showNewFileModal={() => setShowNewFileModal(true)}
                  fileCreationLoading={fileCreationLoading}
                  showOutput={false}
                  setShowOutput={() => {}}
                  isExecuting={isExecuting}
                  executionResult={executionResult}
                  socket={socket}
                  connected={connected}
                  sessionId={sessionId}
                  user={user}
                  cursors={cursors}
                  setCursors={setCursors}
                  getUserColor={getUserColor}
                  fileLocks={{}}
                  lockRequests={{}}
                />
              </div>

              {/* Preview Panel */}
              {layout.preview === 'expanded' && (
                <>
                  <div 
                    className="w-1 cursor-col-resize transition-all duration-200" 
                    style={{ backgroundColor: 'var(--border)' }}
                    onMouseDown={outputPanel.startResize} 
                  />
                  <div className="flex-shrink-0 transition-all duration-300 ease-out" style={{ width: `${outputPanel.width}px` }}>
                    <PreviewPanel
                      isPreviewVisible={true}
                      setIsPreviewVisible={() => togglePanel('preview')}
                      generatePreview={generatePreview}
                      session={session}
                      activeFile={activeFile}
                      files={files}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Terminal Output Panel - VSCode Style with CSS Variables */}
        {layout.output === 'expanded' && <TerminalOutput />}
      </div>

      {/* Keep all your existing modals */}
      {showNewFileModal && (
        <NewFileModal
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileLanguage={newFileLanguage}
          setNewFileLanguage={setNewFileLanguage}
          fileCreationLoading={fileCreationLoading}
          createNewFile={handleCreateFile}
          files={files}
          closeModal={() => setShowNewFileModal(false)}
        />
      )}

      {showInviteModal && (
        <InviteModal
          sessionId={sessionId as string}
          sessionTitle={session?.title}
          isPublic={session?.type === 'PUBLIC'}
          closeModal={() => setShowInviteModal(false)}
        />
      )}

      {showEndSessionModal && (
        <EndSessionModal
          endSessionLoading={endSessionLoading}
          handleEndSession={handleEndSession}
          closeModal={() => setShowEndSessionModal(false)}
          sessionTitle={session?.title}
          participantCount={participantCount}
          fileCount={files.length}
        />
      )}

      {showSessionEndedModal && (
        <SessionEndedModal
          sessionEndedReason={sessionEndedReason}
          goToDashboard={() => router.push('/dashboard')}
        />
      )}
    </div>
  );
}
