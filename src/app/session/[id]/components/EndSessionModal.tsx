import { X, StopCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EndSessionModal({
  endSessionLoading,
  handleEndSession,
  closeModal
}: {
  endSessionLoading: boolean;
  handleEndSession: () => void;
  closeModal: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <StopCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">End Session</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeModal}
            disabled={endSessionLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action cannot be undone.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-3">
            <p className="text-gray-700">
              Are you sure you want to end this session? This will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
              <li>Immediately disconnect all participants</li>
              <li>Mark the session as inactive</li>
              <li>Prevent new participants from joining</li>
              <li>Stop all real-time collaboration features</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Note:</strong> All files and chat history will be preserved and can still be accessed later.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={closeModal}
            disabled={endSessionLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleEndSession}
            disabled={endSessionLoading}
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
      </div>
    </div>
  );
}
