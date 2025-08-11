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
      "group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap relative overflow-hidden",
      isActive 
        ? "bg-blue-900/30 text-blue-300 border border-blue-600" 
        : "hover:bg-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-600 border border-transparent",
      isMobile ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
    );
  };

  const canExecute = activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable;

  return (
    <div className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3">
      {/* File Tabs Section */}
      <div className="flex items-center flex-1 min-w-0">
        {/* Scroll Left Button */}
        {showScrollButtons && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scrollTabs('left')}
            className="mr-2 hover:bg-gray-700 transition-colors"
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
            <div className="flex items-center space-x-2 text-gray-500">
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
                    "transition-colors",
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
                        "text-xs opacity-70 group-hover:opacity-100 transition-opacity",
                        isActive && "bg-blue-800/50 text-blue-300"
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
                        "ml-1 hover:bg-red-900/30 hover:text-red-400 rounded-full p-1 transition-colors opacity-0 group-hover:opacity-100",
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
            className="ml-2 hover:bg-gray-700 transition-colors"
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
            className="hover:bg-gray-700 hover:border-blue-500 transition-colors"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className={cn("animate-spin", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {!isMobile && "Creating..."}
              </>
            ) : (
              <>
                <Plus className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
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
            className="bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            {isExecuting ? (
              <>
                <RefreshCw className={cn("animate-spin", isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {isMobile ? "Running" : "Running..."}
              </>
            ) : (
              <>
                <Play className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {isMobile ? "Run" : "Run Code"}
              </>
            )}
          </Button>
        )}

        {/* Execute Indicator */}
        {canExecute && (
          <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400">
            <Zap className="h-3 w-3 text-green-400" />
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
