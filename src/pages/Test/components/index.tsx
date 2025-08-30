import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';
import ChatMessage, { Message } from './ChatMessage';

// --- 1. Define accurate interfaces for the new API response ---
interface LangChainMessage {
  id: string[];
  kwargs: {
    content: string;
    id: string;
  };
}

interface BackendResponse {
  messages: LangChainMessage[];
  // Include other properties from your response if needed
}

// This is the type that Axios will return
interface AxiosResponse {
  data: BackendResponse;
}

const ChatLayout = () => {
  const { activeOrg } = useOrg();
  const [message, setMessage] = useState('');
  // We'll also update the state to hold the full chat history from the API
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessageMutation = useMutation({
    // Tell useMutation the correct types for the response and input
    mutationFn: (input: string): Promise<BackendResponse> => {
      // The Axios call needs to be correctly typed
      return Axios.post<AxiosResponse>(`/quotes/${activeOrg._id}`, { input }).then((response) => response.data.data); // Assuming the response is nested under a `data` key
    },
    onSuccess: (data) => {
      console.log(data);
      // --- 2. Correctly parse the new response structure ---
      if (data && data.messages && data.messages.length > 0) {
        // The AI's latest reply is the last message in the array
        const lastMessage = data.messages[data.messages.length - 1];

        // Ensure the last message is from the AI and has content
        const isAIMessage = lastMessage.id.includes('AIMessage');
        const content = lastMessage.kwargs?.content;

        if (isAIMessage && content) {
          const botMessage: Message = {
            id: Date.now() + 1,
            text: content,
            sender: 'bot',
            timestamp: new Date().toISOString(),
          };
          // Add just the new bot message to the chat
          setMessages((prev) => [...prev, botMessage]);
        } else {
          console.error('Last message was not from the AI or had no content.');
        }
      } else {
        // Fallback if the response is empty or malformed
        const fallbackMessage: Message = {
          id: Date.now() + 1,
          text: 'Sorry, I received an empty response.',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendMessageMutation.isPending]);

  return (
    <div className="flex h-full w-full flex-col">
      <ScrollArea className="flex-grow">
        <div className="space-y-4 p-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}

          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* The form JSX remains the same */}
      <div className="border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4">
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
              <Input type="file" className="w-full" />
            </DialogContent>
          </Dialog>

          <Textarea
            placeholder="Type a message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button type="submit" size="icon" disabled={!message.trim() || sendMessageMutation?.isPending}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatLayout;
