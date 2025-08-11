// 'use client'

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/auth-context';
// import { useSocket } from '@/hooks/useSocket';
// import JSZip from 'jszip';
// import { 
//   Users, MessageSquare, Download, Share2, ArrowLeft, Save, Play, 
//   Plus, X, FileText, Terminal, UserPlus, Crown, Send, RefreshCw, 
//   CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Copy, Eye, 
//   EyeOff, MoreVertical, UserMinus, Mail, File, Code2, Settings, 
//   StopCircle, LogOut, Trash2, Loader2, XCircle, Menu, Maximize2,
//   Minimize2, PanelRight, PanelLeft, Grid3X3, Layout, Zap,
//   Globe, Lock, Hash, UserCheck, MessageCircle, Sparkles
// } from 'lucide-react';

// // Components
// import SessionHeader from './components/SessionHeader';
// import FileTabs from './components/FileTabs';
// import EditorArea from './components/EditorArea';
// import PreviewPanel from './components/PreviewPanel';
// import Sidebar from './components/Sidebar';
// import NewFileModal from './components/NewFileModal';
// import InviteModal from './components/InviteModal';
// import EndSessionModal from './components/EndSessionModal';
// import SessionEndedModal from './components/SessionEndedModal';

// // Utils
// import { languageConfigs } from './utils/languageConfigs';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import HeroLogo from '@/components/ui/hero-logo';
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

// interface FileLock {
//   lockedBy: string;
//   lockedByUser: {
//     id: string;
//     displayName: string;
//   };
// }

// // Enhanced Layout State Management
// type LayoutMode = 'focus' | 'split' | 'preview' | 'chat' | 'output';
// type PanelState = 'hidden' | 'collapsed' | 'expanded';

// interface LayoutState {
//   mode: LayoutMode;
//   sidebar: PanelState;
//   preview: PanelState;
//   output: PanelState;
//   fullscreen: boolean;
// }

// // Improved Resizable Panel Hook
// const useResizablePanel = (
//   initialWidth: number, 
//   minWidth: number = 200, 
//   maxWidth: number = 800,
//   onResize?: (width: number) => void
// ) => {
//   const [width, setWidth] = useState(initialWidth);
//   const [isResizing, setIsResizing] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   const startResize = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     setIsResizing(true);
//     setIsDragging(true);
    
//     const startX = e.clientX;
//     const startWidth = width;

//     const handleMouseMove = (e: MouseEvent) => {
//       const diff = e.clientX - startX;
//       const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));
//       setWidth(newWidth);
//       onResize?.(newWidth);
//     };

//     const handleMouseUp = () => {
//       setIsResizing(false);
//       setIsDragging(false);
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//       document.body.style.userSelect = '';
//       document.body.style.cursor = '';
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//     document.body.style.userSelect = 'none';
//     document.body.style.cursor = 'col-resize';
//   }, [width, minWidth, maxWidth, onResize]);

//   const setWidthAnimated = useCallback((newWidth: number) => {
//     const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
//     setWidth(clampedWidth);
//     onResize?.(clampedWidth);
//   }, [minWidth, maxWidth, onResize]);

//   return { 
//     width, 
//     setWidth: setWidthAnimated, 
//     startResize, 
//     isResizing, 
//     isDragging 
//   };
// };

// // Enhanced Layout Management Hook
// const useLayoutManager = () => {
//   const [layout, setLayout] = useState<LayoutState>({
//     mode: 'focus',
//     sidebar: 'collapsed',
//     preview: 'hidden',
//     output: 'hidden',
//     fullscreen: false
//   });

//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);

//   useEffect(() => {
//     const checkLayout = () => {
//       const width = window.innerWidth;
//       const mobile = width < 768;
//       const tablet = width >= 768 && width < 1024;
      
//       setIsMobile(mobile);
//       setIsTablet(tablet);
      
//       if (mobile) {
//         setLayout(prev => ({
//           ...prev,
//           mode: 'focus',
//           sidebar: 'hidden',
//           preview: 'hidden',
//           output: 'hidden'
//         }));
//       } else if (tablet) {
//         setLayout(prev => ({
//           ...prev,
//           sidebar: prev.sidebar === 'hidden' ? 'collapsed' : prev.sidebar
//         }));
//       }
//     };
    
//     checkLayout();
//     window.addEventListener('resize', checkLayout);
//     return () => window.removeEventListener('resize', checkLayout);
//   }, []);

//   const switchMode = useCallback((mode: LayoutMode) => {
//     setLayout(prev => {
//       switch (mode) {
//         case 'focus':
//           return {
//             ...prev,
//             mode,
//             sidebar: 'collapsed',
//             preview: 'hidden',
//             output: 'hidden'
//           };
//         case 'split':
//           return {
//             ...prev,
//             mode,
//             sidebar: 'expanded',
//             preview: 'hidden',
//             output: 'hidden'
//           };
//         case 'preview':
//           return {
//             ...prev,
//             mode,
//             sidebar: 'collapsed',
//             preview: 'expanded',
//             output: 'hidden'
//           };
//         case 'chat':
//           return {
//             ...prev,
//             mode,
//             sidebar: 'expanded',
//             preview: 'hidden',
//             output: 'hidden'
//           };
//         case 'output':
//           return {
//             ...prev,
//             mode,
//             sidebar: 'collapsed',
//             preview: 'hidden',
//             output: 'expanded'
//           };
//         default:
//           return prev;
//       }
//     });
//   }, []);

//   const togglePanel = useCallback((panel: keyof Omit<LayoutState, 'mode' | 'fullscreen'>) => {
//     setLayout(prev => ({
//       ...prev,
//       [panel]: prev[panel] === 'hidden' ? 'expanded' : 'hidden'
//     }));
//   }, []);

//   const toggleFullscreen = useCallback(() => {
//     setLayout(prev => ({
//       ...prev,
//       fullscreen: !prev.fullscreen
//     }));
//   }, []);

//   return {
//     layout,
//     isMobile,
//     isTablet,
//     switchMode,
//     togglePanel,
//     toggleFullscreen,
//     setLayout
//   };
// };

// export default function SessionPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const { socket, connected, connecting } = useSocket();
  
//   // Enhanced Layout Management
//   const { 
//     layout, 
//     isMobile, 
//     isTablet, 
//     switchMode, 
//     togglePanel, 
//     toggleFullscreen 
//   } = useLayoutManager();
  
//   // Enhanced Resizable Panels
//   const sidebarPanel = useResizablePanel(320, 280, 500);
//   const previewPanel = useResizablePanel(400, 300, 700);
//   const outputPanel = useResizablePanel(350, 250, 600);
  
//   // Session state
//   const [sessionJoined, setSessionJoined] = useState(false);
//   const [sessionId] = useState(params.id as string);
//   const [session, setSession] = useState<SessionData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [participantCount, setParticipantCount] = useState(1);
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
//   const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
//   const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
//   // File and editor state
//   const [files, setFiles] = useState<FileData[]>([]);
//   const [activeFileId, setActiveFileId] = useState<string | null>(null);
//   const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
//   const [showNewFileModal, setShowNewFileModal] = useState(false);
//   const [newFileName, setNewFileName] = useState('');
//   const [newFileLanguage, setNewFileLanguage] = useState('javascript');
//   const [fileCreationLoading, setFileCreationLoading] = useState(false);
//   const [fileLocks, setFileLocks] = useState<{ [fileId: string]: FileLock | null }>({});
//   const [lockRequests, setLockRequests] = useState<{ [fileId: string]: boolean }>({});
  
//   // Code execution state
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
//   // UI state
//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [chatError, setChatError] = useState('');
//   const [isSendingMessage, setIsSendingMessage] = useState(false);
  
//   // Host controls
//   const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null);
//   const [showInviteModal, setShowInviteModal] = useState(false);
//   const [showEndSessionModal, setShowEndSessionModal] = useState(false);
//   const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
//   const [sessionEndedReason, setSessionEndedReason] = useState('');
//   const [endSessionLoading, setEndSessionLoading] = useState(false);

//   // Enhanced UI state
//   const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
//   const [activeHotkey, setActiveHotkey] = useState<string | null>(null);
  
//   // Refs for sync management and cursor tracking
//   const editorRef = useRef<any>(null);
//   const monacoRef = useRef<any>(null);
//   const decorationsRef = useRef<{ [key: string]: string[] }>({});
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
//   const chatInputRef = useRef<HTMLInputElement>(null);
//   const messageIdRef = useRef<Set<string>>(new Set());
//   const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
//   const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

//   // Check if current user is host
//   const isHost = session?.owner?.id === user?.id;

//   // Get active file
//   const activeFile = files.find(file => file.id === activeFileId);

//   // User colors for cursors
//   const userColors = [
//     '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
//     '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB74D',
//     '#81C784', '#64B5F6', '#F06292', '#A1887F'
//   ];
  
//   const getUserColor = useCallback((userId: string) => {
//     const hash = userId.split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
//     return userColors[Math.abs(hash) % userColors.length];
//   }, []);

//   // Enhanced Keyboard Shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
//         switch (e.key) {
//           case 's':
//             e.preventDefault();
//             saveAllFiles();
//             setActiveHotkey('save');
//             setTimeout(() => setActiveHotkey(null), 1000);
//             break;
//           case 'e':
//             e.preventDefault();
//             if (activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable) {
//               executeCode();
//               switchMode('output');
//             }
//             setActiveHotkey('execute');
//             setTimeout(() => setActiveHotkey(null), 1000);
//             break;
//           case 'k':
//             e.preventDefault();
//             switchMode(layout.mode === 'chat' ? 'focus' : 'chat');
//             setActiveHotkey('chat');
//             setTimeout(() => setActiveHotkey(null), 1000);
//             break;
//           case 'p':
//             e.preventDefault();
//             switchMode(layout.mode === 'preview' ? 'focus' : 'preview');
//             setActiveHotkey('preview');
//             setTimeout(() => setActiveHotkey(null), 1000);
//             break;
//           case 'n':
//             e.preventDefault();
//             if (isHost) {
//               setShowNewFileModal(true);
//               setActiveHotkey('newfile');
//               setTimeout(() => setActiveHotkey(null), 1000);
//             }
//             break;
//           case 'i':
//             e.preventDefault();
//             if (isHost) {
//               setShowInviteModal(true);
//               setActiveHotkey('invite');
//               setTimeout(() => setActiveHotkey(null), 1000);
//             }
//             break;
//           case '/':
//             e.preventDefault();
//             setShowKeyboardShortcuts(true);
//             break;
//         }
//       }
      
//       if (e.key === 'Escape') {
//         if (layout.fullscreen) {
//           toggleFullscreen();
//         } else if (layout.mode !== 'focus') {
//           switchMode('focus');
//         }
//       }
      
//       if (e.key === 'F11') {
//         e.preventDefault();
//         toggleFullscreen();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [layout, activeFile, isHost, switchMode, toggleFullscreen]);

//   // Cursor decoration functions
//   const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
//     if (!editorRef.current || !monacoRef.current) return;
    
//     const { userId, userName, position } = cursorData;
    
//     if (decorationsRef.current[userId]) {
//       editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
//     }
    
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
    
//     const newDecorations = editorRef.current.deltaDecorations([], decorations);
//     decorationsRef.current[userId] = newDecorations;
    
//     addCursorStyles(userId, userName, color);
//   }, []);

//   const updateSelectionDecorations = useCallback((selectionData: CursorPosition, color: string) => {
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
    
//     if (decorationsRef.current[`${userId}-selection`]) {
//       editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], []);
//     }
    
//     const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations);
//     decorationsRef.current[`${userId}-selection`] = newSelectionDecorations;
    
//     addSelectionStyles(userId, color);
//   }, []);

