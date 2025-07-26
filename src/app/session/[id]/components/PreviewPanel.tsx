import { EyeOff, Eye, RefreshCw, Maximize2, Minimize2, Globe, Code2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface PreviewPanelProps {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  generatePreview: () => string;
  session: any;
  activeFile?: any;
}

export default function PreviewPanel({
  isPreviewVisible,
  setIsPreviewVisible,
  generatePreview,
  session,
  activeFile
}: PreviewPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle iframe loading errors
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        setPreviewError(null);
        setIsRefreshing(false);
      };

      const handleError = () => {
        setPreviewError('Failed to load preview');
        setIsRefreshing(false);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPreviewError(null);
    
    // Force iframe reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.srcDoc;
      iframeRef.current.srcDoc = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcDoc = currentSrc || generatePreview();
        }
      }, 100);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getPreviewContent = () => {
    try {
      return generatePreview();
    } catch (error) {
      setPreviewError('Error generating preview content');
      return '<html><body><h1>Preview Error</h1><p>Unable to generate preview</p></body></html>';
    }
  };

  const canPreview = activeFile && ['html', 'css', 'javascript'].includes(activeFile.language);

  if (!isPreviewVisible) return null;
  
  return (
    <div className={cn(
      "bg-card flex flex-col border-border/30 glass-card backdrop-blur-sm",
      isFullscreen 
        ? "fixed inset-0 z-50" 
        : isMobile 
          ? "w-full border-t" 
          : "w-1/2 border-l",
      "min-h-0" // Prevent flex item from growing beyond container
    )}>
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm px-4 py-3 border-b border-border/30 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="p-1.5 bg-info/10 rounded-lg">
            <Globe className="h-4 w-4 text-info" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <span>Live Preview</span>
              {isRefreshing && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </h3>
            {activeFile && (
              <p className="text-xs text-muted-foreground truncate">
                {activeFile.name}
              </p>
            )}
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center space-x-2">
            {canPreview ? (
              <Badge variant="default" className="bg-success/20 text-success border-success/30 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30 text-xs">
                <Code2 className="h-3 w-3 mr-1" />
                No Preview
              </Badge>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {/* Refresh Button */}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-info/10 hover:text-info transition-all duration-200 group"
            title="Refresh preview"
          >
            <RefreshCw className={cn(
              "h-4 w-4 group-hover:rotate-180 transition-transform duration-300",
              isRefreshing && "animate-spin"
            )} />
          </Button>
          
          {/* Fullscreen Toggle */}
          {!isMobile && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={toggleFullscreen}
              className="hover:bg-accent/50 transition-all duration-200 group"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <Maximize2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              )}
            </Button>
          )}
          
          {/* Close Button */}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsPreviewVisible(false)}
            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
            title="Close preview"
          >
            <EyeOff className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 relative min-h-0">
        {previewError ? (
          <div className="flex items-center justify-center h-full bg-destructive/5">
            <div className="text-center p-6 max-w-md">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">Preview Error</h3>
              <p className="text-sm text-muted-foreground mb-4">{previewError}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        ) : !canPreview ? (
          <div className="flex items-center justify-center h-full bg-muted/5">
            <div className="text-center p-6 max-w-md">
              <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Preview Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Preview is only available for HTML, CSS, and JavaScript files. 
                {activeFile && ` Current file: ${activeFile.language}`}
              </p>
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs">
                  Supported: HTML, CSS, JS
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Loading Overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Refreshing preview...</p>
                </div>
              </div>
            )}
            
            {/* Preview iframe */}
            <iframe
              ref={iframeRef}
              srcDoc={getPreviewContent()}
              className="w-full h-full border-0 bg-white"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              style={{ minHeight: '100%' }}
            />
          </>
        )}
      </div>

      {/* Footer Info */}
      {canPreview && !previewError && (
        <div className="px-4 py-2 border-t border-border/30 bg-card/30 backdrop-blur-sm flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Live updates enabled</span>
          </div>
          {session?.participants && (
            <span>{session.participants.length} collaborator{session.participants.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Mobile Fullscreen Overlay */}
      {isMobile && isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <Alert className="glass-card backdrop-blur-sm border-info/30">
            <Globe className="h-4 w-4 text-info" />
            <AlertDescription className="text-info">
              Preview is now in fullscreen mode. Tap anywhere outside to exit.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
