// 'use client'
// import Link from 'next/link';

// import { useState } from 'react'
// import { useAuth } from '@/contexts/auth-context'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Badge } from '@/components/ui/badge'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Loader2, 
//   Globe, 
//   Lock, 
//   ArrowLeft, 
//   Users, 
//   Code2, 
//   Settings,
//   Sparkles,
//   CheckCircle,
//   Clock,
//   Shield,
//   Zap,
//   Heart,
//   Info
// } from 'lucide-react'
// import { ProtectedRoute } from '@/components/ProtectedRoute'
// import { useToast } from '@/hooks/use-toast'


// interface SessionFormData {
//   title: string
//   description: string
//   type: 'PUBLIC' | 'PRIVATE'
//   language: string
//   maxParticipants: number
//   autoSave: boolean
//   allowFileUpload: boolean
//   allowChat: boolean
// }

// export default function CreateSessionPage() {
//   const [formData, setFormData] = useState<SessionFormData>({
//     title: '',
//     description: '',
//     type: 'PUBLIC',
//     language: 'javascript',
//     maxParticipants: 10,
//     autoSave: true,
//     allowFileUpload: true,
//     allowChat: true,
//   })
//   const [activeTab, setActiveTab] = useState('basics')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
  
//   const { user } = useAuth()
//   const router = useRouter()
//   const { toast } = useToast()

//   const updateFormData = (field: keyof SessionFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//     setError('') // Clear errors when user starts typing
//   }

//   const validateForm = () => {
//     if (!formData.title.trim()) {
//       setError('Session title is required')
//       setActiveTab('basics')
//       return false
//     }
//     if (formData.title.length < 3) {
//       setError('Session title must be at least 3 characters long')
//       setActiveTab('basics')
//       return false
//     }
//     return true
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!validateForm()) return

//     setLoading(true)

//     try {
//       const token = localStorage.getItem('accessToken')
//       const response = await fetch('/api/sessions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: formData.title.trim(),
//           description: formData.description.trim() || undefined,
//           type: formData.type,
//           settings: {
//             defaultLanguage: formData.language,
//             maxParticipants: formData.maxParticipants,
//             autoSave: formData.autoSave,
//             allowFileUpload: formData.allowFileUpload,
//             allowChat: formData.allowChat,
//           }
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create session')
//       }

//       toast({
//         variant: "success",
//         title: "Session created successfully!",
//         description: `"${formData.title}" is ready for collaboration`,
//       })