//   const addCursorStyles = (userId: string, userName: string, color: string) => {
//     const existingStyle = document.getElementById(`cursor-style-${userId}`);
//     if (existingStyle) existingStyle.remove();
    
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
//         background: linear-gradient(to bottom, ${color}, ${color}cc);
//         z-index: 1000;
//         animation: cursor-pulse-${userId} 1.5s ease-in-out infinite;
//         box-shadow: 0 0 4px ${color}80;
//         border-radius: 1px;
//       }
      
//       .cursor-label-${userId}::after {
//         content: '${userName.replace(/'/g, "\\'")}';
//         position: absolute;
//         top: -32px;
//         left: -1px;
//         background: linear-gradient(135deg, ${color}, ${color}ee);
//         color: white;
//         padding: 4px 8px;
//         border-radius: 6px;
//         font-size: 12px;
//         font-weight: 600;
//         white-space: nowrap;
//         z-index: 1001;
//         box-shadow: 0 2px 12px rgba(0,0,0,0.3);
//         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
//         max-width: 150px;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         pointer-events: none;
//         border: 1px solid ${color}cc;
//       }
      
//       @keyframes cursor-pulse-${userId} {
//         0%, 100% { opacity: 1; transform: scaleX(1); }
//         50% { opacity: 0.8; transform: scaleX(1.1); }
//       }
//     `;
//     document.head.appendChild(style);
//   };

//   const addSelectionStyles = (userId: string, color: string) => {
//     const existingStyle = document.getElementById(`selection-style-${userId}`);
//     if (existingStyle) existingStyle.remove();
    
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

//   // Scroll to bottom of messages
//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // Handle active file switching when files change
//   useEffect(() => {
//     if (files.length > 0 && !activeFileId) {
//       setActiveFileId(files[0].id);
//     } else if (files.length > 0 && activeFileId && !files.some(f => f.id === activeFileId)) {
//       setActiveFileId(files[0].id);
//     }
//   }, [files, activeFileId]);

//   // Update cursor decorations when cursors change
//   useEffect(() => {
//     if (editorRef.current && activeFile && cursors) {
//       Object.keys(decorationsRef.current).forEach(key => {
//         if (decorationsRef.current[key]) {
//           editorRef.current.deltaDecorations(decorationsRef.current[key], []);
//         }
//       });
//       decorationsRef.current = {};
      
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

//   // Fetch session data
//   const fetchSessionData = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch(`/api/sessions/${sessionId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         console.log('📄 Session data loaded:', data.session);
//         setSession(data.session);
        
//         if (data.session.files) {
//           console.log('📁 Loading files:', data.session.files.length);
//           setFiles(data.session.files);
          
//           if (!activeFileId && data.session.files.length > 0) {
//             setActiveFileId(data.session.files[0].id);
//             console.log('🎯 Set active file:', data.session.files[0].name);
//           }
//         } else if (data.session.files?.length === 0 && isHost) {
//           createDefaultFile();
//         }
        
//         setParticipantCount(data.session._count?.participants || 1);
        
//         if (data.session.messages && Array.isArray(data.session.messages)) {
//           console.log('💬 Loading messages:', data.session.messages.length);
          
//           messageIdRef.current.clear();
          
//           const loadedMessages = data.session.messages.map((msg: Message) => {
//             messageIdRef.current.add(msg.id);
//             return msg;
//           });
          
//           setMessages(loadedMessages);
//           console.log('✅ Messages loaded successfully:', loadedMessages.length);
//         } else {
//           console.log('📭 No messages found, starting with empty chat');
//           setMessages([]);
//         }
        
//         data.session.files?.forEach((file: FileData) => {
//           lastCodeChangeRef.current[file.id] = file.content;
//         });
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch session data');
//       }
//     } catch (error) {
//       console.error('❌ Error fetching session:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [sessionId, activeFileId, isHost]);

//   // Create default file if none exists
//   const createDefaultFile = useCallback(async () => {
//     if (!user || !sessionId) return;

//     try {
//       const token = localStorage.getItem('accessToken');
//       const response = await fetch('/api/sessions/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           sessionId,
//           name: 'main.js',
//           language: 'javascript',
//           content: languageConfigs.javascript.defaultContent
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const newFile = data.file;
//         setFiles([newFile]);
//         setActiveFileId(newFile.id);
//         lastCodeChangeRef.current[newFile.id] = newFile.content;
//         console.log('✅ Default file created:', newFile.name);
//       }
//     } catch (error) {
//       console.error('❌ Failed to create default file:', error);
//     }
//   }, [user, sessionId]);

//   // Socket event handlers
//   useEffect(() => {
//     if (!socket || !connected || !sessionId || !user?.id) {
//       if (socket && !connected) {
//         setConnectionStatus('Connecting to server...');
//         setSyncStatus('offline');
//       }
//       return;
//     }

//     console.log('🎯 Setting up socket listeners for session:', sessionId);
//     setConnectionStatus('Joining session...');

//     socket.emit('join-session', sessionId);

//     socket.on('session-joined', (data) => {
//       console.log('✅ Successfully joined session:', data);
//       setSessionJoined(true);
//       setParticipantCount(data.participantCount || 1);
//       setConnectionStatus('Connected');
//       setSyncStatus('synced');
//       fetchSessionData();
//     });

//     socket.on('user-joined', (data) => {
//       console.log('👤 User joined session:', data);
      
//       if (data.participantCount !== undefined) {
//         setParticipantCount(data.participantCount);
//       }
      
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
//       console.log('👋 User left session:', data);
      
//       if (data.participantCount !== undefined) {
//         setParticipantCount(data.participantCount);
//       }
      
//       setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      
//       setCursors(prev => {
//         const newCursors = { ...prev };
//         Object.keys(newCursors).forEach(key => {
//           if (key.startsWith(data.userId)) {
//             delete newCursors[key];
//           }
//         });
//         return newCursors;
//       });

//       if (editorRef.current && decorationsRef.current[data.userId]) {
//         editorRef.current.deltaDecorations(decorationsRef.current[data.userId], []);
//         delete decorationsRef.current[data.userId];
//       }

//       const cursorStyle = document.getElementById(`cursor-style-${data.userId}`);
//       const selectionStyle = document.getElementById(`selection-style-${data.userId}`);
//       if (cursorStyle) cursorStyle.remove();
//       if (selectionStyle) selectionStyle.remove();
//     });

//     socket.on('cursor-position', (data) => {
//       console.log('👁️ FRONTEND received cursor from:', data.userName, 'at:', data.position);
      
//       if (data.userId === user?.id) {
//         console.log('⏭️ Skipping own cursor');
//         return;
//       }
      
//       const cursorKey = `${data.userId}-${data.fileId}`;
//       const userColor = getUserColor(data.userId);
      
//       setCursors(prev => {
//         const updated = {
//           ...prev,
//           [cursorKey]: {
//             userId: data.userId,
//             userName: data.userName,
//             fileId: data.fileId,
//             position: data.position,
//             selection: data.selection,
//             color: userColor,
//             timestamp: data.timestamp
//           }
//         };
//         console.log('📊 Cursors updated. Count:', Object.keys(updated).length);
//         return updated;
//       });
//     });
    
//     socket.on('cursor-selection', (data) => {
//       console.log('👁️ FRONTEND received selection from:', data.userName);
      
//       if (data.userId === user?.id) return;
      
//       const cursorKey = `${data.userId}-${data.fileId}`;
//       const userColor = getUserColor(data.userId);
      
//       setCursors(prev => ({
//         ...prev,
//         [cursorKey]: {
//           ...prev[cursorKey],
//           selection: data.selection,
//           color: userColor,
//           timestamp: data.timestamp
//         }
//       }));
//     });

//     socket.on('file-update', (data) => {
//       if (data.userId === user.id) return;

//       console.log('📥 Remote file update received:', {
//         fileId: data.fileId,
//         contentLength: data.content?.length,
//         fromUser: data.userId,
//         timestamp: data.timestamp
//       });
      
//       isRemoteUpdateRef.current[data.fileId] = true;
      
//       setFiles(prev => prev.map(file => 
//         file.id === data.fileId ? { ...file, content: data.content } : file
//       ));
      
//       lastCodeChangeRef.current[data.fileId] = data.content;
      
//       if (data.fileId === activeFileId && editorRef.current) {
//         const currentValue = editorRef.current.getValue();
//         if (currentValue !== data.content) {
//           console.log('🔄 Updating Monaco editor for file', data.fileId);
//           const position = editorRef.current.getPosition();
//           editorRef.current.setValue(data.content);
//           if (position) {
//             editorRef.current.setPosition(position);
//           }
//         }
//       }
      
//       setTimeout(() => {
//         isRemoteUpdateRef.current[data.fileId] = false;
//       }, 100);
//     });

//     socket.on('file-created', (data: { file: FileData }) => {
//       console.log('📁 New file created by another user:', data.file.name);
      
//       setFiles(prev => {
//         const exists = prev.some(f => f.id === data.file.id);
//         if (!exists) {
//           const newFiles = [...prev, data.file];
//           console.log('📁 Added file to list. Total files:', newFiles.length);
//           return newFiles;
//         }
//         return prev;
//       });
//     });

//     socket.on('file-deleted', (data: { fileId: string }) => {
//       console.log('🗑️ File deleted by another user:', data.fileId);
      
//       setFiles(prev => prev.filter(f => f.id !== data.fileId));
      
//       setActiveFileId(prevActiveId => {
//         if (data.fileId === prevActiveId) {
//           return null;
//         }
//         return prevActiveId;
//       });
//     });

//     socket.on('session-ended', (data) => {
//       console.log('🛑 Session ended by host:', data);
      
//       setShowSessionEndedModal(true);
//       setSessionEndedReason(data.reason || 'The host has ended this session');
      
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 3000);
//     });

//     socket.on('participant-kicked', (data) => {
//       console.log('🚫 You were removed from the session:', data);
//       alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`);
//       router.push('/dashboard');
//     });

//     socket.on('force-disconnect', (data) => {
//       console.log('⚠️ Force disconnected:', data);
//       router.push('/dashboard');
//     });

//     socket.on('chat-message', (message) => {
//       console.log('💬 New chat message received:', message);
//       setChatError('');
      
//       if (!messageIdRef.current.has(message.id)) {
//         messageIdRef.current.add(message.id);
//         setMessages(prev => [...prev, message]);
//       }
//     });

//     socket.on('chat-error', (error) => {
//       console.error('💬 Chat error:', error);
//       setChatError(error.message || 'Failed to send message');
//       setIsSendingMessage(false);
//     });

//     socket.on('message-sent', (data) => {
//       setIsSendingMessage(false);
//     });

//     socket.on('connect', () => {
//       setSyncStatus('synced');
//       setConnectionStatus('Connected');
//     });

//     socket.on('disconnect', () => {
//       setSyncStatus('offline');
//       setConnectionStatus('Disconnected');
//     });

//     socket.on('error', (error) => {
//       console.error('❌ Socket error:', error);
//       setSyncStatus('error');
//     });

//     return () => {
//       console.log('🧹 Cleaning up socket listeners');
//       socket.off('session-joined');
//       socket.off('user-joined');
//       socket.off('user-left');
//       socket.off('cursor-position');
//       socket.off('cursor-selection');
//       socket.off('file-update');
//       socket.off('file-created');
//       socket.off('file-deleted');
//       socket.off('session-ended');
//       socket.off('participant-kicked');
//       socket.off('force-disconnect');
//       socket.off('chat-message');
//       socket.off('chat-error');
//       socket.off('message-sent');
//       socket.off('connect');
//       socket.off('disconnect');
//       socket.off('error');
//     };
//   }, [socket, connected, sessionId, user?.id, router, activeFileId, getUserColor, updateCursorDecorations, updateSelectionDecorations, fetchSessionData]);

//   // Handle file editor changes
//   const handleEditorChange = useCallback((value: string | undefined) => {
//     if (!value || !socket || !connected || !activeFileId) return;
    
