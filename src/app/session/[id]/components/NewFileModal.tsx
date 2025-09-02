// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   X, 
//   Plus, 
//   Loader2, 
//   AlertCircle, 
//   File, 
//   Code2, 
//   Sparkles, 
//   FileText,
//   CheckCircle,
//   Zap,
//   Search,
//   Info,
//   FolderPlus
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from '@/components/ui/select'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { 
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { Progress } from '@/components/ui/progress'
// import { languageConfigs } from '../utils/languageConfigs'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

// interface NewFileModalProps {
//   newFileName: string
//   setNewFileName: (name: string) => void
//   newFileLanguage: string
//   setNewFileLanguage: (lang: string) => void
//   fileCreationLoading: boolean
//   createNewFile: () => void
//   files: any[]
//   closeModal: () => void
// }

// export default function NewFileModal({
//   newFileName,
//   setNewFileName,
//   newFileLanguage,
//   setNewFileLanguage,
//   fileCreationLoading,
//   createNewFile,
//   files,
//   closeModal
// }: NewFileModalProps) {
//   const [open, setOpen] = useState(true)
//   const [error, setError] = useState('')
//   const [validationProgress, setValidationProgress] = useState(0)
//   const [searchTerm, setSearchTerm] = useState('')

//   // Handle modal close
//   const handleClose = () => {
//     setOpen(false)
//     closeModal()
//   }

//   // Prevent background scroll when modal is open
//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'unset'
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset'
//     }
//   }, [open])

//   // Validation progress animation
//   useEffect(() => {
//     if (fileCreationLoading) {
//       setValidationProgress(0)
//       const interval = setInterval(() => {
//         setValidationProgress(prev => {
//           if (prev >= 90) return prev
//           return prev + Math.random() * 15
//         })
//       }, 150)
      
//       return () => clearInterval(interval)
//     } else {
//       if (validationProgress > 0) {
//         setValidationProgress(100)
//         setTimeout(() => setValidationProgress(0), 1000)
//       }
//     }
//   }, [fileCreationLoading, validationProgress])

//   // Enhanced validation with toast feedback
//   const validateAndCreate = () => {
//     setError('')
    
//     if (!newFileName.trim()) {
//       setError('File name is required')
//       toast.error('Please enter a file name')
//       return
//     }
    
//     if (files.some(file => file.name === newFileName.trim())) {
//       setError('A file with this name already exists')
//       toast.error('File name already exists')
//       return
//     }
    
//     if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) {
//       setError('File name contains invalid characters. Use only letters, numbers, dots, hyphens, and underscores.')
//       toast.error('Invalid file name characters')
//       return
//     }

//     if (newFileName.trim().length > 100) {
//       setError('File name is too long (maximum 100 characters)')
//       toast.error('File name too long')
//       return
//     }

//     if (!newFileLanguage) {
//       setError('Please select a programming language')
//       toast.error('Please select a language')
//       return
//     }
    
//     toast.loading('Creating file...', { id: 'create-file' })
//     createNewFile()
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !fileCreationLoading && isFormValid) {
//       validateAndCreate()
//     }
//   }

//   // Enhanced auto-detect language from file extension
//   const handleFileNameChange = (name: string) => {
//     setNewFileName(name)
//     setError('') // Clear errors when user types
    
//     // Auto-detect language from extension
//     const extension = name.split('.').pop()?.toLowerCase()
//     if (extension) {
//       const detectedLanguage = Object.entries(languageConfigs).find(
//         ([_, config]) => config.extension === extension
//       )
//       if (detectedLanguage && !newFileLanguage) {
//         setNewFileLanguage(detectedLanguage[0])
//         toast.success(`Auto-detected ${languageConfigs[detectedLanguage[0] as keyof typeof languageConfigs]?.name}`)
//       }
//     }
//   }

//   const getSelectedLanguageConfig = () => {
//     return languageConfigs[newFileLanguage as keyof typeof languageConfigs]
//   }

//   const isFormValid = newFileName.trim() && newFileLanguage && !fileCreationLoading

//   // Get validation status
//   const getValidationStatus = () => {
//     if (!newFileName.trim()) return { valid: false, message: 'Required' }
//     if (files.some(file => file.name === newFileName.trim())) 
//       return { valid: false, message: 'Already exists' }
//     if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) 
//       return { valid: false, message: 'Invalid characters' }
//     if (newFileName.trim().length > 100) 
//       return { valid: false, message: 'Too long' }
//     return { valid: true, message: 'Valid' }
//   }

//   // Filter languages based on search
//   const filteredLanguages = Object.entries(languageConfigs).filter(
//     ([key, config]) =>
//       config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       config.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       key.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   // Get popular languages
//   const popularLanguages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html']
//   const otherLanguages = filteredLanguages.filter(([key]) => !popularLanguages.includes(key))
//   const popularFiltered = filteredLanguages.filter(([key]) => popularLanguages.includes(key))

//   const validationStatus = getValidationStatus()

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-2xl max-h-[95vh] border-0 bg-card/95 backdrop-blur shadow-2xl">
//         <DialogHeader className="space-y-4 pb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
//                 <FolderPlus className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <DialogTitle className="text-3xl font-bold text-foreground">
//                   Create New File
//                 </DialogTitle>
//                 <DialogDescription className="text-muted-foreground mt-2 text-lg">
//                   Add a new file to your collaborative session
//                 </DialogDescription>
//               </div>
//             </div>
//           </div>

//           {/* Session Files Info */}
//           {files.length > 0 && (
//             <Card className="border-0 bg-muted/30 backdrop-blur">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center space-x-2">
//                     <File className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm text-foreground font-semibold">
//                       {files.length} existing file{files.length !== 1 ? 's' : ''}
//                     </span>
//                   </div>
//                   <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/20">
//                     Names must be unique
//                   </Badge>
//                 </div>
//                 {files.length <= 6 && (
//                   <div className="flex flex-wrap gap-1">
//                     {files.slice(0, 6).map((file: any, index: number) => (
//                       <Badge key={index} variant="secondary" className="text-xs">
//                         {file.name}
//                       </Badge>
//                     ))}
//                     {files.length > 6 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{files.length - 6} more
//                       </Badge>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           )}
//         </DialogHeader>

//         <ScrollArea className="flex-1 px-1">
//           <div className="space-y-6 py-4">
//             {/* Error Alert */}
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription className="font-medium">{error}</AlertDescription>
//               </Alert>
//             )}

//             {/* File Name Input */}
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <Label className="text-sm font-semibold text-foreground">
//                   File Name
//                 </Label>
//                 <Badge variant="destructive" className="text-xs">
//                   Required
//                 </Badge>
//               </div>
              
//               <div className="relative">
//                 <Input
//                   type="text"
//                   value={newFileName}
//                   onChange={(e) => handleFileNameChange(e.target.value)}
//                   placeholder="e.g., main.js, style.css, index.html, app.py"
//                   className={cn(
//                     "text-base transition-all pr-24",
//                     newFileName && (validationStatus.valid 
//                       ? "border-green-500/50 focus:border-green-500" 
//                       : "border-red-500/50 focus:border-red-500")
//                   )}
//                   onKeyPress={handleKeyPress}
//                   disabled={fileCreationLoading}
//                   autoFocus
//                   maxLength={100}
//                 />
                
//                 {/* Validation indicator */}
//                 {newFileName && (
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
//                     <div className={cn(
//                       "w-2 h-2 rounded-full transition-colors",
//                       validationStatus.valid ? "bg-green-500" : "bg-red-500"
//                     )} />
//                     <span className={cn(
//                       "text-xs font-medium",
//                       validationStatus.valid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//                     )}>
//                       {validationStatus.message}
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <p className="text-xs text-muted-foreground">
//                   Use only letters, numbers, dots, hyphens, and underscores
//                 </p>
//                 <span className={cn(
//                   "text-xs font-medium",
//                   newFileName.length > 80 ? "text-orange-500" : "text-muted-foreground"
//                 )}>
//                   {newFileName.length}/100
//                 </span>
//               </div>
//             </div>

//             {/* Language Selection */}
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <Label className="text-sm font-semibold text-foreground">
//                   Programming Language
//                 </Label>
//                 <Badge variant="destructive" className="text-xs">
//                   Required
//                 </Badge>
//               </div>
              
//               <Select 
//                 value={newFileLanguage} 
//                 onValueChange={setNewFileLanguage}
//                 disabled={fileCreationLoading}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose a programming language">
//                     {newFileLanguage && getSelectedLanguageConfig() && (
//                       <div className="flex items-center space-x-2">
//                         <span className="text-lg">{getSelectedLanguageConfig().icon}</span>
//                         <span className="font-medium">{getSelectedLanguageConfig().name}</span>
//                         <Badge variant="outline" className="text-xs">
//                           .{getSelectedLanguageConfig().extension}
//                         </Badge>
//                       </div>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent className="max-h-80">
//                   <div className="p-2">
//                     <div className="relative">
//                       <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         placeholder="Search languages..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="pl-8 h-8 text-sm"
//                       />
//                     </div>
//                   </div>
                  
//                   <ScrollArea className="h-60">
//                     {/* Popular Languages */}
//                     {popularFiltered.length > 0 && !searchTerm && (
//                       <div className="px-2 py-1">
//                         <div className="flex items-center space-x-1 mb-2">
//                           <Sparkles className="h-3 w-3 text-primary" />
//                           <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                             Popular
//                           </span>
//                         </div>
//                         {popularFiltered.map(([key, config]) => (
//                           <SelectItem 
//                             key={key} 
//                             value={key} 
//                             className="hover:bg-muted/50 transition-colors mb-1"
//                           >
//                             <div className="flex items-center space-x-3 w-full">
//                               <span className="text-lg">{config.icon}</span>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center space-x-2">
//                                   <span className="font-medium">{config.name}</span>
//                                   <Badge variant="outline" className="text-xs">
//                                     .{config.extension}
//                                   </Badge>
//                                 </div>
//                                 {config.executable && (
//                                   <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 mt-1">
//                                     <Zap className="h-2 w-2 mr-1" />
//                                     Executable
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Other Languages */}
//                     {(otherLanguages.length > 0 || searchTerm) && (
//                       <div className="px-2 py-1">
//                         {!searchTerm && popularFiltered.length > 0 && <Separator className="my-2" />}
//                         {!searchTerm && (
//                           <div className="flex items-center space-x-1 mb-2">
//                             <Code2 className="h-3 w-3 text-muted-foreground" />
//                             <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                               All Languages
//                             </span>
//                           </div>
//                         )}
//                         {(searchTerm ? filteredLanguages : otherLanguages).map(([key, config]) => (
//                           <SelectItem 
//                             key={key} 
//                             value={key} 
//                             className="hover:bg-muted/50 transition-colors mb-1"
//                           >
//                             <div className="flex items-center space-x-3 w-full">
//                               <span className="text-lg">{config.icon}</span>
//                               <div className="flex-1 min-w-0">
//                                 <div className="flex items-center space-x-2">
//                                   <span className="font-medium">{config.name}</span>
//                                   <Badge variant="outline" className="text-xs">
//                                     .{config.extension}
//                                   </Badge>
//                                 </div>
//                                 {config.executable && (
//                                   <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800 mt-1">
//                                     <Zap className="h-2 w-2 mr-1" />
//                                     Executable
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </div>
//                     )}
                    
