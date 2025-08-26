'use client'

import { Editor } from '@monaco-editor/react'
import { Terminal, File, Plus, Loader2, X, RefreshCw, AlertCircle, CheckCircle, Lock, Maximize2, Minimize2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { languageConfigs } from '../utils/languageConfigs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CursorData {
  userId: string
  userName: string
  fileId: string
  position: {
    lineNumber: number
    column: number
  }
  selection?: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
  color: string
  timestamp: number
}

interface FileLock {
  lockedBy: string
  lockedByUser: {
    id: string
    displayName: string
  }
}

interface EditorAreaProps {
  activeFile: any
  handleEditorChange: (value: string | undefined) => void
  handleEditorDidMount: (editor: any, monaco: any) => void
  isHost: boolean
  showNewFileModal: () => void
  fileCreationLoading: boolean
  showOutput: boolean
  setShowOutput: (show: boolean) => void
  isExecuting: boolean
  executionResult: any
  // Cursor props
  socket?: any
  connected?: boolean
  sessionId?: string
  user?: any
  cursors?: { [key: string]: CursorData }
  setCursors?: (cursors: any) => void
  getUserColor?: (userId: string) => string
  // File lock props
  fileLocks?: { [fileId: string]: FileLock | null }
  lockRequests?: { [fileId: string]: boolean }
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
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)
  const decorationsRef = useRef<{ [key: string]: string[] }>({})
  
  // Responsive state
  const [isOutputFullscreen, setIsOutputFullscreen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Check if current file is locked by another user
  const currentLock = activeFile ? fileLocks[activeFile.id] : null
  const isLockedByOther = currentLock && currentLock.lockedBy !== user?.id
  const isRequestingLock = activeFile ? lockRequests[activeFile.id] : false
  const canEdit = !isLockedByOther && !isRequestingLock

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Enhanced editor mount handler with cursor tracking
  const handleEditorDidMountWithCursors = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor
    monacoRef.current = monaco
    
    // Call the original handler
    handleEditorDidMount(editor, monaco)

    console.log('🎯 Editor mounted with cursor tracking enabled')

    // Add cursor tracking if socket is available
    if (socket && connected && sessionId && user) {
      console.log('✅ Setting up cursor tracking for user:', user.displayName)
      
      // Track cursor position changes
      editor.onDidChangeCursorPosition((e: any) => {
        // Only emit cursor position if user can edit (has lock)
        if (!canEdit) return
        
        const position = e.position
        const selection = editor.getSelection()
        
        console.log('📍 Cursor moved to:', position)
        
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
        })
      })

      // Track selection changes
      editor.onDidChangeCursorSelection((e: any) => {
        // Only emit cursor selection if user can edit (has lock)
        if (!canEdit) return
        
        const selection = e.selection
        
        console.log('🔤 Selection changed:', selection)
        
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
        })
      })
    } else {
      console.log('❌ Cursor tracking not enabled - missing dependencies:', {
        socket: !!socket,
        connected,
        sessionId: !!sessionId,
        user: !!user
      })
    }
  }, [handleEditorDidMount, socket, connected, sessionId, user, activeFile?.id, canEdit])

  // Cursor decoration functions
  const updateCursorDecorations = useCallback((cursorData: CursorData, color: string) => {
    if (!editorRef.current || !monacoRef.current) {
      console.log('❌ Cannot update cursor decorations - editor not ready')
      return
    }
    
    const { userId, userName, position } = cursorData
    
    console.log('🎨 Creating cursor decoration for:', userName, 'at line:', position.lineNumber, 'column:', position.column)
    
    // Remove previous decorations for this user
    if (decorationsRef.current[userId]) {
      editorRef.current.deltaDecorations(decorationsRef.current[userId], [])
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
    ]
    
    // Apply decorations
    const newDecorations = editorRef.current.deltaDecorations([], decorations)
    decorationsRef.current[userId] = newDecorations
    
    console.log('✅ Cursor decoration applied for:', userName, 'with', newDecorations.length, 'decorations')
    
    // Add custom CSS for cursor
    addCursorStyles(userId, userName, color)
  }, [])

  const updateSelectionDecorations = useCallback((selectionData: CursorData, color: string) => {
    if (!editorRef.current || !monacoRef.current) return
    
    const { userId, selection } = selectionData
    
    if (!selection || (
      selection.startLineNumber === selection.endLineNumber &&
      selection.startColumn === selection.endColumn
    )) return
    
    console.log('🔤 Updating selection decoration for user:', userId)
    
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
    ]
    
    // Apply selection decorations
    if (decorationsRef.current[`${userId}-selection`]) {
      editorRef.current.deltaDecorations(decorationsRef.current[`${userId}-selection`], [])
    }
    
    const newSelectionDecorations = editorRef.current.deltaDecorations([], selectionDecorations)
    decorationsRef.current[`${userId}-selection`] = newSelectionDecorations
    
    // Add selection styles
    addSelectionStyles(userId, color)
  }, [])

  const addCursorStyles = (userId: string, userName: string, color: string) => {
    // Remove existing styles for this user
    const existingStyle = document.getElementById(`cursor-style-${userId}`)
    if (existingStyle) {
      existingStyle.remove()
    }
    
    const style = document.createElement('style')
    style.id = `cursor-style-${userId}`
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
        border-radius: 1px;
      }
      
      .cursor-label-${userId}::after {
        content: '${userName.replace(/'/g, "\\'")}';
        position: absolute;
        top: -28px;
        left: -1px;
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 1001;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.2;
        pointer-events: none;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @keyframes cursor-blink-${userId} {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.4; }
      }
      
      .cursor-${userId} {
        position: relative;
      }
    `
    
    document.head.appendChild(style)
    console.log('🎨 Enhanced cursor styles added for:', userName)
  }
  
  const addSelectionStyles = (userId: string, color: string) => {
    const existingStyle = document.getElementById(`selection-style-${userId}`)
    if (existingStyle) {
      existingStyle.remove()
    }
    
    const style = document.createElement('style')
    style.id = `selection-style-${userId}`
    style.textContent = `
      .selection-${userId} {
        background: ${color}30 !important;
        border: 1px solid ${color}60;
        border-radius: 2px;
      }
    `
    
    document.head.appendChild(style)
  }

  // Update cursor decorations when cursors change
  useEffect(() => {
    if (editorRef.current && activeFile && cursors && getUserColor) {
      console.log('🔄 Updating cursor decorations, cursor count:', Object.keys(cursors).length)
      
      // Clear all existing decorations
      Object.keys(decorationsRef.current).forEach(key => {
        if (decorationsRef.current[key]) {
          editorRef.current.deltaDecorations(decorationsRef.current[key], [])
        }
      })
      decorationsRef.current = {}
      
      // Apply cursors for the current active file
      Object.values(cursors).forEach(cursor => {
        if (cursor.fileId === activeFile.id && cursor.userId !== user?.id) {
          console.log('👁️ Showing cursor for:', cursor.userName, 'in file:', activeFile.name)
          const userColor = getUserColor(cursor.userId)
          updateCursorDecorations(cursor, userColor)
          if (cursor.selection) {
            updateSelectionDecorations(cursor, userColor)
          }
        }
      })
    }
  }, [cursors, activeFile, getUserColor, user?.id, updateCursorDecorations, updateSelectionDecorations])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up cursor styles
      if (cursors) {
        Object.keys(cursors).forEach(cursorKey => {
          const userId = cursorKey.split('-')[0]
          const cursorStyle = document.getElementById(`cursor-style-${userId}`)
          const selectionStyle = document.getElementById(`selection-style-${userId}`)
          if (cursorStyle) cursorStyle.remove()
          if (selectionStyle) selectionStyle.remove()
        })
      }
    }
  }, [cursors])

  // Request file lock when user tries to edit
  const requestFileLock = useCallback(() => {
    if (socket && activeFile && !currentLock && !isRequestingLock) {
      console.log('🔒 Requesting lock for file:', activeFile.name)
      socket.emit('request-file-lock', { fileId: activeFile.id })
      toast.loading('Requesting edit access...', { id: 'lock-request' })
    }
  }, [socket, activeFile, currentLock, isRequestingLock])

  // Responsive layout classes
  const getResponsiveLayout = () => {
    if (isMobileView) {
      return showOutput 
        ? isOutputFullscreen 
          ? "flex flex-col h-full" // Output fullscreen on mobile
          : "flex flex-col h-full" // Stacked layout on mobile
        : "flex flex-col h-full" // Just editor on mobile
    }
    return "flex h-full" // Side-by-side on desktop
  }

  const getEditorClasses = () => {
    if (isMobileView && showOutput) {
      return isOutputFullscreen ? "hidden" : "flex-1 min-h-0"
    }
    return "flex-1 min-h-0"
  }

  const getOutputClasses = () => {
    if (isMobileView) {
      return isOutputFullscreen ? "flex-1" : "h-1/2 min-h-[200px]"
    }
    return "w-2/5 min-w-[300px] max-w-[50%]"
  }

  return (
    <div className={cn("relative", getResponsiveLayout())}>
      {/* Code Editor */}
      <div className={cn("relative bg-background border-r", getEditorClasses())}>
        {activeFile ? (
          <>
            {/* Lock Status Indicators */}
            {isLockedByOther && (
              <div className={cn(
                "absolute z-20",
                isMobileView ? "top-2 left-2 right-2" : "top-4 right-4"
              )}>
                <Alert className="bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/20">
                  <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    <div className="font-medium">File Locked</div>
                    <div className="text-sm mt-1">
                      {currentLock?.lockedByUser?.displayName} is editing this file
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {isRequestingLock && (
              <div className={cn(
                "absolute z-20",
                isMobileView ? "top-2 left-2 right-2" : "top-4 right-4"
              )}>
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/20">
                  <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <div className="font-medium">Requesting Access</div>
                    <div className="text-sm mt-1">Waiting for edit permission...</div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Edit Access Button */}
            {isLockedByOther && (
              <div className={cn(
                "absolute z-20",
                isMobileView 
                  ? "bottom-4 left-1/2 transform -translate-x-1/2" 
                  : "top-20 right-4"
              )}>
                <Button
                  size={isMobileView ? "default" : "sm"}
                  onClick={requestFileLock}
                  disabled={isRequestingLock}
                  className="shadow-lg"
                >
                  {isRequestingLock ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      {isMobileView ? "Requesting..." : "Requesting..."}
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-2" />
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
                minimap: { enabled: !isMobileView },
                fontSize: isMobileView ? 12 : 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                insertSpaces: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                readOnly: !canEdit,
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: false,
                cursorStyle: 'line',
                cursorWidth: 2,
                mouseWheelScrollSensitivity: 1,
                fastScrollSensitivity: 5,
                scrollBeyondLastColumn: 5,
                glyphMargin: !isMobileView,
                folding: !isMobileView,
                foldingStrategy: 'indentation',
                showFoldingControls: 'mouseover',
                disableLayerHinting: true,
                fontLigatures: true,
                renderWhitespace: 'boundary',
                renderControlCharacters: false,
                renderIndentGuides: !isMobileView,
                highlightActiveIndentGuide: !isMobileView,
                lineNumbers: isMobileView ? 'off' : 'on',
                lineDecorationsWidth: isMobileView ? 0 : 10,
                lineNumbersMinChars: isMobileView ? 0 : 3,
                ...(isLockedByOther && {
                  rulers: [],
                  overviewRulerBorder: false,
                }),
              }}
            />

            {/* Read-only overlay message */}
            {!canEdit && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none flex items-center justify-center z-10">
                <Card className={cn("max-w-md shadow-xl", isMobileView ? "mx-4" : "mx-4")}>
                  <CardHeader className="text-center pb-4">
                    <div className={cn("mx-auto mb-4 p-4 bg-muted rounded-full", isMobileView ? "w-16 h-16" : "w-20 h-20")}>
                      <Lock className={cn("text-muted-foreground", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                    </div>
                    <CardTitle className={cn(isMobileView ? "text-lg" : "text-xl")}>
                      {isRequestingLock ? 'Requesting Edit Access' : 'File is Locked'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {isRequestingLock 
                        ? 'Please wait while we request edit permissions for this file.'
                        : `${currentLock?.lockedByUser?.displayName} is currently editing this file. You can view the content but cannot make changes.`
                      }
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-background text-foreground p-4">
            <Card className="max-w-md text-center">
              <CardHeader>
                <div className={cn("mx-auto mb-4 p-4 bg-muted rounded-full", isMobileView ? "w-16 h-16" : "w-20 h-20")}>
                  <File className={cn("text-muted-foreground", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                </div>
                <CardTitle className={cn(isMobileView ? "text-lg" : "text-xl")}>
                  No file selected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={cn("mb-4", isMobileView ? "text-sm" : "text-base")}>
                  {isHost ? 'Create your first file to start coding' : 'Select a file to start editing'}
                </CardDescription>
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Output Panel */}
      {showOutput && (
        <Card className={cn(
          "flex flex-col border-0",
          getOutputClasses(),
          isMobileView ? "border-t" : "border-l"
        )}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Terminal className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Output</CardTitle>
                {activeFile && (
                  <CardDescription className="text-xs">
                    {languageConfigs[activeFile.language as keyof typeof languageConfigs]?.name || activeFile.language}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile fullscreen toggle */}
              {isMobileView && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsOutputFullscreen(!isOutputFullscreen)}
                  title={isOutputFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isOutputFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowOutput(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden flex flex-col min-h-0">
            {isExecuting ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="mx-auto mb-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
                    <RefreshCw className={cn("animate-spin text-blue-600 dark:text-blue-400", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Executing code...</p>
                </div>
              </div>
            ) : executionResult ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className={cn(
                  "px-4 py-3 text-sm border-b flex-shrink-0 flex items-center gap-2",
                  executionResult.error 
                    ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-200 dark:border-red-900/20' 
                    : 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-200 dark:border-green-900/20'
                )}>
                  {executionResult.error ? (
                    <>
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Execution failed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Executed successfully in {executionResult.executionTime}ms</span>
                    </>
                  )}
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {executionResult.error ? (
                    <pre className={cn(
                      "text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-900/20",
                      isMobileView ? "text-xs" : "text-sm"
                    )}>
                      {executionResult.error}
                    </pre>
                  ) : (
                    <pre className={cn(
                      "text-foreground whitespace-pre-wrap font-mono bg-muted/50 p-3 rounded border min-h-32",
                      isMobileView ? "text-xs" : "text-sm"
                    )}>
                      {executionResult.output || 'No output generated'}
                    </pre>
                  )}
                </ScrollArea>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
                    <Play className={cn("text-muted-foreground", isMobileView ? "h-8 w-8" : "h-12 w-12")} />
                  </div>
                  <CardDescription className={isMobileView ? "text-sm" : "text-base"}>
                    Click "Run Code" to execute
                  </CardDescription>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
