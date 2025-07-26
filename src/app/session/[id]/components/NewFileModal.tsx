import { useState, useEffect } from 'react';
import { X, Plus, Loader2, AlertCircle, File, Code2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { languageConfigs } from '../utils/languageConfigs';
import { cn } from '@/lib/utils';

interface NewFileModalProps {
  newFileName: string;
  setNewFileName: (name: string) => void;
  newFileLanguage: string;
  setNewFileLanguage: (lang: string) => void;
  fileCreationLoading: boolean;
  createNewFile: () => void;
  files: any[];
  closeModal: () => void;
}

export default function NewFileModal({
  newFileName,
  setNewFileName,
  newFileLanguage,
  setNewFileLanguage,
  fileCreationLoading,
  createNewFile,
  files,
  closeModal
}: NewFileModalProps) {
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Simple toast replacement
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

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

    if (!newFileLanguage) {
      setError('Please select a programming language');
      return;
    }
    
    createNewFile();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !fileCreationLoading) {
      validateAndCreate();
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  // Auto-detect language from file extension
  const handleFileNameChange = (name: string) => {
    setNewFileName(name);
    setError(''); // Clear errors when user types
    
    // Auto-detect language from extension
    const extension = name.split('.').pop()?.toLowerCase();
    if (extension) {
      const detectedLanguage = Object.entries(languageConfigs).find(
        ([_, config]) => config.extension === extension
      );
      if (detectedLanguage && !newFileLanguage) {
        setNewFileLanguage(detectedLanguage[0]);
      }
    }
  };

  const getSelectedLanguageConfig = () => {
    return languageConfigs[newFileLanguage as keyof typeof languageConfigs];
  };

  const isFormValid = newFileName.trim() && newFileLanguage && !fileCreationLoading;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card 
        className={cn(
          "w-full max-w-md glass-card shadow-2xl animate-fade-in-scale border-primary/20",
          isMobile ? "mx-4" : "mx-auto"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Create New File</h2>
                <p className="text-sm text-muted-foreground">
                  Add a new file to your collaborative session
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={closeModal}
              disabled={fileCreationLoading}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-slide-down glass-card backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}
          
          {/* File Name Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              File Name
              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
            </label>
            <Input
              type="text"
              value={newFileName}
              onChange={(e) => handleFileNameChange(e.target.value)}
              placeholder="e.g., main.js, style.css, index.html"
              className="w-full h-12 text-base glass-card backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all duration-300"
              onKeyPress={handleKeyPress}
              disabled={fileCreationLoading}
              autoFocus
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Use only letters, numbers, dots, hyphens, and underscores
              </p>
              {newFileName && (
                <div className="flex items-center space-x-1 text-xs">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    /^[a-zA-Z0-9_.-]+$/.test(newFileName.trim()) ? "bg-success" : "bg-destructive"
                  )} />
                  <span className={cn(
                    "font-medium",
                    /^[a-zA-Z0-9_.-]+$/.test(newFileName.trim()) ? "text-success" : "text-destructive"
                  )}>
                    {/^[a-zA-Z0-9_.-]+$/.test(newFileName.trim()) ? "Valid" : "Invalid"}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Language Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Programming Language
              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
            </label>
            <Select 
              value={newFileLanguage} 
              onValueChange={setNewFileLanguage}
              disabled={fileCreationLoading}
            >
              <SelectTrigger className="w-full h-12 glass-card backdrop-blur-sm border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Select a programming language">
                  {newFileLanguage && getSelectedLanguageConfig() && (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSelectedLanguageConfig().icon}</span>
                      <span>{getSelectedLanguageConfig().name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="glass-card backdrop-blur-sm max-h-60">
                {Object.entries(languageConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="hover:bg-accent/50 transition-colors duration-200">
                    <div className="flex items-center space-x-3 w-full">
                      <span className="text-lg">{config.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium">{config.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-muted/50">
                            .{config.extension}
                          </Badge>
                          {config.executable && (
                            <Badge variant="default" className="text-xs bg-success/20 text-success border-success/30">
                              Executable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {newFileLanguage && (
              <div className="p-3 bg-info/5 border border-info/20 rounded-lg backdrop-blur-sm">
                <div className="flex items-start space-x-2">
                  <Code2 className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-info">
                      {getSelectedLanguageConfig().name} Selected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Files will be created with .{getSelectedLanguageConfig().extension} extension
                      {getSelectedLanguageConfig().executable && " and can be executed"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Preview */}
          {newFileName && newFileLanguage && (
            <div className="p-4 bg-muted/20 rounded-lg backdrop-blur-sm border border-border/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="text-lg">{getSelectedLanguageConfig().icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Preview:</p>
                  <p className="text-lg font-mono text-primary truncate">
                    {newFileName.includes('.') ? newFileName : `${newFileName}.${getSelectedLanguageConfig().extension}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={closeModal}
            disabled={fileCreationLoading}
            className="glass-card backdrop-blur-sm hover:bg-card/50 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={validateAndCreate}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-primary via-accent-purple to-accent-blue hover:from-primary/90 hover:via-accent-purple/90 hover:to-accent-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group min-w-[120px]"
          >
            {fileCreationLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Create File
              </>
            )}
          </Button>
        </div>

        {/* Existing Files Count */}
        {files.length > 0 && (
          <div className="absolute top-2 right-12">
            <Badge variant="secondary" className="bg-muted/50 text-xs">
              {files.length} existing files
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}
