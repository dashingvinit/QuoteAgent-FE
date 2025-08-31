import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paperclip, Send, RotateCcw, FileText, Loader2, Settings, Zap, Copy, Archive } from 'lucide-react';
import type { ComponentType, InputAreaProps } from '../types';

export default function InputArea({
  message,
  setMessage,
  file,
  isUploading,
  onFileSelect,
  onSendMessage,
  setSelectedComponent,
  componentTypes,
}: InputAreaProps) {
  const [selectedComponentTypeId, setSelectedComponentTypeId] = useState<string>('');

  // Handle component type selection
  const handleComponentTypeSelect = (componentTypeId: string) => {
    setSelectedComponentTypeId(componentTypeId);

    if (componentTypeId && componentTypes) {
      const selectedComponentType = componentTypes.find((comp: ComponentType) => comp._id === componentTypeId);
      setSelectedComponent(selectedComponentType || null);
    } else {
      setSelectedComponent(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <Card className="m-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border-border/50 shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* File Upload Status */}
          {file && (
            <div className="flex items-center gap-3 p-3 bg-blue-50/80 rounded-lg border border-blue-200/50 backdrop-blur-sm">
              <div className="p-1 bg-blue-100 rounded-md">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-blue-700">{file.name}</span>
                <span className="text-xs text-blue-600 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              {isUploading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </div>
          )}

          {/* Component Selection and Controls */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Select value={selectedComponentTypeId} onValueChange={handleComponentTypeSelect}>
                <SelectTrigger className="w-full bg-background/60 border-border/70 focus:bg-background">
                  <SelectValue placeholder="Select a component type" />
                </SelectTrigger>
                <SelectContent>
                  {componentTypes && componentTypes.length > 0 ? (
                    componentTypes.map((comp: ComponentType) => (
                      <SelectItem key={comp._id} value={comp._id}>
                        {comp.displayName || comp.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-component-types" disabled>
                      No component types available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                disabled
                variant="outline"
                size="sm"
                className="px-3 bg-background/60 hover:bg-background/80 border-border/70">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>

              <Button
                disabled
                variant="outline"
                size="sm"
                className="px-3 bg-background/60 hover:bg-background/80 border-border/70">
                <Zap className="w-4 h-4 mr-1" />
                Quick
              </Button>
            </div>
          </div>

          {/* Enhanced Message Input Area */}
          <div className="relative">
            <Textarea
              placeholder="Type your message to the AI assistant... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[100px] resize-none bg-background/60 border-border/70 focus:bg-background focus:border-primary/50 transition-all duration-200 pr-12 text-foreground placeholder:text-muted-foreground"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/50">
              {message.length} chars
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                disabled
                variant="outline"
                size="sm"
                className="bg-background/60 hover:bg-background/80 border-border/70">
                <Copy className="w-4 h-4 mr-1" />
                Template
              </Button>

              <Button
                disabled
                variant="outline"
                size="sm"
                className="bg-background/60 hover:bg-background/80 border-border/70">
                <Archive className="w-4 h-4 mr-1" />
                History
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedComponentTypeId('');
                  setSelectedComponent(null);
                  setMessage('');
                }}
                className="bg-background/60 hover:bg-background/80 border-border/70">
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onFileSelect}
                disabled={isUploading}
                className="bg-background/60 hover:bg-background/80 border-border/70">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Paperclip className="h-4 w-4 mr-1" />
                )}
                Attach
              </Button>

              <Button
                onClick={onSendMessage}
                size="sm"
                disabled={!message.trim() || isUploading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