//                     {filteredLanguages.length === 0 && searchTerm && (
//                       <div className="p-4 text-center text-muted-foreground">
//                         <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                         <p className="text-sm">No languages found</p>
//                         <p className="text-xs">Try a different search term</p>
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </SelectContent>
//               </Select>

//               {/* Language Info */}
//               {newFileLanguage && (
//                 <Alert className="bg-primary/5 border-primary/20">
//                   <Info className="h-4 w-4 text-primary" />
//                   <AlertDescription>
//                     <span className="font-medium text-primary">
//                       {getSelectedLanguageConfig().name}
//                     </span>
//                     <span className="text-muted-foreground ml-1">
//                       selected • .{getSelectedLanguageConfig().extension} extension
//                     </span>
//                     {getSelectedLanguageConfig().executable && (
//                       <span className="text-green-600 dark:text-green-400 ml-1 font-medium">• Executable</span>
//                     )}
//                   </AlertDescription>
//                 </Alert>
//               )}
//             </div>

//             {/* File Preview */}
//             {newFileName && newFileLanguage && validationStatus.valid && (
//               <Card className="border-0 bg-gradient-to-r from-primary/5 to-purple-500/5 backdrop-blur">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4 text-green-500" />
//                     File Preview
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center space-x-4 p-4 bg-background rounded-xl border shadow-sm">
//                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
//                       <span className="text-2xl">{getSelectedLanguageConfig().icon}</span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-lg font-mono text-foreground truncate">
//                         {newFileName.includes('.') ? newFileName : `${newFileName}.${getSelectedLanguageConfig().extension}`}
//                       </p>
//                       <div className="flex items-center space-x-2 mt-2">
//                         <Badge variant="secondary" className="text-xs">
//                           {getSelectedLanguageConfig().name}
//                         </Badge>
//                         {getSelectedLanguageConfig().executable && (
//                           <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
//                             <Zap className="h-2 w-2 mr-1" />
//                             Can execute
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Loading Progress */}
//             {fileCreationLoading && (
//               <Card className="border-0 bg-muted/20">
//                 <CardContent className="p-4 space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Loader2 className="h-4 w-4 animate-spin text-primary" />
//                       <span className="text-sm font-medium">Creating file...</span>
//                     </div>
//                     <span className="text-sm text-primary font-semibold">{Math.round(validationProgress)}%</span>
//                   </div>
//                   <Progress value={validationProgress} className="h-2" />
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </ScrollArea>

