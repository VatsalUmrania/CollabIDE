import { X, StopCircle, AlertTriangle, Loader2, Shield, Archive, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface EndSessionModalProps {
  endSessionLoading: boolean;
  handleEndSession: () => void;
  closeModal: () => void;
  sessionTitle?: string;
  participantCount?: number;
  fileCount?: number;
}

export default function EndSessionModal({
  endSessionLoading,
  handleEndSession,
  closeModal,
  sessionTitle = "Current Session",
  participantCount = 0,
  fileCount = 0
}: EndSessionModalProps) {
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card 
        className={cn(
          "w-full max-w-md shadow-lg",
          isMobile ? "mx-4" : "mx-auto"
        )}
      >
       
        <CardHeader className="pb-4 relative">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <StopCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">End Session</h2>
              <p className="text-sm text-gray-400 truncate max-w-[200px]">
                {sessionTitle}
              </p>
            </div>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={closeModal}
            disabled={endSessionLoading}
            className="absolute top-5 right-5 hover:bg-red-900/30 hover:text-red-300 transition-colors rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert variant="destructive">
            <span className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription className="font-medium">
                <strong>Warning:</strong> This action cannot be undone.
              </AlertDescription>
            </span>
          </Alert>

          {/* Session Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-white">{participantCount}</div>
                <div className="text-xs text-gray-400">Participants</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg">
              <FileText className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-white">{fileCount}</div>
                <div className="text-xs text-gray-400">Files</div>
              </div>
            </div>
          </div>
          
          {/* Confirmation Message */}
          <div className="space-y-4">
            <p className="text-white font-medium">
              Are you sure you want to end this session?
            </p>
            
            {/* Impact List */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-medium">This will:</p>
              <div className="space-y-2">
                {[
                  { icon: Users, text: "Immediately disconnect all participants", color: "text-yellow-400" },
                  { icon: StopCircle, text: "Mark the session as inactive", color: "text-red-400" },
                  { icon: Shield, text: "Prevent new participants from joining", color: "text-gray-400" },
                  { icon: X, text: "Stop all real-time collaboration features", color: "text-gray-400" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", color)} />
                    <span className="text-sm text-gray-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preservation Notice */}
            <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <Archive className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-300 mb-1">Data Preservation</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    All files, chat history, and session data will be preserved and can be accessed later for download or review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={closeModal}
            disabled={endSessionLoading}
            className="hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleEndSession}
            disabled={endSessionLoading}
            className="min-w-[140px] transition-colors"
          >
            {endSessionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ending Session...
              </>
            ) : (
              <>
                <StopCircle className="h-4 w-4 mr-2" />
                End Session
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
