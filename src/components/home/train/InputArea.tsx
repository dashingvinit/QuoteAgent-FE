import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, MessageSquare, Send, X } from 'lucide-react';
import { useTraining } from '../../../context/useTraning.tsx';
import { useState } from 'react';

export default function InputArea() {
  const { updateContext, uploadSheet } = useTraining();
  const [file, setFile] = useState<File | null>(null);
  const [contextKey, setContextKey] = useState<string>('');
  const [contextValue, setContextValue] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    try {
      setIsUploading(true);
      await uploadSheet(file);
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContextSubmit = async () => {
    if (!contextKey.trim() || !contextValue.trim()) {
      return;
    }
    try {
      await updateContext(contextKey.trim(), contextValue.trim());
      setContextKey('');
      setContextValue('');
    } catch (error) {
      console.log(error);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <Card className="m-2 bg-muted/40 py-2">
      <CardContent className="text-muted-foreground text-sm">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center space-x-1 cursor-pointer hover:bg-muted/20 p-2 rounded-md">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <p>Upload price spreadsheet</p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Spreadsheet</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4">
              {file ? (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={clearFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Input type="file" onChange={handleFileChange} className="w-full" />
              )}
              <Button
                onClick={handleFileUpload}
                className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
                disabled={!file || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-1 border border-dashed rounded-lg p-2">
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <p>Add context and info</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              value={contextKey}
              onChange={(e) => setContextKey(e.target.value)}
              placeholder="Context key..."
              className="flex-1"
            />
            <Input
              value={contextValue}
              onChange={(e) => setContextValue(e.target.value)}
              placeholder="Context value..."
              className="flex-1"
            />
            <Button
              onClick={handleContextSubmit}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              disabled={!contextKey.trim() || !contextValue.trim()}>
              <Send className="h-5 w-5 mr-2" /> Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
