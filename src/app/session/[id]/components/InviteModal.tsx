import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import HeroLogo from '@/components/ui/hero-logo';
import { cn } from '@/lib/utils';

interface InviteModalProps {
  sessionId: string;
  closeModal: () => void;
  sessionTitle?: string;
  isPublic?: boolean;
}

export default function InviteModal({
  sessionId,
  closeModal,
  sessionTitle = "Coding Session",
  isPublic = true
}: InviteModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sessionUrl = `${window.location.origin}/session/${sessionId}`;

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Simple toast replacement
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };
  
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const sendInviteEmails = async () => {
    if (!emailAddresses.trim()) return;
    
    setSendingEmails(true);
    try {
      const emails = emailAddresses
        .split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email && /\S+@\S+\.\S+/.test(email));
      
      if (emails.length === 0) {
        showToast('Please enter valid email addresses', 'error');
        setSendingEmails(false);
        return;
      }

      const response = await fetch('/api/sessions/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          emails,
          message: customMessage,
          sessionTitle
        })
      });
      
      if (response.ok) {
        setEmailAddresses('');
        setCustomMessage('');
        setEmailSuccess(true);
        showToast(`Invitations sent to ${emails.length} recipients!`, 'success');
        setTimeout(() => setEmailSuccess(false), 3000);
      } else {
        throw new Error('Failed to send invitations');
      }
    } catch (error) {
      console.error('Failed to send invites:', error);
      showToast('Failed to send invitations', 'error');
    } finally {
      setSendingEmails(false);
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my coding session: ${sessionTitle}`,
          text: 'Come collaborate with me in this real-time coding session!',
          url: sessionUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(sessionUrl)}`;
    link.download = `session-${sessionId}-qr.png`;
    link.click();
  };

  const getEmailCount = () => {
    if (!emailAddresses.trim()) return 0;
    return emailAddresses
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email && /\S+@\S+\.\S+/.test(email))
      .length;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card 
        className={cn(
          "w-full max-w-2xl glass-card shadow-2xl animate-fade-in-scale max-h-[90vh] overflow-hidden",
          isMobile ? "mx-4" : "mx-auto"
        )}
      >
        {/* Header */}
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Invite Collaborators</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {sessionTitle}
                  </p>
                  <Badge variant={isPublic ? "default" : "secondary"} className="text-xs">
                    {isPublic ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closeModal}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-card backdrop-blur-sm">
              <TabsTrigger 
                value="link" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent-blue data-[state=active]:text-white"
              >
                <Link2 className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "block"}>Share Link</span>
                <span className={isMobile ? "block" : "hidden"}>Link</span>
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-emerald data-[state=active]:to-success data-[state=active]:text-white"
              >
                <Mail className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "block"}>Send Email</span>
                <span className={isMobile ? "block" : "hidden"}>Email</span>
              </TabsTrigger>
              <TabsTrigger 
                value="qr" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-purple data-[state=active]:to-accent-pink data-[state=active]:text-white"
              >
                <QrCode className="h-4 w-4" />
                <span className={isMobile ? "hidden" : "block"}>QR Code</span>
                <span className={isMobile ? "block" : "hidden"}>QR</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Share Link Tab */}
            <TabsContent value="link" className="space-y-4 mt-6 animate-fade-in">
              <Card className="glass-card backdrop-blur-sm border-border/30">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Session Link</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Share this link with collaborators:
                    </label>
                    <div className="flex space-x-2 ">
                      <Input 
                        value={sessionUrl} 
                        readOnly 
                        className={cn(
                          "flex-1 font-mono glass-card backdrop-blur-sm border-border/50",
                          isMobile ? "text-xs" : "text-sm"
                        )}
                      />
                      <Button 
                        onClick={() => copyToClipboard(sessionUrl, 'link')}
                        variant="outline"
                        className="flex-shrink-0 glass-card backdrop-blur-sm hover:bg-card/50 group"
                        size={isMobile ? "sm" : "default"}
                      >
                        {copied === 'link' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-success" />
                            {!isMobile && "Copied!"}
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                            {!isMobile && "Copy"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session ID:
                    </label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sessionId} 
                        readOnly 
                        className={cn(
                          "flex-1 font-mono glass-card backdrop-blur-sm border-border/50",
                          isMobile ? "text-xs" : "text-sm"
                        )}
                      />
                      <Button 
                        onClick={() => copyToClipboard(sessionId, 'id')}
                        variant="outline"
                        className="flex-shrink-0 glass-card backdrop-blur-sm hover:bg-card/50 group"
                        size={isMobile ? "sm" : "default"}
                      >
                        {copied === 'id' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-success" />
                            {!isMobile && "Copied!"}
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                            {!isMobile && "Copy"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {navigator.share && (
                    <Button 
                      onClick={shareViaWebShare}
                      className="w-full bg-gradient-to-r from-primary via-accent-blue to-accent-cyan hover:from-primary/90 hover:via-accent-blue/90 hover:to-accent-cyan/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Share via Device
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Email Tab */}
            <TabsContent value="email" className="space-y-4 mt-6 animate-fade-in">
              <Card className="glass-card backdrop-blur-sm border-border/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-accent-emerald" />
                      <h3 className="text-lg font-semibold text-foreground">Send Email Invitations</h3>
                    </div>
                    {getEmailCount() > 0 && (
                      <Badge variant="secondary" className="bg-accent-emerald/20 text-accent-emerald">
                        {getEmailCount()} recipients
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emailSuccess && (
                    <Alert className="animate-slide-down bg-success/10 border-success/30">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription className="text-success">
                        Invitations sent successfully! Recipients will receive an email with the session link.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Addresses
                    </label>
                    <Textarea
                      value={emailAddresses}
                      onChange={(e) => setEmailAddresses(e.target.value)}
                      placeholder="Enter email addresses separated by commas or new lines&#10;e.g: john@example.com, jane@example.com"
                      className={cn(
                        "min-h-24 glass-card backdrop-blur-sm border-border/50 focus:border-accent-emerald/50",
                        isMobile ? "text-sm" : "text-base"
                      )}
                      disabled={sendingEmails}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate multiple emails with commas, semicolons, or new lines
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Custom Message (Optional)
                    </label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      className={cn(
                        "min-h-20 glass-card backdrop-blur-sm border-border/50 focus:border-accent-emerald/50",
                        isMobile ? "text-sm" : "text-base"
                      )}
                      disabled={sendingEmails}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        Add context about your collaboration session
                      </p>
                      <span className={cn(
                        "text-xs font-medium",
                        customMessage.length > 400 ? "text-warning" : "text-muted-foreground"
                      )}>
                        {customMessage.length}/500
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={sendInviteEmails}
                    disabled={!emailAddresses.trim() || sendingEmails || getEmailCount() === 0}
                    className="w-full bg-gradient-to-r from-accent-emerald via-success to-accent-green hover:from-accent-emerald/90 hover:via-success/90 hover:to-accent-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {sendingEmails ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Invitations...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                        Send {getEmailCount() > 0 ? `${getEmailCount()} ` : ''}Invitation{getEmailCount() !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-4 mt-6 animate-fade-in">
              <Card className="glass-card backdrop-blur-sm border-border/30">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-accent-purple" />
                    <h3 className="text-lg font-semibold text-foreground">QR Code</h3>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-border/30 inline-block shadow-lg">
                      <div 
                        className={cn(
                          "bg-gray-100 rounded-lg flex items-center justify-center text-gray-500",
                          isMobile ? "w-32 h-32" : "w-48 h-48"
                        )}
                        style={{
                          backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=${isMobile ? '128x128' : '192x192'}&data=${encodeURIComponent(sessionUrl)})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center'
                        }}
                      >
                        <QrCode className={cn("opacity-20", isMobile ? "h-8 w-8" : "h-12 w-12")} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code with a mobile device to join the session
                    </p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile friendly</span>
                    </div>
                  </div>
                  
                  <div className={cn("grid gap-2", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                    <Button 
                      onClick={() => copyToClipboard(sessionUrl, 'qr')}
                      variant="outline"
                      className="glass-card backdrop-blur-sm hover:bg-card/50 group"
                    >
                      {copied === 'qr' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-success" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={downloadQRCode}
                      variant="outline"
                      className="glass-card backdrop-blur-sm hover:bg-card/50 group"
                    >
                      <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Download QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm rounded-b-xl">
          <Alert className="glass-card backdrop-blur-sm border-info/30">
            <AlertCircle className="h-4 w-4 text-info" />
            <AlertDescription className="text-muted-foreground">
              <strong className="text-foreground">Security Notice:</strong> {' '}
              {isPublic 
                ? "This is a public session. Anyone with the link can join and collaborate."
                : "This is a private session. Only invited users can access the collaboration."
              } Share responsibly with trusted collaborators.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  );
}