//         <DialogFooter className="flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
//           <Button 
//             variant="outline" 
//             onClick={handleClose}
//             disabled={fileCreationLoading}
//             className="w-full sm:w-auto"
//           >
//             Cancel
//           </Button>
          
//           <Button 
//             onClick={validateAndCreate}
//             disabled={!isFormValid}
//             className="w-full sm:w-auto min-w-[140px] shadow-md"
//           >
//             {fileCreationLoading ? (
//               <div className="flex items-center space-x-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span>Creating...</span>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Plus className="h-4 w-4" />
//                 <span>Create File</span>
//               </div>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Plus, Loader2, AlertCircle, FolderPlus, FileText } from 'lucide-react'
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

// Language icon component with proper SVG icons
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
          <path d="M2 1v125h125V1zm109 107c0 5.5-3.5 9-11.5 9-6 0-9.5-3-11.5-7l6-3.5c1.5 2.5 3 4.5 6 4.5s5-1.5 5-3.5c0-2.5-2-3.5-5.5-5l-2-1c-5.5-2.5-9-5.5-9-12 0-6 4.5-10.5 11.5-10.5 5 0 8.5 1.5 11 5.5l-6 4c-1.5-2.5-3-3.5-5-3.5s-3 1.5-3 3.5c0 2.5 2 3.5 5 5l2 1c6.5 3 10.5 5.5 10.5 12z"/>
        </svg>
      )
    case 'typescript':
    case 'ts':
      return (
        <svg {...iconProps} fill="#3178C6">
          <path d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-.53.29-.83.48l-5.24 2.26c-.24.1-.43.05-.59-.23a6.57 6.57 0 00-5.69-2.7c-2.79 0-4.6 1.54-4.6 3.49 0 1.54.79 2.52 4.31 3.68l2 .67c4.65 1.58 6.64 3.18 6.64 6.53 0 3.9-3.24 6.42-8.78 6.42a16.3 16.3 0 01-9.52-3.95c-.83-.56-1.26-1.26-.94-2l.13-.18 5.16-2.28c.26-.13.43-.1.63.15a7.3 7.3 0 006.44 3.49c3 0 5-1.38 5-3.17 0-1.69-.79-2.26-4.57-3.81l-2-.8c-4.62-2-6.74-3.78-6.74-7.59 0-3.5 3.38-6.17 8.11-6.17a13.4 13.4 0 018.55 3.18z"/>
        </svg>
      )
    case 'python':
    case 'py':
      return (
        <svg {...iconProps} fill="#306998">
          <path d="M49.3 16.3c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H55.6c-3.5 0-6.3-2.8-6.3-6.3z"/>
          <path d="M6 55.8c0-3.5 2.8-6.3 6.3-6.3h11.2c3.5 0 6.3 2.8 6.3 6.3v22.6c0 3.5-2.8 6.3-6.3 6.3H12.3c-3.5 0-6.3-2.8-6.3-6.3z" fill="#FFE05A"/>
          <circle cx="61.9" cy="21.9" r="2.6" fill="#FFF"/>
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
    case 'java':
      return (
        <svg {...iconProps} fill="#ED8B00">
          <path d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969z"/>
        </svg>
      )
    case 'cpp':
    case 'c++':
      return (
        <svg {...iconProps} fill="#00599C">
          <path d="M64 12.8l44.7 25.8v51.6L64 115.4 19.3 90.2V38.6L64 12.8z"/>
        </svg>
      )
    case 'php':
      return (
        <svg {...iconProps} fill="#777BB4">
          <path d="M64 33.039C30.26 33.039 2.906 48.901 2.906 68.508c0 19.608 27.354 35.47 61.094 35.47s61.094-15.862 61.094-35.47C125.094 48.901 97.74 33.039 64 33.039z"/>
        </svg>
      )
    case 'json':
      return (
        <svg {...iconProps} fill="#FFA500">
          <rect x="10" y="10" width="108" height="108" rx="8"/>
          <text x="64" y="75" textAnchor="middle" fontSize="48" fontFamily="monospace" fill="white">{ }</text>
        </svg>
      )
    case 'go':
      return (
        <svg {...iconProps} fill="#00ADD8">
          <path d="M16.2 36.9c-.7-2.3 2.5-3.5 5.4-3.7 2.9-.2 5.8.3 8.6 1.2 2.8.9 5.4 2.4 7.6 4.4"/>
        </svg>
      )
    case 'rust':
    case 'rs':
      return (
        <svg {...iconProps} fill="#CE422B">
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

  // Focus management for accessibility
  useEffect(() => {
    if (open && fileNameInputRef.current) {
      fileNameInputRef.current.focus()
    }
  }, [open])

  const handleClose = () => {
    setOpen(false)
    closeModal()
  }

  const validateAndCreate = (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    
    if (!newFileName.trim()) {
      setError('Please enter a file name')
      fileNameInputRef.current?.focus()
      return
    }
    
    if (files.some(file => file.name === newFileName.trim())) {
      setError('A file with this name already exists')
      fileNameInputRef.current?.focus()
      return
    }
    
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) {
      setError('Invalid characters in file name')
      fileNameInputRef.current?.focus()
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="max-w-md bg-card border-border p-0"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
              <FolderPlus className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-semibold text-foreground">
                Create New File
              </h2>
              <p id="modal-description" className="text-sm text-muted-foreground">
                Add a new file to your collaborative session
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              aria-label="Close dialog"
              disabled={fileCreationLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Existing files context */}
          {files.length > 0 && (
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {files.length} existing file{files.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-muted-foreground">
                  Names must be unique
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {files.slice(0, 4).map((file: any, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {file.name}
                  </Badge>
                ))}
                {files.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{files.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={validateAndCreate} className="space-y-4">
            <div>
              <Label htmlFor="fileName" className="block text-sm font-medium mb-2">
                File Name <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={fileNameInputRef}
                id="fileName"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value)
                  setError('')
                }}
                placeholder="e.g., main.js, style.css, index.html, app.py"
                disabled={fileCreationLoading}
                aria-invalid={!!error}
                aria-describedby="fileName-help"
                className={cn(error && "border-destructive focus:border-destructive")}
              />
              <p id="fileName-help" className="text-xs text-muted-foreground mt-1">
                Use only letters, numbers, dots, hyphens, and underscores
              </p>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">
                Programming Language <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={newFileLanguage} 
                onValueChange={(value) => {
                  setNewFileLanguage(value)
                  setError('')
                }}
                disabled={fileCreationLoading}
              >
                <SelectTrigger aria-describedby="language-help">
                  <SelectValue placeholder="Choose a programming language">
                    {newFileLanguage && getSelectedLanguageConfig() && (
                      <div className="flex items-center space-x-2">
                        <LanguageIcon language={newFileLanguage} />
                        <span className="font-medium">{getSelectedLanguageConfig().name}</span>
                        <Badge variant="outline" className="text-xs">
                          .{getSelectedLanguageConfig().extension}
                        </Badge>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <LanguageIcon language={key} />
                        <span>{config.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          .{config.extension}
                        </Badge>
                        {config.executable && (
                          <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                            Executable
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="language-help" className="text-xs text-muted-foreground mt-1">
                Choose the programming language for this file
              </p>
            </div>

            {/* Language preview */}
            {newFileName && newFileLanguage && !error && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <LanguageIcon language={newFileLanguage} />
                  <span className="font-medium text-primary">
                    {getSelectedLanguageConfig()?.name}
                  </span>
                  <span className="text-muted-foreground">
                    selected • .{getSelectedLanguageConfig()?.extension} extension
                  </span>
                  {getSelectedLanguageConfig()?.executable && (
                    <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Executable
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
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
                className="min-w-[100px]"
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
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