//     if (isRemoteUpdateRef.current[activeFileId]) {
//       return;
//     }
    
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
//           console.log(`🚀 Broadcasting file change for ${activeFileId}`);
//           socket.emit('file-update', {
//             fileId: activeFileId,
//             content: value,
//             sessionId,
//             timestamp: Date.now()
//           });
//           setSyncStatus('synced');
//           setLastSyncTime(new Date());
//         }
//       }, 200);
//     }
//   }, [socket, connected, sessionId, activeFileId]);

//   // Enhanced handle editor mount with cursor tracking
//   const handleEditorDidMount = (editor: any, monaco: any) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
    
//     editor.updateOptions({
//       fontSize: isMobile ? 12 : 14,
//       minimap: { enabled: !isMobile },
//       scrollBeyondLastLine: false,
//       wordWrap: 'on',
//       automaticLayout: true,
//       theme: 'vs-dark',
//       tabSize: 2,
//       insertSpaces: true,
//       cursorBlinking: 'smooth',
//       cursorSmoothCaretAnimation: 'on',
//       smoothScrolling: true,
//       lineNumbers: isMobile ? 'off' : 'on',
//       glyphMargin: !isMobile,
//       folding: !isMobile,
//       renderIndentGuides: !isMobile
//     });

//     if (activeFile) {
//       editor.setValue(activeFile.content);
//     }

//     if (socket && connected && sessionId && user) {
//       editor.onDidChangeCursorPosition((e: any) => {
//         const position = e.position;
//         const selection = editor.getSelection();
        
//         socket.emit('cursor-position', {
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
//           timestamp: Date.now()
//         });
//       });

//       editor.onDidChangeCursorSelection((e: any) => {
//         const selection = e.selection;
        
//         socket.emit('cursor-selection', {
//           sessionId,
//           fileId: activeFileId,
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
//   };

//   // Execute code function
//   const executeCode = useCallback(async () => {
//     if (!activeFile || isExecuting) return;

//     setIsExecuting(true);
//     setExecutionResult(null);
    
//     try {
//       const startTime = performance.now();
      
//       const response = await fetch('/api/execute', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
//         },
//         body: JSON.stringify({
//           code: activeFile.content,
//           language: activeFile.language
//         })
//       });

//       const result = await response.json();
//       const executionTime = Math.round(performance.now() - startTime);

//       setExecutionResult({
//         output: result.output || '',
//         error: result.error || '',
//         executionTime,
//         language: activeFile.language
//       });

//     } catch (error) {
//       setExecutionResult({
//         output: '',
//         error: 'Network error: ' + (error as Error).message,
//         executionTime: 0,
//         language: activeFile.language
//       });
//     } finally {
//       setIsExecuting(false);
//     }
//   }, [activeFile, isExecuting]);

//   // Create new file
//   const createNewFile = async () => {
//     if (!newFileName.trim() || !socket || !connected) {
//       return;
//     }
    
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
        
//         console.log('✅ File created successfully:', newFile);
        
//         setFiles(prev => [...prev, newFile]);
//         setActiveFileId(newFile.id);
//         lastCodeChangeRef.current[newFile.id] = newFile.content;
        
//         setNewFileName('');
//         setNewFileLanguage('javascript');
//         setShowNewFileModal(false);
        
//         if (socket && connected) {
//           socket.emit('file-created', {
//             sessionId,
//             file: newFile
//           });
//         }
        
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

//   // Delete file
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

//   // Auto-save functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (files.length > 0 && connected) {
//         saveAllFiles();
//       }
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [files, connected]);

//   // Save all files
//   const saveAllFiles = async () => {
//     try {
//       if (activeFileId && editorRef.current) {
//         const currentContent = editorRef.current.getValue();
//         const updatedFiles = files.map(file => 
//           file.id === activeFileId ? { ...file, content: currentContent } : file
//         );
        
//         const token = localStorage.getItem('accessToken');
//         const response = await fetch(`/api/sessions/${sessionId}/save`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           },
//           body: JSON.stringify({ files: updatedFiles })
//         });
        
//         if (response.ok) {
//           console.log('✅ All files saved successfully');
//           setLastSyncTime(new Date());
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to save files:', error);
//     }
//   };

//   // Send chat message
//   const sendMessage = useCallback(() => {
//     if (!newMessage.trim() || !socket || !connected || isSendingMessage) {
//       return;
//     }

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

//     if (chatInputRef.current) {
//       chatInputRef.current.focus();
//     }
//   }, [newMessage, socket, connected, sessionId, isSendingMessage]);

//   // Handle enter key in chat
//   const handleChatKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // Remove participant (host only)
//   const removeParticipant = useCallback((participantId: string) => {
//     if (!isHost || !socket || !connected) return;
    
//     socket.emit('remove-participant', {
//       sessionId,
//       participantId
//     });
    
//     setShowParticipantMenu(null);
//   }, [isHost, socket, connected, sessionId]);

//   // Copy session link
//   const copySessionLink = () => {
//     const link = `${window.location.origin}/session/${sessionId}`;
//     navigator.clipboard.writeText(link).then(() => {
//       console.log('📋 Session link copied to clipboard');
//     });
//   };

//   // Export session
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
// - Last Updated: ${new Date().toLocaleString()}
// - Type: ${session.type}
// - Status: ${session.isActive ? 'Active' : 'Ended'}

// Generated by CollabIDE - Real-time Collaborative Code Editor
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

//   // Generate preview HTML
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

//   // End session function
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
//         if (socket && connected) {
//           console.log('📡 Broadcasting session end to all participants');
//           socket.emit('end-session-broadcast', { 
//             sessionId,
//             reason: 'Session ended by host',
//             hostName: user?.displayName || 'Host'
//           });
//         }
        
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

//   // Cleanup on unmount
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
//         const cursorStyle = document.getElementById(`cursor-style-${userId}`);
//         const selectionStyle = document.getElementById(`selection-style-${userId}`);
//         if (cursorStyle) cursorStyle.remove();
//         if (selectionStyle) selectionStyle.remove();
//       });
//     };
//   }, [socket, sessionId, cursors]);

//   // Enhanced Quick Actions Component
//   const QuickActionsBar = () => (
//     <div className="flex items-center space-x-2 p-2 bg-card/50 backdrop-blur-sm border-b border-border/30">
//       {/* Layout Mode Selector */}
//       <div className="flex items-center space-x-1 border border-border/50 rounded-lg p-1">
//         <Button
//           size="sm"
//           variant={layout.mode === 'focus' ? 'default' : 'ghost'}
//           onClick={() => switchMode('focus')}
//           className="h-7 px-2"
//           title="Focus Mode (Escape)"
//         >
//           <Layout className="h-3 w-3" />
//         </Button>

//         <Button
//           size="sm"
//           variant={layout.mode === 'split' ? 'default' : 'ghost'}
//           onClick={() => switchMode('split')}
//           className="h-7 px-2"
//           title="Split View"
//         >
//           <Grid3X3 className="h-3 w-3" />
//         </Button>

//         <Button
//           size="sm"
//           variant={layout.mode === 'preview' ? 'default' : 'ghost'}
//           onClick={() => switchMode('preview')}
//           className="h-7 px-2"
//           title="Preview Mode (Ctrl+P)"
//         >
//           <Eye className="h-3 w-3" />
//         </Button>

//         <Button
//           size="sm"
//           variant={layout.mode === 'chat' ? 'default' : 'ghost'}
//           onClick={() => switchMode('chat')}
//           className="h-7 px-2 relative"
//           title="Chat Mode (Ctrl+K)"
//         >
//           <MessageSquare className="h-3 w-3" />
//           {messages.length > 0 && layout.mode !== 'chat' && (
//             <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
//           )}
//         </Button>

//         <Button
//           size="sm"
//           variant={layout.mode === 'output' ? 'default' : 'ghost'}
//           onClick={() => switchMode('output')}
//           className="h-7 px-2"
//           title="Output Mode"
//         >
//           <Terminal className="h-3 w-3" />
//         </Button>
//       </div>

//       <div className="w-px h-6 bg-border" />

//       {/* Quick Actions */}
//       <Button
//         size="sm"
//         variant="ghost"
//         onClick={saveAllFiles}
//         className={cn(
//           "h-7 px-2 transition-all duration-200",
//           activeHotkey === 'save' && "bg-success/20 text-success"
//         )}
//         title="Save All (Ctrl+S)"
//       >
//         <Save className="h-3 w-3" />
//       </Button>

//       {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => {
//             executeCode();
//             switchMode('output');
//           }}
//           disabled={isExecuting}
//           className={cn(
//             "h-7 px-2 transition-all duration-200",
//             activeHotkey === 'execute' && "bg-accent-emerald/20 text-accent-emerald"
//           )}
//           title="Run Code (Ctrl+E)"
//         >
//           {isExecuting ? (
//             <Loader2 className="h-3 w-3 animate-spin" />
//           ) : (
//             <Play className="h-3 w-3" />
//           )}
//         </Button>
//       )}

//       {isHost && (
//         <>
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => setShowNewFileModal(true)}
//             className={cn(
//               "h-7 px-2 transition-all duration-200",
//               activeHotkey === 'newfile' && "bg-primary/20 text-primary"
//             )}
//             title="New File (Ctrl+N)"
//           >
//             <Plus className="h-3 w-3" />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => setShowInviteModal(true)}
//             className={cn(
//               "h-7 px-2 transition-all duration-200",
//               activeHotkey === 'invite' && "bg-accent-blue/20 text-accent-blue"
//             )}
//             title="Invite Users (Ctrl+I)"
//           >
//             <UserPlus className="h-3 w-3" />
//           </Button>
//         </>
//       )}

//       <div className="w-px h-6 bg-border" />

//       {/* Connection Status */}
//       <div className="flex items-center space-x-2 px-2">
//         <div className={cn(
//           "w-2 h-2 rounded-full transition-all duration-300",
//           connected ? "bg-success animate-pulse" : "bg-destructive"
//         )} />
//         <span className="text-xs text-muted-foreground">
//           {participantCount} online
//         </span>
//       </div>

//       {/* Sync Status */}
//       <Badge
//         variant="outline"
//         className={cn(
//           "text-xs transition-all duration-300",
//           syncStatus === 'synced' && "border-success/30 text-success",
//           syncStatus === 'syncing' && "border-info/30 text-info",
//           syncStatus === 'error' && "border-destructive/30 text-destructive",
//           syncStatus === 'offline' && "border-muted-foreground/30 text-muted-foreground"
//         )}
//       >
//         {syncStatus === 'syncing' && <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />}
//         {syncStatus === 'synced' && <CheckCircle className="h-2.5 w-2.5 mr-1" />}
//         {syncStatus === 'error' && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
//         {syncStatus === 'offline' && <WifiOff className="h-2.5 w-2.5 mr-1" />}
//         {syncStatus}
//       </Badge>
//     </div>
//   );

//   // Enhanced Status Bar Component
//   const StatusBar = () => (
//     <div className="flex items-center justify-between p-2 bg-card/30 backdrop-blur-sm border-t border-border/30 text-xs text-muted-foreground">
//       <div className="flex items-center space-x-4">
//         <div className="flex items-center space-x-2">
//           <Badge variant="outline" className="text-xs">
//             {activeFile ? languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language : 'No file'}
//           </Badge>
//           {activeFile && (
//             <span>
//               {activeFile.content.split('\n').length} lines
//             </span>
//           )}
//         </div>
        
//         {lastSyncTime && (
//           <div className="flex items-center space-x-1">
//             <Clock className="h-3 w-3" />
//             <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
//           </div>
//         )}
//       </div>

//       <div className="flex items-center space-x-4">
//         <div className="flex items-center space-x-2">
//           <Users className="h-3 w-3" />
//           <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <FileText className="h-3 w-3" />
//           <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
//         </div>

//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={() => setShowKeyboardShortcuts(true)}
//           className="h-5 px-2 text-xs"
//         >
//           Shortcuts
//         </Button>
//       </div>
//     </div>
//   );

