import { useState } from 'react';
import { X, Copy, Mail, Share2, CheckCircle, Users, Link2, QrCode, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InviteModal({
  sessionId,
  closeModal
}: {
  sessionId: string;
  closeModal: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);

  const sessionUrl = `${window.location.origin}/session/${sessionId}`;
  
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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
      
      const response = await fetch('/api/sessions/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          emails,
          message: customMessage
        })
      });
      
      if (response.ok) {
        setEmailAddresses('');
        setCustomMessage('');
        // Show success message
      }
    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setSendingEmails(false);
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my coding session',
          text: 'Come collaborate with me in this real-time coding session!',
          url: sessionUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Invite Collaborators</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={closeModal}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link" className="flex items-center space-x-2">
                <Link2 className="h-4 w-4" />
                <span>Share Link</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Send Email</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>QR Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Share this link with collaborators:
                    </label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sessionUrl} 
                        readOnly 
                        className="flex-1 font-mono text-sm"
                      />
                      <Button 
                        onClick={() => copyToClipboard(sessionUrl, 'link')}
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {copied === 'link' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session ID:
                    </label>
                    <div className="flex space-x-2">
                      <Input 
                        value={sessionId} 
                        readOnly 
                        className="flex-1 font-mono text-sm"
                      />
                      <Button 
                        onClick={() => copyToClipboard(sessionId, 'id')}
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {copied === 'id' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {navigator.share && (
                    <Button 
                      onClick={shareViaWebShare}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share via Device
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Email Invitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses
                    </label>
                    <Textarea
                      value={emailAddresses}
                      onChange={(e) => setEmailAddresses(e.target.value)}
                      placeholder="Enter email addresses separated by commas or new lines&#10;e.g: john@example.com, jane@example.com"
                      className="min-h-24"
                      disabled={sendingEmails}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate multiple emails with commas, semicolons, or new lines
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Message (Optional)
                    </label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation..."
                      className="min-h-20"
                      disabled={sendingEmails}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {customMessage.length}/500 characters
                    </p>
                  </div>
                  
                  <Button 
                    onClick={sendInviteEmails}
                    disabled={!emailAddresses.trim() || sendingEmails}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {sendingEmails ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending Invitations...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">QR Code</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                      <div 
                        className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500"
                        style={{
                          backgroundImage: `url(https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(sessionUrl)})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center'
                        }}
                      >
                        <QrCode className="h-12 w-12" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with a mobile device to join the session
                  </p>
                  <Button 
                    onClick={() => copyToClipboard(sessionUrl, 'qr')}
                    variant="outline"
                    className="w-full"
                  >
                    {copied === 'qr' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Anyone with the session link can join and collaborate. Make sure to share it only with trusted collaborators.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
