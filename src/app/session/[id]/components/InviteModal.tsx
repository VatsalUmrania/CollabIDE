// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   X, 
//   Copy, 
//   Mail, 
//   Share2, 
//   CheckCircle, 
//   Users, 
//   Link2, 
//   QrCode, 
//   AlertCircle, 
//   Loader2,
//   Send,
//   Globe,
//   Smartphone,
//   Download,
//   ExternalLink,
//   Shield,
//   Clock,
//   UserPlus
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { 
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { Separator } from '@/components/ui/separator'
// import { Progress } from '@/components/ui/progress'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// import { Label } from '@/components/ui/label'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { cn } from '@/lib/utils'
// import { toast } from 'sonner'

// interface InviteModalProps {
//   sessionId: string
//   closeModal: () => void
//   sessionTitle?: string
//   isPublic?: boolean
//   participantCount?: number
//   sessionDuration?: string
// }

// export default function InviteModal({
//   sessionId,
//   closeModal,
//   sessionTitle = "Coding Session",
//   isPublic = true,
//   participantCount = 0,
//   sessionDuration
// }: InviteModalProps) {
//   const [open, setOpen] = useState(true)
//   const [copied, setCopied] = useState<string | null>(null)
//   const [emailAddresses, setEmailAddresses] = useState('')
//   const [customMessage, setCustomMessage] = useState('')
//   const [sendingEmails, setSendingEmails] = useState(false)
//   const [emailSuccess, setEmailSuccess] = useState(false)
//   const [emailProgress, setEmailProgress] = useState(0)
//   const [activeTab, setActiveTab] = useState('link')

//   const sessionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/session/${sessionId}`

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

//   // Enhanced copy to clipboard with toast
//   const copyToClipboard = async (text: string, type: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopied(type)
//       toast.success('Copied to clipboard!')
//       setTimeout(() => setCopied(null), 2000)
//     } catch (err) {
//       console.error('Failed to copy:', err)
//       toast.error('Failed to copy to clipboard')
      
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea')
//       textArea.value = text
//       document.body.appendChild(textArea)
//       textArea.select()
//       document.execCommand('copy')
//       document.body.removeChild(textArea)
//       setCopied(type)
//       setTimeout(() => setCopied(null), 2000)
//     }
//   }

//   // Enhanced email sending with progress
//   const sendInviteEmails = async () => {
//     if (!emailAddresses.trim()) return
    
//     setSendingEmails(true)
//     setEmailProgress(0)
    
//     try {
//       const emails = emailAddresses
//         .split(/[,;\n]/)
//         .map(email => email.trim())
//         .filter(email => email && /\S+@\S+\.\S+/.test(email))
      
//       if (emails.length === 0) {
//         toast.error('Please enter valid email addresses')
//         setSendingEmails(false)
//         return
//       }

//       // Simulate progress
//       const progressInterval = setInterval(() => {
//         setEmailProgress(prev => {
//           if (prev >= 90) return prev
//           return prev + Math.random() * 20
//         })
//       }, 200)

//       const response = await fetch('/api/sessions/invite', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           emails,
//           message: customMessage,
//           sessionTitle,
//           sessionUrl
//         })
//       })
      
//       clearInterval(progressInterval)
//       setEmailProgress(100)
      
//       if (response.ok) {
//         setEmailAddresses('')
//         setCustomMessage('')
//         setEmailSuccess(true)
//         toast.success(`Invitations sent to ${emails.length} recipients!`)
//         setTimeout(() => {
//           setEmailSuccess(false)
//           setEmailProgress(0)
//         }, 3000)
//       } else {
//         throw new Error('Failed to send invitations')
//       }
//     } catch (error) {
//       console.error('Failed to send invites:', error)
//       toast.error('Failed to send invitations')
//       setEmailProgress(0)
//     } finally {
//       setSendingEmails(false)
//     }
//   }

//   // Enhanced web share API
//   const shareViaWebShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `Join ${sessionTitle}`,
//           text: 'Come collaborate with me in this real-time coding session on CollabIDE!',
//           url: sessionUrl
//         })
//         toast.success('Shared successfully!')
//       } catch (err: any) {
//         if (err.name !== 'AbortError') {
//           console.error('Share failed:', err)
//           copyToClipboard(sessionUrl, 'share-fallback')
//         }
//       }
//     } else {
//       copyToClipboard(sessionUrl, 'share-fallback')
//     }
//   }

//   // Enhanced QR code download
//   const downloadQRCode = () => {
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')
//     const img = new Image()
    
//     canvas.width = 400
//     canvas.height = 400
    
//     img.onload = () => {
//       ctx?.drawImage(img, 0, 0, 400, 400)
//       canvas.toBlob((blob) => {
//         if (blob) {
//           const url = URL.createObjectURL(blob)
//           const link = document.createElement('a')
//           link.href = url
//           link.download = `collabide-session-${sessionId}-qr.png`
//           link.click()
//           URL.revokeObjectURL(url)
//           toast.success('QR code downloaded!')
//         }
//       }, 'image/png')
//     }
    
//     img.crossOrigin = 'anonymous'
//     img.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sessionUrl)}`
//   }

//   // Get valid email count
//   const getEmailCount = () => {
//     if (!emailAddresses.trim()) return 0
//     return emailAddresses
//       .split(/[,;\n]/)
//       .map(email => email.trim())
//       .filter(email => email && /\S+@\S+\.\S+/.test(email))
//       .length
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-4xl max-h-[95vh] border-0 bg-card/95 backdrop-blur shadow-2xl">
//         <DialogHeader className="space-y-4 pb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
//                 <UserPlus className="h-6 w-6 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <DialogTitle className="text-3xl font-bold text-foreground">
//                   Invite Collaborators
//                 </DialogTitle>
//                 <DialogDescription className="text-muted-foreground mt-2 text-lg">
//                   Share your coding session and collaborate in real-time
//                 </DialogDescription>
//               </div>
//             </div>
//           </div>

//           {/* Session Info Card */}
//           <Card className="border-0 bg-muted/30 backdrop-blur">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4 min-w-0 flex-1">
//                   <div className="min-w-0 flex-1">
//                     <h3 className="font-semibold text-lg text-foreground truncate">{sessionTitle}</h3>
//                     <p className="text-sm text-muted-foreground font-mono">Session ID: {sessionId}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 flex-shrink-0">
//                   <Badge variant={isPublic ? "default" : "secondary"} className="flex items-center space-x-1">
//                     {isPublic ? (
//                       <>
//                         <Globe className="h-3 w-3" />
//                         <span>Public</span>
//                       </>
//                     ) : (
//                       <>
//                         <Shield className="h-3 w-3" />
//                         <span>Private</span>
//                       </>
//                     )}
//                   </Badge>
                  
//                   {participantCount > 0 && (
//                     <Badge variant="outline" className="flex items-center space-x-1">
//                       <Users className="h-3 w-3" />
//                       <span>{participantCount} online</span>
//                     </Badge>
//                   )}
                  
//                   {sessionDuration && (
//                     <Badge variant="outline" className="flex items-center space-x-1">
//                       <Clock className="h-3 w-3" />
//                       <span>{sessionDuration}</span>
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </DialogHeader>

//         <ScrollArea className="flex-1 px-1">
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-3 bg-muted/30 backdrop-blur">
//               <TabsTrigger 
//                 value="link" 
//                 className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//               >
//                 <Link2 className="h-4 w-4" />
//                 <span className="hidden sm:inline">Share Link</span>
//                 <span className="sm:hidden">Link</span>
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="email" 
//                 className="flex items-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
//               >
//                 <Mail className="h-4 w-4" />
//                 <span className="hidden sm:inline">Send Email</span>
//                 <span className="sm:hidden">Email</span>
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="qr" 
//                 className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
//               >
//                 <QrCode className="h-4 w-4" />
//                 <span className="hidden sm:inline">QR Code</span>
//                 <span className="sm:hidden">QR</span>
//               </TabsTrigger>
//             </TabsList>
            
//             {/* Share Link Tab */}
//             <TabsContent value="link" className="space-y-6 mt-6">
//               <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2 text-xl">
//                     <Link2 className="h-6 w-6 text-primary" />
//                     <span>Session Link</span>
//                   </CardTitle>
//                   <CardDescription>Share this link with anyone you want to collaborate with</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold">Session URL:</Label>
//                     <div className="flex space-x-2">
//                       <Input 
//                         value={sessionUrl} 
//                         readOnly 
//                         className="font-mono text-sm bg-background/50 border-border/50"
//                       />
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button 
//                             onClick={() => copyToClipboard(sessionUrl, 'link')}
//                             variant="outline"
//                             className="flex-shrink-0 hover:bg-primary/10"
//                           >
//                             {copied === 'link' ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <Copy className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{copied === 'link' ? 'Copied!' : 'Copy session link'}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold">Session ID:</Label>
//                     <div className="flex space-x-2">
//                       <Input 
//                         value={sessionId} 
//                         readOnly 
//                         className="font-mono text-sm bg-background/50 border-border/50"
//                       />
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button 
//                             onClick={() => copyToClipboard(sessionId, 'id')}
//                             variant="outline"
//                             className="flex-shrink-0 hover:bg-primary/10"
//                           >
//                             {copied === 'id' ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <Copy className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>{copied === 'id' ? 'Copied!' : 'Copy session ID'}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </div>
//                   </div>
                  
//                   <Separator />
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Button 
//                       onClick={shareViaWebShare}
//                       className="bg-primary hover:bg-primary/90"
//                       size="lg"
//                     >
//                       <Share2 className="h-4 w-4 mr-2" />
//                       Share via Device
//                     </Button>
                    
//                     <Button 
//                       onClick={() => window.open(sessionUrl, '_blank')}
//                       variant="outline"
//                       size="lg"
//                     >
//                       <ExternalLink className="h-4 w-4 mr-2" />
//                       Open Session
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             {/* Email Tab */}
//             <TabsContent value="email" className="space-y-6 mt-6">
//               <Card className="border-0 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 backdrop-blur">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="flex items-center space-x-2 text-xl">
//                         <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
//                         <span>Send Email Invitations</span>
//                       </CardTitle>
//                       <CardDescription>Invite people directly via email with a personal message</CardDescription>
//                     </div>
//                     {getEmailCount() > 0 && (
//                       <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
//                         {getEmailCount()} recipient{getEmailCount() !== 1 ? 's' : ''}
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {emailSuccess && (
//                     <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/20">
//                       <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
//                       <AlertDescription className="text-green-800 dark:text-green-200">
//                         Invitations sent successfully! Recipients will receive an email with the session link.
//                       </AlertDescription>
//                     </Alert>
//                   )}

//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold">Email Addresses</Label>
//                     <Textarea
//                       value={emailAddresses}
//                       onChange={(e) => setEmailAddresses(e.target.value)}
//                       placeholder="Enter email addresses separated by commas, semicolons, or new lines

// Examples:
// john@example.com, jane@example.com
// alice@company.com;
// bob@university.edu"
//                       className="min-h-[120px] bg-background/50 border-border/50 focus:border-green-500/50 resize-none"
//                       disabled={sendingEmails}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Separate multiple emails with commas, semicolons, or new lines
//                     </p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <Label className="text-sm font-semibold">Personal Message (Optional)</Label>
//                     <Textarea
//                       value={customMessage}
//                       onChange={(e) => setCustomMessage(e.target.value)}
//                       placeholder="Add a personal message to your invitation...

// Hi! I'm inviting you to collaborate on a coding project. Join me in this real-time session where we can code together, share ideas, and build something amazing!"
//                       className="min-h-[100px] bg-background/50 border-border/50 focus:border-green-500/50 resize-none"
//                       disabled={sendingEmails}
//                       maxLength={500}
//                     />
//                     <div className="flex justify-between items-center">
//                       <p className="text-xs text-muted-foreground">
//                         Add context about your collaboration session
//                       </p>
//                       <span className={cn(
//                         "text-xs font-medium",
//                         customMessage.length > 450 ? "text-orange-500" : "text-muted-foreground"
//                       )}>
//                         {customMessage.length}/500
//                       </span>
//                     </div>
//                   </div>

//                   {sendingEmails && (
//                     <Card className="border-0 bg-background/50">
//                       <CardContent className="p-4 space-y-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <Loader2 className="h-4 w-4 animate-spin text-green-600" />
//                             <span className="text-sm font-medium">Sending invitations...</span>
//                           </div>
//                           <span className="text-sm text-green-600 font-semibold">{Math.round(emailProgress)}%</span>
//                         </div>
//                         <Progress value={emailProgress} className="h-2" />
//                       </CardContent>
//                     </Card>
//                   )}
                  
//                   <Button 
//                     onClick={sendInviteEmails}
//                     disabled={!emailAddresses.trim() || sendingEmails || getEmailCount() === 0}
//                     className="w-full bg-green-600 hover:bg-green-700"
//                     size="lg"
//                   >
//                     {sendingEmails ? (
//                       <div className="flex items-center space-x-2">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         <span>Sending Invitations...</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <Send className="h-4 w-4" />
//                         <span>
//                           Send {getEmailCount() > 0 ? `${getEmailCount()} ` : ''}
//                           Invitation{getEmailCount() !== 1 ? 's' : ''}
//                         </span>
//                       </div>
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>
            
//             {/* QR Code Tab */}
//             <TabsContent value="qr" className="space-y-6 mt-6">
//               <Card className="border-0 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 backdrop-blur">
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2 text-xl">
//                     <QrCode className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//                     <span>QR Code Access</span>
//                   </CardTitle>
//                   <CardDescription>Scan with any mobile device to join instantly</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-8">
//                   <div className="flex justify-center">
//                     <div className="relative">
//                       <Card className="p-6 border-2 border-dashed border-purple-200 dark:border-purple-800 bg-white shadow-xl">
//                         <div 
//                           className="w-56 h-56 rounded-xl flex items-center justify-center"
//                           style={{
//                             backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=224x224&data=${encodeURIComponent(sessionUrl)}&margin=10)`,
//                             backgroundSize: 'contain',
//                             backgroundRepeat: 'no-repeat',
//                             backgroundPosition: 'center'
//                           }}
//                         >
//                           <QrCode className="h-12 w-12 opacity-10" />
//                         </div>
//                       </Card>
//                       <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-20 blur animate-pulse"></div>
//                     </div>
//                   </div>
                  
//                   <div className="text-center space-y-4">
//                     <p className="text-muted-foreground">
//                       Scan this QR code with any mobile device to join the session instantly
//                     </p>
//                     <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
//                       <div className="flex items-center space-x-2">
//                         <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                         <span>Mobile friendly</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                         <span>Works anywhere</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Button 
//                       onClick={() => copyToClipboard(sessionUrl, 'qr')}
//                       variant="outline"
//                       size="lg"
//                       className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
//                     >
//                       {copied === 'qr' ? (
//                         <div className="flex items-center space-x-2">
//                           <CheckCircle className="h-4 w-4 text-green-600" />
//                           <span>Copied!</span>
//                         </div>
//                       ) : (
//                         <div className="flex items-center space-x-2">
//                           <Copy className="h-4 w-4" />
//                           <span>Copy Link</span>
//                         </div>
//                       )}
//                     </Button>
                    
//                     <Button 
//                       onClick={downloadQRCode}
//                       variant="outline"
//                       size="lg"
//                       className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
//                     >
//                       <Download className="h-4 w-4 mr-2" />
//                       Download QR Code
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </ScrollArea>

//         {/* Footer Security Notice */}
//         <div className="pt-4 border-t">
//           <Alert className="bg-muted/20 border-border/30">
//             <Shield className="h-4 w-4" />
//             <AlertDescription>
//               <strong>Security Notice:</strong>{' '}
//               {isPublic 
//                 ? "This is a public session. Anyone with the link can join and collaborate."
//                 : "This is a private session. Only invited users can access the collaboration."
//               } Share responsibly with trusted collaborators.
//             </AlertDescription>
//           </Alert>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Copy, 
  Mail, 
  Share2, 
  CheckCircle, 
  Users, 
  Link2, 
  QrCode, 
  AlertCircle, 
  Loader2,
  Send,
  Globe,
  Smartphone,
  Download,
  ExternalLink,
  Shield,
  Clock,
  UserPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface InviteModalProps {
  sessionId: string
  closeModal: () => void
  sessionTitle?: string
  isPublic?: boolean
  participantCount?: number
  sessionDuration?: string
}

export default function InviteModal({
  sessionId,
  closeModal,
  sessionTitle = "Coding Session",
  isPublic = true,
  participantCount = 0,
  sessionDuration
}: InviteModalProps) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [emailAddresses, setEmailAddresses] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [sendingEmails, setSendingEmails] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [emailProgress, setEmailProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('link')

  const sessionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/session/${sessionId}`

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

  // Enhanced copy to clipboard with toast
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy to clipboard')
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  // Enhanced email sending with progress
  const sendInviteEmails = async () => {
    if (!emailAddresses.trim()) return
    
    setSendingEmails(true)
    setEmailProgress(0)
    
    try {
      const emails = emailAddresses
        .split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email && /\S+@\S+\.\S+/.test(email))
      
      if (emails.length === 0) {
        toast.error('Please enter valid email addresses')
        setSendingEmails(false)
        return
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setEmailProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 20
        })
      }, 200)

      const response = await fetch('/api/sessions/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          emails,
          message: customMessage,
          sessionTitle,
          sessionUrl
        })
      })
      
      clearInterval(progressInterval)
      setEmailProgress(100)
      
      if (response.ok) {
        setEmailAddresses('')
        setCustomMessage('')
        setEmailSuccess(true)
        toast.success(`Invitations sent to ${emails.length} recipients!`)
        setTimeout(() => {
          setEmailSuccess(false)
          setEmailProgress(0)
        }, 3000)
      } else {
        throw new Error('Failed to send invitations')
      }
    } catch (error) {
      console.error('Failed to send invites:', error)
      toast.error('Failed to send invitations')
      setEmailProgress(0)
    } finally {
      setSendingEmails(false)
    }
  }

  // Enhanced web share API
  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${sessionTitle}`,
          text: 'Come collaborate with me in this real-time coding session!',
          url: sessionUrl
        })
        toast.success('Shared successfully!')
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
          copyToClipboard(sessionUrl, 'share-fallback')
        }
      }
    } else {
      copyToClipboard(sessionUrl, 'share-fallback')
    }
  }

  // Enhanced QR code download
  const downloadQRCode = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    canvas.width = 400
    canvas.height = 400
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `session-${sessionId}-qr.png`
          link.click()
          URL.revokeObjectURL(url)
          toast.success('QR code downloaded!')
        }
      }, 'image/png')
    }
    
    img.crossOrigin = 'anonymous'
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sessionUrl)}`
  }

  // Get valid email count
  const getEmailCount = () => {
    if (!emailAddresses.trim()) return 0
    return emailAddresses
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email && /\S+@\S+\.\S+/.test(email))
      .length
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[95vh] bg-card border-border">
        <DialogHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-semibold text-foreground">
                  Invite Collaborators
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1">
                  Share your coding session and collaborate in real-time
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Session Info Card */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground truncate">{sessionTitle}</h3>
                    <p className="text-sm text-muted-foreground font-mono">ID: {sessionId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant={isPublic ? "default" : "secondary"}>
                    {isPublic ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                  
                  {participantCount > 0 && (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {participantCount}
                    </Badge>
                  )}
                  
                  {sessionDuration && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {sessionDuration}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogHeader>

        <ScrollArea className="flex-1 px-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="link" className="flex items-center space-x-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share Link</span>
                <span className="sm:hidden">Link</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Send Email</span>
                <span className="sm:hidden">Email</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span className="hidden sm:inline">QR Code</span>
                <span className="sm:hidden">QR</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Share Link Tab */}
            <TabsContent value="link" className="space-y-6 mt-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    <span>Session Link</span>
                  </CardTitle>
                  <CardDescription>Share this link with anyone you want to collaborate with</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Session URL:</Label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sessionUrl} 
                        readOnly 
                        className="font-mono text-sm bg-background"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => copyToClipboard(sessionUrl, 'link')}
                            variant="outline"
                            size="icon"
                          >
                            {copied === 'link' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copied === 'link' ? 'Copied!' : 'Copy session link'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Session ID:</Label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sessionId} 
                        readOnly 
                        className="font-mono text-sm bg-background"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => copyToClipboard(sessionId, 'id')}
                            variant="outline"
                            size="icon"
                          >
                            {copied === 'id' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copied === 'id' ? 'Copied!' : 'Copy session ID'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button onClick={shareViaWebShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share via Device
                    </Button>
                    
                    <Button 
                      onClick={() => window.open(sessionUrl, '_blank')}
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Email Tab */}
            <TabsContent value="email" className="space-y-6 mt-6">
              <Card className="bg-green-50/50 dark:bg-green-950/10 border-green-200/50 dark:border-green-900/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span>Send Email Invitations</span>
                      </CardTitle>
                      <CardDescription>Invite people directly via email with a personal message</CardDescription>
                    </div>
                    {getEmailCount() > 0 && (
                      <Badge variant="secondary">
                        {getEmailCount()} recipient{getEmailCount() !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emailSuccess && (
                    <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Invitations sent successfully! Recipients will receive an email with the session link.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email Addresses</Label>
                    <Textarea
                      value={emailAddresses}
                      onChange={(e) => setEmailAddresses(e.target.value)}
                      placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;&#10;Examples:&#10;john@example.com, jane@example.com&#10;alice@company.com;&#10;bob@university.edu"
                      className="min-h-[100px] bg-background"
                      disabled={sendingEmails}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple emails with commas, semicolons, or new lines
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Personal Message (Optional)</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      className="min-h-[80px] bg-background"
                      disabled={sendingEmails}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Add context about your collaboration session
                      </p>
                      <span className={cn(
                        "text-xs",
                        customMessage.length > 450 ? "text-orange-500" : "text-muted-foreground"
                      )}>
                        {customMessage.length}/500
                      </span>
                    </div>
                  </div>

                  {sendingEmails && (
                    <Card className="bg-background/50">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                            <span className="text-sm font-medium">Sending invitations...</span>
                          </div>
                          <span className="text-sm text-green-600 font-medium">{Math.round(emailProgress)}%</span>
                        </div>
                        <Progress value={emailProgress} className="h-2" />
                      </CardContent>
                    </Card>
                  )}
                  
                  <Button 
                    onClick={sendInviteEmails}
                    disabled={!emailAddresses.trim() || sendingEmails || getEmailCount() === 0}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {sendingEmails ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Invitations...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send {getEmailCount() > 0 ? `${getEmailCount()} ` : ''}
                        Invitation{getEmailCount() !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-6 mt-6">
              <Card className="bg-purple-50/50 dark:bg-purple-950/10 border-purple-200/50 dark:border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>QR Code Access</span>
                  </CardTitle>
                  <CardDescription>Scan with any mobile device to join instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <Card className="p-4 bg-background">
                      <div 
                        className="w-48 h-48 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(sessionUrl)}&margin=10)`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center'
                        }}
                      >
                        <QrCode className="h-8 w-8 opacity-10" />
                      </div>
                    </Card>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Scan this QR code with any mobile device to join the session instantly
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>Mobile friendly</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span>Works anywhere</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => copyToClipboard(sessionUrl, 'qr')}
                      variant="outline"
                    >
                      {copied === 'qr' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={downloadQRCode}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Footer Security Notice */}
        <div className="pt-4 border-t border-border">
          <Alert className="bg-muted/30 border-border">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Notice:</strong>{' '}
              {isPublic 
                ? "This is a public session. Anyone with the link can join and collaborate."
                : "This is a private session. Only invited users can access the collaboration."
              } Share responsibly with trusted collaborators.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
