'use client'

import { useState } from 'react'
import {
  Plus,
  Play,
  Loader2,
  X,
  FileCode,
  FileText,
  MoreHorizontal,
  Dot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { languageConfigs } from '../utils/languageConfigs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Official language icons using SVG - enhanced version
const LanguageIcon = ({ language, className = "" }: { language: string; className?: string }) => {
  const iconProps = {
    className: cn("w-4 h-4", className),
    viewBox: "0 0 128 128"
  }

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return (
        <svg {...iconProps} fill="#F7DF1E">
          <path d="M2 1v125h125V1zm109 107c0 5.5-3.5 9-11.5 9-6 0-9.5-3-11.5-7l6-3.5c1.5 2.5 3 4.5 6 4.5s5-1.5 5-3.5c0-2.5-2-3.5-5.5-5l-2-1c-5.5-2.5-9-5.5-9-12 0-6 4.5-10.5 11.5-10.5 5 0 8.5 1.5 11 5.5l-6 4c-1.5-2.5-3-3.5-5-3.5s-3 1.5-3 3.5c0 2.5 2 3.5 5 5l2 1c6.5 3 10.5 5.5 10.5 12zm-40.5 1.5c0 7.5-4.5 11-11 11-5.5 0-9-2.5-11-6.5l6-3.5c1.5 3 3 5 6 5 2.5 0 4-1 4-5.5V70h7.5v37.5z"/>
        </svg>
      )
    case 'typescript':
    case 'ts':
      return (
        <svg {...iconProps} fill="#3178C6">
          <path d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-.53.29-.83.48l-5.24 2.26c-.24.1-.43.05-.59-.23a6.57 6.57 0 00-5.69-2.7c-2.79 0-4.6 1.54-4.6 3.49 0 1.54.79 2.52 4.31 3.68l2 .67c4.65 1.58 6.64 3.18 6.64 6.53 0 3.9-3.24 6.42-8.78 6.42a16.3 16.3 0 01-9.52-3.95c-.83-.56-1.26-1.26-.94-2l.13-.18 5.16-2.28c.26-.13.43-.1.63.15a7.3 7.3 0 006.44 3.49c3 0 5-1.38 5-3.17 0-1.69-.79-2.26-4.57-3.81l-2-.8c-4.62-2-6.74-3.78-6.74-7.59 0-3.5 3.38-6.17 8.11-6.17a13.4 13.4 0 018.55 3.18zM51.5 60.4c.1.83.1 1.7.1 2.77V81.3c0 4.06-.21 6.9-1.14 8.26-.72 1.05-2.07 1.67-3.81 1.67-1.86 0-3.16-.83-4.27-2.05a8.78 8.78 0 00-1.56-2.62l6.24-2.79c.26.62.73 1.18 1.87 1.18.83 0 1.36-.37 1.36-3.64V63.91z"/>
        </svg>
      )
    case 'python':
    case 'py':
      return (
        <svg {...iconProps} fill="none">
          <defs>
            <linearGradient id="python-a" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3F7CAF"/>
              <stop offset="100%" stopColor="#306998"/>
            </linearGradient>
            <linearGradient id="python-b" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE05A"/>
              <stop offset="100%" stopColor="#FFC331"/>
            </linearGradient>
          </defs>
          <path d="M49.3 16.3c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H55.6c-3.5 0-6.3-2.8-6.3-6.3z" fill="url(#python-a)"/>
          <path d="M6 55.8c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H12.3c-3.5 0-6.3-2.8-6.3-6.3z" fill="url(#python-b)"/>
          <circle cx="61.9" cy="21.9" r="2.6" fill="#FFF"/>
          <circle cx="17.1" cy="61.4" r="2.6" fill="#FFF"/>
        </svg>
      )
    case 'html':
      return (
        <svg {...iconProps} fill="#E34F26">
          <path d="M20.61 0H7.39L9.85 27.3L64 40l54.15-12.7L120.61 0zM96.37 18.4H48.05l1.35 15.12h45.62l-4.05 45.09L64 85.3l-26.97-6.65-1.84-20.64h13.21l.94 10.48L64 72.3l14.66-3.82 1.52-17H35.64l-3.77-42.1H96.37z"/>
        </svg>
      )
    case 'css':
      return (
        <svg {...iconProps} fill="#1572B6">
          <path d="M20.61 0h87.38L99.2 27.3 64 40 28.8 27.3zM96.37 18.4H31.63l3.77 42.1h60.97l-1.52 17L80.34 81.3 64 85.12 47.66 81.3l-1.84-20.64h13.21l.94 10.48L64 72.3l14.66-3.82 1.52-17H35.64l-3.77-42.1h64.5z"/>
        </svg>
      )
    case 'json':
      return (
        <div className={cn("w-4 h-4 rounded-sm bg-amber-500 flex items-center justify-center text-white text-[8px] font-bold", className)}>
          { }
        </div>
      )
    case 'java':
      return (
        <svg {...iconProps} fill="#ED8B00">
          <path d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
        </svg>
      )
    case 'php':
      return (
        <svg {...iconProps} fill="#777BB4">
          <path d="M16.83 28.7c0 0-10.82 0-10.82 13.44 0 7.15 4.02 11.73 10.82 11.73s10.82-4.58 10.82-11.73c0-13.44-10.82-13.44-10.82-13.44zm42.18 0c0 0-10.82 0-10.82 13.44 0 7.15 4.02 11.73 10.82 11.73s10.82-4.58 10.82-11.73c0-13.44-10.82-13.44-10.82-13.44z"/>
        </svg>
      )
    default:
      return <FileText className={cn("w-4 h-4 text-muted-foreground", className)} />
  }
}

