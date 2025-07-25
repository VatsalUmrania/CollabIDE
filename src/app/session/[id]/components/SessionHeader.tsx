import { Crown, Share2, Save, Download, Eye, EyeOff, StopCircle, UserPlus, Loader2, AlertCircle, WifiOff, RefreshCw, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SessionHeader({
  session,
  isHost,
  connected,
  syncStatus,
  participantCount,
  copySessionLink,
  saveAllFiles,
  exportSession,
  isPreviewVisible,
  togglePreview,
  showInviteModal,
  showEndSessionModal,
  endSessionLoading
}: {
  session: any;
  isHost: boolean;
  connected: boolean;
  syncStatus: string;
  participantCount: number;
  copySessionLink: () => void;
  saveAllFiles: () => void;
  exportSession: () => void;
  isPreviewVisible: boolean;
  togglePreview: () => void;
  showInviteModal: () => void;
  showEndSessionModal: () => void;
  endSessionLoading: boolean;
}) {
  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
            {session.description && (
              <p className="text-sm text-gray-600">{session.description}</p>
            )}
          </div>
          <Badge variant={session.type === 'PUBLIC' ? 'secondary' : 'outline'}>
            {session.type}
          </Badge>
          <Badge variant={session.isActive ? 'default' : 'secondary'}>
            {session.isActive ? 'Active' : 'Ended'}
          </Badge>
          {isHost && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Crown className="h-3 w-3 mr-1" />
              Host
            </Badge>
          )}

          <Badge className={`flex items-center space-x-1 ${
            syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
            syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
            syncStatus === 'offline' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {syncStatus === 'synced' && <CheckCircle className="h-3 w-3" />}
            {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 animate-spin" />}
            {syncStatus === 'offline' && <WifiOff className="h-3 w-3" />}
            {syncStatus === 'error' && <AlertCircle className="h-3 w-3" />}
            <span className="capitalize">{syncStatus}</span>
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-gray-600 mr-4">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <Users className="h-4 w-4 mr-1" />
              {participantCount} online
            </div>
          </div>
          
          <Button size="sm" variant="outline" onClick={copySessionLink}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          <Button size="sm" variant="outline" onClick={saveAllFiles}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button size="sm" variant="outline" onClick={exportSession}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={togglePreview}
          >
            {isPreviewVisible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            Preview
          </Button>

          {isHost && (
            <div className="flex items-center space-x-2 border-l pl-2 ml-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={showInviteModal}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Invite
              </Button>
              
              <Button 
                size="sm" 
                variant="destructive"
                onClick={showEndSessionModal}
                disabled={endSessionLoading}
              >
                {endSessionLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <StopCircle className="h-4 w-4 mr-1" />
                )}
                End Session
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}