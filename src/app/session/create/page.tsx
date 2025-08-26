'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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
  Shield,
  Zap,
  Info,
  AlertCircle,
  FileUp,
  MessageSquare,
  Save,
  ChevronRight,
  ChevronLeft,
  Code
} from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

      toast.success(`Session "${formData.title}" created successfully!`, {
        description: 'You\'re ready to start collaborating',
      })

      router.push(`/session/${data.session.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session'
      setError(errorMessage)
      toast.error('Failed to create session', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', code: 'JS', color: 'text-yellow-500' },
    { value: 'typescript', label: 'TypeScript', code: 'TS', color: 'text-blue-500' },
    { value: 'python', label: 'Python', code: 'PY', color: 'text-green-500' },
    { value: 'html', label: 'HTML', code: 'HTML', color: 'text-orange-500' },
    { value: 'css', label: 'CSS', code: 'CSS', color: 'text-purple-500' },
    { value: 'cpp', label: 'C++', code: 'C++', color: 'text-blue-600' },
    { value: 'java', label: 'Java', code: 'JAVA', color: 'text-red-500' },
    { value: 'react', label: 'React JSX', code: 'RX', color: 'text-cyan-500' },
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
      <div className="min-h-screen bg-background">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-primary/10 animate-pulse" />
        <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-purple-500/10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl relative z-10">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary via-purple-500 to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4">
                Create New Session
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Set up a collaborative coding environment where you and your team can build amazing things together
              </p>
            </div>
          </div>

          {/* Main Form */}
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur">
            <form onSubmit={handleSubmit}>
              <CardHeader className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
                  <Code2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">Session Configuration</CardTitle>
                  <CardDescription>
                    Configure your collaborative workspace with the perfect settings for your team
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <TabsTrigger 
                        key={id}
                        value={id} 
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Basics Tab */}
                  <TabsContent value="basics" className="space-y-6">
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
                          className="text-base"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Choose a descriptive name for your session
                          </p>
                          <span className={cn(
                            "text-xs font-medium",
                            formData.title.length > 80 ? "text-yellow-500" : "text-muted-foreground"
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
                          className="text-base resize-none"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Help others understand your session's purpose
                          </p>
                          <span className={cn(
                            "text-xs font-medium",
                            formData.description.length > 400 ? "text-yellow-500" : "text-muted-foreground"
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>
                                <div className="flex items-center space-x-3">
                                  <span className={cn("text-xs font-bold font-mono", lang.color)}>
                                    {lang.code}
                                  </span>
                                  <span>{lang.label}</span>
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
                  <TabsContent value="access" className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                          Session Type
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card 
                            className={cn(
                              "cursor-pointer transition-all duration-200 hover:shadow-md",
                              formData.type === 'PUBLIC' 
                                ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20' 
                                : 'hover:border-green-300'
                            )}
                            onClick={() => updateFormData('type', 'PUBLIC')}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <Badge variant={formData.type === 'PUBLIC' ? 'default' : 'outline'}>
                                  Public
                                </Badge>
                              </div>
                              <h3 className="font-bold text-lg mb-3">Public Session</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Anyone can join without approval. Perfect for open workshops, study groups, and community learning.
                              </p>
                              <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                                <CheckCircle className="h-3 w-3 mr-2" />
                                Instant access for everyone
                              </div>
                            </CardContent>
                          </Card>

                          <Card 
                            className={cn(
                              "cursor-pointer transition-all duration-200 hover:shadow-md",
                              formData.type === 'PRIVATE' 
                                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                                : 'hover:border-blue-300'
                            )}
                            onClick={() => updateFormData('type', 'PRIVATE')}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <Badge variant={formData.type === 'PRIVATE' ? 'default' : 'outline'}>
                                  Private
                                </Badge>
                              </div>
                              <h3 className="font-bold text-lg mb-3">Private Session</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Invite-only access with host approval. Ideal for team projects, client work, and focused collaboration.
                              </p>
                              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                                <Shield className="h-3 w-3 mr-2" />
                                Controlled access only
                              </div>
                            </CardContent>
                          </Card>
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block">Collaboration Features</Label>
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                  <Save className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Auto-save</h4>
                                  <p className="text-sm text-muted-foreground">Automatically save changes every 30 seconds</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.autoSave}
                                onCheckedChange={(checked) => updateFormData('autoSave', checked)}
                                disabled={loading}
                              />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">Chat System</h4>
                                  <p className="text-sm text-muted-foreground">Enable real-time chat for collaboration</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.allowChat}
                                onCheckedChange={(checked) => updateFormData('allowChat', checked)}
                                disabled={loading}
                              />
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                  <FileUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">File Upload</h4>
                                  <p className="text-sm text-muted-foreground">Allow participants to upload files</p>
                                </div>
                              </div>
                              <Switch
                                checked={formData.allowFileUpload}
                                onCheckedChange={(checked) => updateFormData('allowFileUpload', checked)}
                                disabled={loading}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button variant="ghost" disabled={loading} asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  
                  <div className="flex space-x-3">
                    {currentTabIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goToPreviousTab}
                        disabled={loading}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    )}                    
                    
                    {currentTabIndex < tabs.length - 1 ? (
                      <Button
                        type="button"
                        onClick={goToNextTab}
                        disabled={loading || (activeTab === 'basics' && !formData.title.trim())}
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={loading || !formData.title.trim()}
                        className="min-w-[140px]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
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
          <Card className="mt-8 border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Pro Tips for Successful Sessions</CardTitle>
                  <CardDescription>Make the most of your collaborative coding experience</CardDescription>
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
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">
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
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full mt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex justify-center py-8">
            <Badge variant="outline" className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Powered by CollabIDE collaborative technology</span>
            </Badge>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