//       router.push(`/session/${data.session.id}`)
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to create session'
//       setError(errorMessage)
//       toast({
//         variant: "destructive",
//         title: "Failed to create session",
//         description: errorMessage,
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const languageOptions = [
//     { value: 'javascript', label: 'JavaScript', icon: '🟨' },
//     { value: 'typescript', label: 'TypeScript', icon: '🔷' },
//     { value: 'python', label: 'Python', icon: '🐍' },
//     { value: 'html', label: 'HTML', icon: '🌐' },
//     { value: 'css', label: 'CSS', icon: '🎨' },
//     { value: 'cpp', label: 'C++', icon: '🔵' },
//   ]

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <div className="container mx-auto px-4 py-8 max-w-4xl">
//           {/* Header */}
//           <div className="mb-8">
//             <Link href="/dashboard">
//               <Button variant="ghost" size="sm" className="mb-6 hover:bg-white/50">
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Dashboard
//               </Button>
//             </Link>
            
//             <div className="text-center mb-8">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 animate-float">
//                 <Sparkles className="h-8 w-8 text-white" />
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
//                 Create New Session
//               </h1>
//               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//                 Set up a collaborative coding environment where you and your team can build amazing things together
//               </p>
//             </div>
//           </div>

//           {/* Main Form */}
//           <Card className="glass-card shadow-xl border-0">
//             <form onSubmit={handleSubmit}>
//               <CardHeader className="pb-6">
//                 <div className="flex items-center space-x-2">
//                   <Code2 className="h-5 w-5 text-primary" />
//                   <CardTitle className="text-xl">Session Configuration</CardTitle>
//                 </div>
//                 <CardDescription>
//                   Configure your collaborative workspace with the perfect settings for your team
//                 </CardDescription>
//               </CardHeader>

//               <CardContent>
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                   <TabsList className="grid w-full grid-cols-3 bg-muted/50">
//                     <TabsTrigger value="basics" className="flex items-center space-x-2">
//                       <Info className="h-4 w-4" />
//                       <span>Basics</span>
//                     </TabsTrigger>
//                     <TabsTrigger value="access" className="flex items-center space-x-2">
//                       <Shield className="h-4 w-4" />
//                       <span>Access</span>
//                     </TabsTrigger>
//                     <TabsTrigger value="settings" className="flex items-center space-x-2">
//                       <Settings className="h-4 w-4" />
//                       <span>Settings</span>
//                     </TabsTrigger>
//                   </TabsList>

//                   {/* Error Alert */}
//                   {error && (
//                     <Alert variant="destructive" className="animate-slide-up">
//                       <AlertDescription>{error}</AlertDescription>
//                     </Alert>
//                   )}

//                   {/* Basics Tab */}
//                   <TabsContent value="basics" className="space-y-6">
//                     <div className="grid gap-6">
//                       <div className="space-y-2">
//                         <Label htmlFor="title" className="text-base font-medium">
//                           Session Title *
//                         </Label>
//                         <Input
//                           id="title"
//                           placeholder="Frontend Workshop, Team Project, Study Session..."
//                           value={formData.title}
//                           onChange={(e) => updateFormData('title', e.target.value)}
//                           maxLength={100}
//                           required
//                           disabled={loading}
//                           className="h-12 text-base"
//                         />
//                         <div className="flex justify-between items-center">
//                           <p className="text-sm text-muted-foreground">
//                             Choose a descriptive name for your session
//                           </p>
//                           <span className="text-xs text-muted-foreground">
//                             {formData.title.length}/100
//                           </span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="description" className="text-base font-medium">
//                           Description
//                         </Label>
//                         <Textarea
//                           id="description"
//                           placeholder="Describe what you'll be working on in this session..."
//                           value={formData.description}
//                           onChange={(e) => updateFormData('description', e.target.value)}
//                           maxLength={500}
//                           rows={4}
//                           disabled={loading}
//                           className="text-base resize-none"
//                         />
//                         <div className="flex justify-between items-center">
//                           <p className="text-sm text-muted-foreground">
//                             Help others understand your session's purpose
//                           </p>
//                           <span className="text-xs text-muted-foreground">
//                             {formData.description.length}/500
//                           </span>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label className="text-base font-medium">Default Language</Label>
//                         <Select
//                           value={formData.language}
//                           onValueChange={(value) => updateFormData('language', value)}
//                           disabled={loading}
//                         >
//                           <SelectTrigger className="h-12">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {languageOptions.map(lang => (
//                               <SelectItem key={lang.value} value={lang.value}>
//                                 <div className="flex items-center space-x-2">
//                                   <span>{lang.icon}</span>
//                                   <span>{lang.label}</span>
//                                 </div>
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <p className="text-sm text-muted-foreground">
//                           Primary programming language for this session
//                         </p>
//                       </div>
//                     </div>
//                   </TabsContent>

//                   {/* Access Tab */}
//                   <TabsContent value="access" className="space-y-6">
//                     <div className="space-y-4">
//                       <div>
//                         <Label className="text-base font-medium mb-4 block">Session Type *</Label>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <button
//                             type="button"
//                             onClick={() => updateFormData('type', 'PUBLIC')}
//                             disabled={loading}
//                             className={`group p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
//                               formData.type === 'PUBLIC'
//                                 ? 'border-green-500 bg-green-50 shadow-md'
//                                 : 'border-border hover:border-green-300 bg-card'
//                             }`}
//                           >
//                             <div className="flex items-center justify-between mb-3">
//                               <div className="p-2 bg-green-100 rounded-lg">
//                                 <Globe className="h-5 w-5 text-green-600" />
//                               </div>
//                               <Badge 
//                                 variant={formData.type === 'PUBLIC' ? 'default' : 'outline'}
//                                 className="bg-green-100 text-green-800 border-green-200"
//                               >
//                                 Public
//                               </Badge>
//                             </div>
//                             <h3 className="font-semibold text-lg text-foreground mb-2">Public Session</h3>
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                               Anyone can join without approval. Perfect for open workshops, study groups, and community learning.
//                             </p>
//                             <div className="mt-3 flex items-center text-xs text-green-600">
//                               <CheckCircle className="h-3 w-3 mr-1" />
//                               Instant access
//                             </div>
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => updateFormData('type', 'PRIVATE')}
//                             disabled={loading}
//                             className={`group p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
//                               formData.type === 'PRIVATE'
//                                 ? 'border-blue-500 bg-blue-50 shadow-md'
//                                 : 'border-border hover:border-blue-300 bg-card'
//                             }`}
//                           >
//                             <div className="flex items-center justify-between mb-3">
//                               <div className="p-2 bg-blue-100 rounded-lg">
//                                 <Lock className="h-5 w-5 text-blue-600" />
//                               </div>
//                               <Badge 
//                                 variant={formData.type === 'PRIVATE' ? 'default' : 'outline'}
//                                 className="bg-blue-100 text-blue-800 border-blue-200"
//                               >
//                                 Private
//                               </Badge>
//                             </div>
//                             <h3 className="font-semibold text-lg text-foreground mb-2">Private Session</h3>
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                               Invite-only access with host approval. Ideal for team projects, client work, and focused collaboration.
//                             </p>
//                             <div className="mt-3 flex items-center text-xs text-blue-600">
//                               <Shield className="h-3 w-3 mr-1" />
//                               Controlled access
//                             </div>
//                           </button>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="maxParticipants" className="text-base font-medium">
//                           Maximum Participants
//                         </Label>
//                         <Select
//                           value={formData.maxParticipants.toString()}
//                           onValueChange={(value) => updateFormData('maxParticipants', parseInt(value))}
//                           disabled={loading}
//                         >
//                           <SelectTrigger className="h-12">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="5">5 participants</SelectItem>
//                             <SelectItem value="10">10 participants</SelectItem>
//                             <SelectItem value="25">25 participants</SelectItem>
//                             <SelectItem value="50">50 participants</SelectItem>
//                             <SelectItem value="100">100 participants</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <p className="text-sm text-muted-foreground">
//                           Set the maximum number of people who can join your session
//                         </p>
//                       </div>
//                     </div>
//                   </TabsContent>

