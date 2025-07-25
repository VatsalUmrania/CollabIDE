import { XCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SessionEndedModal({
  sessionEndedReason,
  goToDashboard
}: {
  sessionEndedReason: string;
  goToDashboard: () => void;
}) {
  const refreshPage = () => {
    window.location.reload();
  };

  const getReasonMessage = (reason: string) => {
    switch (reason) {
      case 'host_ended':
        return 'The session host has ended this collaboration session.';
      case 'session_expired':
        return 'This session has expired due to inactivity.';
      case 'connection_lost':
        return 'Connection to the session was lost. The session may have ended.';
      case 'kicked':
        return 'You have been removed from this session by the host.';
      default:
        return 'This session has been terminated.';
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'host_ended':
        return '👋';
      case 'session_expired':
        return '⏰';
      case 'connection_lost':
        return '📡';
      case 'kicked':
        return '🚪';
      default:
        return '❌';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-2xl">{getReasonIcon(sessionEndedReason)}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Session Ended
          </h2>
          
          <p className="text-gray-600 mb-6">
            {getReasonMessage(sessionEndedReason)}
          </p>
          
          {sessionEndedReason === 'connection_lost' && (
            <Alert className="mb-6">
              <AlertDescription>
                If this was unexpected, you can try refreshing the page to reconnect.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-center space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
          {sessionEndedReason === 'connection_lost' && (
            <Button 
              variant="outline"
              onClick={refreshPage}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={goToDashboard}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
