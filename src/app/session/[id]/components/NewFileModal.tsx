'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Plus, Loader2, AlertCircle, FolderPlus } from 'lucide-react'
import { 
  SiJavascript, 
  SiTypescript, 
  SiPython, 
  SiHtml5, 
  SiCss3, 
  SiJava, 
  SiCplusplus, 
  SiPhp, 
  SiGo, 
  SiRust, 
  SiRuby 
} from 'react-icons/si'
import { VscJson } from 'react-icons/vsc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { languageConfigs } from '../utils/languageConfigs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Original language icons using react-icons
const LanguageIcon = ({ language, className = "" }: { language: string; className?: string }) => {
  const iconClass = cn("w-5 h-5", className)

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return <SiJavascript className={cn(iconClass, "text-yellow-400")} />
    case 'typescript':
    case 'ts':
      return <SiTypescript className={cn(iconClass, "text-blue-500")} />
    case 'python':
    case 'py':
      return <SiPython className={cn(iconClass, "text-blue-600")} />
    case 'html':
      return <SiHtml5 className={cn(iconClass, "text-orange-600")} />
    case 'css':
      return <SiCss3 className={cn(iconClass, "text-blue-500")} />
    case 'java':
      return <SiJava className={cn(iconClass, "text-red-600")} />
    case 'cpp':
    case 'c++':
      return <SiCplusplus className={cn(iconClass, "text-blue-600")} />
    case 'php':
      return <SiPhp className={cn(iconClass, "text-purple-600")} />
    case 'go':
      return <SiGo className={cn(iconClass, "text-cyan-600")} />
    case 'rust':
    case 'rs':
      return <SiRust className={cn(iconClass, "text-orange-600")} />
    case 'ruby':
    case 'rb':
      return <SiRuby className={cn(iconClass, "text-red-600")} />
    case 'json':
      return <VscJson className={cn(iconClass, "text-yellow-500")} />
    default:
      return <div className={cn("w-5 h-5 rounded bg-muted-foreground/20 flex items-center justify-center", className)}>
        <span className="text-xs text-muted-foreground">?</span>
      </div>
  }
}

interface NewFileModalProps {
  newFileName: string
  setNewFileName: (name: string) => void
  newFileLanguage: string
  setNewFileLanguage: (lang: string) => void
  fileCreationLoading: boolean
  createNewFile: () => void
  files: any[]
  closeModal: () => void
}

export default function NewFileModal({
  newFileName,
  setNewFileName,
  newFileLanguage,
  setNewFileLanguage,
  fileCreationLoading,
  createNewFile,
  files,
  closeModal
}: NewFileModalProps) {
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const fileNameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && fileNameInputRef.current) {
      setTimeout(() => fileNameInputRef.current?.focus(), 100)
    }
  }, [open])

  const handleClose = () => {
    if (!fileCreationLoading) {
      setOpen(false)
      closeModal()
    }
  }

  const validateAndCreate = (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    
    if (!newFileName.trim()) {
      setError('Please enter a file name')
      return
    }
    
    if (files.some(file => file.name === newFileName.trim())) {
      setError('A file with this name already exists')
      return
    }
    
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) {
      setError('Invalid characters in file name')
      return
    }

    if (!newFileLanguage) {
      setError('Please select a programming language')
      return
    }
    
    createNewFile()
  }

  const getSelectedLanguageConfig = () => {
    return languageConfigs[newFileLanguage as keyof typeof languageConfigs]
  }

  const isFormValid = newFileName.trim() && newFileLanguage && !error

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {/* Clean Header with single close button */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FolderPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                Create New File
              </h2>
              <p className="text-sm text-muted-foreground">
                Add a file to your session
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={fileCreationLoading}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Simple existing files info */}
          {files.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {files.length} existing: {files.slice(0, 3).map(f => f.name).join(', ')}
              {files.length > 3 && ` +${files.length - 3} more`}
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Clean Form */}
          <form onSubmit={validateAndCreate} className="space-y-4">
            <div>
              <Label htmlFor="fileName" className="text-sm font-medium">
                File Name
              </Label>
              <Input
                ref={fileNameInputRef}
                id="fileName"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value)
                  setError('')
                }}
                placeholder="main.js"
                disabled={fileCreationLoading}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Language
              </Label>
              <Select 
                value={newFileLanguage} 
                onValueChange={(value) => {
                  setNewFileLanguage(value)
                  setError('')
                }}
                disabled={fileCreationLoading}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select language">
                    {newFileLanguage && getSelectedLanguageConfig() && (
                      <div className="flex items-center space-x-3">
                        <LanguageIcon language={newFileLanguage} />
                        <span>{getSelectedLanguageConfig().name}</span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <Badge variant="outline" className="text-xs">
                            .{getSelectedLanguageConfig().extension}
                          </Badge>
                          {getSelectedLanguageConfig().executable && (
                            <Badge className="text-xs bg-chart-2/20 text-chart-2 border-chart-2/30">
                              Run
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <LanguageIcon language={key} />
                          <span>{config.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <Badge variant="outline" className="text-xs">
                            .{config.extension}
                          </Badge>
                          {config.executable && (
                            <Badge className="text-xs bg-chart-2/20 text-chart-2 border-chart-2/30">
                              Run
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Simple Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={fileCreationLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || fileCreationLoading}
              >
                {fileCreationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
