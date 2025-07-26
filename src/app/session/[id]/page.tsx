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
//   StopCircle, LogOut, Trash2, Loader2, XCircle 
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

// export default function SessionPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
//   const { socket, connected, connecting } = useSocket();
  
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
  
//   // Code execution state
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
//   const [showOutput, setShowOutput] = useState(false);
  
//   // UI state
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false);
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
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [inviteLoading, setInviteLoading] = useState(false);
//   const [endSessionLoading, setEndSessionLoading] = useState(false);
  
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
//   const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
//   const getUserColor = useCallback((userId: string) => {
//     const hash = userId.split('').reduce((a, b) => {
//       a = ((a << 5) - a) + b.charCodeAt(0);
//       return a & a;
//     }, 0);
//     return userColors[Math.abs(hash) % userColors.length];
//   }, []);

//   // Cursor decoration functions
//   const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
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
        
//         // Load files
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
        
//         // FIX: Load chat messages from database
//         if (data.session.messages && Array.isArray(data.session.messages)) {
//           console.log('💬 Loading messages:', data.session.messages.length);
          
//           // Clear existing message IDs and add new ones
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
        
//         // Initialize lastCodeChangeRef for all files
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

//   // Socket event handlers with cursor tracking
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

//     // Join session
//     socket.emit('join-session', sessionId);

//     // Session events
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
      
//       // Remove cursors when user leaves
//       setCursors(prev => {
//         const newCursors = { ...prev };
//         Object.keys(newCursors).forEach(key => {
//           if (key.startsWith(data.userId)) {
//             delete newCursors[key];
//           }
//         });
//         return newCursors;
//       });

//       // Remove decorations
//       if (editorRef.current && decorationsRef.current[data.userId]) {
//         editorRef.current.deltaDecorations(decorationsRef.current[data.userId], []);
//         delete decorationsRef.current[data.userId];
//       }

//       // Clean up cursor styles
//       const cursorStyle = document.getElementById(`cursor-style-${data.userId}`);
//       const selectionStyle = document.getElementById(`selection-style-${data.userId}`);
//       if (cursorStyle) cursorStyle.remove();
//       if (selectionStyle) selectionStyle.remove();
//     });

//     // Cursor tracking events
//     // socket.on('cursor-position', (data) => {
//     //   if (data.userId === user?.id) return; // Don't show own cursor
      
//     //   const cursorKey = `${data.userId}-${data.fileId}`;
//     //   const userColor = getUserColor(data.userId);
      
//     //   setCursors(prev => ({
//     //     ...prev,
//     //     [cursorKey]: {
//     //       ...data,
//     //       color: userColor
//     //     }
//     //   }));
      
//     //   // Update cursor decoration in Monaco if it's the active file
//     //   if (data.fileId === activeFileId && editorRef.current) {
//     //     updateCursorDecorations(data, userColor);
//     //   }
//     // });

//     // socket.on('cursor-selection', (data) => {
//     //   if (data.userId === user?.id) return;
      
//     //   const cursorKey = `${data.userId}-${data.fileId}`;
//     //   const userColor = getUserColor(data.userId);
      
//     //   setCursors(prev => ({
//     //     ...prev,
//     //     [cursorKey]: {
//     //       ...prev[cursorKey],
//     //       selection: data.selection,
//     //       color: userColor
//     //     }
//     //   }));
      
//     //   if (data.fileId === activeFileId && editorRef.current) {
//     //     updateSelectionDecorations(data, userColor);
//     //   }
//     // });

//     // socket.on('cursor-position', (data) => {
//     //   console.log('👁️ RECEIVED cursor from:', data.userName, 'at:', data.position);
//     //   console.log('👁️ Full cursor data:', data);
//     //   if (data.userId === user?.id) return;
      
//     //   const cursorKey = `${data.userId}-${data.fileId}`;
//     //   const userColor = getUserColor(data.userId);
      
//     //   setCursors(prev => ({
//     //     ...prev,
//     //     [cursorKey]: {
//     //       ...data,
//     //       color: userColor
//     //     }
//     //   }));
//     // });

//     socket.on('cursor-position', (data) => {
//       console.log('👁️ FRONTEND received cursor from:', data.userName, 'at:', data.position);
//       console.log('👁️ Full data:', data);
      
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
//     // File update events
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
      
//       // Update editor if this is the active file
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

//     // File creation events
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

//     // File deletion events
//     socket.on('file-deleted', (data: { fileId: string }) => {
//       console.log('🗑️ File deleted by another user:', data.fileId);
      
//       setFiles(prev => prev.filter(f => f.id !== data.fileId));
      
//       // Handle active file switching
//       setActiveFileId(prevActiveId => {
//         if (data.fileId === prevActiveId) {
//           return null; // Will be handled by useEffect
//         }
//         return prevActiveId;
//       });
//     });

//     // Session ended event
//     socket.on('session-ended', (data) => {
//       console.log('🛑 Session ended by host:', data);
      
//       setShowSessionEndedModal(true);
//       setSessionEndedReason(data.reason || 'The host has ended this session');
      
//       // Automatically redirect after a delay
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 3000);
//     });

//     // Handle being kicked out by host
//     socket.on('participant-kicked', (data) => {
//       console.log('🚫 You were removed from the session:', data);
//       alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`);
//       router.push('/dashboard');
//     });

//     // Handle force disconnect
//     socket.on('force-disconnect', (data) => {
//       console.log('⚠️ Force disconnected:', data);
//       router.push('/dashboard');
//     });

//     // Chat events
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

//     // Cleanup function
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
//   }, [socket, connected, sessionId, user?.id, router, activeFileId, getUserColor, updateCursorDecorations, updateSelectionDecorations]);

//   // Handle file editor changes
//   const handleEditorChange = useCallback((value: string | undefined) => {
//     if (!value || !socket || !connected || !activeFileId) return;
    
//     // Skip if this is a remote update
//     if (isRemoteUpdateRef.current[activeFileId]) {
//       return;
//     }
    
//     // Update local file immediately
//     setFiles(prev => prev.map(file => 
//       file.id === activeFileId ? { ...file, content: value } : file
//     ));
    