//   // Keyboard Shortcuts Modal
//   const KeyboardShortcutsModal = () => (
//     showKeyboardShortcuts && (
//       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <Card className="glass-card max-w-md w-full animate-fade-in-scale">
//           <CardHeader className="pb-4">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-lg font-bold">Keyboard Shortcuts</CardTitle>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => setShowKeyboardShortcuts(false)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 gap-3">
//               {[
//                 { key: 'Ctrl+S', action: 'Save all files' },
//                 { key: 'Ctrl+E', action: 'Execute code' },
//                 { key: 'Ctrl+K', action: 'Toggle chat' },
//                 { key: 'Ctrl+P', action: 'Toggle preview' },
//                 { key: 'Ctrl+N', action: 'New file (Host)' },
//                 { key: 'Ctrl+I', action: 'Invite users (Host)' },
//                 { key: 'Ctrl+/', action: 'Show shortcuts' },
//                 { key: 'Escape', action: 'Focus mode' },
//                 { key: 'F11', action: 'Toggle fullscreen' }
//               ].map(({ key, action }) => (
//                 <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
//                   <span className="text-sm">{action}</span>
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {key}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   );

//   // Loading states with enhanced UI
//   if (!user) {
//     return (
//       <div className="min-h-screen auth-bg flex items-center justify-center">
//         <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
//           <div className="text-center space-y-6">
//             <HeroLogo size="lg" className="animate-float" />
//             <div>
//               <h2 className="text-2xl font-bold gradient-text mb-2">Authentication Required</h2>
//               <p className="text-muted-foreground mb-4">Please log in to access this collaboration session.</p>
//               <Button 
//                 onClick={() => router.push('/auth/login')}
//                 className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90"
//               >
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
//       <div className="min-h-screen auth-bg flex items-center justify-center">
//         <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
//           <div className="text-center space-y-6">
//             <HeroLogo size="lg" className="animate-float" />
//             <div className="space-y-4">
//               <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
//               <div>
//                 <h2 className="text-xl font-bold gradient-text mb-2">{connectionStatus}</h2>
//                 <p className="text-muted-foreground">
//                   {loading ? 'Loading session data...' : 'Establishing real-time connection...'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   if (!connected) {
//     return (
//       <div className="min-h-screen auth-bg flex items-center justify-center">
//         <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
//           <div className="text-center space-y-6">
//             <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
//               <WifiOff className="h-16 w-16 text-destructive" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-destructive mb-2">Connection Failed</h2>
//               <p className="text-muted-foreground mb-6">Unable to connect to the collaboration server.</p>
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
//       <div className="min-h-screen auth-bg flex items-center justify-center">
//         <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
//           <div className="text-center space-y-6">
//             <HeroLogo size="lg" className="animate-float" />
//             <div className="space-y-4">
//               <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
//               <div>
//                 <h2 className="text-xl font-bold gradient-text mb-2">Joining Session</h2>
//                 <p className="text-muted-foreground">Setting up your collaborative workspace...</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className={cn(
//       "h-screen flex flex-col auth-bg overflow-hidden transition-all duration-300",
//       layout.fullscreen && "fixed inset-0 z-50"
//     )}>
//       {/* Enhanced Session Header */}
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

//       {/* Quick Actions Bar */}
//       <QuickActionsBar />

//       {/* Main Content Area with Enhanced Layout */}
//       <div className="flex-1 flex overflow-hidden relative">
//         {/* Collapsible Sidebar */}
//         {layout.sidebar !== 'hidden' && (
//           <div 
//             className={cn(
//               "flex-shrink-0 transition-all duration-300 ease-in-out",
//               layout.sidebar === 'collapsed' && "w-[60px]",
//               layout.sidebar === 'expanded' && `w-[${sidebarPanel.width}px]`
//             )}
//           >
//             {layout.sidebar === 'collapsed' ? (
//               // Collapsed Sidebar
//               <div className="w-[60px] h-full glass-card backdrop-blur-sm border-r border-border/30 flex flex-col items-center py-4 space-y-4">
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => switchMode('chat')}
//                   className="w-10 h-10 p-0 relative"
//                   title={`Participants (${participantCount})`}
//                 >
//                   <Users className="h-4 w-4" />
//                   <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center">
//                     {participantCount}
//                   </Badge>
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={() => switchMode('chat')}
//                   className="w-10 h-10 p-0 relative"
//                   title={`Chat (${messages.length})`}
//                 >
//                   <MessageSquare className="h-4 w-4" />
//                   {messages.length > 0 && (
//                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-emerald rounded-full" />
//                   )}
//                 </Button>
//               </div>
//             ) : (
//               // Expanded Sidebar
//               <>
//                 <Sidebar
//                   user={user}
//                   session={session}
//                   isHost={isHost}
//                   onlineUsers={onlineUsers}
//                   participantCount={participantCount}
//                   getUserColor={getUserColor}
//                   showParticipantMenu={showParticipantMenu}
//                   setShowParticipantMenu={setShowParticipantMenu}
//                   removeParticipant={removeParticipant}
//                   messages={messages}
//                   newMessage={newMessage}
//                   setNewMessage={setNewMessage}
//                   chatError={chatError}
//                   connected={connected}
//                   isSendingMessage={isSendingMessage}
//                   sendMessage={sendMessage}
//                   handleChatKeyPress={handleChatKeyPress}
//                   messagesEndRef={messagesEndRef}
//                   isMobile={isMobile}
//                 />
                
//                 {/* Resize Handle */}
//                 <div 
//                   className="w-1 bg-border/50 hover:bg-primary/50 cursor-col-resize transition-colors duration-200"
//                   onMouseDown={sidebarPanel.startResize}
//                 />
//               </>
//             )}
//           </div>
//         )}

//         {/* Main Editor Area */}
//         <div className="flex-1 flex flex-col min-w-0">
//           {/* Enhanced File Tabs */}
//           <FileTabs
//             files={files}
//             activeFileId={activeFileId}
//             setActiveFileId={setActiveFileId}
//             isHost={isHost}
//             showNewFileModal={() => setShowNewFileModal(true)}
//             fileCreationLoading={fileCreationLoading}
//             deleteFile={deleteFile}
//             executeCode={() => {
//               executeCode();
//               switchMode('output');
//             }}
//             isExecuting={isExecuting}
//             activeFile={activeFile}
//           />

//           {/* Editor and Side Panels Container */}
//           <div className="flex-1 flex overflow-hidden">
//             {/* Code Editor */}
//             <div className="flex-1 min-w-0">
//               <EditorArea
//                 activeFile={activeFile}
//                 handleEditorChange={handleEditorChange}
//                 handleEditorDidMount={handleEditorDidMount}
//                 isHost={isHost}
//                 showNewFileModal={() => setShowNewFileModal(true)}
//                 fileCreationLoading={fileCreationLoading}
//                 showOutput={layout.output === 'expanded'}
//                 setShowOutput={(show) => {
//                   if (show) switchMode('output');
//                   else if (layout.mode === 'output') switchMode('focus');
//                 }}
//                 isExecuting={isExecuting}
//                 executionResult={executionResult}
//                 socket={socket}
//                 connected={connected}
//                 sessionId={sessionId}
//                 user={user}
//                 cursors={cursors}
//                 setCursors={setCursors}
//                 getUserColor={getUserColor}
//                 fileLocks={fileLocks}
//                 lockRequests={lockRequests}
//               />
//             </div>

//             {/* Preview Panel */}
//             {layout.preview === 'expanded' && (
//               <>
//                 <div 
//                   className="w-1 bg-border/50 hover:bg-info/50 cursor-col-resize transition-colors duration-200"
//                   onMouseDown={previewPanel.startResize}
//                 />
//                 <div 
//                   className="flex-shrink-0 transition-all duration-300"
//                   style={{ width: `${previewPanel.width}px` }}
//                 >
//                   <PreviewPanel
//                     isPreviewVisible={true}
//                     setIsPreviewVisible={(visible) => {
//                       if (!visible) switchMode('focus');
//                     }}
//                     generatePreview={generatePreview}
//                     session={session}
//                     activeFile={activeFile}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Output Panel */}
//             {layout.output === 'expanded' && (
//               <>
//                 <div 
//                   className="w-1 bg-border/50 hover:bg-accent-emerald/50 cursor-col-resize transition-colors duration-200"
//                   onMouseDown={outputPanel.startResize}
//                 />
//                 <div 
//                   className="flex-shrink-0 transition-all duration-300"
//                   style={{ width: `${outputPanel.width}px` }}
//                 >
//                   <Card className="h-full glass-card backdrop-blur-sm border-border/30 rounded-none">
//                     <CardHeader className="pb-3 border-b border-border/30 flex-shrink-0">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <div className="p-1.5 bg-accent-emerald/10 rounded-lg">
//                             <Terminal className="h-4 w-4 text-accent-emerald" />
//                           </div>
//                           <div>
//                             <h3 className="text-sm font-semibold text-foreground">Code Output</h3>
//                             <p className="text-xs text-muted-foreground">
//                               {activeFile ? `${activeFile.language} execution` : 'No active file'}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Button 
//                             size="sm" 
//                             variant="ghost" 
//                             onClick={() => switchMode('focus')}
//                             className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
//                             title="Close Output"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="flex-1 p-4 overflow-auto min-h-0">
//                       {isExecuting ? (
//                         <div className="flex items-center justify-center h-full min-h-[200px]">
//                           <div className="text-center space-y-3">
//                             <RefreshCw className="h-8 w-8 mx-auto animate-spin text-accent-emerald" />
//                             <div>
//                               <p className="font-medium text-foreground">Executing Code</p>
//                               <p className="text-sm text-muted-foreground">
//                                 Running {activeFile?.language} code...
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : executionResult ? (
//                         <div className="space-y-4">
//                           <div className={cn(
//                             "px-4 py-3 rounded-lg text-sm border backdrop-blur-sm",
//                             executionResult.error 
//                               ? "bg-destructive/10 text-destructive border-destructive/30"
//                               : "bg-success/10 text-success border-success/30"
//                           )}>
//                             {executionResult.error ? (
//                               <div className="flex items-center gap-2">
//                                 <AlertCircle className="h-4 w-4 flex-shrink-0" />
//                                 <div>
//                                   <div className="font-medium">Execution Failed</div>
//                                   <div className="text-xs opacity-80">
//                                     Completed in {executionResult.executionTime}ms
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-2">
//                                 <CheckCircle className="h-4 w-4 flex-shrink-0" />
//                                 <div>
//                                   <div className="font-medium">Execution Successful</div>
//                                   <div className="text-xs opacity-80">
//                                     Completed in {executionResult.executionTime}ms
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between">
//                               <h4 className="text-sm font-medium text-foreground">Output:</h4>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(
//                                     executionResult.error || executionResult.output || ''
//                                   );
//                                 }}
//                                 className="h-6 px-2 text-xs"
//                               >
//                                 <Copy className="h-3 w-3 mr-1" />
//                                 Copy
//                               </Button>
//                             </div>
//                             <pre className={cn(
//                               "text-sm whitespace-pre-wrap font-mono p-4 rounded-lg border overflow-auto max-h-96 backdrop-blur-sm",
//                               executionResult.error 
//                                 ? "bg-destructive/5 border-destructive/20 text-destructive"
//                                 : "bg-muted/20 border-border/30 text-foreground"
//                             )}>
//                               {executionResult.error || executionResult.output || 'No output generated'}
//                             </pre>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center h-full min-h-[200px] text-center">
//                           <div className="space-y-4">
//                             <div className="p-4 bg-accent-emerald/10 rounded-full w-fit mx-auto">
//                               <Terminal className="h-12 w-12 text-accent-emerald" />
//                             </div>
//                             <div>
//                               <h3 className="font-medium text-foreground mb-2">Ready to Execute</h3>
//                               <p className="text-sm text-muted-foreground mb-4">
//                                 Click the "Run Code" button or press Ctrl+E to execute your code
//                               </p>
//                               {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//                                 <Button
//                                   onClick={executeCode}
//                                   className="bg-gradient-to-r from-accent-emerald to-success hover:from-accent-emerald/90 hover:to-success/90"
//                                 >
//                                   <Play className="h-4 w-4 mr-2" />
//                                   Run Code
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Status Bar */}
//       <StatusBar />