//                   {/* Settings Tab */}
//                   <TabsContent value="settings" className="space-y-6">
//                     <div className="space-y-6">
//                       <div>
//                         <Label className="text-base font-medium mb-4 block">Collaboration Features</Label>
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between p-4 border rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <div className="p-2 bg-blue-100 rounded-lg">
//                                 <Zap className="h-4 w-4 text-blue-600" />
//                               </div>
//                               <div>
//                                 <h4 className="font-medium">Auto-save</h4>
//                                 <p className="text-sm text-muted-foreground">Automatically save changes every 30 seconds</p>
//                               </div>
//                             </div>
//                             <input
//                               type="checkbox"
//                               checked={formData.autoSave}
//                               onChange={(e) => updateFormData('autoSave', e.target.checked)}
//                               disabled={loading}
//                               className="h-4 w-4 text-primary"
//                             />
//                           </div>

//                           <div className="flex items-center justify-between p-4 border rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <div className="p-2 bg-purple-100 rounded-lg">
//                                 <Users className="h-4 w-4 text-purple-600" />
//                               </div>
//                               <div>
//                                 <h4 className="font-medium">Chat System</h4>
//                                 <p className="text-sm text-muted-foreground">Enable real-time chat for collaboration</p>
//                               </div>
//                             </div>
//                             <input
//                               type="checkbox"
//                               checked={formData.allowChat}
//                               onChange={(e) => updateFormData('allowChat', e.target.checked)}
//                               disabled={loading}
//                               className="h-4 w-4 text-primary"
//                             />
//                           </div>

//                           <div className="flex items-center justify-between p-4 border rounded-lg">
//                             <div className="flex items-center space-x-3">
//                               <div className="p-2 bg-green-100 rounded-lg">
//                                 <Clock className="h-4 w-4 text-green-600" />
//                               </div>
//                               <div>
//                                 <h4 className="font-medium">File Upload</h4>
//                                 <p className="text-sm text-muted-foreground">Allow participants to upload files</p>
//                               </div>
//                             </div>
//                             <input
//                               type="checkbox"
//                               checked={formData.allowFileUpload}
//                               onChange={(e) => updateFormData('allowFileUpload', e.target.checked)}
//                               disabled={loading}
//                               className="h-4 w-4 text-primary"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>

//                 {/* Action Buttons */}
//                 <div className="flex justify-between items-center pt-6 border-t">
//                   <Link href="/dashboard">
//                     <Button variant="ghost" disabled={loading} className="hover:bg-muted/50">
//                       Cancel
//                     </Button>
//                   </Link>
                  
