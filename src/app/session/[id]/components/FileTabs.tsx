'use client'

import { 
  Plus, 
  Play, 
  Loader2, 
  ChevronLeft,
  ChevronRight,
  X, 
  File, 
  Code2, 
  Zap,
  FileCode,
  MoreHorizontal,
  FolderOpen,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { languageConfigs } from '../utils/languageConfigs'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface FileTabsProps {
  files: any[]
  activeFileId: string | null
  setActiveFileId: (id: string) => void
  isHost: boolean
  showNewFileModal: () => void
  fileCreationLoading: boolean
  deleteFile: (id: string) => void
  executeCode: () => void
  isExecuting: boolean
  activeFile: any
  sessionInfo?: {
    participantCount?: number
    isConnected?: boolean
  }
}

export default function FileTabs({
  files,
  activeFileId,
  setActiveFileId,
  isHost,
  showNewFileModal,
  fileCreationLoading,
  deleteFile,
  executeCode,
  isExecuting,
  activeFile,
  sessionInfo
}: FileTabsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const canExecute = activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable

  // Enhanced file deletion with toast
  const handleDeleteFile = (fileId: string, fileName: string) => {
    deleteFile(fileId)
    toast.success(`File "${fileName}" deleted`)
  }

  // Get visible files and overflow files for mobile
  const visibleFiles = isMobile ? files.slice(0, 2) : files
  const overflowFiles = isMobile ? files.slice(2) : []

  // Get language configuration
  const getLanguageConfig = (language: string) => {
    return languageConfigs[language as keyof typeof languageConfigs] || {
      name: language,
      icon: '📄',
      executable: false
    }
  }

  return (
    <Card className="border-0 bg-card/80 backdrop-blur border-b">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Header Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Project Files</CardTitle>
              <CardDescription>
                {files.length} file{files.length !== 1 ? 's' : ''} • {sessionInfo?.isConnected ? 'Connected' : 'Offline'}
              </CardDescription>
            </div>
          </div>

          {/* Session Status Indicator */}
          {sessionInfo && (
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium",
                sessionInfo.isConnected 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  sessionInfo.isConnected 
                    ? "bg-green-500 animate-pulse" 
                    : "bg-red-500"
                )} />
                <Activity className="h-3 w-3" />
                <span>{sessionInfo.participantCount || 0} online</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* File Tabs Section */}
        {files.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop File Tabs */}
            {!isMobile && (
              <ScrollArea ref={scrollAreaRef} className="w-full whitespace-nowrap">
                <div className="flex space-x-2 pb-2">
                  {files.map((file) => {
                    const config = getLanguageConfig(file.language)
                    const isActive = file.id === activeFileId
                    
                    return (
                      <Tooltip key={file.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setActiveFileId(file.id)}
                            className={cn(
                              "group relative min-w-0 max-w-[240px] justify-start transition-all duration-200",
                              isActive 
                                ? "bg-primary text-primary-foreground shadow-md" 
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <span className="text-sm flex-shrink-0">
                                {config.icon}
                              </span>
                              <span className="truncate font-medium">
                                {file.name}
                              </span>
                              {isActive && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs h-5 bg-primary-foreground/20 text-primary-foreground"
                                >
                                  {config.name}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Close Button */}
                            {isHost && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFile(file.id, file.name)
                                }}
                                className={cn(
                                  "h-5 w-5 p-0 ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all",
                                  isActive && "opacity-70 hover:bg-destructive/10"
                                )}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {config.name} • {file.content?.length || 0} characters
                            </p>
                            {config.executable && (
                              <p className="text-xs text-green-600 dark:text-green-400">Executable</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}

            {/* Mobile File Tabs */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                {visibleFiles.map((file) => {
                  const config = getLanguageConfig(file.language)
                  const isActive = file.id === activeFileId
                  
                  return (
                    <Button
                      key={file.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFileId(file.id)}
                      className={cn(
                        "flex-1 min-w-0 justify-start",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="text-sm mr-2">{config.icon}</span>
                      <span className="truncate text-sm">{file.name}</span>
                    </Button>
                  )
                })}
                
                {/* More Files Dropdown for Mobile */}
                {overflowFiles.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {overflowFiles.map((file) => {
                        const config = getLanguageConfig(file.language)
                        return (
                          <DropdownMenuItem
                            key={file.id}
                            onClick={() => setActiveFileId(file.id)}
                            className="flex items-center space-x-2"
                          >
                            <span>{config.icon}</span>
                            <span className="truncate flex-1">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {config.name}
                            </Badge>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {/* Active File Info */}
            {activeFile && (
              <Card className="border-0 bg-muted/30">
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Code2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activeFile.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {getLanguageConfig(activeFile.language).name} • {activeFile.content?.length || 0} chars
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {canExecute && (
                      <Badge variant="outline" className="text-xs border-green-500/50 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Executable
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-2 border-dashed border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <FileCode className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <CardTitle className="text-lg mb-2">No files yet</CardTitle>
              <CardDescription className="mb-6 max-w-sm">
                {isHost ? 'Create your first file to start coding collaboratively' : 'Waiting for files to be created'}
              </CardDescription>
              {isHost && (
                <Button onClick={showNewFileModal} disabled={fileCreationLoading}>
                  {fileCreationLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First File
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>{files.length} files</span>
            </div>
            {activeFile && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1">
                  <span>{getLanguageConfig(activeFile.language).icon}</span>
                  <span>{getLanguageConfig(activeFile.language).name}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* New File Button */}
            {isHost && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={showNewFileModal}
                    disabled={fileCreationLoading}
                    className="hover:border-primary/50"
                  >
                    {fileCreationLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        New File
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new file</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Run Code Button */}
            {canExecute && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={executeCode}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p>Execute the current file</p>
                    <p className="text-xs text-muted-foreground">
                      {activeFile && getLanguageConfig(activeFile.language).name}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
