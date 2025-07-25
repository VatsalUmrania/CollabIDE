import { EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PreviewPanel({
  isPreviewVisible,
  setIsPreviewVisible,
  generatePreview,
  session
}: {
  isPreviewVisible: boolean;
  setIsPreviewVisible: (visible: boolean) => void;
  generatePreview: () => string;
  session: any;
}) {
  if (!isPreviewVisible) return null;
  
  return (
    <div className="w-1/2 border-l bg-white flex flex-col">
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Live Preview</h3>
        <Button size="sm" variant="outline" onClick={() => setIsPreviewVisible(false)}>
          <EyeOff className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1">
        <iframe
          srcDoc={generatePreview()}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}