//     // Only broadcast if the change is different from last known state
//     if (lastCodeChangeRef.current[activeFileId] !== value) {
//       lastCodeChangeRef.current[activeFileId] = value;
//       setSyncStatus('syncing');
      
//       // Clear existing timeout
//       if (syncTimeoutRef.current[activeFileId]) {
//         clearTimeout(syncTimeoutRef.current[activeFileId]);
//       }
      
//       // Fast debounce for real-time feel
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
//       fontSize: 14,
//       minimap: { enabled: false },
//       scrollBeyondLastLine: false,
//       wordWrap: 'on',
//       automaticLayout: true,
//       theme: 'vs-dark',
//       tabSize: 2,
//       insertSpaces: true,
//       cursorBlinking: 'smooth',
//       cursorSmoothCaretAnimation: 'on',
//       smoothScrolling: true
//     });

//     // Set initial value if we have an active file
//     if (activeFile) {
//       editor.setValue(activeFile.content);
//     }

//     // Add cursor tracking if socket is available
//     if (socket && connected && sessionId && user) {
//       // Track cursor position changes
//       editor.onDidChangeCursorPosition((e: any) => {
//         const position = e.position;
//         const selection = editor.getSelection();
        
//         // Emit cursor position to other users
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

//       // Track selection changes
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

//   // Create new file
//   const createNewFile = async () => {
//     if (!newFileName.trim() || !socket || !connected) {
//       return;
//     }
    
//     // Check for duplicate names
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
        
//         // Update local state
//         setFiles(prev => [...prev, newFile]);
//         setActiveFileId(newFile.id);
//         lastCodeChangeRef.current[newFile.id] = newFile.content;
        
//         // Clear form
//         setNewFileName('');
//         setNewFileLanguage('javascript');
//         setShowNewFileModal(false);
        
//         // Broadcast to other users
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
        
//         // Switch to first remaining file if deleted file was active
//         if (fileId === activeFileId) {
//           const remainingFiles = files.filter(f => f.id !== fileId);
//           if (remainingFiles.length > 0) {
//             setActiveFileId(remainingFiles[0].id);
//           } else {
//             setActiveFileId(null);
//           }
//         }
        
//         // Broadcast file deletion
//         socket?.emit('file-deleted', { sessionId, fileId });
//       }
//     } catch (error) {
//       console.error('Failed to delete file:', error);
//     }
//   };

//   // Execute code
//   const executeCode = useCallback(async () => {
//     if (!activeFile || isExecuting) return;

//     setIsExecuting(true);
//     setShowOutput(true);
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

//   // End session
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
//         // Broadcast session end to all participants before redirecting
//         if (socket && connected) {
//           console.log('📡 Broadcasting session end to all participants');
//           socket.emit('end-session-broadcast', { 
//             sessionId,
//             reason: 'Session ended by host',
//             hostName: user?.displayName || 'Host'
//           });
//         }
        
//         // Small delay to ensure message is sent
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         // Redirect host to dashboard
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

//   // Auto-save functionality
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (files.length > 0 && connected) {
//         saveAllFiles();
//       }
//     }, 30000); // Auto-save every 30 seconds

//     return () => clearInterval(interval);
//   }, [files, connected]);

//   const saveAllFiles = async () => {
//     try {
//       // Include current editor content in save
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

//     const zip = new JSZip();
    
//     // Include current editor content
//     const currentFiles = files.map(file => {
//       if (file.id === activeFileId && editorRef.current) {
//         return { ...file, content: editorRef.current.getValue() };
//       }
//       return file;
//     });
    
//     // Add all files
//     currentFiles.forEach(file => {
//       zip.file(file.name, file.content);
//     });
    
//     // Add README
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
    
//     // Get current content if it's the active file
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

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (socket && sessionId) {
//         socket.emit('leave-session', sessionId);
//       }
//       // Clear all timeouts
//       Object.values(syncTimeoutRef.current).forEach(timeout => {
//         if (timeout) clearTimeout(timeout);
//       });
//       // Clean up cursor styles
//       Object.keys(cursors).forEach(cursorKey => {
//         const userId = cursorKey.split('-')[0];
//         const cursorStyle = document.getElementById(`cursor-style-${userId}`);
//         const selectionStyle = document.getElementById(`selection-style-${userId}`);
//         if (cursorStyle) cursorStyle.remove();
//         if (selectionStyle) selectionStyle.remove();
//       });
//     };
//   }, [socket, sessionId, cursors]);

//   // Loading states
//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to access this session.</p>
//           <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
//         </div>
//       </div>
//     );
//   }

//   if (loading || connecting) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//           <h2 className="text-xl font-bold text-gray-900 mb-2">{connectionStatus}</h2>
//           <p className="text-gray-600">
//             {loading ? 'Loading session data...' : 'Establishing real-time connection...'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!connected) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <WifiOff className="h-16 w-16 mx-auto mb-4 text-red-500" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
//           <p className="text-gray-600 mb-4">Unable to connect to the collaboration server.</p>
//           <div className="space-x-4">
//             <Button onClick={() => window.location.reload()}>
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Retry Connection
//             </Button>
//             <Button variant="outline" onClick={() => router.push('/dashboard')}>
//               Back to Dashboard
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!sessionJoined || !session) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Joining Session</h2>
//           <p className="text-gray-600">Setting up your collaborative workspace...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gray-100">
//       <SessionHeader 
//         session={session}
//         isHost={isHost}
//         connected={connected}
//         syncStatus={syncStatus}
//         participantCount={participantCount}
//         copySessionLink={copySessionLink}
//         saveAllFiles={saveAllFiles}
//         exportSession={exportSession}
//         isPreviewVisible={isPreviewVisible}
//         togglePreview={() => setIsPreviewVisible(!isPreviewVisible)}
//         showInviteModal={() => setShowInviteModal(true)}
//         showEndSessionModal={() => setShowEndSessionModal(true)}
//         endSessionLoading={endSessionLoading}
//       />

//       <div className="flex-1 flex overflow-hidden">
//         <div className="flex-1 flex flex-col">
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

//           <EditorArea
//             activeFile={activeFile}
//             handleEditorChange={handleEditorChange}
//             handleEditorDidMount={handleEditorDidMount}
//             isHost={isHost}
//             showNewFileModal={() => setShowNewFileModal(true)}
//             fileCreationLoading={fileCreationLoading}
//             showOutput={showOutput}
//             setShowOutput={setShowOutput}
//             isExecuting={isExecuting}
//             executionResult={executionResult}
//             // Pass cursor props
//             socket={socket}
//             connected={connected}
//             sessionId={sessionId}
//             user={user}
//             cursors={cursors}
//             setCursors={setCursors}
//             getUserColor={getUserColor}
//           />
//         </div>

//         <PreviewPanel
//           isPreviewVisible={isPreviewVisible}
//           setIsPreviewVisible={setIsPreviewVisible}
//           generatePreview={generatePreview}
//           session={session}
//         />

//         <Sidebar
//           user={user}
//           session={session}
//           isHost={isHost}
//           onlineUsers={onlineUsers}
//           participantCount={participantCount}
//           getUserColor={getUserColor}
//           showParticipantMenu={showParticipantMenu}
//           setShowParticipantMenu={setShowParticipantMenu}
//           removeParticipant={removeParticipant}
//           messages={messages}
//           newMessage={newMessage}
//           setNewMessage={setNewMessage}
//           chatError={chatError}
//           connected={connected}
//           isSendingMessage={isSendingMessage}
//           sendMessage={sendMessage}
//           handleChatKeyPress={handleChatKeyPress}
//           messagesEndRef={messagesEndRef}
//         />
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
//           closeModal={() => setShowInviteModal(false)}
//         />
//       )}

//       {showEndSessionModal && (
//         <EndSessionModal
//           endSessionLoading={endSessionLoading}
//           handleEndSession={handleEndSession}
//           closeModal={() => setShowEndSessionModal(false)}
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
  Users, MessageSquare, Download, Share2, ArrowLeft, Save, Play, 
  Plus, X, FileText, Terminal, UserPlus, Crown, Send, RefreshCw, 
  CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Copy, Eye, 
  EyeOff, MoreVertical, UserMinus, Mail, File, Code2, Settings, 
  StopCircle, LogOut, Trash2, Loader2, XCircle, Menu, Maximize2,
  Minimize2, PanelRight, PanelLeft, Grid3X3, Layout, Zap,
  Globe, Lock, Hash, UserCheck, MessageCircle, Sparkles
} from 'lucide-react';

