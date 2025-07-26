// import { Crown, Share2, Save, Download, Eye, EyeOff, StopCircle, UserPlus, Loader2, AlertCircle, WifiOff, RefreshCw, CheckCircle, Users } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// export default function SessionHeader({
//   session,
//   isHost,
//   connected,
//   syncStatus,
//   participantCount,
//   copySessionLink,
//   saveAllFiles,
//   exportSession,
//   isPreviewVisible,
//   togglePreview,
//   showInviteModal,
//   showEndSessionModal,
//   endSessionLoading
// }: {
//   session: any;
//   isHost: boolean;
//   connected: boolean;
//   syncStatus: string;
//   participantCount: number;
//   copySessionLink: () => void;
//   saveAllFiles: () => void;
//   exportSession: () => void;
//   isPreviewVisible: boolean;
//   togglePreview: () => void;
//   showInviteModal: () => void;
//   showEndSessionModal: () => void;
//   endSessionLoading: boolean;
// }) {
//   return (
//     <header className="bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
//             {session.description && (
//               <p className="text-sm text-gray-600">{session.description}</p>
//             )}
//           </div>
//           <Badge variant={session.type === 'PUBLIC' ? 'secondary' : 'outline'}>
//             {session.type}
//           </Badge>
//           <Badge variant={session.isActive ? 'default' : 'secondary'}>
//             {session.isActive ? 'Active' : 'Ended'}
//           </Badge>
//           {isHost && (
//             <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
//               <Crown className="h-3 w-3 mr-1" />
//               Host
//             </Badge>
//           )}

//           <Badge className={`flex items-center space-x-1 ${
//             syncStatus === 'synced' ? 'bg-green-100 text-green-800' :
//             syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
//             syncStatus === 'offline' ? 'bg-gray-100 text-gray-800' :
//             'bg-red-100 text-red-800'
//           }`}>
//             {syncStatus === 'synced' && <CheckCircle className="h-3 w-3" />}
//             {syncStatus === 'syncing' && <RefreshCw className="h-3 w-3 animate-spin" />}
//             {syncStatus === 'offline' && <WifiOff className="h-3 w-3" />}
//             {syncStatus === 'error' && <AlertCircle className="h-3 w-3" />}
//             <span className="capitalize">{syncStatus}</span>
//           </Badge>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <div className="flex items-center text-sm text-gray-600 mr-4">
//             <div className="flex items-center">
//               <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <Users className="h-4 w-4 mr-1" />
//               {participantCount} online
//             </div>
//           </div>
          
//           <Button size="sm" variant="outline" onClick={copySessionLink}>
//             <Share2 className="h-4 w-4 mr-1" />
//             Share
//           </Button>
          
//           <Button size="sm" variant="outline" onClick={saveAllFiles}>
//             <Save className="h-4 w-4 mr-1" />
//             Save
//           </Button>
          
//           <Button size="sm" variant="outline" onClick={exportSession}>
//             <Download className="h-4 w-4 mr-1" />
//             Export
//           </Button>

//           <Button 
//             size="sm" 
//             variant="outline" 
//             onClick={togglePreview}
//           >
//             {isPreviewVisible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
//             Preview
//           </Button>

//           {isHost && (
//             <div className="flex items-center space-x-2 border-l pl-2 ml-2">
//               <Button 
//                 size="sm" 
//                 variant="outline"
//                 onClick={showInviteModal}
//               >
//                 <UserPlus className="h-4 w-4 mr-1" />
//                 Invite
//               </Button>
              
//               <Button 
//                 size="sm" 
//                 variant="destructive"
//                 onClick={showEndSessionModal}
//                 disabled={endSessionLoading}
//               >
//                 {endSessionLoading ? (
//                   <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                 ) : (
//                   <StopCircle className="h-4 w-4 mr-1" />
//                 )}
//                 End Session
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }


