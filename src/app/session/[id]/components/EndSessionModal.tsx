// import { X, StopCircle, AlertTriangle, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription } from '@/components/ui/alert';

// export default function EndSessionModal({
//   endSessionLoading,
//   handleEndSession,
//   closeModal
// }: {
//   endSessionLoading: boolean;
//   handleEndSession: () => void;
//   closeModal: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
//         <div className="flex justify-between items-center p-6 border-b">
//           <div className="flex items-center space-x-2">
//             <StopCircle className="h-5 w-5 text-red-600" />
//             <h2 className="text-xl font-semibold text-gray-900">End Session</h2>
//           </div>
//           <Button 
//             variant="ghost" 
//             size="sm" 
//             onClick={closeModal}
//             disabled={endSessionLoading}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <Alert variant="destructive">
//             <AlertTriangle className="h-4 w-4" />
//             <AlertDescription>
//               <strong>Warning:</strong> This action cannot be undone.
//             </AlertDescription>
//           </Alert>
          
//           <div className="space-y-3">
//             <p className="text-gray-700">
//               Are you sure you want to end this session? This will:
//             </p>
//             <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
//               <li>Immediately disconnect all participants</li>
//               <li>Mark the session as inactive</li>
//               <li>Prevent new participants from joining</li>
//               <li>Stop all real-time collaboration features</li>
//             </ul>
//             <p className="text-sm text-gray-600 mt-3">
//               <strong>Note:</strong> All files and chat history will be preserved and can still be accessed later.
//             </p>
//           </div>
//         </div>
        
//         <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
//           <Button 
//             variant="outline" 
//             onClick={closeModal}
//             disabled={endSessionLoading}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="destructive"
//             onClick={handleEndSession}
//             disabled={endSessionLoading}
//           >
//             {endSessionLoading ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Ending Session...
//               </>
//             ) : (
//               <>
//                 <StopCircle className="h-4 w-4 mr-2" />
//                 End Session
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card 
        className={cn(
          "w-full max-w-md glass-card shadow-2xl animate-fade-in-scale border-destructive/20",
          isMobile ? "mx-4" : "mx-auto"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <StopCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">End Session</h2>
                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {sessionTitle}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closeModal}
              disabled={endSessionLoading}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <Alert variant="destructive" className="animate-slide-down glass-card backdrop-blur-sm">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              <strong>Warning:</strong> This action cannot be undone.
            </AlertDescription>
          </Alert>

          {/* Session Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{participantCount}</div>
                <div className="text-xs text-muted-foreground">Participants</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-lg backdrop-blur-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{fileCount}</div>
                <div className="text-xs text-muted-foreground">Files</div>
              </div>
            </div>
          </div>
          
          {/* Confirmation Message */}
          <div className="space-y-4">
            <p className="text-foreground font-medium">
              Are you sure you want to end this session?
            </p>
            
            {/* Impact List */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">This will:</p>
              <div className="space-y-2">
                {[
                  { icon: Users, text: "Immediately disconnect all participants", color: "text-warning" },
                  { icon: StopCircle, text: "Mark the session as inactive", color: "text-destructive" },
                  { icon: Shield, text: "Prevent new participants from joining", color: "text-muted-foreground" },
                  { icon: X, text: "Stop all real-time collaboration features", color: "text-muted-foreground" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/10 transition-colors duration-200"
                  >
                    <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", color)} />
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preservation Notice */}
            <div className="p-4 bg-info/5 border border-info/20 rounded-lg backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Archive className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-info mb-1">Data Preservation</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All files, chat history, and session data will be preserved and can be accessed later for download or review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={closeModal}
            disabled={endSessionLoading}
            className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleEndSession}
            disabled={endSessionLoading}
            className="bg-gradient-to-r from-destructive to-red-600 hover:from-destructive/90 hover:to-red-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[140px]"
          >
            {endSessionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Ending Session...
              </>
            ) : (
              <>
                <StopCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                End Session
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
