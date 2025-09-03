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
  Loader2,
  Send,
  Globe,
  Download,
  Shield,
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
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface InviteModalProps {
  sessionId: string
  closeModal: () => void
  sessionTitle?: string
  isPublic?: boolean
  participantCount?: number
}

export default function InviteModal({
  sessionId,
  closeModal,
  sessionTitle = "Coding Session",
  isPublic = true,
  participantCount = 0
}: InviteModalProps) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [emailAddresses, setEmailAddresses] = useState('')
  const [sendingEmails, setSendingEmails] = useState(false)

  const sessionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/session/${sessionId}`

  const handleClose = () => {
    setOpen(false)
    closeModal()
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Send email invitations
  const sendInviteEmails = async () => {
    if (!emailAddresses.trim()) return
    
    setSendingEmails(true)
    
    try {
      const emails = emailAddresses
        .split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email && /\S+@\S+\.\S+/.test(email))
      
      if (emails.length === 0) {
        toast.error('Please enter valid email addresses')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setEmailAddresses('')
      toast.success(`Invitations sent to ${emails.length} recipients!`)
    } catch (error) {
      toast.error('Failed to send invitations')
    } finally {
      setSendingEmails(false)
    }
  }

  // Web share API
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
          copyToClipboard(sessionUrl, 'share')
        }
      }
    } else {
      copyToClipboard(sessionUrl, 'share')
    }
  }

  // Download QR code
  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sessionUrl)}`
    link.download = `session-${sessionId}-qr.png`
    link.click()
    toast.success('QR code downloaded!')
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
    <Dialog open={open} onOpenChange={handleClose}>
      {/* INCREASED MODAL WIDTH */}
      <DialogContent className="sm:max-w-3xl bg-card border-border">
        {/* Header */}
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold text-card-foreground">
                Invite Collaborators
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Share "{sessionTitle}" with your team
              </DialogDescription>
            </div>
          </div>
          
          {/* Session Info */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground min-w-0 flex-1">
              <span className="flex-shrink-0">Session ID:</span>
              <code className="bg-background px-2 py-1 rounded text-card-foreground font-mono text-xs truncate">
                {sessionId}
              </code>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Badge variant={isPublic ? "default" : "secondary"} className="text-xs">
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
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {participantCount}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="link" className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span>Link</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>QR Code</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Link Tab - INCREASED INPUT SIZE */}
          <TabsContent value="link" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-card-foreground">Session URL</Label>
              {/* MAIN FIX: Much wider input with better spacing */}
              <div className="flex items-center gap-3 w-full">
                <Input 
                  value={sessionUrl} 
                  readOnly 
                  className="flex-1 min-w-0 font-mono text-sm bg-background border-border h-12 px-4 truncate"
                />
                <Button 
                  onClick={() => copyToClipboard(sessionUrl, 'url')}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 w-12 h-12"
                >
                  {copied === 'url' ? (
                    <CheckCircle className="h-5 w-5 text-chart-2" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this URL with your collaborators to join the session
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button onClick={shareViaWebShare} className="w-full h-12 text-base">
                <Share2 className="h-5 w-5 mr-2" />
                Share Link
              </Button>
              <Button 
                onClick={() => window.open(sessionUrl, '_blank')}
                variant="outline" 
                className="w-full h-12 text-base"
              >
                <Globe className="h-5 w-5 mr-2" />
                Open Session
              </Button>
            </div>
          </TabsContent>
          
          {/* Email Tab */}
          <TabsContent value="email" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-card-foreground">Email Addresses</Label>
                {getEmailCount() > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {getEmailCount()} recipient{getEmailCount() !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <Textarea
                value={emailAddresses}
                onChange={(e) => setEmailAddresses(e.target.value)}
                placeholder="Enter email addresses separated by commas&#10;&#10;example@company.com, user@domain.org"
                className="min-h-[120px] bg-background resize-none border-border text-base p-4"
                disabled={sendingEmails}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas, semicolons, or new lines
              </p>
            </div>
            
            <Button 
              onClick={sendInviteEmails}
              disabled={!emailAddresses.trim() || sendingEmails || getEmailCount() === 0}
              className="w-full h-12 text-base"
            >
              {sendingEmails ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending Invitations...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send {getEmailCount() > 0 ? `${getEmailCount()} ` : ''}
                  Invitation{getEmailCount() !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </TabsContent>
          
          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6 mt-6">
            <div className="flex justify-center">
              <Card className="p-6 bg-background border-border/50">
                <div 
                  className="w-48 h-48 rounded-lg flex items-center justify-center bg-white"
                  style={{
                    backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(sessionUrl)}&margin=5)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />
              </Card>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                Scan with any mobile device to join the session instantly
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => copyToClipboard(sessionUrl, 'qr')}
                  variant="outline"
                  className="h-12 text-base"
                >
                  {copied === 'qr' ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2 text-chart-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button 
                  onClick={downloadQRCode}
                  variant="outline"
                  className="h-12 text-base"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download QR
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Notice */}
        <Alert className="bg-muted/30 border-border/50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {isPublic 
              ? "This is a public session. Anyone with the link can join." 
              : "This is a private session. Only invited users can access it."
            }
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  )
}