//       {/* Mobile Layout Adjustments */}
//       {isMobile && (
//         <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-40">
//           <Button
//             onClick={() => switchMode(layout.mode === 'chat' ? 'focus' : 'chat')}
//             className={cn(
//               "rounded-full shadow-lg backdrop-blur-sm transition-all duration-300",
//               layout.mode === 'chat' ? "bg-primary" : "glass-card border border-border/50"
//             )}
//           >
//             <MessageSquare className="h-4 w-4 mr-2" />
//             Chat
//             {messages.length > 0 && layout.mode !== 'chat' && (
//               <Badge className="ml-2 bg-accent-emerald/20 text-accent-emerald">
//                 {messages.length}
//               </Badge>
//             )}
//           </Button>
          
//           {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
//             <Button
//               onClick={() => {
//                 executeCode();
//                 switchMode('output');
//               }}
//               disabled={isExecuting}
//               className="rounded-full shadow-lg bg-gradient-to-r from-accent-emerald to-success hover:from-accent-emerald/90 hover:to-success/90"
//             >
//               {isExecuting ? (
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//               ) : (
//                 <Play className="h-4 w-4 mr-2" />
//               )}
//               Run
//             </Button>
//           )}
//         </div>
//       )}

//       {/* Enhanced Modals */}
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
//           sessionTitle={session?.title}
//         />
//       )}

//       {/* Keyboard Shortcuts Modal */}
//       <KeyboardShortcutsModal />
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
  Zap, Grid3X3, PanelLeft, PanelRight
} from 'lucide-react';

// Component imports
import SessionHeader from './components/SessionHeader';
import FileTabs from './components/FileTabs';
import EditorArea from './components/EditorArea';
import PreviewPanel from './components/PreviewPanel';
import NewFileModal from './components/NewFileModal';
import InviteModal from './components/InviteModal';
import EndSessionModal from './components/EndSessionModal';
import SessionEndedModal from './components/SessionEndedModal';

import { languageConfigs } from './utils/languageConfigs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import HeroLogo from '@/components/ui/hero-logo';
import { cn } from '@/lib/utils';

// Interfaces
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

// Layout Management Hook
type LayoutMode = 'focus' | 'split' | 'preview' | 'chat' | 'participants' | 'output';
type PanelState = 'hidden' | 'collapsed' | 'expanded';

interface LayoutState {
  mode: LayoutMode;
  sidebar: PanelState;
  chat: PanelState;
  participants: PanelState;
  preview: PanelState;
  output: PanelState;
  fullscreen: boolean;
}