// Helper to get file extension from filename
const getFileExtension = (filename: string): string => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

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
  
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const canExecute = activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable

  const handleDeleteFile = (fileId: string, fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteFile(fileId)
    toast.success(`File "${fileName}" deleted`)
  }

  const getLanguageConfig = (language: string) => {
    return languageConfigs[language as keyof typeof languageConfigs] || {
      name: language,
      icon: '📄',
      executable: false
    }
  }

  // Empty state with better styling
  if (files.length === 0) {
    return (
      <div className="h-10 border-b border-border bg-[#252526] flex items-center justify-center">
        {isHost ? (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={showNewFileModal} 
            disabled={fileCreationLoading}
            className="h-8 text-xs text-[#cccccc] hover:bg-[#37373d] hover:text-white transition-colors"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Creating file...
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-2" />
                Create your first file
              </>
            )}
          </Button>
        ) : (
          <div className="text-xs text-[#858585]">No files open</div>
        )}
      </div>
    )
  }

  // Modern, clean tab design
  return (
    <div className="h-10 border-b border-border bg-[#252526] flex items-center">
      {/* File tabs area */}
      <ScrollArea className="flex-1 whitespace-nowrap">
        <div className="flex h-10 items-center">
          {files.map((file, index) => {
            const config = getLanguageConfig(file.language)
            const isActive = file.id === activeFileId
            const fileExt = getFileExtension(file.name)
            const isHovered = hoveredTab === file.id
            
            // Construct filename with extension if missing
            const displayName = (!file.name.includes('.') && config.extension)
                ? `${file.name}.${config.extension}`
                : file.name;

            return (
              <Tooltip key={file.id}>
                <TooltipTrigger asChild>
                  <button
                    onMouseEnter={() => setHoveredTab(file.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActiveFileId(file.id)}
                    className={cn(
                      "group relative flex items-center px-3 h-full text-xs font-normal min-w-0 max-w-[200px]",
                      "transition-all duration-150 ease-in-out",
                      "border-r border-[#37373d] last:border-r-0",
                      isActive 
                        ? "bg-[#1e1e1e] text-white shadow-sm" 
                        : "bg-transparent text-[#cccccc] hover:bg-[#2d2d30] hover:text-white"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#007acc]" />
                    )}
                    
                    {/* Language icon */}
                    <div className="flex-shrink-0 mr-2">
                      <LanguageIcon language={file.language || fileExt} />
                    </div>
                    
                    {/* File name */}
                    <span className="truncate flex-1 text-left font-medium">
                      {displayName}
                    </span>
                    
                    {/* File status indicator (unsaved changes) */}
                    <div className="ml-1 flex-shrink-0">
                      <Dot className={cn(
                        "w-3 h-3 transition-opacity",
                        false ? "opacity-100 text-white" : "opacity-0" // Add unsaved logic here
                      )} />
                    </div>
                    
                    {/* Close button */}
                    {isHost && (
                      <button
                        onClick={(e) => handleDeleteFile(file.id, displayName, e)}
                        className={cn(
                          "ml-1 w-5 h-5 flex items-center justify-center rounded transition-all",
                          "opacity-0 group-hover:opacity-100",
                          isActive && "opacity-60 hover:opacity-100",
                          "hover:bg-[#5a5d5e] hover:text-white"
                        )}
                        title="Close file"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {config.name} {fileExt && `• .${fileExt}`}
                      {canExecute && file.id === activeFileId && ' • Executable'}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>

      {/* Right side actions */}
      <div className="flex items-center border-l border-[#37373d] pl-2 pr-2">
        {/* Session status */}
        {sessionInfo && (
          <div className="flex items-center px-2 text-xs text-[#cccccc] space-x-1">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              sessionInfo.isConnected ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className="text-[10px] text-[#858585]">
              {sessionInfo.participantCount || 0} online
            </span>
          </div>
        )}

        {/* New file button */}
        {isHost && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={showNewFileModal}
                disabled={fileCreationLoading}
                className="h-7 w-7 p-0 hover:bg-[#37373d] text-[#cccccc] hover:text-white transition-colors"
              >
                {fileCreationLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div>New File</div>
                <div className="text-muted-foreground">Ctrl+N</div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Execute button for executable files */}
        {canExecute && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={executeCode}
                disabled={isExecuting}
                className={cn(
                  "h-7 px-2 hover:bg-[#37373d] transition-colors ml-1",
                  isExecuting 
                    ? "text-blue-400 bg-blue-500/10" 
                    : "text-[#cccccc] hover:text-white hover:bg-emerald-600/20"
                )}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    <span className="text-xs">Running</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    <span className="text-xs">Run</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div>Run {activeFile && getLanguageConfig(activeFile.language).name}</div>
                <div className="text-muted-foreground">Ctrl+E</div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* File actions menu */}
        {files.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-[#37373d] text-[#cccccc] hover:text-white transition-colors ml-1"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={showNewFileModal} disabled={!isHost}>
                <Plus className="h-4 w-4 mr-2" />
                New File
              </DropdownMenuItem>
              {canExecute && (
                <DropdownMenuItem onClick={executeCode} disabled={isExecuting}>
                  <Play className="h-4 w-4 mr-2" />
                  Run File
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-muted-foreground">
                {files.length} file{files.length !== 1 ? 's' : ''} open
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