import { 
  Crown, 
  Share2, 
  Save, 
  Download, 
  Eye, 
  EyeOff, 
  StopCircle, 
  UserPlus, 
  Loader2, 
  AlertCircle, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  Users,
  Globe,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import HeroLogo from '@/components/ui/hero-logo';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface SessionHeaderProps {
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
}

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
}: SessionHeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSyncStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: CheckCircle,
          color: 'text-success bg-success/20 border-success/30',
          label: 'Synced'
        };
      case 'syncing':
        return {
          icon: RefreshCw,
          color: 'text-info bg-info/20 border-info/30',
          label: 'Syncing',
          animate: true
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-muted-foreground bg-muted/20 border-muted-foreground/30',
          label: 'Offline'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-destructive bg-destructive/20 border-destructive/30',
          label: 'Error'
        };
    }
  };

  const syncConfig = getSyncStatusConfig();

  const ActionButtons = () => (
    <>
      <Button 
        size={isMobile ? "sm" : "default"} 
        variant="outline" 
        onClick={copySessionLink}
        className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
      >
        <Share2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
        {!isMobile && "Share"}
      </Button>
      
      <Button 
        size={isMobile ? "sm" : "default"} 
        variant="outline" 
        onClick={saveAllFiles}
        className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
      >
        <Save className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
        {!isMobile && "Save"}
      </Button>
      
      <Button 
        size={isMobile ? "sm" : "default"} 
        variant="outline" 
        onClick={exportSession}
        className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
      >
        <Download className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
        {!isMobile && "Export"}
      </Button>

      <Button 
        size={isMobile ? "sm" : "default"} 
        variant="outline" 
        onClick={togglePreview}
        className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200 group"
      >
        {isPreviewVisible ? (
          <>
            <EyeOff className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
            {!isMobile && "Hide Preview"}
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
            {!isMobile && "Show Preview"}
          </>
        )}
      </Button>

      {isHost && (
        <div className="flex items-center space-x-2 border-l border-border/30 pl-2 ml-2">
          <Button 
            size={isMobile ? "sm" : "default"} 
            variant="outline"
            onClick={showInviteModal}
            className="glass-card backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-200 group"
          >
            <UserPlus className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
            {!isMobile && "Invite"}
          </Button>
          
          <Button 
            size={isMobile ? "sm" : "default"} 
            variant="destructive"
            onClick={showEndSessionModal}
            disabled={endSessionLoading}
            className="hover:bg-destructive/90 transition-all duration-200 group"
          >
            {endSessionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                {!isMobile && "Ending..."}
              </>
            ) : (
              <>
                <StopCircle className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                {!isMobile && "End Session"}
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header className="glass-card shadow-sm border-b border-border/30 px-4 py-3 flex-shrink-0 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        {/* Left Section - Session Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {/* Logo - Hidden on Mobile */}
          {!isMobile && (
            <HeroLogo 
              size="sm" 
              variant="compact" 
              className="animate-float"
            />
          )}
          
          {/* Session Details - Single Line Layout */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 flex-wrap">
              {/* Session Title */}
              <h1 className={cn(
                "font-bold text-foreground truncate",
                isMobile ? "text-base" : "text-xl"
              )}>
                {session.title}
              </h1>
              
              {/* All Status Badges in One Line */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Session Type Badge */}
                <Badge 
                  variant={session.type === 'PUBLIC' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs backdrop-blur-sm",
                    session.type === 'PUBLIC' 
                      ? "bg-success/20 text-success border-success/30" 
                      : "bg-muted/20 text-muted-foreground border-muted-foreground/30"
                  )}
                >
                  {session.type === 'PUBLIC' ? (
                    <>
                      <Globe className="h-3 w-3 mr-1" />
                      {isMobile ? "Pub" : "Public"}
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      {isMobile ? "Prv" : "Private"}
                    </>
                  )}
                </Badge>
                
                {/* Active Status Badge */}
                <Badge 
                  variant={session.isActive ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs backdrop-blur-sm",
                    session.isActive 
                      ? "bg-success/20 text-success border-success/30" 
                      : "bg-muted/20 text-muted-foreground border-muted-foreground/30"
                  )}
                >
                  {session.isActive ? (
                    <>
                      <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse" />
                      Active
                    </>
                  ) : (
                    <>
                      <StopCircle className="h-3 w-3 mr-1" />
                      Ended
                    </>
                  )}
                </Badge>
                
                {/* Host Badge */}
                {isHost && (
                  <Badge 
                    variant="outline" 
                    className="bg-accent-orange/20 text-accent-orange border-accent-orange/30 text-xs backdrop-blur-sm"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Host
                  </Badge>
                )}

                {/* Sync Status Badge */}
                <Badge className={cn("flex items-center space-x-1 text-xs backdrop-blur-sm", syncConfig.color)}>
                  <syncConfig.icon className={cn("h-3 w-3", syncConfig.animate && "animate-spin")} />
                  <span className="capitalize">{isMobile ? syncConfig.label.slice(0,4) : syncConfig.label}</span>
                </Badge>
                
                {/* Participants Count */}
                <Badge variant="outline" className="bg-info/20 text-info border-info/30 text-xs backdrop-blur-sm">
                  <div className={cn(
                    "w-2 h-2 rounded-full mr-1.5",
                    connected ? "bg-success animate-pulse" : "bg-destructive"
                  )} />
                  <Users className="h-3 w-3 mr-1" />
                  <span className="font-medium">{participantCount}</span>
                  {!isMobile && <span className="ml-1">online</span>}
                </Badge>
              </div>
            </div>
            
            {/* Description - Only show on desktop and in a compact way */}
            {session.description && !isMobile && (
              <p className="text-xs text-muted-foreground truncate max-w-[300px] mt-1">
                {session.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {isMobile ? (
            <>
              {/* Mobile Menu Button */}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="glass-card backdrop-blur-sm"
              >
                {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              
              {/* Mobile Menu Overlay */}
              {showMobileMenu && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end pt-16 pr-4">
                  <Card className="glass-card p-4 space-y-3 min-w-[200px] animate-fade-in-scale">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-foreground">Actions</h3>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <ActionButtons />
                    </div>
                  </Card>
                </div>
              )}
            </>
          ) : (
            <ActionButtons />
          )}
        </div>
      </div>
    </header>
  );
}