//                   <div className="flex space-x-3">
//                     {activeTab !== 'basics' && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={() => {
//                           const tabs = ['basics', 'access', 'settings']
//                           const currentIndex = tabs.indexOf(activeTab)
//                           if (currentIndex > 0) {
//                             setActiveTab(tabs[currentIndex - 1])
//                           }
//                         }}
//                         disabled={loading}
//                       >
//                         Previous
//                       </Button>
//                     )}
                    
//                     {activeTab !== 'settings' ? (
//                       <Button
//                         type="button"
//                         onClick={() => {
//                           const tabs = ['basics', 'access', 'settings']
//                           const currentIndex = tabs.indexOf(activeTab)
//                           if (currentIndex < tabs.length - 1) {
//                             setActiveTab(tabs[currentIndex + 1])
//                           }
//                         }}
//                         disabled={loading || (activeTab === 'basics' && !formData.title.trim())}
//                         className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
//                       >
//                         Next
//                       </Button>
//                     ) : (
//                       <Button 
//                         type="submit" 
//                         disabled={loading || !formData.title.trim()}
//                         className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 min-w-[140px]"
//                       >
//                         {loading ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Creating...
//                           </>
//                         ) : (
//                           <>
//                             <Sparkles className="mr-2 h-4 w-4" />
//                             Create Session
//                           </>
//                         )}
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </form>
//           </Card>

//           {/* Tips Card */}
//           <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
//             <CardHeader>
//               <div className="flex items-center space-x-2">
//                 <Heart className="h-5 w-5 text-purple-600" />
//                 <CardTitle className="text-lg text-purple-900">Pro Tips for Successful Sessions</CardTitle>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-3">
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Choose descriptive titles that clearly communicate your session's purpose</span>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Use public sessions for open learning and community collaboration</span>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Private sessions are perfect for team projects and client work</span>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Enable auto-save to prevent losing important changes</span>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Use the built-in chat system for seamless communication</span>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
//                     <span className="text-sm text-gray-700">Export your collaborative work anytime as downloadable files</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </ProtectedRoute>
//   )
// }


