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

// Enhanced Interfaces
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
  selection?: { 
    startLineNumber: number; 
    startColumn: number; 
    endLineNumber: number; 
    endColumn: number 
  };
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

// Layout Manager
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

// Panel Manager
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
  
  // State
  const [sessionJoined, setSessionJoined] = useState(false);
  const [sessionId] = useState(params.id as string);
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
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
  
  // **🚀 MULTI-FILE CURSOR SYSTEM - ENHANCED REFS**
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  const isApplyingRemoteChange = useRef(false);
  const suppressNextChange = useRef(false);
  const lastCodeChangeRef = useRef<{ [key: string]: string }>({});
  const messageIdRef = useRef<Set<string>>(new Set());
  const lastEmittedContent = useRef<{ [key: string]: string }>({});
  const isInitializingEditor = useRef(false);
  const socketListenersRegistered = useRef(false);
  
  const fileUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingFileUpdates = useRef<{ [fileId: string]: string }>({});
  
  // **🎯 CRITICAL: Enhanced cursor storage with real-time file tracking**
  const cursorElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  const activeCursorsRef = useRef<{ [key: string]: CursorPosition }>({});
  const lastCursorEmitTime = useRef<number>(0);
  const currentUserId = useRef<string>('');
  const editorContainerRef = useRef<HTMLElement | null>(null);
  const cursorCleanupTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const activeFileIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      currentUserId.current = user.id;
    }
  }, [user?.id]);

  useEffect(() => {
    activeFileIdRef.current = activeFileId;
  }, [activeFileId]);

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

  const applyRemoteContent = useCallback((editor: any, newContent: string, fileId: string) => {
    if (!editor || newContent === undefined) return;
    
    const model = editor.getModel();
    if (!model) return;

    console.log('📥 Applying remote content for:', fileId);
    
    isApplyingRemoteChange.current = true;
    suppressNextChange.current = true;

    try {
      const currentPosition = editor.getPosition();
      const currentScrollTop = editor.getScrollTop();
      
      editor.setValue(newContent);
      
      if (currentPosition) {
        setTimeout(() => {
          editor.setPosition(currentPosition);
          editor.setScrollTop(currentScrollTop);
        }, 10);
      }
      
      lastCodeChangeRef.current[fileId] = newContent;
      lastEmittedContent.current[fileId] = newContent;
      
    } catch (error) {
      console.error('Error applying remote content:', error);
    } finally {
      setTimeout(() => {
        isApplyingRemoteChange.current = false;
        suppressNextChange.current = false;
      }, 50);
    }
  }, []);

  // **🎯 CRITICAL FIX: Enhanced cursor system with proper file isolation**
  const updateCursorPosition = useCallback((
    userId: string, 
    userName: string, 
    color: string, 
    lineNumber: number, 
    columnPosition: number, 
    fileId: string,
    selection?: { startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number }
  ) => {
    if (!editorRef.current || !monacoRef.current) return;
    
    // **CRITICAL: Only show cursors for the active file using ref**
    if (fileId !== activeFileIdRef.current) {
      console.log('🚫 Skipping cursor for different file:', fileId, 'active:', activeFileIdRef.current);
      return;
    }
    
    try {
      console.log('✅ Rendering cursor for same file:', userName, 'in', fileId);
      
      // Remove existing cursor for this user
      removeCursorStyles(userId);

      if (!editorContainerRef.current) {
        const editorDomNode = editorRef.current.getDomNode();
        if (!editorDomNode) return;
        
        editorContainerRef.current = editorDomNode.querySelector('.view-lines') || 
                                     editorDomNode.querySelector('.monaco-editor') ||
                                     editorDomNode;
      }
      
      const container = editorContainerRef.current;
      if (!container) return;
      
      const model = editorRef.current.getModel();
      if (!model) return;

      const lineCount = model.getLineCount();
      const validLine = Math.max(1, Math.min(lineNumber, lineCount));
      const lineLength = model.getLineMaxColumn(validLine);
      const validColumn = Math.max(1, Math.min(columnPosition, lineLength));

      const position = editorRef.current.getScrolledVisiblePosition({
        lineNumber: validLine,
        column: validColumn
      });

      if (!position || position.top < 0 || position.left < 0) return;

      const lineHeight = editorRef.current.getOption(monacoRef.current.editor.EditorOption.lineHeight) || 20;
      
      const cursorWrapper = document.createElement('div');
      cursorWrapper.className = `collab-cursor-${userId}`;
      cursorWrapper.setAttribute('data-user-id', userId);
      cursorWrapper.setAttribute('data-file-id', fileId);
      
      cursorWrapper.style.cssText = `
        position: absolute !important;
        top: ${position.top}px !important;
        left: ${position.left}px !important;
        pointer-events: none !important;
        z-index: 10 !important;
        user-select: none !important;
        contain: layout !important;
      `;

      const cursorLine = document.createElement('div');
      cursorLine.style.cssText = `
        width: 2px !important;
        height: ${lineHeight}px !important;
        background: ${color} !important;
        position: relative !important;
        opacity: 0.9 !important;
        pointer-events: none !important;
        user-select: none !important;
      `;

      const labelElement = document.createElement('div');
      labelElement.textContent = userName;
      
      const shouldPlaceBelow = position.top < 25;
      const labelTop = shouldPlaceBelow ? `${lineHeight + 2}px` : '-22px';
      
      labelElement.style.cssText = `
        position: absolute !important;
        top: ${labelTop} !important;
        left: 0px !important;
        background: ${color} !important;
        color: white !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        pointer-events: none !important;
        user-select: none !important;
        line-height: 1.2 !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
      `;

      cursorWrapper.appendChild(cursorLine);
      cursorWrapper.appendChild(labelElement);
      container.appendChild(cursorWrapper);
      
      // Store reference to cursor element
      cursorElementsRef.current[userId] = cursorWrapper;

      // Store cursor data
      activeCursorsRef.current[userId] = {
        userId,
        userName,
        fileId,
        position: { lineNumber: validLine, column: validColumn },
        selection,
        color,
        timestamp: Date.now(),
        isActive: true,
        lastActivity: Date.now()
      };

      // Auto cleanup
      if (cursorCleanupTimers.current[userId]) {
        clearTimeout(cursorCleanupTimers.current[userId]);
      }
      
      cursorCleanupTimers.current[userId] = setTimeout(() => {
        removeCursorStyles(userId);
      }, 8000);

    } catch (error) {
      console.error('❌ Cursor error:', error);
    }
  }, []);

  // **Enhanced cursor removal**
  const removeCursorStyles = useCallback((userId: string) => {
    try {
      // Remove from DOM
      const element = cursorElementsRef.current[userId];
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
      delete cursorElementsRef.current[userId];
      
      // Remove from data store
      delete activeCursorsRef.current[userId];
      
      // Clear cleanup timer
      if (cursorCleanupTimers.current[userId]) {
        clearTimeout(cursorCleanupTimers.current[userId]);
        delete cursorCleanupTimers.current[userId];
      }
      
      // Remove any leftover elements
      const leftoverCursors = document.querySelectorAll(`.collab-cursor-${userId}`);
      leftoverCursors.forEach(el => el.remove());
    } catch (error) {
      console.error('Error removing cursor:', error);
    }
  }, []);

  // **Clear all cursors when switching files**
  useEffect(() => {
    if (!activeFileId) return;

    console.log('🔄 Switching to file:', activeFileId);

    // Clean up all cursors when switching files
    Object.keys(cursorElementsRef.current).forEach(userId => {
      removeCursorStyles(userId);
    });
    
    // Clear all cleanup timers
    Object.values(cursorCleanupTimers.current).forEach(timer => {
      clearTimeout(timer);
    });
    cursorCleanupTimers.current = {};

    editorContainerRef.current = null;
  }, [activeFileId, removeCursorStyles]);

  useEffect(() => {
    const cleanupBlockingElements = () => {
      const existingCursors = document.querySelectorAll('[class*="collab-cursor-"]');
      existingCursors.forEach(el => el.remove());
      console.log('🧹 Cleaned up blocking elements');
    };
    
    cleanupBlockingElements();
    const cleanupTimer = setTimeout(cleanupBlockingElements, 100);
    
    return () => clearTimeout(cleanupTimer);
  }, []);

  const debouncedFileUpdate = useCallback((fileId: string, content: string) => {
    if (isApplyingRemoteChange.current || !socket || !connected || !user?.id) {
      return;
    }

    if (lastEmittedContent.current[fileId] === content) {
      return;
    }

    pendingFileUpdates.current[fileId] = content;

    if (fileUpdateTimeoutRef.current) {
      clearTimeout(fileUpdateTimeoutRef.current);
    }

    fileUpdateTimeoutRef.current = setTimeout(() => {
      const pendingContent = pendingFileUpdates.current[fileId];
      
      if (pendingContent && 
          pendingContent === content && 
          !isApplyingRemoteChange.current &&
          socket && 
          connected) {
        
        console.log(`📤 Syncing file update for ${fileId}`);
        
        socket.emit('file-update', {
          fileId,
          content: pendingContent,
          sessionId,
          userId: user.id,
          timestamp: Date.now()
        });
        
        lastEmittedContent.current[fileId] = pendingContent;
        setSyncStatus('synced');
      }
      
      delete pendingFileUpdates.current[fileId];
      fileUpdateTimeoutRef.current = null;
    }, 250);
  }, [socket, connected, sessionId, user?.id]);

  const fetchSessionData = useCallback(async () => {
    if (!sessionId) return;
    
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
          
          data.session.files.forEach((file: FileData) => {
            lastCodeChangeRef.current[file.id] = file.content;
            lastEmittedContent.current[file.id] = file.content;
          });
          
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
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId, activeFileId]);

  // **ENHANCED SOCKET EVENTS WITH IMPROVED FILE ISOLATION**
  useEffect(() => {
    if (!socket || !connected || !sessionId || !user?.id || socketListenersRegistered.current) {
      return;
    }

    console.log('🔌 Registering enhanced socket listeners');
    socketListenersRegistered.current = true;

    socket.emit('join-session', sessionId);

    const handleSessionJoined = (data: any) => {
      setSessionJoined(true);
      setParticipantCount(data.participantCount || 1);
      setSyncStatus('synced');
      fetchSessionData();
    };

    const handleUserJoined = (data: any) => {
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
    };

    const handleUserLeft = (data: any) => {
      if (data.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
      
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      removeCursorStyles(data.userId);
    };

    // **CRITICAL FIX: Enhanced cursor handling with proper file validation**
    const handleCursorPosition = (data: any) => {
      if (data.userId === currentUserId.current || !data.position) {
        return;
      }
      
      if (typeof data.position.lineNumber !== 'number' || 
          typeof data.position.column !== 'number') {
        return;
      }
      
      console.log('📍 Received cursor for file:', data.fileId, 'active:', activeFileIdRef.current);
      
      const userColor = getUserColor(data.userId);
      const validLine = Math.max(1, Math.floor(data.position.lineNumber));
      const validColumn = Math.max(1, Math.floor(data.position.column));
      
      updateCursorPosition(
        data.userId, 
        data.userName, 
        userColor, 
        validLine, 
        validColumn, 
        data.fileId,
        data.selection
      );
    };

    const handleFileUpdate = (data: any) => {
      if (data.userId === currentUserId.current) {
        return;
      }
      
      console.log(`📥 Multi-file update for ${data.fileId}`);
      
      setFiles(prev => prev.map(file => 
        file.id === data.fileId ? { ...file, content: data.content } : file
      ));
      
      lastCodeChangeRef.current[data.fileId] = data.content;
      lastEmittedContent.current[data.fileId] = data.content;
      
      if (data.fileId === activeFileIdRef.current && editorRef.current) {
        const currentValue = editorRef.current.getValue();
        if (currentValue !== data.content) {
          console.log('🔄 Syncing active file content');
          applyRemoteContent(editorRef.current, data.content, data.fileId);
        }
      }
    };

    const handleFileCreated = (data: any) => {
      if (data.userId !== currentUserId.current) {
        console.log('📄 New file created:', data.file.name);
        setFiles(prev => {
          const fileExists = prev.some(f => f.id === data.file.id);
          if (fileExists) return prev;
          return [...prev, data.file];
        });
        lastCodeChangeRef.current[data.file.id] = data.file.content;
        lastEmittedContent.current[data.file.id] = data.file.content;
      }
    };

    const handleFileDeleted = (data: any) => {
      console.log('🗑️ File deleted:', data.fileId);
      setFiles(prev => prev.filter(f => f.id !== data.fileId));
      
      // Clean up all cursors for deleted file
      Object.keys(cursorElementsRef.current).forEach(userId => {
        removeCursorStyles(userId);
      });
      
      // Clean up stored cursor data
      Object.keys(activeCursorsRef.current).forEach(key => {
        if (key.endsWith(`-${data.fileId}`)) {
          delete activeCursorsRef.current[key];
        }
      });
      
      if (data.fileId === activeFileIdRef.current) {
        setFiles(currentFiles => {
          const remainingFiles = currentFiles.filter(f => f.id !== data.fileId);
          if (remainingFiles.length > 0) {
            setActiveFileId(remainingFiles[0].id);
          } else {
            setActiveFileId(null);
          }
          return remainingFiles;
        });
      }
      
      delete lastCodeChangeRef.current[data.fileId];
      delete lastEmittedContent.current[data.fileId];
    };

    const handleChatMessage = (message: Message) => {
      setChatError('');
      if (!messageIdRef.current.has(message.id)) {
        messageIdRef.current.add(message.id);
        setMessages(prev => [...prev, message]);
      }
    };

    const handleSessionEnded = (data: any) => {
      setShowSessionEndedModal(true);
      setSessionEndedReason(data.reason || 'The host has ended this session');
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    };

    socket.on('session-joined', handleSessionJoined);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('cursor-position', handleCursorPosition);
    socket.on('file-update', handleFileUpdate);
    socket.on('file-created', handleFileCreated);
    socket.on('file-deleted', handleFileDeleted);
    socket.on('chat-message', handleChatMessage);
    socket.on('session-ended', handleSessionEnded);

    return () => {
      socketListenersRegistered.current = false;
      
      socket.off('session-joined', handleSessionJoined);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('cursor-position', handleCursorPosition);
      socket.off('file-update', handleFileUpdate);
      socket.off('file-created', handleFileCreated);
      socket.off('file-deleted', handleFileDeleted);
      socket.off('chat-message', handleChatMessage);
      socket.off('session-ended', handleSessionEnded);
    };
  }, [socket, connected, sessionId, user?.id, fetchSessionData, getUserColor, updateCursorPosition, removeCursorStyles, applyRemoteContent, router]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (suppressNextChange.current) {
      suppressNextChange.current = false;
      return;
    }

    if (isApplyingRemoteChange.current || !value || !activeFileId || !user?.id) {
      return;
    }
    
    if (lastCodeChangeRef.current[activeFileId] === value) {
      return;
    }
    
    console.log('📝 Local change for file:', activeFileId);
    
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content: value } : file
    ));
    
    lastCodeChangeRef.current[activeFileId] = value;
    setSyncStatus('syncing');
    
    debouncedFileUpdate(activeFileId, value);
  }, [activeFileId, debouncedFileUpdate, user?.id]);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    console.log('🎯 Editor mounted with enhanced tracking');
    
    editorRef.current = editor;
    monacoRef.current = monaco;
    editorContainerRef.current = null;
    
    editor.updateOptions({
      fontSize: isMobile ? 13 : 15,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      theme: 'vs-dark',
      tabSize: 2,
      insertSpaces: true,
      cursorBlinking: 'blink',
      lineNumbers: isMobile ? 'off' : 'on',
      glyphMargin: false,
      folding: false,
      readOnly: false,
      renderValidationDecorations: 'off',
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      mouseWheelZoom: true,
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        handleMouseWheel: true,
        alwaysConsumeMouseWheel: false
      }
    });

    if (activeFile) {
      editor.setValue(activeFile.content);
      lastCodeChangeRef.current[activeFile.id] = activeFile.content;
      lastEmittedContent.current[activeFile.id] = activeFile.content;
    }

    // **ENHANCED CURSOR TRACKING WITH REF**
    if (socket && connected && sessionId && user?.id && activeFileId) {
      const handleCursorPositionChange = (e: any) => {
        const position = e.position;
        
        if (!position || 
            position.lineNumber < 1 || 
            position.column < 1 || 
            isApplyingRemoteChange.current) {
          return;
        }
        
        const now = Date.now();
        if (now - lastCursorEmitTime.current < 50) return;
        lastCursorEmitTime.current = now;
        
        const selection = editor.getSelection();
        const cursorData = {
          sessionId,
          fileId: activeFileIdRef.current, // **CRITICAL: Use ref for real-time file ID**
          userId: user.id,
          userName: user.displayName || 'Anonymous',
          position: {
            lineNumber: position.lineNumber,
            column: position.column
          },
          selection: selection && !selection.isEmpty() ? {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn
          } : null,
          timestamp: Date.now()
        };
        
        console.log('📡 Emitting cursor for file:', activeFileIdRef.current);
        socket.emit('cursor-position', cursorData);
      };

      editor.onDidChangeCursorPosition(handleCursorPositionChange);

      let scrollTimeout: NodeJS.Timeout;
      editor.onDidScrollChange(() => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          editorContainerRef.current = null;
          
          // Re-render active cursors for current file only
          Object.values(activeCursorsRef.current).forEach(cursor => {
            if (cursor.isActive && 
                cursor.userId !== user.id && 
                cursor.fileId === activeFileIdRef.current) {
              updateCursorPosition(
                cursor.userId,
                cursor.userName,
                cursor.color,
                cursor.position.lineNumber,
                cursor.position.column,
                cursor.fileId,
                cursor.selection
              );
            }
          });
        }, 50);
      });
    }

    setTimeout(() => {
      editor.focus();
      console.log('✅ Editor ready with enhanced file tracking');
    }, 100);

  }, [activeFile, socket, connected, sessionId, user, activeFileId, isMobile, updateCursorPosition]);

  const executeCode = useCallback(async () => {
    if (!activeFile || isExecuting) return;

    setIsExecuting(true);
    setExecutionResult(null);
    toggleTerminal();
    
    try {
      const startTime = performance.now();
      
      let codeToExecute = activeFile.content;
      if (editorRef.current) {
        codeToExecute = editorRef.current.getValue();
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

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
        
        console.log('📄 Creating new file:', newFile.name);
        
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        lastCodeChangeRef.current[newFile.id] = newFile.content;
        lastEmittedContent.current[newFile.id] = newFile.content;
        
        setNewFileName('');
        setNewFileLanguage('javascript');
        setShowNewFileModal(false);
        
        socket?.emit('file-created', { sessionId, file: newFile, userId: user?.id });
        
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
        
        socket?.emit('file-deleted', { sessionId, fileId, userId: user?.id });
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const saveAllFiles = async () => {
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
  };

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

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const removeParticipant = useCallback((participantId: string) => {
    if (!isHost || !socket || !connected) return;
    
    socket.emit('remove-participant', {
      sessionId,
      participantId
    });
    
    setShowParticipantMenu(null);
  }, [isHost, socket, connected, sessionId]);

  const copySessionLink = () => {
    const link = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(link);
  };

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
            setSidebarMode(layout.sidebar === 'chat' ? 'hidden' : 'chat');
            break;
          case 'n':
            e.preventDefault();
            if (isHost) setShowNewFileModal(true);
            break;
          case 'i':
            e.preventDefault();
            if (isHost) setShowInviteModal(true);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, isHost, layout.sidebar, setSidebarMode, togglePanel, saveAllFiles, executeCode]);

  const QuickActionsBar = () => (
    <div 
      className="h-12 px-6 flex items-center justify-between font-sans border-b"
      style={{ 
        backgroundColor: 'var(--background)', 
        borderColor: 'var(--border)',
        color: 'var(--foreground)'
      }}
    >
      <div className="flex items-center gap-6">
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

        <div className="w-px h-6" style={{ backgroundColor: 'var(--border)' }} />

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
    </div>
  );

  const TerminalOutput = () => (
    <div 
      className="border-t flex flex-col font-mono"
      style={{ 
        height: `${terminalPanel.height}px`,
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      <div 
        className="h-1 cursor-row-resize transition-all relative group"
        style={{ backgroundColor: 'var(--border)' }}
        onMouseDown={terminalPanel.startResize}
      >
        <div className="absolute inset-0 group-hover:bg-[var(--accent)]" />
      </div>

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
              onClick={() => {
                const content = executionResult.error || executionResult.output || '';
                navigator.clipboard.writeText(content);
              }}
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

  useEffect(() => {
    return () => {
      console.log('🧹 Enhanced cleanup');
      
      if (socket && sessionId) {
        socket.emit('leave-session', sessionId);
      }
      
      if (fileUpdateTimeoutRef.current) {
        clearTimeout(fileUpdateTimeoutRef.current);
      }
      
      // Clean up all cursors
      Object.keys(cursorElementsRef.current).forEach(userId => {
        removeCursorStyles(userId);
      });
      
      // Clear all timers
      Object.values(cursorCleanupTimers.current).forEach(timer => {
        clearTimeout(timer);
      });
      
      const blockingElements = document.querySelectorAll('[class*="collab-cursor-"]');
      blockingElements.forEach(el => el.remove());
      
      // Reset all refs
      activeCursorsRef.current = {};
      isApplyingRemoteChange.current = false;
      suppressNextChange.current = false;
      socketListenersRegistered.current = false;
      lastCodeChangeRef.current = {};
      lastEmittedContent.current = {};
      pendingFileUpdates.current = {};
      editorContainerRef.current = null;
      cursorCleanupTimers.current = {};
    };
  }, [socket, sessionId, removeCursorStyles]);

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
      <style jsx global>{`
        .monaco-editor,
        .monaco-editor .view-lines,
        .monaco-editor .monaco-scrollable-element {
          overflow: visible !important;
        }
        
        [class*="collab-cursor-"] {
          pointer-events: none !important;
          user-select: none !important;
          z-index: 10 !important;
        }
        
        .monaco-editor .inputarea {
          pointer-events: auto !important;
        }
        
        .monaco-editor .suggest-widget,
        .monaco-editor .parameter-hints-widget,
        .monaco-editor .hover-row {
          display: none !important;
        }
      `}</style>
      
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
        <div className="flex-1 flex overflow-hidden">
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
              executeCode={executeCode}
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

        {layout.output === 'expanded' && <TerminalOutput />}
      </div>

      <div className="bg-black border-t border-slate-700/50 px-4 py-2 flex items-center justify-between text-xs text-slate-400 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs border-slate-700/50 bg-slate-800/50">
              {activeFile ? languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language : 'No file'}
            </Badge>
            {activeFile && <span className="text-slate-500">{activeFile.content.split('\n').length} lines</span>}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={cn("w-2 h-2 rounded-full", connected ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-red-400")} />
            <span>{participantCount} online</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>{files.length} files</span>
          </div>

          <Badge className={cn("text-xs border-0 shadow-sm", syncStatus === 'synced' && "bg-emerald-500/10 text-emerald-400", syncStatus === 'syncing' && "bg-blue-500/10 text-blue-400", syncStatus === 'error' && "bg-red-500/10 text-red-400", syncStatus === 'offline' && "bg-slate-700 text-slate-400")}>
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
        />
      )}
    </div>
  );
}
