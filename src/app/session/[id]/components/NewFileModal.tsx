'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Loader2, 
  AlertCircle, 
  File, 
  Code2, 
  Sparkles, 
  FileText,
  CheckCircle,
  Zap,
  Search,
  Info,
  FolderPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { languageConfigs } from '../utils/languageConfigs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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
  const [validationProgress, setValidationProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Handle modal close
  const handleClose = () => {
    setOpen(false)
    closeModal()
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  // Validation progress animation
  useEffect(() => {
    if (fileCreationLoading) {
      setValidationProgress(0)
      const interval = setInterval(() => {
        setValidationProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 150)
      
      return () => clearInterval(interval)
    } else {
      if (validationProgress > 0) {
        setValidationProgress(100)
        setTimeout(() => setValidationProgress(0), 1000)
      }
    }
  }, [fileCreationLoading, validationProgress])

  // Enhanced validation with toast feedback
  const validateAndCreate = () => {
    setError('')
    
    if (!newFileName.trim()) {
      setError('File name is required')
      toast.error('Please enter a file name')
      return
    }
    
    if (files.some(file => file.name === newFileName.trim())) {
      setError('A file with this name already exists')
      toast.error('File name already exists')
      return
    }
    
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) {
      setError('File name contains invalid characters. Use only letters, numbers, dots, hyphens, and underscores.')
      toast.error('Invalid file name characters')
      return
    }

    if (newFileName.trim().length > 100) {
      setError('File name is too long (maximum 100 characters)')
      toast.error('File name too long')
      return
    }

    if (!newFileLanguage) {
      setError('Please select a programming language')
      toast.error('Please select a language')
      return
    }
    
    toast.loading('Creating file...', { id: 'create-file' })
    createNewFile()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !fileCreationLoading && isFormValid) {
      validateAndCreate()
    }
  }

  // Enhanced auto-detect language from file extension
  const handleFileNameChange = (name: string) => {
    setNewFileName(name)
    setError('') // Clear errors when user types
    
    // Auto-detect language from extension
    const extension = name.split('.').pop()?.toLowerCase()
    if (extension) {
      const detectedLanguage = Object.entries(languageConfigs).find(
        ([_, config]) => config.extension === extension
      )
      if (detectedLanguage && !newFileLanguage) {
        setNewFileLanguage(detectedLanguage[0])
        toast.success(`Auto-detected ${languageConfigs[detectedLanguage[0] as keyof typeof languageConfigs]?.name}`)
      }
    }
  }

  const getSelectedLanguageConfig = () => {
    return languageConfigs[newFileLanguage as keyof typeof languageConfigs]
  }

  const isFormValid = newFileName.trim() && newFileLanguage && !fileCreationLoading

  // Get validation status
  const getValidationStatus = () => {
    if (!newFileName.trim()) return { valid: false, message: 'Required' }
    if (files.some(file => file.name === newFileName.trim())) 
      return { valid: false, message: 'Already exists' }
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) 
      return { valid: false, message: 'Invalid characters' }
    if (newFileName.trim().length > 100) 
      return { valid: false, message: 'Too long' }
    return { valid: true, message: 'Valid' }
  }

  // Filter languages based on search
  const filteredLanguages = Object.entries(languageConfigs).filter(
    ([key, config]) =>
      config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get popular languages
  const popularLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html']
  const otherLanguages = filteredLanguages.filter(([key]) => !popularLanguages.includes(key))
  const popularFiltered = filteredLanguages.filter(([key]) => popularLanguages.includes(key))

  const validationStatus = getValidationStatus()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[95vh] border-0 bg-card/95 backdrop-blur shadow-2xl">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FolderPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  Create New File
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2 text-lg">
                  Add a new file to your collaborative session
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Session Files Info */}
          {files.length > 0 && (
            <Card className="border-0 bg-muted/30 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground font-semibold">
                      {files.length} existing file{files.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/20">
                    Names must be unique
                  </Badge>
                </div>
                {files.length <= 6 && (
                  <div className="flex flex-wrap gap-1">
                    {files.slice(0, 6).map((file: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {file.name}
                      </Badge>
                    ))}
                    {files.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{files.length - 6} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {/* File Name Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">
                  File Name
                </Label>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>
              
              <div className="relative">
                <Input
                  type="text"
                  value={newFileName}
                  onChange={(e) => handleFileNameChange(e.target.value)}
                  placeholder="e.g., main.js, style.css, index.html, app.py"
                  className={cn(
                    "text-base transition-all pr-24",
                    newFileName && (validationStatus.valid 
                      ? "border-green-500/50 focus:border-green-500" 
                      : "border-red-500/50 focus:border-red-500")
                  )}
                  onKeyPress={handleKeyPress}
                  disabled={fileCreationLoading}
                  autoFocus
                  maxLength={100}
                />
                
                {/* Validation indicator */}
                {newFileName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      validationStatus.valid ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      validationStatus.valid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {validationStatus.message}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Use only letters, numbers, dots, hyphens, and underscores
                </p>
                <span className={cn(
                  "text-xs font-medium",
                  newFileName.length > 80 ? "text-orange-500" : "text-muted-foreground"
                )}>
                  {newFileName.length}/100
                </span>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">
                  Programming Language
                </Label>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>
              
              <Select 
                value={newFileLanguage} 
                onValueChange={setNewFileLanguage}
                disabled={fileCreationLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a programming language">
                    {newFileLanguage && getSelectedLanguageConfig() && (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSelectedLanguageConfig().icon}</span>
                        <span className="font-medium">{getSelectedLanguageConfig().name}</span>
                        <Badge variant="outline" className="text-xs">
                          .{getSelectedLanguageConfig().extension}
                        </Badge>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search languages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                  
                  <ScrollArea className="h-60">
                    {/* Popular Languages */}
                    {popularFiltered.length > 0 && !searchTerm && (
                      <div className="px-2 py-1">
                        <div className="flex items-center space-x-1 mb-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Popular
                          </span>
                        </div>
                        {popularFiltered.map(([key, config]) => (
                          <SelectItem 
                            key={key} 
                            value={key} 
                            className="hover:bg-muted/50 transition-colors mb-1"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <span className="text-lg">{config.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{config.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    .{config.extension}
                                  </Badge>
                                </div>
                                {config.executable && (
                                  <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 mt-1">
                                    <Zap className="h-2 w-2 mr-1" />
                                    Executable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    )}
                    
                    {/* Other Languages */}
                    {(otherLanguages.length > 0 || searchTerm) && (
                      <div className="px-2 py-1">
                        {!searchTerm && popularFiltered.length > 0 && <Separator className="my-2" />}
                        {!searchTerm && (
                          <div className="flex items-center space-x-1 mb-2">
                            <Code2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              All Languages
                            </span>
                          </div>
                        )}
                        {(searchTerm ? filteredLanguages : otherLanguages).map(([key, config]) => (
                          <SelectItem 
                            key={key} 
                            value={key} 
                            className="hover:bg-muted/50 transition-colors mb-1"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <span className="text-lg">{config.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{config.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    .{config.extension}
                                  </Badge>
                                </div>
                                {config.executable && (
                                  <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 mt-1">
                                    <Zap className="h-2 w-2 mr-1" />
                                    Executable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    )}
                    
                    {filteredLanguages.length === 0 && searchTerm && (
                      <div className="p-4 text-center text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No languages found</p>
                        <p className="text-xs">Try a different search term</p>
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>

              {/* Language Info */}
              {newFileLanguage && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <span className="font-medium text-primary">
                      {getSelectedLanguageConfig().name}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      selected • .{getSelectedLanguageConfig().extension} extension
                    </span>
                    {getSelectedLanguageConfig().executable && (
                      <span className="text-green-600 dark:text-green-400 ml-1 font-medium">• Executable</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* File Preview */}
            {newFileName && newFileLanguage && validationStatus.valid && (
              <Card className="border-0 bg-gradient-to-r from-primary/5 to-purple-500/5 backdrop-blur">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    File Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{getSelectedLanguageConfig().icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-mono text-foreground truncate">
                        {newFileName.includes('.') ? newFileName : `${newFileName}.${getSelectedLanguageConfig().extension}`}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {getSelectedLanguageConfig().name}
                        </Badge>
                        {getSelectedLanguageConfig().executable && (
                          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                            <Zap className="h-2 w-2 mr-1" />
                            Can execute
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading Progress */}
            {fileCreationLoading && (
              <Card className="border-0 bg-muted/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">Creating file...</span>
                    </div>
                    <span className="text-sm text-primary font-semibold">{Math.round(validationProgress)}%</span>
                  </div>
                  <Progress value={validationProgress} className="h-2" />
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={fileCreationLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={validateAndCreate}
            disabled={!isFormValid}
            className="w-full sm:w-auto min-w-[140px] shadow-md"
          >
            {fileCreationLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create File</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
