'use client'

import { 
  EyeOff, 
  Eye, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Globe, 
  Code2, 
  AlertTriangle, 
  Loader2,
  MonitorSpeaker,
  FileCode,
  Zap,
  Smartphone,
  Tablet,
  Monitor,
  Info,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface PreviewPanelProps {
  isPreviewVisible: boolean
  setIsPreviewVisible: (visible: boolean) => void
  generatePreview: () => string
  session: any
  activeFile?: any
  onInviteUsers?: () => void
}

export default function PreviewPanel({
  isPreviewVisible,
  setIsPreviewVisible,
  generatePreview,
  session,
  activeFile,
  onInviteUsers
}: PreviewPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle iframe loading with progress
  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe) {
      const handleLoadStart = () => {
        setLoadingProgress(0)
        setIsRefreshing(true)
        setPreviewError(null)
        
        // Simulate loading progress
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) return prev
            return prev + Math.random() * 15
          })
        }, 100)
        
        // Clear interval after 3 seconds max
        setTimeout(() => clearInterval(interval), 3000)
      }

      const handleLoad = () => {
        setPreviewError(null)
        setIsRefreshing(false)
        setLoadingProgress(100)
        setTimeout(() => setLoadingProgress(0), 1000)
        toast.success('Preview updated')
      }

      const handleError = () => {
        setPreviewError('Failed to load preview content')
        setIsRefreshing(false)
        setLoadingProgress(0)
        toast.error('Preview failed to load')
      }

      // Start loading process when content changes
      handleLoadStart()
      
      iframe.addEventListener('load', handleLoad)
      iframe.addEventListener('error', handleError)

      return () => {
        iframe.removeEventListener('load', handleLoad)
        iframe.removeEventListener('error', handleError)
      }
    }
  }, [generatePreview()])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setPreviewError(null)
    setLoadingProgress(0)
    toast.loading('Refreshing preview...', { id: 'refresh-preview' })
    
    // Force iframe reload
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.srcDoc
      iframeRef.current.srcDoc = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcDoc = currentSrc || generatePreview()
        }
        toast.success('Preview refreshed', { id: 'refresh-preview' })
      }, 100)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      toast.info('Preview now in fullscreen mode')
    }
  }

  const getPreviewContent = () => {
    try {
      return generatePreview()
    } catch (error) {
      setPreviewError('Error generating preview content')
      return '<html><body style="font-family: system-ui; padding: 2rem; text-align: center;"><h1 style="color: #ef4444;">Preview Error</h1><p>Unable to generate preview content</p></body></html>'
    }
  }

  const canPreview = activeFile && ['html', 'css', 'javascript', 'tsx', 'jsx'].includes(activeFile.language)

  // Get viewport classes for responsive preview
  const getViewportClasses = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      default:
        return 'w-full'
    }
  }

  if (!isPreviewVisible) return null
  
  return (
    <Card className={cn(
      "flex flex-col border-0 bg-card/80 backdrop-blur shadow-2xl",
      isFullscreen 
        ? "fixed inset-0 z-50 rounded-none" 
        : isMobile 
          ? "w-full border-t rounded-t-none" 
          : "w-1/2 border-l rounded-l-none",
      "min-h-0"
    )}>
      {/* Header */}
      <CardHeader className="pb-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl font-bold text-foreground flex items-center space-x-2">
                <span>Live Preview</span>
                {isRefreshing && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              </CardTitle>
              {activeFile && (
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <FileCode className="h-3 w-3" />
                  <span className="truncate">{activeFile.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {activeFile.language}
                  </Badge>
                </CardDescription>
              )}
            </div>
          </div>
          
          {/* Status and Actions */}
          <div className="flex items-center space-x-2">
            {/* Preview Status */}
            {canPreview ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-500/20">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview updates automatically</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-500/20">
                    <Code2 className="h-3 w-3 mr-1" />
                    No Preview
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview not available for this file type</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Viewport Size Selector */}
            {canPreview && !isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {viewportSize === 'mobile' && <Smartphone className="h-4 w-4 mr-2" />}
                    {viewportSize === 'tablet' && <Tablet className="h-4 w-4 mr-2" />}
                    {viewportSize === 'desktop' && <Monitor className="h-4 w-4 mr-2" />}
                    <span className="hidden sm:inline">
                      {viewportSize.charAt(0).toUpperCase() + viewportSize.slice(1)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewportSize('mobile')}>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewportSize('tablet')}>
                    <Tablet className="h-4 w-4 mr-2" />
                    Tablet View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewportSize('desktop')}>
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Separator orientation="vertical" className="h-6" />
            
            {/* Action Buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4 transition-transform",
                    isRefreshing && "animate-spin"
                  )} />
                  <span className="ml-2 hidden sm:inline">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh preview</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Fullscreen Toggle */}
            {!isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Exit</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Fullscreen</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            {/* Close Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsPreviewVisible(false)}
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                  <EyeOff className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Close</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Close preview</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Loading Progress */}
        {isRefreshing && loadingProgress > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Loading preview...</span>
              <span className="text-primary font-medium">{Math.round(loadingProgress)}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      {/* Content Area */}
      <CardContent className="flex-1 relative min-h-0 p-0">
        {previewError ? (
          <div className="flex items-center justify-center h-full bg-destructive/5 p-8">
            <Card className="max-w-md border-destructive/50 bg-destructive/5">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-2">{previewError}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your code for syntax errors or try refreshing the preview.
                  </p>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !canPreview ? (
          <div className="flex items-center justify-center h-full bg-muted/10 p-8">
            <Card className="max-w-md">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                  <Info className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Preview Not Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Live preview is available for HTML, CSS, JavaScript, JSX, and TSX files.
                    {activeFile && ` Current file type: ${activeFile.language}`}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {['HTML', 'CSS', 'JS', 'JSX', 'TSX'].map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Loading Overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <Card className="border-0 bg-card/90 backdrop-blur">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative mx-auto w-fit">
                      <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                      <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" />
                    </div>
                    <div>
                      <p className="font-medium">Refreshing preview...</p>
                      {loadingProgress > 0 && (
                        <div className="w-48 mx-auto mt-3">
                          <Progress value={loadingProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Preview iframe container with responsive wrapper */}
            <div className={cn("h-full p-6", !isFullscreen && getViewportClasses())}>
              <iframe
                ref={iframeRef}
                srcDoc={getPreviewContent()}
                className="w-full h-full border border-border/30 rounded-xl bg-white shadow-lg"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer Info */}
      {canPreview && !previewError && (
        <div className="px-6 py-4 border-t bg-muted/20 flex items-center justify-between text-sm flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600 dark:text-green-400 font-medium">Live updates enabled</span>
            </div>
            
            {viewportSize !== 'desktop' && !isMobile && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1 text-muted-foreground">
                  {viewportSize === 'mobile' && <Smartphone className="h-3 w-3" />}
                  {viewportSize === 'tablet' && <Tablet className="h-3 w-3" />}
                  <span className="capitalize">{viewportSize} view</span>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {session?.participants && (
              <div className="text-muted-foreground">
                {session.participants.length} collaborator{session.participants.length !== 1 ? 's' : ''}
              </div>
            )}
            
            {session?.participants?.length === 1 && onInviteUsers && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onInviteUsers}
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Play className="h-3 w-3 mr-1" />
                Invite others
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Info */}
      {isMobile && isFullscreen && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <Alert className="bg-primary/5 border-primary/20">
            <MonitorSpeaker className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Preview is in fullscreen mode. Tap the minimize button to exit.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  )
}