// Components
import SessionHeader from './components/SessionHeader';
import FileTabs from './components/FileTabs';
import EditorArea from './components/EditorArea';
import PreviewPanel from './components/PreviewPanel';
import Sidebar from './components/Sidebar';
import NewFileModal from './components/NewFileModal';
import InviteModal from './components/InviteModal';
import EndSessionModal from './components/EndSessionModal';
import SessionEndedModal from './components/SessionEndedModal';

// Utils
import { languageConfigs } from './utils/languageConfigs';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface FileLock {
  lockedBy: string;
  lockedByUser: {
    id: string;
    displayName: string;
  };
}

// Enhanced Layout State Management
type LayoutMode = 'focus' | 'split' | 'preview' | 'chat' | 'output';
type PanelState = 'hidden' | 'collapsed' | 'expanded';

interface LayoutState {
  mode: LayoutMode;
  sidebar: PanelState;
  preview: PanelState;
  output: PanelState;
  fullscreen: boolean;
}

// Improved Resizable Panel Hook
const useResizablePanel = (
  initialWidth: number, 
  minWidth: number = 200, 
  maxWidth: number = 800,
  onResize?: (width: number) => void
) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setIsDragging(true);
    
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + diff));
      setWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [width, minWidth, maxWidth, onResize]);

  const setWidthAnimated = useCallback((newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);
    onResize?.(clampedWidth);
  }, [minWidth, maxWidth, onResize]);

  return { 
    width, 
    setWidth: setWidthAnimated, 
    startResize, 
    isResizing, 
    isDragging 
  };
};

