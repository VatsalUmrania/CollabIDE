import { Plus, Play, Loader2, RefreshCw, X, File, Code2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { languageConfigs } from '../utils/languageConfigs';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface FileTabsProps {
  files: any[];
  activeFileId: string | null;
  setActiveFileId: (id: string) => void;
  isHost: boolean;
  showNewFileModal: () => void;
  fileCreationLoading: boolean;
  deleteFile: (id: string) => void;
  executeCode: () => void;
  isExecuting: boolean;
  activeFile: any;
}

export default function FileTabs({
  files,
  activeFileId,
  setActiveFileId,
  isHost,
  showNewFileModal,
  fileCreationLoading,
  deleteFile,
  executeCode,
  isExecuting,
  activeFile
}: FileTabsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Check for mobile viewport and scroll indicators
  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Check if tabs container needs scroll buttons
      const tabsContainer = document.getElementById('file-tabs-container');
      if (tabsContainer) {
        setShowScrollButtons(tabsContainer.scrollWidth > tabsContainer.clientWidth);
      }
    };
    
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [files]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const container = document.getElementById('file-tabs-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getTabClasses = (file: any, isActive: boolean) => {
    return cn(
      "group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap relative overflow-hidden backdrop-blur-sm",
      isActive 
        ? "bg-primary/10 text-primary border border-primary/30 shadow-sm glass-card" 
        : "hover:bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/50 border border-transparent",
      isMobile ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
    );
  };

  const canExecute = activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable;

  return (
    <div className="glass-card border-b border-border/30 flex items-center justify-between px-4 py-3 backdrop-blur-sm">
      {/* File Tabs Section */}
      <div className="flex items-center flex-1 min-w-0">
        {/* Scroll Left Button */}
        {showScrollButtons && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollTabs('left')}
            className="mr-2 hover:bg-accent/50 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4 rotate-180" />
          </Button>
        )}

        {/* Tabs Container */}
        <div 
          id="file-tabs-container"
          className={cn(
            "flex items-center space-x-2 overflow-x-auto scrollbar-hide flex-1",
            isMobile ? "space-x-1" : "space-x-2"
          )}
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {files.length === 0 ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <File className="h-4 w-4 opacity-50" />
              <span className={cn("italic", isMobile ? "text-xs" : "text-sm")}>
                No files yet
              </span>
            </div>
          ) : (
            files.map((file) => {
              const config = languageConfigs[file.language as keyof typeof languageConfigs];
              const isActive = file.id === activeFileId;
              
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={getTabClasses(file, isActive)}
                  title={`${file.name} (${config?.name || file.language})`}
                >
                  {/* Language Icon */}
                  <span className={cn(
                    "transition-transform duration-200 group-hover:scale-110",
                    isMobile ? "text-sm" : "text-base"
                  )}>
                    {config?.icon || '📄'}
                  </span>
                  
                  {/* File Name */}
                  <span className={cn(
                    "max-w-[120px] truncate",
                    isMobile && "max-w-[80px]"
                  )}>
                    {file.name}
                  </span>
                  
                  {/* Language Badge */}
                  {!isMobile && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs opacity-70 group-hover:opacity-100 transition-opacity duration-200",
                        isActive && "bg-primary/20 text-primary"
                      )}
                    >
                      {config?.name || file.language}
                    </Badge>
                  )}
                  
                  {/* Delete Button */}
                  {isHost && files.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className={cn(
                        "ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full p-1 transition-all duration-200 opacity-0 group-hover:opacity-100",
                        isActive && "opacity-70"
                      )}
                      title="Delete file"
                    >
                      <X className={cn(isMobile ? "h-3 w-3" : "h-3 w-3")} />
                    </button>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Scroll Right Button */}
        {showScrollButtons && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollTabs('right')}
            className="ml-2 hover:bg-accent/50 transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Action Buttons Section */}
      <div className={cn(
        "flex items-center space-x-2 ml-4 flex-shrink-0",
        isMobile ? "space-x-1 ml-2" : "space-x-2 ml-4"
      )}>
        {/* New File Button */}
        {isHost && (
          <Button
            size={isMobile ? "sm" : "default"}
            variant="outline"
            onClick={showNewFileModal}
            disabled={fileCreationLoading}
            className="glass-card backdrop-blur-sm hover:bg-card/50 hover:border-primary/50 transition-all duration-300 group"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className={cn("animate-spin", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {!isMobile && "Creating..."}
              </>
            ) : (
              <>
                <Plus className={cn("group-hover:rotate-180 transition-transform duration-300", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {isMobile ? "New" : "New File"}
              </>
            )}
          </Button>
        )}
        
        {/* Run Code Button */}
        {canExecute && (
          <Button
            size={isMobile ? "sm" : "default"}
            onClick={executeCode}
            disabled={isExecuting}
            className="bg-gradient-to-r from-success via-accent-emerald to-accent-green hover:from-success/90 hover:via-accent-emerald/90 hover:to-accent-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isExecuting ? (
              <>
                <RefreshCw className={cn("animate-spin", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {isMobile ? "Running" : "Running..."}
              </>
            ) : (
              <>
                <Play className={cn("group-hover:scale-110 transition-transform duration-200", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {isMobile ? "Run" : "Run Code"}
              </>
            )}
          </Button>
        )}

        {/* Execute Indicator */}
        {canExecute && (
          <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-success" />
            <span>Executable</span>
          </div>
        )}
      </div>

      {/* Mobile File Count Indicator */}
      {isMobile && files.length > 0 && (
        <div className="absolute top-1 right-1">
          <Badge variant="secondary" className="text-xs">
            {files.length}
          </Badge>
        </div>
      )}
    </div>
  );
}