const useLayoutManager = () => {
  const [layout, setLayout] = useState<LayoutState>({
    mode: 'focus',
    sidebar: 'collapsed',
    chat: 'hidden',
    participants: 'hidden',
    preview: 'hidden',
    output: 'hidden',
    fullscreen: false
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      if (mobile) {
        setLayout(prev => ({
          ...prev,
          mode: 'focus',
          sidebar: 'hidden',
          chat: 'hidden',
          participants: 'hidden',
          preview: 'hidden',
          output: 'hidden'
        }));
      }
    };
    
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  const switchMode = useCallback((mode: LayoutMode) => {
    setLayout(prev => {
      switch (mode) {
        case 'focus':
          return {
            ...prev,
            mode,
            sidebar: 'collapsed',
            chat: 'hidden',
            participants: 'hidden',
            preview: 'hidden',
            output: 'hidden'
          };
        case 'chat':
          return {
            ...prev,
            mode,
            sidebar: 'hidden',
            chat: 'expanded',
            participants: 'hidden',
            preview: 'hidden',
            output: 'hidden'
          };
        case 'participants':
          return {
            ...prev,
            mode,
            sidebar: 'hidden',
            chat: 'hidden',
            participants: 'expanded',
            preview: 'hidden',
            output: 'hidden'
          };
        case 'preview':
          return {
            ...prev,
            mode,
            sidebar: 'collapsed',
            chat: 'hidden',
            participants: 'hidden',
            preview: 'expanded',
            output: 'hidden'
          };
        case 'output':
          return {
            ...prev,
            mode,
            sidebar: 'collapsed',
            chat: 'hidden',
            participants: 'hidden',
            preview: 'hidden',
            output: 'expanded'
          };
        default:
          return prev;
      }
    });
  }, []);

  const togglePanel = useCallback((panel: 'chat' | 'participants' | 'preview' | 'output') => {
    setLayout(prev => ({
      ...prev,
      [panel]: prev[panel] === 'hidden' ? 'expanded' : 'hidden',
      // Hide other panels when opening one
      ...(panel === 'chat' && prev.chat === 'hidden' && { participants: 'hidden' }),
      ...(panel === 'participants' && prev.participants === 'hidden' && { chat: 'hidden' })
    }));
  }, []);

  return {
    layout,
    isMobile,
    isTablet,
    switchMode,
    togglePanel,
    toggleFullscreen: useCallback(() => {
      setLayout(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
    }, []),
    setLayout
  };
};

// Panel Management Hook
const usePanelManager = () => {
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [outputWidth, setOutputWidth] = useState(450);
  
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

  return { sidebarPanel, outputPanel };
};

// Chat Panel Component
const ChatPanel = ({ 
  user, messages, newMessage, setNewMessage, chatError, connected, 
  isSendingMessage, sendMessage, handleChatKeyPress, messagesEndRef, 
  getUserColor, onClose 
}: any) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full bg-slate-900/95 border-r border-slate-700/50 backdrop-blur-xl flex flex-col">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Team Chat</h3>
              <p className="text-xs text-slate-400">Real-time collaboration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              connected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-red-400"
            )} />
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              <Hash className="h-2.5 w-2.5 mr-1" />
              {messages.length}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              title="Close Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className="flex-1 flex flex-col min-h-0 p-4">
        {chatError && (
          <Alert variant="destructive" className="mb-3 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertDescription className="text-sm">{chatError}</AlertDescription>
          </Alert>
        )}
        
        {/* Messages Area */}
        <div className="flex-1 mb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 py-12 space-y-3">
                <div className="p-4 bg-emerald-500/5 rounded-full w-fit mx-auto">
                  <MessageCircle className="h-12 w-12 opacity-50" />
                </div>
                <div>
                  <p className="font-medium">No messages yet</p>
                  <p className="text-xs opacity-75">Start the conversation! 💬</p>
                </div>
              </div>
            ) : (
              messages.map((message: any) => (
                <div key={message.id} className="group">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 mt-0.5 shadow-lg"
                      style={{ backgroundColor: getUserColor(message.user.id) }}
                    >
                      {message.user.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={cn(
                          "text-sm font-medium truncate",
                          message.user.id === user?.id ? 'text-blue-400' : 'text-slate-200'
                        )}>
                          {message.user.displayName}
                          {message.user.id === user?.id && ' (You)'}
                        </span>
                        <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                      <div className={cn(
                        "text-sm rounded-xl px-4 py-2 border transition-all duration-200 backdrop-blur-sm",
                        message.user.id === user?.id 
                          ? 'bg-blue-500/10 border-blue-500/30 text-blue-100 ml-0' 
                          : 'bg-slate-800/50 border-slate-700/30 text-slate-200'
                      )}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={connected ? "Type your message..." : "Connecting to chat..."}
              className="text-sm bg-slate-800/50 border-slate-700/50 focus:border-emerald-500/50 backdrop-blur-sm"
              onKeyPress={handleChatKeyPress}
              disabled={!connected || isSendingMessage}
              maxLength={500}
            />
            <Button 
              size="sm" 
              onClick={sendMessage} 
              disabled={!connected || !newMessage.trim() || isSendingMessage}
              className="px-3 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
            >
              {isSendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Status */}
          <div className="flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              {connected ? (
                <>
                  <Wifi className="h-3 w-3 text-emerald-400" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-400" />
                  <span>Reconnecting...</span>
                </>
              )}
            </div>
            <span className={cn(
              "font-mono text-xs",
              newMessage.length > 450 ? "text-yellow-400" : "text-slate-500"
            )}>
              {newMessage.length}/500
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Participants Panel Component
const ParticipantsPanel = ({ 
  user, session, isHost, onlineUsers, participantCount, getUserColor, 
  showParticipantMenu, setShowParticipantMenu, removeParticipant, onClose 
}: any) => {
  return (
    <div className="h-full bg-slate-900/95 border-r border-slate-700/50 backdrop-blur-xl flex flex-col">
      {/* Participants Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Participants</h3>
              <p className="text-xs text-slate-400">
                {participantCount} {participantCount === 1 ? 'member' : 'members'} online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse shadow-lg shadow-emerald-400/50" />
              {participantCount}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
              title="Close Participants"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Participants Content */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="space-y-3">
          {/* Current user */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 backdrop-blur-sm group">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-lg flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: getUserColor(user.id) }}
                >
                  {user?.displayName?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-lg shadow-emerald-400/50" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-slate-100 truncate">
                    {user?.displayName}
                  </span>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                    You
                  </Badge>
                </div>
                {session.owner.id === user?.id && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs mt-1">
                    <Crown className="h-2.5 w-2.5 mr-1" />
                    Host
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Other online users */}
          {onlineUsers
            .filter((u: any) => u.userId !== user?.id)
            .map((participant: any) => (
              <div key={participant.userId} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 backdrop-blur-sm group hover:bg-slate-800/50 transition-all duration-200">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-lg flex items-center justify-center text-sm font-semibold text-white"
                      style={{ backgroundColor: getUserColor(participant.userId) }}
                    >
                      {participant.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-lg shadow-emerald-400/50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-100 truncate">
                        {participant.displayName}
                      </span>
                      {session.owner.id === participant.userId && (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                          <Crown className="h-2.5 w-2.5 mr-1" />
                          Host
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <UserCheck className="h-2.5 w-2.5 text-emerald-400" />
                      <span className="text-xs text-slate-400">Online</span>
                    </div>
                  </div>
                </div>
                
                {isHost && session.owner.id !== participant.userId && (
                  <div className="relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowParticipantMenu(
                        showParticipantMenu === participant.userId ? null : participant.userId
                      )}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                    {showParticipantMenu === participant.userId && (
                      <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-20 backdrop-blur-xl">
                        <button
                          onClick={() => removeParticipant(participant.userId)}
                          className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                        >
                          <UserMinus className="h-3 w-3 mr-2" />
                          Remove from session
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          
          {/* Empty state */}
          {participantCount === 1 && (
            <div className="text-center text-slate-400 py-12 space-y-4">
              <div className="p-4 bg-amber-500/5 rounded-full w-fit mx-auto">
                <Sparkles className="h-12 w-12 opacity-50" />
              </div>
              <div>
                <p className="font-medium">You're flying solo!</p>
                <p className="text-xs opacity-75">
                  {isHost ? 'Invite others to join the collaboration' : 'Waiting for others to join...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, connected, connecting } = useSocket();
  
  // Layout and panel management
  const { layout, isMobile, isTablet, switchMode, togglePanel } = useLayoutManager();
  const { sidebarPanel, outputPanel } = usePanelManager();
  
  // Core state
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionId] = useState(params.id as string);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  
  // File state
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
  
  // Modals
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');
  const [fileCreationLoading, setFileCreationLoading] = useState(false);
  
  // Execution
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  // Chat and collaboration
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatError, setChatError] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Host controls
  const [showParticipantMenu, setShowParticipantMenu] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const [sessionEndedReason, setSessionEndedReason] = useState('');
  const [endSessionLoading, setEndSessionLoading] = useState(false);
  
  // Refs
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
  const messageIdRef = useRef<Set<string>>(new Set());
  const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
  const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const decorationsRef = useRef<{ [key: string]: string[] }>({});

  // Computed values
  const isHost = session?.owner?.id === user?.id;
  const activeFile = files.find(file => file.id === activeFileId);

  // User colors for cursors
  const userColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
  ];
  
  const getUserColor = useCallback((userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return userColors[Math.abs(hash) % userColors.length];
  }, []);

  // Enhanced cursor decoration functions
  // const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
  //   if (!editorRef.current || !monacoRef.current) return;
    
  //   const { userId, userName, position } = cursorData;
    
  //   // Remove previous decorations for this user
  //   if (decorationsRef.current[userId]) {
  //     editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
  //   }
    
  //   // Create new cursor decoration
  //   const decorations = [
  //     {
  //       range: new monacoRef.current.Range(
  //         position.lineNumber,
  //         position.column,
  //         position.lineNumber,
  //         position.column
  //       ),
  //       options: {
  //         className: `remote-cursor-${userId}`,
  //         stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
  //         beforeContentClassName: `cursor-line-${userId}`,
  //         afterContentClassName: `cursor-label-${userId}`,
  //       }
  //     }
  //   ];
    
  //   // Apply decorations
  //   const newDecorations = editorRef.current.deltaDecorations([], decorations);
  //   decorationsRef.current[userId] = newDecorations;
    
  //   // Add dynamic CSS styles for this user's cursor
  //   addCursorStyles(userId, userName, color);
  // }, []);

// Enhanced cursor decoration function with comprehensive logging
// Enhanced cursor decoration with better error handling and logging
const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
  console.log('🎨 updateCursorDecorations called for:', cursorData.userName, 'at line', cursorData.position.lineNumber);
  
  if (!editorRef.current) {
    console.error('❌ No editor ref available');
    return;
  }
  
  if (!monacoRef.current) {
    console.error('❌ No monaco ref available');
    return;
  }
  
  const { userId, userName, position } = cursorData;
  
  try {
    // Remove existing decorations
    if (decorationsRef.current[userId]) {
      console.log(`🧹 Removing existing decorations for ${userName}`);
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
      delete decorationsRef.current[userId];
    }
    
    // Create new decorations
    const decorations = [
      {
        range: new monacoRef.current.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: `remote-cursor-${userId}`,
          beforeContentClassName: `cursor-line-${userId}`,
          afterContentClassName: `cursor-label-${userId}`,
          stickiness: monacoRef.current.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      }
    ];
    
    // Apply decorations
    const newDecorations = editorRef.current.deltaDecorations([], decorations);
    decorationsRef.current[userId] = newDecorations;
    
    console.log(`✅ Applied ${newDecorations.length} decorations for ${userName}`);
    
    // Add CSS styles
    addCursorStyles(userId, userName, color);
    
    // Force re-render
    editorRef.current.render(true);
    
    console.log(`🎉 Cursor decoration complete for ${userName}`);
    
  } catch (error) {
    console.error('❌ Error in updateCursorDecorations:', error);
  }
}, []);


// Enhanced CSS style injection
const addCursorStyles = useCallback((userId: string, userName: string, color: string) => {
  console.log(`🎨 Adding cursor styles for ${userName} with color ${color}`);
  
  try {
    // Remove existing styles
    const existingStyle = document.getElementById(`cursor-style-${userId}`);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = `cursor-style-${userId}`;
    
    // Enhanced cursor styles with maximum visibility
    style.textContent = `
      /* Enhanced blinking cursor for ${userName} */
      .monaco-editor .cursor-line-${userId}::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: -2px !important;
        width: 3px !important;
        height: 100% !important;
        background: ${color} !important;
        z-index: 1000 !important;
        animation: cursor-blink-${userId} 1s ease-in-out infinite !important;
        pointer-events: none !important;
        display: block !important;
        opacity: 1 !important;
        box-shadow: 0 0 6px ${color}80 !important;
      }
      
      /* Enhanced username label for ${userName} */
      .monaco-editor .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}' !important;
        position: absolute !important;
        top: -28px !important;
        left: -2px !important;
        background: ${color} !important;
        color: white !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
        z-index: 1001 !important;
        pointer-events: none !important;
        display: block !important;
        opacity: 1 !important;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
      }
      
      /* Smooth blinking animation for ${userName} */
      @keyframes cursor-blink-${userId} {
        0%, 50% { opacity: 1 !important; }
        51%, 100% { opacity: 0.4 !important; }
      }
    `;
    
    document.head.appendChild(style);
    console.log(`✅ Successfully added cursor styles for ${userName}`);
    
  } catch (error) {
    console.error(`❌ Error adding cursor styles for ${userName}:`, error);
  }
}, []);

useEffect(() => {
  if (!editorRef.current || !monacoRef.current || !activeFile) {
    console.log('⚠️ Editor, monaco, or activeFile not ready for cursor updates');
    return;
  }
  
  console.log('🔄 Cursor state changed, updating decorations for active file:', activeFile.name);
  console.log('📊 Current cursors:', Object.keys(cursors).length);
  
  // Filter cursors for current file only
  const currentFileCursors = Object.values(cursors).filter(
    cursor => cursor.fileId === activeFile.id && cursor.userId !== user?.id
  );
  
  console.log('🎯 Cursors for current file:', currentFileCursors.length);
  
  // Apply decorations for each cursor
  currentFileCursors.forEach((cursor, index) => {
    console.log(`🎨 Applying decoration ${index + 1}/${currentFileCursors.length} for:`, cursor.userName);
    
    setTimeout(() => {
      updateCursorDecorations(cursor, cursor.color);
    }, index * 100); // Stagger updates to avoid conflicts
  });
  
}, [cursors, activeFile?.id, user?.id, updateCursorDecorations]);


  // Enhanced CSS style injection
  // const addCursorStyles = useCallback((userId: string, userName: string, color: string) => {
  //   // Remove existing style for this user
  //   const existingStyle = document.getElementById(`cursor-style-${userId}`);
  //   if (existingStyle) existingStyle.remove();
    
  //   // Create new style element
  //   const style = document.createElement('style');
  //   style.id = `cursor-style-${userId}`;
  //   style.textContent = `
  //     /* Blinking cursor line */
  //     .cursor-line-${userId}::before {
  //       content: '';
  //       position: absolute;
  //       top: 0;
  //       left: -1px;
  //       width: 2px;
  //       height: 100%;
  //       background: ${color};
  //       z-index: 1000;
  //       animation: cursor-blink-${userId} 1.2s ease-in-out infinite;
  //       pointer-events: none;
  //       box-shadow: 0 0 8px ${color}40;
  //     }
      
  //     /* Username label */
  //     .cursor-label-${userId}::after {
  //       content: '${userName.replace(/'/g, "\\'")}';
  //       position: absolute;
  //       top: -32px;
  //       left: -1px;
  //       background: ${color};
  //       color: white;
  //       padding: 4px 10px;
  //       border-radius: 8px;
  //       font-size: 11px;
  //       font-weight: 600;
  //       white-space: nowrap;
  //       z-index: 1001;
  //       max-width: 150px;
  //       overflow: hidden;
  //       text-overflow: ellipsis;
  //       pointer-events: none;
  //       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  //       border: 1px solid ${color}80;
  //     }
      
  //     /* Enhanced blinking animation */
  //     @keyframes cursor-blink-${userId} {
  //       0%, 50% { 
  //         opacity: 1; 
  //         transform: scaleX(1) scaleY(1);
  //       }
  //       51%, 100% { 
  //         opacity: 0.3; 
  //         transform: scaleX(0.8) scaleY(1.1);
  //       }
  //     }
      
  //     /* Hover effects */
  //     .cursor-line-${userId}:hover::before {
  //       animation-play-state: paused;
  //       opacity: 1;
  //       box-shadow: 0 0 12px ${color}60;
  //     }
      
  //     .cursor-line-${userId}:hover + .cursor-label-${userId}::after {
  //       opacity: 1;
  //       transform: scale(1.05);
  //     }
  //   `;
    
  //   document.head.appendChild(style);
  // }, []);

  // Clean up cursor styles when users leave
  const removeCursorStyles = useCallback((userId: string) => {
    const cursorStyle = document.getElementById(`cursor-style-${userId}`);
    if (cursorStyle) cursorStyle.remove();
    
    // Remove decorations
    if (editorRef.current && decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
      delete decorationsRef.current[userId];
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveAllFiles();
            break;
          case 'e':
            e.preventDefault();
            if (activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable) {
              executeCode();
            }
            break;
          case 'p':
            e.preventDefault();
            togglePanel('preview');
            break;
          case 'k':
            e.preventDefault();
            if (layout.chat === 'expanded') {
              togglePanel('chat');
            } else if (layout.participants === 'expanded') {
              togglePanel('participants');
            } else {
              togglePanel('chat');
            }
            break;
          case 'n':
            e.preventDefault();
            if (isHost) {
              setShowNewFileModal(true);
            }
            break;
          case 'i':
            e.preventDefault();
            if (isHost) {
              setShowInviteModal(true);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, isHost, layout, togglePanel]);

  // Fetch session data
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

  // Socket event handlers with enhanced cursor support
  useEffect(() => {
    if (!socket || !connected || !sessionId || !user?.id) {
      if (socket && !connected) {
        setSyncStatus('offline');
      }
      return;
    }

    socket.emit('join-session', sessionId);

    socket.on('session-joined', (data) => {
      setSessionJoined(true);
      setParticipantCount(data.participantCount || 1);
      setSyncStatus('synced');
      fetchSessionData();
    });

    socket.on('user-joined', (data) => {
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      const newUser: OnlineUser = {
        userId: data.userId,
        userEmail: data.userEmail,
        displayName: data.userDisplayName || data.userEmail?.split('@')[0] || 'Anonymous',
        socketId: data.socketId || socket.id!,
        joinedAt: new Date(data.timestamp),
        isOnline: true
      };
      
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, newUser];
      });
    });

    socket.on('user-left', (data) => {
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      
      // Remove all cursor decorations for this user
      setCursors(prev => {
        const newCursors = { ...prev };
        Object.keys(newCursors).forEach(key => {
          if (key.startsWith(data.userId)) {
            delete newCursors[key];
          }
        });
        return newCursors;
      });
      
      // Clean up cursor styles
      removeCursorStyles(data.userId);
    });

    // Enhanced cursor position handling
    socket.on('cursor-position', (data) => {
      console.log('👥 RECEIVED cursor position from:', data.userName, 'at line', data.position.lineNumber, 'col', data.position.column);
      
      if (data.userId === user?.id) {
        console.log('⏭️ Ignoring own cursor position');
        return;
      }
      
      const cursorKey = `${data.userId}-${data.fileId}`;
      const userColor = getUserColor(data.userId);
      
      // Update cursor state immediately
      setCursors(prev => {
        const newCursors = {
          ...prev,
          [cursorKey]: {
            userId: data.userId,
            userName: data.userName,
            fileId: data.fileId,
            position: data.position,
            selection: data.selection,
            color: userColor,
            timestamp: data.timestamp
          }
        };
        
        console.log('🎯 Updated cursors state, total cursors:', Object.keys(newCursors).length);
        
        return newCursors;
      });
      
      // Apply decoration if it's for the active file
      if (data.fileId === activeFileId && editorRef.current && monacoRef.current) {
        console.log('🚀 Applying cursor decoration for active file');
        
        setTimeout(() => {
          updateCursorDecorations({
            userId: data.userId,
            userName: data.userName,
            fileId: data.fileId,
            position: data.position,
            selection: data.selection,
            color: userColor,
            timestamp: data.timestamp
          }, userColor);
        }, 50);
      }
    });

    socket.on('file-update', (data) => {
      if (data.userId === user.id) return;
      
      isRemoteUpdateRef.current[data.fileId] = true;
      
      setFiles(prev => prev.map(file => 
        file.id === data.fileId ? { ...file, content: data.content } : file
      ));
      
      lastCodeChangeRef.current[data.fileId] = data.content;
      
      if (data.fileId === activeFileId && editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== data.content) {
          const position = editorRef.current.getPosition();
          editorRef.current.setValue(data.content);
          if (position) {
            editorRef.current.setPosition(position);
          }
        }
      }
      
      setTimeout(() => {
        isRemoteUpdateRef.current[data.fileId] = false;
      }, 100);
    });

    socket.on('chat-message', (message) => {
      setChatError('');
      if (!messageIdRef.current.has(message.id)) {
        messageIdRef.current.add(message.id);
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('session-ended', (data) => {
      setShowSessionEndedModal(true);
      setSessionEndedReason(data.reason || 'The host has ended this session');
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    });

    return () => {
      socket.off('session-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-position');
      socket.off('file-update');
      socket.off('chat-message');
      socket.off('session-ended');
    };
  }, [socket, connected, sessionId, user?.id, router, activeFileId, fetchSessionData, getUserColor, updateCursorDecorations, removeCursorStyles]);

  // Handle editor changes
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value || !socket || !connected || !activeFileId) return;
    
    if (isRemoteUpdateRef.current[activeFileId]) {
      return;
    }
    
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

  // Enhanced editor mount with cursor tracking
  // const handleEditorDidMount = (editor: any, monaco: any) => {
  //   editorRef.current = editor;
  //   monacoRef.current = monaco;
    
  //   editor.updateOptions({
  //     fontSize: isMobile ? 13 : 15,
  //     fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
  //     fontLigatures: true,
  //     lineHeight: 1.6,
  //     minimap: { enabled: !isMobile },
  //     scrollBeyondLastLine: false,
  //     wordWrap: 'on',
  //     automaticLayout: true,
  //     theme: 'vs-dark',
  //     tabSize: 2,
  //     insertSpaces: true,
  //     cursorBlinking: 'smooth',
  //     cursorSmoothCaretAnimation: 'on',
  //     lineNumbers: isMobile ? 'off' : 'on',
  //     glyphMargin: !isMobile,
  //     folding: !isMobile,
  //     renderLineHighlight: 'line',
  //     renderWhitespace: 'selection',
  //     smoothScrolling: true,
  //     mouseWheelScrollSensitivity: 1,
  //     fastScrollSensitivity: 5,
  //     scrollbar: {
  //       vertical: 'auto',
  //       horizontal: 'auto',
  //       useShadows: true,
  //       verticalHasArrows: false,
  //       horizontalHasArrows: false
  //     }
  //   });

  //   if (activeFile) {
  //     editor.setValue(activeFile.content);
  //   }

  //   // Enhanced cursor position tracking
  //   if (socket && connected && sessionId && user) {
  //     editor.onDidChangeCursorPosition((e: any) => {
  //       const position = e.position;
  //       const selection = editor.getSelection();
        
  //       socket.emit('cursor-position', {
  //         sessionId,
  //         fileId: activeFileId,
  //         userId: user.id,
  //         userName: user.displayName || user.name || 'Anonymous',
  //         position: {
  //           lineNumber: position.lineNumber,
  //           column: position.column
  //         },
  //         selection: selection ? {
  //           startLineNumber: selection.startLineNumber,
  //           startColumn: selection.startColumn,
  //           endLineNumber: selection.endLineNumber,
  //           endColumn: selection.endColumn
  //         } : null,
  //         timestamp: Date.now()
  //       });
  //     });
      
  //     // Also track selection changes
  //     editor.onDidChangeCursorSelection((e: any) => {
  //       const selection = e.selection;
        
  //       socket.emit('cursor-position', {
  //         sessionId,
  //         fileId: activeFileId,
  //         userId: user.id,
  //         userName: user.displayName || user.name || 'Anonymous',
  //         position: {
  //           lineNumber: selection.endLineNumber,
  //           column: selection.endColumn
  //         },
  //         selection: {
  //           startLineNumber: selection.startLineNumber,
  //           startColumn: selection.startColumn,
  //           endLineNumber: selection.endLineNumber,
  //           endColumn: selection.endColumn
  //         },
  //         timestamp: Date.now()
  //       });
  //     });
  //   }
  // };
// FIXED editor mount that preserves input functionality
const handleEditorDidMount = (editor: any, monaco: any) => {
  editorRef.current = editor;
  monacoRef.current = monaco;
  
  // Configure editor normally
  editor.updateOptions({
    fontSize: isMobile ? 13 : 15,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
    // IMPORTANT: Don't disable input features
    readOnly: false, // Ensure it's not read-only
    renderValidationDecorations: 'on',
  });

  if (activeFile) {
    editor.setValue(activeFile.content);
  }

  // GENTLE focus - don't force it aggressively
  setTimeout(() => {
    editor.focus();
  }, 100);

  // Cursor tracking (same as before)
  if (socket && connected && sessionId && user) {
    editor.onDidChangeCursorPosition((e: any) => {
      const position = e.position;
      const selection = editor.getSelection();
      
      socket.emit('cursor-position', {
        sessionId,
        fileId: activeFileId,
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
  }
};


  // Update cursor decorations when cursors change or active file changes
  useEffect(() => {
    if (editorRef.current && activeFile && cursors) {
      // Clear all existing decorations
      Object.keys(decorationsRef.current).forEach(userId => {
        if (decorationsRef.current[userId]) {
          editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
        }
      });
      decorationsRef.current = {};
      
      // Apply decorations for current file
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
          updateCursorDecorations(cursor, cursor.color);
        }
      });
    }
  }, [cursors, activeFile, user?.id, updateCursorDecorations]);

  // Fixed execute code function
  const executeCode = useCallback(async () => {
    if (!activeFile || isExecuting) {
      console.log('❌ Cannot execute: No active file or already executing');
      return;
    }

    console.log('🚀 Starting code execution for:', activeFile.name, activeFile.language);
    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      const startTime = performance.now();
      
      // Get the latest content from Monaco editor or fallback to file content
      let codeToExecute = activeFile.content;
      if (editorRef.current) {
        codeToExecute = editorRef.current.getValue();
        console.log('📝 Using content from Monaco editor, length:', codeToExecute.length);
      } else {
        console.log('📝 Using content from file state, length:', codeToExecute.length);
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('📡 Sending execution request...');
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

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const executionTime = Math.round(performance.now() - startTime);

      console.log('✅ Execution completed:', {
        hasOutput: !!result.output,
        hasError: !!result.error,
        executionTime
      });

      setExecutionResult({
        output: result.output || '',
        error: result.error || '',
        executionTime,
        language: activeFile.language
      });

      // Switch to output mode to show results
      switchMode('output');

    } catch (error) {
      console.error('❌ Execution error:', error);
      
      setExecutionResult({
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: 0,
        language: activeFile.language
      });

      // Still switch to output mode to show the error
      switchMode('output');
    } finally {
      setIsExecuting(false);
    }
  }, [activeFile, isExecuting, sessionId, switchMode]);

  // Create new file
  const createNewFile = async () => {
    if (!newFileName.trim() || !socket || !connected) return;
    
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
  };

  // Delete file
  const deleteFile = async (fileId: string) => {
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
          } else {
            setActiveFileId(null);
          }
        }
        
        socket?.emit('file-deleted', { sessionId, fileId });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Save all files
  const saveAllFiles = async () => {
    try {
      if (activeFileId && editorRef.current) {
        const currentContent = editorRef.current.getValue();
        const updatedFiles = files.map(file => 
          file.id === activeFileId ? { ...file, content: currentContent } : file
        );
        
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/sessions/${sessionId}/save`, {
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
  };

  // Send chat message
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

  // Handle enter key in chat
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Remove participant
  const removeParticipant = useCallback((participantId: string) => {
    if (!isHost || !socket || !connected) return;
    
    socket.emit('remove-participant', {
      sessionId,
      participantId
    });
    
    setShowParticipantMenu(null);
  }, [isHost, socket, connected, sessionId]);

  // Copy session link
  const copySessionLink = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link);
  };

  // Export session
  const exportSession = async () => {
    if (!session) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    const currentFiles = files.map(file => {
      if (file.id === activeFileId && editorRef.current) {
        return { ...file, content: editorRef.current.getValue() };
      }
      return file;
    });
    
    currentFiles.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    const readme = `# ${session.title}

## Description
${session.description || 'No description provided'}

## Files
${currentFiles.map(f => `- ${f.name} (${f.language})`).join('\n')}

## Session Info
- Created: ${new Date(session.createdAt).toLocaleString()}
- Type: ${session.type}
- Status: ${session.isActive ? 'Active' : 'Ended'}
`;
    zip.file('README.md', readme);
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate preview HTML
  const generatePreview = () => {
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
  };

  // End session
  const handleEndSession = async () => {
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
        
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to end session');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      alert('Failed to end session. Please try again.');
    } finally {
      setEndSessionLoading(false);
      setShowEndSessionModal(false);
    }
  };

  // Modern Quick Actions Bar Component
  const QuickActionsBar = () => (
    <div className="flex items-center justify-between p-3 bg-slate-900/95 border-b border-slate-700/50 backdrop-blur-xl">
      <div className="flex items-center space-x-3">
        {/* Layout Mode Selector */}
        <div className="flex items-center space-x-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
          <Button
            size="sm"
            variant={layout.mode === 'focus' ? 'default' : 'ghost'}
            onClick={() => switchMode('focus')}
            className={cn(
              "h-8 px-3 rounded-lg transition-all duration-200",
              layout.mode === 'focus' 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                : "hover:bg-slate-700/50 text-slate-300"
            )}
            title="Focus Mode (Escape)"
          >
            <Layout className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Focus</span>
          </Button>

          <Button
            size="sm"
            variant={layout.participants === 'expanded' ? 'default' : 'ghost'}
            onClick={() => togglePanel('participants')}
            className={cn(
              "h-8 px-3 rounded-lg relative transition-all duration-200",
              layout.participants === 'expanded'
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "hover:bg-slate-700/50 text-slate-300"
            )}
            title="Participants"
          >
            <Users className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">People</span>
            {participantCount > 1 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 text-xs flex items-center justify-center bg-emerald-600 border-0 shadow-lg shadow-emerald-600/25">
                {participantCount}
              </Badge>
            )}
          </Button>

          <Button
            size="sm"
            variant={layout.chat === 'expanded' ? 'default' : 'ghost'}
            onClick={() => togglePanel('chat')}
            className={cn(
              "h-8 px-3 rounded-lg relative transition-all duration-200",
              layout.chat === 'expanded'
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                : "hover:bg-slate-700/50 text-slate-300"
            )}
            title="Chat"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Chat</span>
            {messages.length > 0 && layout.chat !== 'expanded' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            )}
          </Button>

          <Button
            size="sm"
            variant={layout.preview === 'expanded' ? 'default' : 'ghost'}
            onClick={() => togglePanel('preview')}
            className={cn(
              "h-8 px-3 rounded-lg transition-all duration-200",
              layout.preview === 'expanded'
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                : "hover:bg-slate-700/50 text-slate-300"
            )}
            title="Preview Mode"
          >
            <Eye className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            size="sm"
            variant={layout.output === 'expanded' ? 'default' : 'ghost'}
            onClick={() => togglePanel('output')}
            className={cn(
              "h-8 px-3 rounded-lg transition-all duration-200",
              layout.output === 'expanded'
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                : "hover:bg-slate-700/50 text-slate-300"
            )}
            title="Output Mode"
          >
            <Terminal className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Output</span>
          </Button>
        </div>

        {/* File Actions */}
        <div className="flex items-center space-x-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
          <Button
            size="sm"
            variant="ghost"
            onClick={saveAllFiles}
            className="h-8 px-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-200"
            title="Save All (Ctrl+S)"
          >
            <Save className="h-3 w-3" />
          </Button>

          {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={executeCode}
              disabled={isExecuting}
              className={cn(
                "h-8 px-3 rounded-lg transition-all duration-200",
                isExecuting 
                  ? "text-emerald-400 bg-emerald-500/10" 
                  : "hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300"
              )}
              title="Run Code (Ctrl+E)"
            >
              {isExecuting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
          )}

          {isHost && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewFileModal(true)}
              className="h-8 px-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-200"
              title="New File (Ctrl+N)"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Session Actions */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
          <Button
            size="sm"
            variant="ghost"
            onClick={copySessionLink}
            className="h-8 px-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-200"
            title="Share Link"
          >
            <Share2 className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={exportSession}
            className="h-8 px-3 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-200"
            title="Export Session"
          >
            <Download className="h-3 w-3" />
          </Button>

          {isHost && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInviteModal(true)}
                className="h-8 px-3 rounded-lg hover:bg-blue-500/10 hover:text-blue-400 text-slate-300 transition-all duration-200"
                title="Invite Users"
              >
                <UserPlus className="h-3 w-3" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowEndSessionModal(true)}
                disabled={endSessionLoading}
                className="h-8 px-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-slate-300 transition-all duration-200"
                title="End Session"
              >
                {endSessionLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <StopCircle className="h-3 w-3" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket && sessionId) {
        socket.emit('leave-session', sessionId);
      }
      
      // Clear all timeouts
      Object.values(syncTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      
      // Remove all cursor styles
      Object.keys(cursors).forEach(cursorKey => {
        const userId = cursorKey.split('-')[0];
        removeCursorStyles(userId);
      });
      
      // Clear decorations
      decorationsRef.current = {};
    };
  }, [socket, sessionId, cursors, removeCursorStyles]);

  // Loading states
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Authentication Required</h2>
              <p className="text-slate-400 mb-4">Please log in to access this collaboration session.</p>
              <Button 
                onClick={() => router.push('/auth/login')}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" />
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Joining Session</h2>
                <p className="text-slate-400">
                  {loading ? 'Loading session data...' : 'Establishing connection...'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
          <div className="text-center space-y-6">
            <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
              <WifiOff className="h-16 w-16 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Connection Failed</h2>
              <p className="text-slate-400 mb-6">Unable to connect to the collaboration server.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 bg-slate-900/95 border-slate-800 backdrop-blur-xl">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" />
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Joining Session</h2>
                <p className="text-slate-400">Setting up your collaborative workspace...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Main session interface with modern styling
  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Modern Session Header */}
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

      {/* Modern Quick Actions Bar */}
      <QuickActionsBar />

      {/* Main Content Area with Modern Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Separate Chat Panel */}
        {layout.chat === 'expanded' && (
          <>
            <div 
              className="flex-shrink-0 transition-all duration-300 ease-out"
              style={{ width: `${sidebarPanel.width}px` }}
            >
              <ChatPanel
                user={user}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                chatError={chatError}
                connected={connected}
                isSendingMessage={isSendingMessage}
                sendMessage={sendMessage}
                handleChatKeyPress={handleChatKeyPress}
                messagesEndRef={messagesEndRef}
                getUserColor={getUserColor}
                onClose={() => togglePanel('chat')}
              />
            </div>
            <div 
              className="w-1 bg-slate-700/50 hover:bg-emerald-500/50 cursor-col-resize transition-all duration-200 relative group"
              onMouseDown={sidebarPanel.startResize}
            >
              <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-emerald-500/10" />
            </div>
          </>
        )}

        {/* Separate Participants Panel */}
        {layout.participants === 'expanded' && (
          <>
            <div 
              className="flex-shrink-0 transition-all duration-300 ease-out"
              style={{ width: `${sidebarPanel.width}px` }}
            >
              <ParticipantsPanel
                user={user}
                session={session}
                isHost={isHost}
                onlineUsers={onlineUsers}
                participantCount={participantCount}
                getUserColor={getUserColor}
                showParticipantMenu={showParticipantMenu}
                setShowParticipantMenu={setShowParticipantMenu}
                removeParticipant={removeParticipant}
                onClose={() => togglePanel('participants')}
              />
            </div>
            <div 
              className="w-1 bg-slate-700/50 hover:bg-blue-500/50 cursor-col-resize transition-all duration-200 relative group"
              onMouseDown={sidebarPanel.startResize}
            >
              <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-blue-500/10" />
            </div>
          </>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Modern File Tabs */}
          <FileTabs
            files={files}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            isHost={isHost}
            showNewFileModal={() => setShowNewFileModal(true)}
            fileCreationLoading={fileCreationLoading}
            deleteFile={deleteFile}
            executeCode={executeCode}
            isExecuting={isExecuting}
            activeFile={activeFile}
          />

          {/* Editor and Panels Container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div className={cn(
              "flex-1 min-w-0",
              (layout.preview === 'expanded' || layout.output === 'expanded') && !isMobile && "border-r border-slate-700/50"
            )}>
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
                  className="w-1 bg-slate-700/50 hover:bg-purple-500/50 cursor-col-resize transition-all duration-200 relative group"
                  onMouseDown={outputPanel.startResize}
                >
                  <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-purple-500/10" />
                </div>
                <div 
                  className="flex-shrink-0 transition-all duration-300 ease-out"
                  style={{ width: `${outputPanel.width}px` }}
                >
                  <PreviewPanel
                    isPreviewVisible={true}
                    setIsPreviewVisible={() => togglePanel('preview')}
                    generatePreview={generatePreview}
                    session={session}
                    activeFile={activeFile}
                  />
                </div>
              </>
            )}

            {/* Enhanced Output Panel */}
            {layout.output === 'expanded' && (
              <>
                <div 
                  className="w-1 bg-slate-700/50 hover:bg-orange-500/50 cursor-col-resize transition-all duration-200 relative group"
                  onMouseDown={outputPanel.startResize}
                >
                  <div className="absolute inset-y-0 -inset-x-2 group-hover:bg-orange-500/10" />
                </div>
                <div 
                  className="flex-shrink-0 transition-all duration-300 ease-out bg-slate-900/95 border-l border-slate-700/50 backdrop-blur-xl"
                  style={{ width: `${outputPanel.width}px` }}
                >
                  <div className="h-full flex flex-col">
                    {/* Enhanced Output Header */}
                    <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                            <Terminal className="h-4 w-4 text-orange-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-100">Code Output</h3>
                            <p className="text-xs text-slate-400">
                              {activeFile ? `${activeFile.language} execution` : 'No active file'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={executeCode}
                            disabled={isExecuting || !activeFile}
                            className="hover:bg-orange-500/10 hover:text-orange-400 border-slate-700/50 transition-all duration-200"
                            title="Re-run code"
                          >
                            {isExecuting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => switchMode('focus')}
                            className="hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                            title="Close Output"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Output Content */}
                    <div className="flex-1 p-4 overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                      {isExecuting ? (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                          <div className="text-center space-y-4">
                            <div className="p-4 bg-orange-500/10 rounded-full w-fit mx-auto">
                              <Loader2 className="h-12 w-12 animate-spin text-orange-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-100">Executing Code</p>
                              <p className="text-sm text-slate-400">
                                Running {activeFile?.language} code...
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : executionResult ? (
                        <div className="space-y-4">
                          {/* Enhanced Execution Status */}
                          <div className={cn(
                            "px-4 py-3 rounded-xl text-sm border backdrop-blur-sm",
                            executionResult.error 
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          )}>
                            <div className="flex items-center gap-3">
                              {executionResult.error ? (
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                              ) : (
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <div className="font-semibold">
                                  {executionResult.error ? "Execution Failed" : "Execution Successful"}
                                </div>
                                <div className="text-xs opacity-80 mt-1">
                                  Completed in {executionResult.executionTime}ms
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Output Display */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                {executionResult.error ? "Error Details:" : "Program Output:"}
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const content = executionResult.error || executionResult.output || '';
                                  navigator.clipboard.writeText(content);
                                }}
                                className="h-7 px-3 text-xs hover:bg-slate-700/50 border-slate-700/50 transition-all duration-200"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            
                            <pre className={cn(
                              "text-sm whitespace-pre-wrap font-mono p-4 rounded-xl border overflow-auto max-h-96 backdrop-blur-sm",
                              executionResult.error 
                                ? "bg-red-500/5 border-red-500/20 text-red-300"
                                : "bg-slate-800/50 border-slate-700/30 text-slate-200"
                            )}>
                              {executionResult.error || executionResult.output || 'No output generated'}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                          <div className="space-y-6">
                            <div className="p-6 bg-orange-500/5 rounded-full w-fit mx-auto">
                              <Terminal className="h-16 w-16 text-orange-400/50" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-100 mb-2 text-lg">Ready to Execute</h3>
                              <p className="text-sm text-slate-400 mb-6 max-w-xs">
                                Click the "Run Code" button or press Ctrl+E to execute your code
                              </p>
                              {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
                                <Button
                                  onClick={executeCode}
                                  disabled={isExecuting}
                                  className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/25"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Code
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Quick Actions */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-40">
          <Button
            onClick={() => togglePanel('participants')}
            className={cn(
              "rounded-full shadow-xl backdrop-blur-xl transition-all duration-300 border-0",
              layout.participants === 'expanded' 
                ? "bg-blue-600 text-white shadow-blue-600/40" 
                : "bg-slate-800/90 border border-slate-700/50 text-slate-300 hover:bg-slate-700/90"
            )}
          >
            <Users className="h-4 w-4 mr-2" />
            People
            {participantCount > 1 && (
              <Badge className="ml-2 bg-emerald-600 text-white text-xs border-0 shadow-lg shadow-emerald-600/25">
                {participantCount}
              </Badge>
            )}
          </Button>

          <Button
            onClick={() => togglePanel('chat')}
            className={cn(
              "rounded-full shadow-xl backdrop-blur-xl transition-all duration-300 border-0",
              layout.chat === 'expanded' 
                ? "bg-emerald-600 text-white shadow-emerald-600/40" 
                : "bg-slate-800/90 border border-slate-700/50 text-slate-300 hover:bg-slate-700/90"
            )}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
            {messages.length > 0 && layout.chat !== 'expanded' && (
              <Badge className="ml-2 bg-emerald-600 text-white text-xs border-0 shadow-lg shadow-emerald-600/25">
                {messages.length}
              </Badge>
            )}
          </Button>
          
          {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className="rounded-full bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/40 backdrop-blur-xl border-0"
            >
              {isExecuting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run
            </Button>
          )}
        </div>
      )}

      {/* Modern Status Bar */}
      <div className="bg-slate-900/95 border-t border-slate-700/50 px-4 py-2 flex items-center justify-between text-xs text-slate-400 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs border-slate-700/50 bg-slate-800/50">
              {activeFile ? languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language : 'No file'}
            </Badge>
            {activeFile && (
              <span className="text-slate-500">{activeFile.content.split('\n').length} lines</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              connected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-red-400"
            )} />
            <span>{participantCount} online</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{files.length} files</span>
          </div>

          \          <Badge className={cn(
            "text-xs border-0 shadow-sm",
            syncStatus === 'synced' && "bg-emerald-500/10 text-emerald-400",
            syncStatus === 'syncing' && "bg-blue-500/10 text-blue-400",
            syncStatus === 'error' && "bg-red-500/10 text-red-400",
            syncStatus === 'offline' && "bg-slate-700 text-slate-400"
          )}>
            {syncStatus === 'syncing' && <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />}
            {syncStatus === 'synced' && <CheckCircle className="h-2.5 w-2.5 mr-1" />}
            {syncStatus === 'error' && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
            {syncStatus === 'offline' && <WifiOff className="h-2.5 w-2.5 mr-1" />}
            {syncStatus}
          </Badge>
        </div>
      </div>

      {/* Modals */}
      {showNewFileModal && (
        <NewFileModal
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileLanguage={newFileLanguage}
          setNewFileLanguage={setNewFileLanguage}
          fileCreationLoading={fileCreationLoading}
          createNewFile={createNewFile}
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
          sessionTitle={session?.title}
        />
      )}
    </div>
  );
}

