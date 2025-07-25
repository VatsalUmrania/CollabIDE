import { useState } from 'react';
import { X, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { languageConfigs } from '../utils/languageConfigs';

export default function NewFileModal({
  newFileName,
  setNewFileName,
  newFileLanguage,
  setNewFileLanguage,
  fileCreationLoading,
  createNewFile,
  files,
  closeModal
}: {
  newFileName: string;
  setNewFileName: (name: string) => void;
  newFileLanguage: string;
  setNewFileLanguage: (lang: string) => void;
  fileCreationLoading: boolean;
  createNewFile: () => void;
  files: any[];
  closeModal: () => void;
}) {
  const [error, setError] = useState('');

  const validateAndCreate = () => {
    setError('');
    
    if (!newFileName.trim()) {
      setError('File name is required');
      return;
    }
    
    if (files.some(file => file.name === newFileName.trim())) {
      setError('A file with this name already exists');
      return;
    }
    
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim())) {
      setError('File name contains invalid characters. Use only letters, numbers, dots, hyphens, and underscores.');
      return;
    }
    
    createNewFile();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !fileCreationLoading) {
      validateAndCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New File</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeModal}
            disabled={fileCreationLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File Name
            </label>
            <Input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g., main.js, style.css, index.html"
              className="w-full"
              onKeyPress={handleKeyPress}
              disabled={fileCreationLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Use only letters, numbers, dots, hyphens, and underscores
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <Select value={newFileLanguage} onValueChange={setNewFileLanguage}>
              <SelectTrigger className="w-full" disabled={fileCreationLoading}>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{config.icon}</span>
                      <span>{config.name}</span>
                      <span className="text-xs text-gray-500">(.{config.extension})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={closeModal}
            disabled={fileCreationLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={validateAndCreate}
            disabled={fileCreationLoading || !newFileName.trim() || !newFileLanguage}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create File
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