'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import HeroLogo from '@/components/ui/hero-logo'
import { 
  Loader2, 
  Globe, 
  Lock, 
  ArrowLeft, 
  Users, 
  Code2, 
  Settings,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  Heart,
  Info,
  AlertCircle,
  FileUp,
  MessageSquare,
  Save,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { cn } from '@/lib/utils'

interface SessionFormData {
  title: string
  description: string
  type: 'PUBLIC' | 'PRIVATE'
  language: string
  maxParticipants: number
  autoSave: boolean
  allowFileUpload: boolean
  allowChat: boolean
}

export default function CreateSessionPage() {
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    type: 'PUBLIC',
    language: 'javascript',
    maxParticipants: 10,
    autoSave: true,
    allowFileUpload: true,
    allowChat: true,
  })
  const [activeTab, setActiveTab] = useState('basics')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  // Simple toast replacement
  const showToast = (message: string, type: 'success' | 'error' = 'success', title?: string) => {
    console.log(`${type.toUpperCase()}: ${title || ''} - ${message}`)
  }

  const updateFormData = (field: keyof SessionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear errors when user starts typing
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Session title is required')
      setActiveTab('basics')
      return false
    }
    if (formData.title.length < 3) {
      setError('Session title must be at least 3 characters long')
      setActiveTab('basics')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          type: formData.type,
          settings: {
            defaultLanguage: formData.language,
            maxParticipants: formData.maxParticipants,
            autoSave: formData.autoSave,
            allowFileUpload: formData.allowFileUpload,
            allowChat: formData.allowChat,
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session')
      }

      showToast(`"${formData.title}" is ready for collaboration`, 'success', 'Session created successfully!')

      router.push(`/session/${data.session.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session'
      setError(errorMessage)
      showToast(errorMessage, 'error', 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨', color: 'text-yellow-600' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷', color: 'text-blue-600' },
    { value: 'python', label: 'Python', icon: '🐍', color: 'text-green-600' },
    { value: 'html', label: 'HTML', icon: '🌐', color: 'text-orange-600' },
    { value: 'css', label: 'CSS', icon: '🎨', color: 'text-purple-600' },
    { value: 'cpp', label: 'C++', icon: '🔵', color: 'text-blue-700' },
    { value: 'java', label: 'Java', icon: '☕', color: 'text-red-600' },
    { value: 'react', label: 'React JSX', icon: '⚛️', color: 'text-cyan-600' },
  ]

  const tabs = [
    { id: 'basics', label: 'Basics', icon: Info },
    { id: 'access', label: 'Access', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }

  const goToPreviousTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen auth-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-6 hover:bg-card/50 backdrop-blur-sm group transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <HeroLogo 
                  size="lg" 
                  variant="compact" 
                  className="animate-float"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                Create New Session
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Set up a collaborative coding environment where you and your team can build amazing things together
              </p>
            </div>
          </div>

          {/* Main Form */}
          <Card className="glass-card shadow-2xl rounded-3xl animate-fade-in-scale">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Session Configuration</h2>
                    <p className="text-muted-foreground">
                      Configure your collaborative workspace with the perfect settings for your team
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 glass-card backdrop-blur-sm">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <TabsTrigger 
                        key={id}
                        value={id} 
                        className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent-blue data-[state=active]:text-white transition-all duration-300"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="animate-slide-down">
                      <AlertDescription className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Basics Tab */}
                  <TabsContent value="basics" className="space-y-6 animate-fade-in">
                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                          Session Title
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        </Label>
                        <Input
                          id="title"
                          placeholder="Frontend Workshop, Team Project, Study Session..."
                          value={formData.title}
                          onChange={(e) => updateFormData('title', e.target.value)}
                          maxLength={100}
                          required
                          disabled={loading}
                          className="h-14 text-base glass-card backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Choose a descriptive name for your session
                          </p>
                          <span className={cn(
                            "text-xs font-medium",
                            formData.title.length > 80 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {formData.title.length}/100
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-base font-semibold">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you'll be working on in this session..."
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                          maxLength={500}
                          rows={4}
                          disabled={loading}
                          className="text-base resize-none glass-card backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Help others understand your session's purpose
                          </p>
                          <span className={cn(
                            "text-xs font-medium",
                            formData.description.length > 400 ? "text-warning" : "text-muted-foreground"
                          )}>
                            {formData.description.length}/500
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Default Language</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => updateFormData('language', value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="h-14 glass-card backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card backdrop-blur-sm">
                            {languageOptions.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                <div className="flex items-center space-x-3">
                                  <span className="text-lg">{lang.icon}</span>
                                  <span className={lang.color}>{lang.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Primary programming language for this session
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Access Tab */}
                  <TabsContent value="access" className="space-y-6 animate-fade-in">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                          Session Type
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => updateFormData('type', 'PUBLIC')}
                            disabled={loading}
                            className={cn(
                              "group p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg glass-card backdrop-blur-sm",
                              formData.type === 'PUBLIC'
                                ? 'border-success bg-success/5 shadow-md shadow-success/20'
                                : 'border-border/50 hover:border-success/50'
                            )}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-success/10 rounded-lg">
                                <Globe className="h-6 w-6 text-success" />
                              </div>
                              <Badge 
                                variant={formData.type === 'PUBLIC' ? 'default' : 'outline'}
                                className="bg-success/20 text-success border-success/30"
                              >
                                Public
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-3">Public Session</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              Anyone can join without approval. Perfect for open workshops, study groups, and community learning.
                            </p>
                            <div className="flex items-center text-xs text-success font-medium">
                              <CheckCircle className="h-3 w-3 mr-2" />
                              Instant access for everyone
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateFormData('type', 'PRIVATE')}
                            disabled={loading}
                            className={cn(
                              "group p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg glass-card backdrop-blur-sm",
                              formData.type === 'PRIVATE'
                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/20'
                                : 'border-border/50 hover:border-primary/50'
                            )}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <Lock className="h-6 w-6 text-primary" />
                              </div>
                              <Badge 
                                variant={formData.type === 'PRIVATE' ? 'default' : 'outline'}
                                className="bg-primary/20 text-primary border-primary/30"
                              >
                                Private
                              </Badge>
                            </div>
                            <h3 className="font-bold text-lg text-foreground mb-3">Private Session</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              Invite-only access with host approval. Ideal for team projects, client work, and focused collaboration.
                            </p>
                            <div className="flex items-center text-xs text-primary font-medium">
                              <Shield className="h-3 w-3 mr-2" />
                              Controlled access only
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="maxParticipants" className="text-base font-semibold">
                          Maximum Participants
                        </Label>
                        <Select
                          value={formData.maxParticipants.toString()}
                          onValueChange={(value) => updateFormData('maxParticipants', parseInt(value))}
                          disabled={loading}
                        >
                          <SelectTrigger className="h-14 glass-card backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card backdrop-blur-sm">
                            <SelectItem value="5">5 participants</SelectItem>
                            <SelectItem value="10">10 participants</SelectItem>
                            <SelectItem value="25">25 participants</SelectItem>
                            <SelectItem value="50">50 participants</SelectItem>
                            <SelectItem value="100">100 participants</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Set the maximum number of people who can join your session
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6 animate-fade-in">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block">Collaboration Features</Label>
                        <div className="space-y-4">
                          <Card className="glass-card backdrop-blur-sm border-border/30">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-accent-blue/10 rounded-lg">
                                  <Save className="h-5 w-5 text-accent-blue" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">Auto-save</h4>
                                  <p className="text-sm text-muted-foreground">Automatically save changes every 30 seconds</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.autoSave}
                                onCheckedChange={(checked) => updateFormData('autoSave', checked)}
                                disabled={loading}
                              />
                            </div>
                          </Card>

                          <Card className="glass-card backdrop-blur-sm border-border/30">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-accent-purple/10 rounded-lg">
                                  <MessageSquare className="h-5 w-5 text-accent-purple" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">Chat System</h4>
                                  <p className="text-sm text-muted-foreground">Enable real-time chat for collaboration</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.allowChat}
                                onCheckedChange={(checked) => updateFormData('allowChat', checked)}
                                disabled={loading}
                              />
                            </div>
                          </Card>

                          <Card className="glass-card backdrop-blur-sm border-border/30">
                            <div className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-accent-emerald/10 rounded-lg">
                                  <FileUp className="h-5 w-5 text-accent-emerald" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground">File Upload</h4>
                                  <p className="text-sm text-muted-foreground">Allow participants to upload files</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.allowFileUpload}
                                onCheckedChange={(checked) => updateFormData('allowFileUpload', checked)}
                                disabled={loading}
                              />
                            </div>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-border/30">
                  <Link href="/dashboard">
                    <Button 
                      variant="ghost" 
                      disabled={loading} 
                      className="hover:bg-card/50 backdrop-blur-sm transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </Link>
                  
                  <div className="flex space-x-3">
                    {currentTabIndex > 0 && (
                      <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousTab}
                      disabled={loading}
                      className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
                    >
                      <span className="flex items-center">
                        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                        Previous
                      </span>
                    </Button>
                    )}                    
                    
                    {currentTabIndex < tabs.length - 1 ? (
                      // <Button
                      //   type="button"
                      //   onClick={goToNextTab}
                      //   disabled={loading || (activeTab === 'basics' && !formData.title.trim())}
                      //   className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300 group"
                      // >
                      //   <span>Next
                      //   <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" /></span>
                        
                      // </Button>
                      <Button
  type="button"
  onClick={goToNextTab}
  disabled={loading || (activeTab === 'basics' && !formData.title.trim())}
  className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 transition-all duration-300 group"
>
  <span className="flex items-center">
    Next
    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
  </span>
</Button>

                    ) : (
                      <Button 
                        type="submit" 
                        disabled={loading || !formData.title.trim()}
                        className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 min-w-[140px] transition-all duration-300 group"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                            Create Session
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>

          {/* Tips Card */}
          <Card className="mt-8 glass-card backdrop-blur-sm rounded-3xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent-pink/10 rounded-lg">
                  <Heart className="h-5 w-5 text-accent-pink" />
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Pro Tips for Successful Sessions</h3>
                  <p className="text-muted-foreground">Make the most of your collaborative coding experience</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    "Choose descriptive titles that clearly communicate your session's purpose",
                    "Use public sessions for open learning and community collaboration",
                    "Private sessions are perfect for team projects and client work"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="p-1 bg-success/10 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[
                    "Enable auto-save to prevent losing important changes",
                    "Use the built-in chat system for seamless communication",
                    "Export your collaborative work anytime as downloadable files"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="p-1 bg-success/10 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CollabIDE Branding Footer */}
          <div className="flex justify-center py-8">
            <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground glass-card px-4 py-2 rounded-full border border-border/20">
              <Zap className="h-3 w-3 text-accent-yellow animate-pulse-subtle" />
              <span>Powered by CollabIDE collaborative technology</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
