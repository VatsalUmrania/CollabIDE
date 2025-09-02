'use client'

import {
  Plus,
  Play,
  Loader2,
  X,
  FileCode,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { languageConfigs } from '../utils/languageConfigs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Official language icons using SVG - based on devicon standard
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
          <linearGradient id="python-a" x1="11.4" y1="0" x2="11.4" y2="24.8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3F7CAF"/>
            <stop offset="1" stopColor="#306998"/>
          </linearGradient>
          <linearGradient id="python-b" x1="11.4" y1="24.8" x2="11.4" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE05A"/>
            <stop offset="1" stopColor="#FFC331"/>
          </linearGradient>
          <path d="M49.3 16.3c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H55.6c-3.5 0-6.3-2.8-6.3-6.3z" fill="url(#python-a)"/>
          <path d="M6 55.8c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H12.3c-3.5 0-6.3-2.8-6.3-6.3z" fill="url(#python-b)"/>
          <circle cx="61.9" cy="21.9" r="2.6" fill="#FFF"/>
          <circle cx="17.1" cy="61.4" r="2.6" fill="#FFF"/>
        </svg>
      )
    case 'java':
      return (
        <svg {...iconProps} fill="#ED8B00">
          <path d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
          <path d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
          <path d="M102.123 116.675s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
          <path d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
          <path d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
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
        <svg {...iconProps} fill="#000" stroke="currentColor" strokeWidth="0.5">
          <rect x="10" y="10" width="108" height="108" rx="8" fill="#FFA500" stroke="none"/>
          <text x="64" y="75" textAnchor="middle" fontSize="48" fontFamily="monospace" fill="white">{ }</text>
        </svg>
      )
    case 'php':
      return (
        <svg {...iconProps} fill="#777BB4">
          <path d="M64 33.039C30.26 33.039 2.906 48.901 2.906 68.508c0 19.608 27.354 35.47 61.094 35.47s61.094-15.862 61.094-35.47C125.094 48.901 97.74 33.039 64 33.039zM48.103 85.25c-2.532 0-4.572-.543-6.121-1.628-1.548-1.085-2.323-2.651-2.323-4.698 0-1.162.194-2.182.581-3.06.388-.878.969-1.627 1.744-2.247a8.305 8.305 0 012.711-1.395c1.085-.31 2.323-.465 3.713-.465h4.031v-6.51c0-1.627-.426-2.883-1.279-3.767-.853-.884-2.092-1.326-3.713-1.326-1.162 0-2.17.194-3.023.581-.853.388-1.511.93-1.976 1.628l-3.488-2.634c.891-1.318 2.17-2.324 3.836-3.023 1.666-.698 3.565-1.047 5.697-1.047 3.178 0 5.62.775 7.326 2.323 1.705 1.549 2.558 3.836 2.558 6.86v16.279H48.103z"/>
        </svg>
      )
    case 'go':
      return (
        <svg {...iconProps} fill="#00ADD8">
          <path d="M16.2 36.9c-.7-2.3 2.5-3.5 5.4-3.7 2.9-.2 5.8.3 8.6 1.2 2.8.9 5.4 2.4 7.6 4.4 2.2 2 4 4.5 5.1 7.3 1.1 2.8 1.5 5.9 1.1 8.9-.4 3-1.5 5.9-3.2 8.4-1.7 2.5-3.9 4.6-6.5 6.1-2.6 1.5-5.5 2.4-8.5 2.6-3 .2-6-.3-8.8-1.4-2.8-1.1-5.3-2.8-7.4-5-2.1-2.2-3.7-4.8-4.7-7.6-1-2.8-1.3-5.8-.9-8.7.4-2.9 1.4-5.6 2.9-8"/>
        </svg>
      )
    case 'rust':
    case 'rs':
      return (
        <svg {...iconProps} fill="#CE422B">
          <path d="M64 12.8c28.4 0 51.4 23 51.4 51.4s-23 51.4-51.4 51.4S12.6 92.6 12.6 64.2s23-51.4 51.4-51.4z"/>
        </svg>
      )
    case 'cpp':
    case 'c++':
    case 'cxx':
      return (
        <svg {...iconProps} fill="#00599C">
          <path d="M64 12.8l44.7 25.8v51.6L64 115.4 19.3 90.2V38.6L64 12.8z"/>
        </svg>
      )
    case 'c':
      return (
        <svg {...iconProps} fill="#A8B9CC">
          <path d="M64 12.8c28.4 0 51.4 23 51.4 51.4s-23 51.4-51.4 51.4S12.6 92.6 12.6 64.2s23-51.4 51.4-51.4z"/>
        </svg>
      )
    case 'ruby':
    case 'rb':
      return (
        <svg {...iconProps} fill="#CC342D">
          <path d="M26.1 9.3L8.8 26.6c-.9.9-.9 2.3 0 3.2L64 85 119.2 29.8c.9-.9.9-2.3 0-3.2L101.9 9.3c-.9-.9-2.3-.9-3.2 0L64 43.9 29.3 9.3c-.9-.9-2.3-.9-3.2 0z"/>
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
  
  const canExecute = activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable

  const handleDeleteFile = (fileId: string, fileName: string) => {
    deleteFile(fileId)
    toast.success(`File "${fileName}" deleted`)
  }

  const getLanguageConfig = (language: string) => {
    // This now returns a config with an optional 'extension' property
    return languageConfigs[language as keyof typeof languageConfigs] || {
      name: language,
      icon: '📄',
      executable: false
    }
  }

  // Empty state - VS Code style
  if (files.length === 0) {
    return (
      <div className="h-9 border-b border-border bg-[#2d2d30] flex items-center justify-center text-xs text-muted-foreground">
        {isHost ? (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={showNewFileModal} 
            disabled={fileCreationLoading}
            className="h-7 text-xs hover:bg-[#37373d]"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-2" />
                New File
              </>
            )}
          </Button>
        ) : (
          "No files open"
        )}
      </div>
    )
  }

  // VS Code exact style tabs with official language icons
  return (
    <div className="h-9 border-b border-border bg-[#2d2d30] flex">
      {/* File tabs area - VS Code style */}
      <ScrollArea className="flex-1 whitespace-nowrap">
        <div className="flex h-9">
          {files.map((file, index) => {
            const config = getLanguageConfig(file.language)
            const isActive = file.id === activeFileId
            const isLast = index === files.length - 1
            const fileExt = getFileExtension(file.name)
            
            // --- 🚀 CHANGE START ---
            // Construct filename with extension if it's missing
            const displayName = (!file.name.includes('.') && config.extension)
                ? `${file.name}.${config.extension}`
                : file.name;
            // --- 🚀 CHANGE END ---

            return (
              <Tooltip key={file.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveFileId(file.id)}
                    className={cn(
                      "group relative flex items-center px-3 h-9 text-xs font-normal min-w-0 max-w-[240px]",
                      "border-r border-[#454545] transition-colors",
                      isActive 
                        ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc] border-r-[#454545]" 
                        : "bg-[#2d2d30] text-[#cccccc] hover:bg-[#37373d]",
                      isLast && !isActive && "border-r-0"
                    )}
                  >
                    {/* Official language icon */}
                    <div className="flex-shrink-0 mr-2">
                      <LanguageIcon language={file.language || fileExt} />
                    </div>
                    
                    {/* File name with extension - VS Code style */}
                    <span className="truncate flex-1 text-left">
                      {/* --- 🚀 CHANGE START --- */}
                      {displayName}
                      {/* --- 🚀 CHANGE END --- */}
                    </span>
                    
                    {/* Close button - VS Code style */}
                    {isHost && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          // Use displayName in the toast message for consistency
                          handleDeleteFile(file.id, displayName)
                        }}
                        className={cn(
                          "ml-2 w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100",
                          "hover:bg-[#5a5d5e] transition-all",
                          isActive && "opacity-60"
                        )}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <div>
                    {/* --- 🚀 CHANGE START --- */}
                    <p className="font-medium">{displayName}</p>
                    {/* --- 🚀 CHANGE END --- */}
                    <p className="text-muted-foreground">
                      {config.name} {fileExt && `• .${fileExt}`}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>

      {/* Action buttons - VS Code toolbar style */}
      <div className="flex items-center border-l border-[#454545]">
        {/* Session indicator */}
        {sessionInfo && (
          <div className="flex items-center px-2 text-xs text-[#cccccc]">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full mr-1",
              sessionInfo.isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span>{sessionInfo.participantCount || 0}</span>
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
                className="h-9 w-9 p-0 hover:bg-[#37373d] text-[#cccccc]"
              >
                {fileCreationLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>New File</TooltipContent>
          </Tooltip>
        )}

        {/* Run button */}
        {canExecute && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={executeCode}
                disabled={isExecuting}
                className="h-9 px-2 hover:bg-[#37373d] text-[#cccccc]"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    <span className="text-xs">Running</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Run</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Run {activeFile && getLanguageConfig(activeFile.language).name}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}