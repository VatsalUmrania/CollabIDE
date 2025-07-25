import { Plus, Play, Loader2, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languageConfigs } from '../utils/languageConfigs';

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
}: {
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
}) {
  return (
    <div className="bg-white border-b flex items-center justify-between px-4 py-2">
      <div className="flex items-center space-x-1 overflow-x-auto max-w-2xl">
        {files.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No files yet</div>
        ) : (
          files.map((file) => {
            const config = languageConfigs[file.language as keyof typeof languageConfigs];
            return (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  file.id === activeFileId
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <span className="text-base">{config?.icon || '📄'}</span>
                <span>{file.name}</span>
                {isHost && files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    className="ml-1 hover:bg-red-100 hover:text-red-600 rounded p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </button>
            );
          })
        )}
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        {isHost && (
          <Button
            size="sm"
            variant="outline"
            onClick={showNewFileModal}
            disabled={fileCreationLoading}
          >
            {fileCreationLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            New File
          </Button>
        )}
        
        {activeFile && languageConfigs[activeFile.language as keyof typeof languageConfigs]?.executable && (
          <Button
            size="sm"
            onClick={executeCode}
            disabled={isExecuting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run Code
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}