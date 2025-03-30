import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Axios } from '@/services';
import Markdown from './markdown-view';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface QuoteResponse {
  data: { quote: string; sender: { reason: string } };
}

const ChatLayout = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessageMutation = useMutation({
    mutationFn: async (input: string) => {
      const { data } = await Axios.post<QuoteResponse>(
        '/inbound/67642c3b315fd62aa89b9aff',
        {
          input,
        }
      );
      return data?.data;
    },
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data?.quote || data?.sender.reason || 'Received your message',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    sendMessageMutation.mutate(message);

    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                <Markdown>{msg.text}</Markdown>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <Input type="file" className="w-full" />
              </div>
            </DialogContent>
          </Dialog>

          <Textarea
            placeholder="Type a message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatLayout;