// Enhanced Layout Management Hook
const useLayoutManager = () => {
  const [layout, setLayout] = useState<LayoutState>({
    mode: 'focus',
    sidebar: 'collapsed',
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
          preview: 'hidden',
          output: 'hidden'
        }));
      } else if (tablet) {
        setLayout(prev => ({
          ...prev,
          sidebar: prev.sidebar === 'hidden' ? 'collapsed' : prev.sidebar
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
            preview: 'hidden',
            output: 'hidden'
          };
        case 'split':
          return {
            ...prev,
            mode,
            sidebar: 'expanded',
            preview: 'hidden',
            output: 'hidden'
          };
        case 'preview':
          return {
            ...prev,
            mode,
            sidebar: 'collapsed',
            preview: 'expanded',
            output: 'hidden'
          };
        case 'chat':
          return {
            ...prev,
            mode,
            sidebar: 'expanded',
            preview: 'hidden',
            output: 'hidden'
          };
        case 'output':
          return {
            ...prev,
            mode,
            sidebar: 'collapsed',
            preview: 'hidden',
            output: 'expanded'
          };
        default:
          return prev;
      }
    });
  }, []);

  const togglePanel = useCallback((panel: keyof Omit<LayoutState, 'mode' | 'fullscreen'>) => {
    setLayout(prev => ({
      ...prev,
      [panel]: prev[panel] === 'hidden' ? 'expanded' : 'hidden'
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      fullscreen: !prev.fullscreen
    }));
  }, []);

  return {
    layout,
    isMobile,
    isTablet,
    switchMode,
    togglePanel,
    toggleFullscreen,
    setLayout
  };
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket, connected, connecting } = useSocket();
  
  // Enhanced Layout Management
  const { 
    layout, 
    isMobile, 
    isTablet, 
    switchMode, 
    togglePanel, 
    toggleFullscreen 
  } = useLayoutManager();
  
  // Enhanced Resizable Panels
  const sidebarPanel = useResizablePanel(320, 280, 500);
  const previewPanel = useResizablePanel(400, 300, 700);
  const outputPanel = useResizablePanel(350, 250, 600);
  
  // Session state
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionId] = useState(params.id as string);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // File and editor state
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileLanguage, setNewFileLanguage] = useState('javascript');
  const [fileCreationLoading, setFileCreationLoading] = useState(false);
  const [fileLocks, setFileLocks] = useState<{ [fileId: string]: FileLock | null }>({});
  const [lockRequests, setLockRequests] = useState<{ [fileId: string]: boolean }>({});
  
  // Code execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  
  // UI state
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

  // Enhanced UI state
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [activeHotkey, setActiveHotkey] = useState<string | null>(null);
  
  // Refs for sync management and cursor tracking
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<{ [key: string]: string[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef<Set<string>>(new Set());
  const isRemoteUpdateRef = useRef<{ [key: string]: boolean }>({});
  const syncTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Check if current user is host
  const isHost = session?.owner?.id === user?.id;

  // Get active file
  const activeFile = files.find(file => file.id === activeFileId);

  // User colors for cursors
  const userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB74D',
    '#81C784', '#64B5F6', '#F06292', '#A1887F'
  ];
  
  const getUserColor = useCallback((userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return userColors[Math.abs(hash) % userColors.length];
  }, []);

  // Enhanced Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveAllFiles();
            setActiveHotkey('save');
            setTimeout(() => setActiveHotkey(null), 1000);
            break;
          case 'e':
            e.preventDefault();
            if (activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable) {
              executeCode();
              switchMode('output');
            }
            setActiveHotkey('execute');
            setTimeout(() => setActiveHotkey(null), 1000);
            break;
          case 'k':
            e.preventDefault();
            switchMode(layout.mode === 'chat' ? 'focus' : 'chat');
            setActiveHotkey('chat');
            setTimeout(() => setActiveHotkey(null), 1000);
            break;
          case 'p':
            e.preventDefault();
            switchMode(layout.mode === 'preview' ? 'focus' : 'preview');
            setActiveHotkey('preview');
            setTimeout(() => setActiveHotkey(null), 1000);
            break;
          case 'n':
            e.preventDefault();
            if (isHost) {
              setShowNewFileModal(true);
              setActiveHotkey('newfile');
              setTimeout(() => setActiveHotkey(null), 1000);
            }
            break;
          case 'i':
            e.preventDefault();
            if (isHost) {
              setShowInviteModal(true);
              setActiveHotkey('invite');
              setTimeout(() => setActiveHotkey(null), 1000);
            }
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
        }
      }
      
      if (e.key === 'Escape') {
        if (layout.fullscreen) {
          toggleFullscreen();
        } else if (layout.mode !== 'focus') {
          switchMode('focus');
        }
      }
      
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [layout, activeFile, isHost, switchMode, toggleFullscreen]);

  // Cursor decoration functions
  const updateCursorDecorations = useCallback((cursorData: CursorPosition, color: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const { userId, userName, position } = cursorData;
    
    if (decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], []);
    }
    
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
    
    const newDecorations = editorRef.current.deltaDecorations([], decorations);
    decorationsRef.current[userId] = newDecorations;
    
    addCursorStyles(userId, userName, color);
  }, []);

  const updateSelectionDecorations = useCallback((selectionData: CursorPosition, color: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    const { userId, selection } = selectionData;
    
    if (!selection || (
      selection.startLineNumber === selection.endLineNumber &&
      selection.startColumn === selection.endColumn
    )) return;
    
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
    
    if (decorationsRef.current[`${userId}-selection`]) {
      editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], []);
    }
    
    const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations);
    decorationsRef.current[`${userId}-selection`] = newSelectionDecorations;
    
    addSelectionStyles(userId, color);
  }, []);

  const addCursorStyles = (userId: string, userName: string, color: string) => {
    const existingStyle = document.getElementById(`cursor-style-${userId}`);
    if (existingStyle) existingStyle.remove();
    
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
        background: linear-gradient(to bottom, ${color}, ${color}cc);
        z-index: 1000;
        animation: cursor-pulse-${userId} 1.5s ease-in-out infinite;
        box-shadow: 0 0 4px ${color}80;
        border-radius: 1px;
      }
      
      .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}';
        position: absolute;
        top: -32px;
        left: -1px;
        background: linear-gradient(135deg, ${color}, ${color}ee);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1001;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        border: 1px solid ${color}cc;
      }
      
      @keyframes cursor-pulse-${userId} {
        0%, 100% { opacity: 1; transform: scaleX(1); }
        50% { opacity: 0.8; transform: scaleX(1.1); }
      }
    `;
    document.head.appendChild(style);
  };

  const addSelectionStyles = (userId: string, color: string) => {
    const existingStyle = document.getElementById(`selection-style-${userId}`);
    if (existingStyle) existingStyle.remove();
    
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

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle active file switching when files change
  useEffect(() => {
    if (files.length > 0 && !activeFileId) {
      setActiveFileId(files[0].id);
    } else if (files.length > 0 && activeFileId && !files.some(f => f.id === activeFileId)) {
      setActiveFileId(files[0].id);
    }
  }, [files, activeFileId]);

  // Update cursor decorations when cursors change
  useEffect(() => {
    if (editorRef.current && activeFile && cursors) {
      Object.keys(decorationsRef.current).forEach(key => {
        if (decorationsRef.current[key]) {
          editorRef.current.deltaDecorations(decorationsRef.current[key], []);
        }
      });
      decorationsRef.current = {};
      
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
          const userColor = getUserColor(cursor.userId);
          updateCursorDecorations(cursor, userColor);
          if (cursor.selection) {
            updateSelectionDecorations(cursor, userColor);
          }
        }
      });
    }
  }, [cursors, activeFile, getUserColor, user?.id, updateCursorDecorations, updateSelectionDecorations]);

  // Fetch session data
  const fetchSessionData = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📄 Session data loaded:', data.session);
        setSession(data.session);
        
        if (data.session.files) {
          console.log('📁 Loading files:', data.session.files.length);
          setFiles(data.session.files);
          
          if (!activeFileId && data.session.files.length > 0) {
            setActiveFileId(data.session.files[0].id);
            console.log('🎯 Set active file:', data.session.files[0].name);
          }
        } else if (data.session.files?.length === 0 && isHost) {
          createDefaultFile();
        }
        
        setParticipantCount(data.session._count?.participants || 1);
        
        if (data.session.messages && Array.isArray(data.session.messages)) {
          console.log('💬 Loading messages:', data.session.messages.length);
          
          messageIdRef.current.clear();
          
          const loadedMessages = data.session.messages.map((msg: Message) => {
            messageIdRef.current.add(msg.id);
            return msg;
          });
          
          setMessages(loadedMessages);
          console.log('✅ Messages loaded successfully:', loadedMessages.length);
        } else {
          console.log('📭 No messages found, starting with empty chat');
          setMessages([]);
        }
        
        data.session.files?.forEach((file: FileData) => {
          lastCodeChangeRef.current[file.id] = file.content;
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch session data');
      }
    } catch (error) {
      console.error('❌ Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, activeFileId, isHost]);

  // Create default file if none exists
  const createDefaultFile = useCallback(async () => {
    if (!user || !sessionId) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/sessions/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          name: 'main.js',
          language: 'javascript',
          content: languageConfigs.javascript.defaultContent
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newFile = data.file;
        setFiles([newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        console.log('✅ Default file created:', newFile.name);
      }
    } catch (error) {
      console.error('❌ Failed to create default file:', error);
    }
  }, [user, sessionId]);

  // Socket event handlers
  useEffect(() => {
    if (!socket || !connected || !sessionId || !user?.id) {
      if (socket && !connected) {
        setConnectionStatus('Connecting to server...');
        setSyncStatus('offline');
      }
      return;
    }

    console.log('🎯 Setting up socket listeners for session:', sessionId);
    setConnectionStatus('Joining session...');

    socket.emit('join-session', sessionId);

    socket.on('session-joined', (data) => {
      console.log('✅ Successfully joined session:', data);
      setSessionJoined(true);
      setParticipantCount(data.participantCount || 1);
      setConnectionStatus('Connected');
      setSyncStatus('synced');
      fetchSessionData();
    });

    socket.on('user-joined', (data) => {
      console.log('👤 User joined session:', data);
      
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
      console.log('👋 User left session:', data);
      
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      
      setCursors(prev => {
        const newCursors = { ...prev };
        Object.keys(newCursors).forEach(key => {
          if (key.startsWith(data.userId)) {
            delete newCursors[key];
          }
        });
        return newCursors;
      });

      if (editorRef.current && decorationsRef.current[data.userId]) {
        editorRef.current.deltaDecorations(decorationsRef.current[data.userId], []);
        delete decorationsRef.current[data.userId];
      }

      const cursorStyle = document.getElementById(`cursor-style-${data.userId}`);
      const selectionStyle = document.getElementById(`selection-style-${data.userId}`);
      if (cursorStyle) cursorStyle.remove();
      if (selectionStyle) selectionStyle.remove();
    });

    socket.on('cursor-position', (data) => {
      console.log('👁️ FRONTEND received cursor from:', data.userName, 'at:', data.position);
      
      if (data.userId === user?.id) {
        console.log('⏭️ Skipping own cursor');
        return;
      }
      
      const cursorKey = `${data.userId}-${data.fileId}`;
      const userColor = getUserColor(data.userId);
      
      setCursors(prev => {
        const updated = {
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
        console.log('📊 Cursors updated. Count:', Object.keys(updated).length);
        return updated;
      });
    });
    
    socket.on('cursor-selection', (data) => {
      console.log('👁️ FRONTEND received selection from:', data.userName);
      
      if (data.userId === user?.id) return;
      
      const cursorKey = `${data.userId}-${data.fileId}`;
      const userColor = getUserColor(data.userId);
      
      setCursors(prev => ({
        ...prev,
        [cursorKey]: {
          ...prev[cursorKey],
          selection: data.selection,
          color: userColor,
          timestamp: data.timestamp
        }
      }));
    });

    socket.on('file-update', (data) => {
      if (data.userId === user.id) return;

      console.log('📥 Remote file update received:', {
        fileId: data.fileId,
        contentLength: data.content?.length,
        fromUser: data.userId,
        timestamp: data.timestamp
      });
      
      isRemoteUpdateRef.current[data.fileId] = true;
      
      setFiles(prev => prev.map(file => 
        file.id === data.fileId ? { ...file, content: data.content } : file
      ));
      
      lastCodeChangeRef.current[data.fileId] = data.content;
      
      if (data.fileId === activeFileId && editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== data.content) {
          console.log('🔄 Updating Monaco editor for file', data.fileId);
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

    socket.on('file-created', (data: { file: FileData }) => {
      console.log('📁 New file created by another user:', data.file.name);
      
      setFiles(prev => {
        const exists = prev.some(f => f.id === data.file.id);
        if (!exists) {
          const newFiles = [...prev, data.file];
          console.log('📁 Added file to list. Total files:', newFiles.length);
          return newFiles;
        }
        return prev;
      });
    });

    socket.on('file-deleted', (data: { fileId: string }) => {
      console.log('🗑️ File deleted by another user:', data.fileId);
      
      setFiles(prev => prev.filter(f => f.id !== data.fileId));
      
      setActiveFileId(prevActiveId => {
        if (data.fileId === prevActiveId) {
          return null;
        }
        return prevActiveId;
      });
    });

    socket.on('session-ended', (data) => {
      console.log('🛑 Session ended by host:', data);
      
      setShowSessionEndedModal(true);
      setSessionEndedReason(data.reason || 'The host has ended this session');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    });

    socket.on('participant-kicked', (data) => {
      console.log('🚫 You were removed from the session:', data);
      alert(`You have been removed from this session by the host: ${data.reason || 'No reason provided'}`);
      router.push('/dashboard');
    });

    socket.on('force-disconnect', (data) => {
      console.log('⚠️ Force disconnected:', data);
      router.push('/dashboard');
    });

    socket.on('chat-message', (message) => {
      console.log('💬 New chat message received:', message);
      setChatError('');
      
      if (!messageIdRef.current.has(message.id)) {
        messageIdRef.current.add(message.id);
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('chat-error', (error) => {
      console.error('💬 Chat error:', error);
      setChatError(error.message || 'Failed to send message');
      setIsSendingMessage(false);
    });

    socket.on('message-sent', (data) => {
      setIsSendingMessage(false);
    });

    socket.on('connect', () => {
      setSyncStatus('synced');
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', () => {
      setSyncStatus('offline');
      setConnectionStatus('Disconnected');
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setSyncStatus('error');
    });

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('session-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-position');
      socket.off('cursor-selection');
      socket.off('file-update');
      socket.off('file-created');
      socket.off('file-deleted');
      socket.off('session-ended');
      socket.off('participant-kicked');
      socket.off('force-disconnect');
      socket.off('chat-message');
      socket.off('chat-error');
      socket.off('message-sent');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [socket, connected, sessionId, user?.id, router, activeFileId, getUserColor, updateCursorDecorations, updateSelectionDecorations, fetchSessionData]);

  // Handle file editor changes
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
          console.log(`🚀 Broadcasting file change for ${activeFileId}`);
          socket.emit('file-update', {
            fileId: activeFileId,
            content: value,
            sessionId,
            timestamp: Date.now()
          });
          setSyncStatus('synced');
          setLastSyncTime(new Date());
        }
      }, 200);
    }
  }, [socket, connected, sessionId, activeFileId]);

  // Enhanced handle editor mount with cursor tracking
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    editor.updateOptions({
      fontSize: isMobile ? 12 : 14,
      minimap: { enabled: !isMobile },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      theme: 'vs-dark',
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      lineNumbers: isMobile ? 'off' : 'on',
      glyphMargin: !isMobile,
      folding: !isMobile,
      renderIndentGuides: !isMobile
    });

    if (activeFile) {
      editor.setValue(activeFile.content);
    }

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

      editor.onDidChangeCursorSelection((e: any) => {
        const selection = e.selection;
        
        socket.emit('cursor-selection', {
          sessionId,
          fileId: activeFileId,
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
    }
  };

  // Execute code function
  const executeCode = useCallback(async () => {
    if (!activeFile || isExecuting) return;

    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      const startTime = performance.now();
      
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language
        })
      });

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
        error: 'Network error: ' + (error as Error).message,
        executionTime: 0,
        language: activeFile.language
      });
    } finally {
      setIsExecuting(false);
    }
  }, [activeFile, isExecuting]);

  // Create new file
  const createNewFile = async () => {
    if (!newFileName.trim() || !socket || !connected) {
      return;
    }
    
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
        
        console.log('✅ File created successfully:', newFile);
        
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        
        setNewFileName('');
        setNewFileLanguage('javascript');
        setShowNewFileModal(false);
        
        if (socket && connected) {
          socket.emit('file-created', {
            sessionId,
            file: newFile
          });
        }
        
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

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (files.length > 0 && connected) {
        saveAllFiles();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [files, connected]);

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
        
        if (response.ok) {
          console.log('✅ All files saved successfully');
          setLastSyncTime(new Date());
        }
      }
    } catch (error) {
      console.error('❌ Failed to save files:', error);
    }
  };

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socket || !connected || isSendingMessage) {
      return;
    }

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

    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [newMessage, socket, connected, sessionId, isSendingMessage]);

  // Handle enter key in chat
  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Remove participant (host only)
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
    navigator.clipboard.writeText(link).then(() => {
      console.log('📋 Session link copied to clipboard');
    });
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
- Last Updated: ${new Date().toLocaleString()}
- Type: ${session.type}
- Status: ${session.isActive ? 'Active' : 'Ended'}

Generated by CollabIDE - Real-time Collaborative Code Editor
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

  // End session function
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
        if (socket && connected) {
          console.log('📡 Broadcasting session end to all participants');
          socket.emit('end-session-broadcast', { 
            sessionId,
            reason: 'Session ended by host',
            hostName: user?.displayName || 'Host'
          });
        }
        
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket && sessionId) {
        socket.emit('leave-session', sessionId);
      }
      Object.values(syncTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
      Object.keys(cursors).forEach(cursorKey => {
        const userId = cursorKey.split('-')[0];
        const cursorStyle = document.getElementById(`cursor-style-${userId}`);
        const selectionStyle = document.getElementById(`selection-style-${userId}`);
        if (cursorStyle) cursorStyle.remove();
        if (selectionStyle) selectionStyle.remove();
      });
    };
  }, [socket, sessionId, cursors]);

  // Enhanced Quick Actions Component
  const QuickActionsBar = () => (
    <div className="flex items-center space-x-2 p-2 bg-card/50 backdrop-blur-sm border-b border-border/30">
      {/* Layout Mode Selector */}
      <div className="flex items-center space-x-1 border border-border/50 rounded-lg p-1">
        <Button
          size="sm"
          variant={layout.mode === 'focus' ? 'default' : 'ghost'}
          onClick={() => switchMode('focus')}
          className="h-7 px-2"
          title="Focus Mode (Escape)"
        >
          <Layout className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant={layout.mode === 'split' ? 'default' : 'ghost'}
          onClick={() => switchMode('split')}
          className="h-7 px-2"
          title="Split View"
        >
          <Grid3X3 className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant={layout.mode === 'preview' ? 'default' : 'ghost'}
          onClick={() => switchMode('preview')}
          className="h-7 px-2"
          title="Preview Mode (Ctrl+P)"
        >
          <Eye className="h-3 w-3" />
        </Button>

        <Button
          size="sm"
          variant={layout.mode === 'chat' ? 'default' : 'ghost'}
          onClick={() => switchMode('chat')}
          className="h-7 px-2 relative"
          title="Chat Mode (Ctrl+K)"
        >
          <MessageSquare className="h-3 w-3" />
          {messages.length > 0 && layout.mode !== 'chat' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-emerald rounded-full animate-pulse" />
          )}
        </Button>

        <Button
          size="sm"
          variant={layout.mode === 'output' ? 'default' : 'ghost'}
          onClick={() => switchMode('output')}
          className="h-7 px-2"
          title="Output Mode"
        >
          <Terminal className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Quick Actions */}
      <Button
        size="sm"
        variant="ghost"
        onClick={saveAllFiles}
        className={cn(
          "h-7 px-2 transition-all duration-200",
          activeHotkey === 'save' && "bg-success/20 text-success"
        )}
        title="Save All (Ctrl+S)"
      >
        <Save className="h-3 w-3" />
      </Button>

      {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            executeCode();
            switchMode('output');
          }}
          disabled={isExecuting}
          className={cn(
            "h-7 px-2 transition-all duration-200",
            activeHotkey === 'execute' && "bg-accent-emerald/20 text-accent-emerald"
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
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNewFileModal(true)}
            className={cn(
              "h-7 px-2 transition-all duration-200",
              activeHotkey === 'newfile' && "bg-primary/20 text-primary"
            )}
            title="New File (Ctrl+N)"
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowInviteModal(true)}
            className={cn(
              "h-7 px-2 transition-all duration-200",
              activeHotkey === 'invite' && "bg-accent-blue/20 text-accent-blue"
            )}
            title="Invite Users (Ctrl+I)"
          >
            <UserPlus className="h-3 w-3" />
          </Button>
        </>
      )}

      <div className="w-px h-6 bg-border" />

      {/* Connection Status */}
      <div className="flex items-center space-x-2 px-2">
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-300",
          connected ? "bg-success animate-pulse" : "bg-destructive"
        )} />
        <span className="text-xs text-muted-foreground">
          {participantCount} online
        </span>
      </div>

      {/* Sync Status */}
      <Badge
        variant="outline"
        className={cn(
          "text-xs transition-all duration-300",
          syncStatus === 'synced' && "border-success/30 text-success",
          syncStatus === 'syncing' && "border-info/30 text-info",
          syncStatus === 'error' && "border-destructive/30 text-destructive",
          syncStatus === 'offline' && "border-muted-foreground/30 text-muted-foreground"
        )}
      >
        {syncStatus === 'syncing' && <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin" />}
        {syncStatus === 'synced' && <CheckCircle className="h-2.5 w-2.5 mr-1" />}
        {syncStatus === 'error' && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
        {syncStatus === 'offline' && <WifiOff className="h-2.5 w-2.5 mr-1" />}
        {syncStatus}
      </Badge>
    </div>
  );

  // Enhanced Status Bar Component
  const StatusBar = () => (
    <div className="flex items-center justify-between p-2 bg-card/30 backdrop-blur-sm border-t border-border/30 text-xs text-muted-foreground">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {activeFile ? languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language : 'No file'}
          </Badge>
          {activeFile && (
            <span>
              {activeFile.content.split('\n').length} lines
            </span>
          )}
        </div>
        
        {lastSyncTime && (
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Last sync: {lastSyncTime.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="h-3 w-3" />
          <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <FileText className="h-3 w-3" />
          <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowKeyboardShortcuts(true)}
          className="h-5 px-2 text-xs"
        >
          Shortcuts
        </Button>
      </div>
    </div>
  );

  // Keyboard Shortcuts Modal
  const KeyboardShortcutsModal = () => (
    showKeyboardShortcuts && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full animate-fade-in-scale">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Keyboard Shortcuts</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowKeyboardShortcuts(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { key: 'Ctrl+S', action: 'Save all files' },
                { key: 'Ctrl+E', action: 'Execute code' },
                { key: 'Ctrl+K', action: 'Toggle chat' },
                { key: 'Ctrl+P', action: 'Toggle preview' },
                { key: 'Ctrl+N', action: 'New file (Host)' },
                { key: 'Ctrl+I', action: 'Invite users (Host)' },
                { key: 'Ctrl+/', action: 'Show shortcuts' },
                { key: 'Escape', action: 'Focus mode' },
                { key: 'F11', action: 'Toggle fullscreen' }
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <span className="text-sm">{action}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  // Loading states with enhanced UI
  if (!user) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center">
        <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" className="animate-float" />
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">Please log in to access this collaboration session.</p>
              <Button 
                onClick={() => router.push('/auth/login')}
                className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90"
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
      <div className="min-h-screen auth-bg flex items-center justify-center">
        <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" className="animate-float" />
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div>
                <h2 className="text-xl font-bold gradient-text mb-2">{connectionStatus}</h2>
                <p className="text-muted-foreground">
                  {loading ? 'Loading session data...' : 'Establishing real-time connection...'}
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
      <div className="min-h-screen auth-bg flex items-center justify-center">
        <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
          <div className="text-center space-y-6">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
              <WifiOff className="h-16 w-16 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-destructive mb-2">Connection Failed</h2>
              <p className="text-muted-foreground mb-6">Unable to connect to the collaboration server.</p>
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
      <div className="min-h-screen auth-bg flex items-center justify-center">
        <Card className="glass-card shadow-2xl p-8 max-w-md mx-4 animate-fade-in-scale">
          <div className="text-center space-y-6">
            <HeroLogo size="lg" className="animate-float" />
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div>
                <h2 className="text-xl font-bold gradient-text mb-2">Joining Session</h2>
                <p className="text-muted-foreground">Setting up your collaborative workspace...</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-screen flex flex-col auth-bg overflow-hidden transition-all duration-300",
      layout.fullscreen && "fixed inset-0 z-50"
    )}>
      {/* Enhanced Session Header */}
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

      {/* Quick Actions Bar */}
      <QuickActionsBar />

      {/* Main Content Area with Enhanced Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Sidebar */}
        {layout.sidebar !== 'hidden' && (
          <div 
            className={cn(
              "flex-shrink-0 transition-all duration-300 ease-in-out",
              layout.sidebar === 'collapsed' && "w-[60px]",
              layout.sidebar === 'expanded' && `w-[${sidebarPanel.width}px]`
            )}
          >
            {layout.sidebar === 'collapsed' ? (
              // Collapsed Sidebar
              <div className="w-[60px] h-full glass-card backdrop-blur-sm border-r border-border/30 flex flex-col items-center py-4 space-y-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => switchMode('chat')}
                  className="w-10 h-10 p-0 relative"
                  title={`Participants (${participantCount})`}
                >
                  <Users className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center">
                    {participantCount}
                  </Badge>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => switchMode('chat')}
                  className="w-10 h-10 p-0 relative"
                  title={`Chat (${messages.length})`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {messages.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-emerald rounded-full" />
                  )}
                </Button>
              </div>
            ) : (
              // Expanded Sidebar
              <>
                <Sidebar
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
                />
                
                {/* Resize Handle */}
                <div 
                  className="w-1 bg-border/50 hover:bg-primary/50 cursor-col-resize transition-colors duration-200"
                  onMouseDown={sidebarPanel.startResize}
                />
              </>
            )}
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced File Tabs */}
          <FileTabs
            files={files}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            isHost={isHost}
            showNewFileModal={() => setShowNewFileModal(true)}
            fileCreationLoading={fileCreationLoading}
            deleteFile={deleteFile}
            executeCode={() => {
              executeCode();
              switchMode('output');
            }}
            isExecuting={isExecuting}
            activeFile={activeFile}
          />

          {/* Editor and Side Panels Container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code Editor */}
            <div className="flex-1 min-w-0">
              <EditorArea
                activeFile={activeFile}
                handleEditorChange={handleEditorChange}
                handleEditorDidMount={handleEditorDidMount}
                isHost={isHost}
                showNewFileModal={() => setShowNewFileModal(true)}
                fileCreationLoading={fileCreationLoading}
                showOutput={layout.output === 'expanded'}
                setShowOutput={(show) => {
                  if (show) switchMode('output');
                  else if (layout.mode === 'output') switchMode('focus');
                }}
                isExecuting={isExecuting}
                executionResult={executionResult}
                socket={socket}
                connected={connected}
                sessionId={sessionId}
                user={user}
                cursors={cursors}
                setCursors={setCursors}
                getUserColor={getUserColor}
                fileLocks={fileLocks}
                lockRequests={lockRequests}
              />
            </div>

            {/* Preview Panel */}
            {layout.preview === 'expanded' && (
              <>
                <div 
                  className="w-1 bg-border/50 hover:bg-info/50 cursor-col-resize transition-colors duration-200"
                  onMouseDown={previewPanel.startResize}
                />
                <div 
                  className="flex-shrink-0 transition-all duration-300"
                  style={{ width: `${previewPanel.width}px` }}
                >
                  <PreviewPanel
                    isPreviewVisible={true}
                    setIsPreviewVisible={(visible) => {
                      if (!visible) switchMode('focus');
                    }}
                    generatePreview={generatePreview}
                    session={session}
                    activeFile={activeFile}
                  />
                </div>
              </>
            )}

            {/* Output Panel */}
            {layout.output === 'expanded' && (
              <>
                <div 
                  className="w-1 bg-border/50 hover:bg-accent-emerald/50 cursor-col-resize transition-colors duration-200"
                  onMouseDown={outputPanel.startResize}
                />
                <div 
                  className="flex-shrink-0 transition-all duration-300"
                  style={{ width: `${outputPanel.width}px` }}
                >
                  <Card className="h-full glass-card backdrop-blur-sm border-border/30 rounded-none">
                    <CardHeader className="pb-3 border-b border-border/30 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-accent-emerald/10 rounded-lg">
                            <Terminal className="h-4 w-4 text-accent-emerald" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">Code Output</h3>
                            <p className="text-xs text-muted-foreground">
                              {activeFile ? `${activeFile.language} execution` : 'No active file'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => switchMode('focus')}
                            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                            title="Close Output"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-auto min-h-0">
                      {isExecuting ? (
                        <div className="flex items-center justify-center h-full min-h-[200px]">
                          <div className="text-center space-y-3">
                            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-accent-emerald" />
                            <div>
                              <p className="font-medium text-foreground">Executing Code</p>
                              <p className="text-sm text-muted-foreground">
                                Running {activeFile?.language} code...
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : executionResult ? (
                        <div className="space-y-4">
                          <div className={cn(
                            "px-4 py-3 rounded-lg text-sm border backdrop-blur-sm",
                            executionResult.error 
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : "bg-success/10 text-success border-success/30"
                          )}>
                            {executionResult.error ? (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Execution Failed</div>
                                  <div className="text-xs opacity-80">
                                    Completed in {executionResult.executionTime}ms
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">Execution Successful</div>
                                  <div className="text-xs opacity-80">
                                    Completed in {executionResult.executionTime}ms
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-foreground">Output:</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    executionResult.error || executionResult.output || ''
                                  );
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className={cn(
                              "text-sm whitespace-pre-wrap font-mono p-4 rounded-lg border overflow-auto max-h-96 backdrop-blur-sm",
                              executionResult.error 
                                ? "bg-destructive/5 border-destructive/20 text-destructive"
                                : "bg-muted/20 border-border/30 text-foreground"
                            )}>
                              {executionResult.error || executionResult.output || 'No output generated'}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full min-h-[200px] text-center">
                          <div className="space-y-4">
                            <div className="p-4 bg-accent-emerald/10 rounded-full w-fit mx-auto">
                              <Terminal className="h-12 w-12 text-accent-emerald" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground mb-2">Ready to Execute</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Click the "Run Code" button or press Ctrl+E to execute your code
                              </p>
                              {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
                                <Button
                                  onClick={executeCode}
                                  className="bg-gradient-to-r from-accent-emerald to-success hover:from-accent-emerald/90 hover:to-success/90"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Run Code
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Status Bar */}
      <StatusBar />

      {/* Mobile Layout Adjustments */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-40">
          <Button
            onClick={() => switchMode(layout.mode === 'chat' ? 'focus' : 'chat')}
            className={cn(
              "rounded-full shadow-lg backdrop-blur-sm transition-all duration-300",
              layout.mode === 'chat' ? "bg-primary" : "glass-card border border-border/50"
            )}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
            {messages.length > 0 && layout.mode !== 'chat' && (
              <Badge className="ml-2 bg-accent-emerald/20 text-accent-emerald">
                {messages.length}
              </Badge>
            )}
          </Button>
          
          {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
            <Button
              onClick={() => {
                executeCode();
                switchMode('output');
              }}
              disabled={isExecuting}
              className="rounded-full shadow-lg bg-gradient-to-r from-accent-emerald to-success hover:from-accent-emerald/90 hover:to-success/90"
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

      {/* Enhanced Modals */}
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

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal />
    </div>
  );
}
