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
interface FunctionCall {
  name: string;
  args: {
    input: string;
  };
}

interface ToolCall {
  name: string;
  args: {
    input: string;
  };
  type: string;
}

interface MessageContent {
  functionCall?: FunctionCall;
}

interface LangChainMessage {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: string | MessageContent[];
    tool_calls?: ToolCall[];
    additional_kwargs?: any;
    usage_metadata?: any;
    invalid_tool_calls?: any[];
    response_metadata?: any;
    id: string;
  };
}

interface BackendResponse extends Array<LangChainMessage> {}

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
      if (data && Array.isArray(data) && data.length > 0) {
        // Parse all messages in the response
        const newMessages: Message[] = [];

        data.forEach((message, index) => {
          const isAIMessage = message.id.includes('AIMessage');
          const isToolMessage = message.id.includes('ToolMessage');

          if (isAIMessage) {
            const content = message.kwargs?.content;

            if (typeof content === 'string') {
              // Simple text response
              newMessages.push({
                id: Date.now() + index,
                text: content,
                sender: 'bot',
                timestamp: new Date().toISOString(),
                type: 'text',
              });
            } else if (Array.isArray(content) && content.length > 0) {
              // Complex content with function calls
              content.forEach((item, itemIndex) => {
                if (item.functionCall) {
                  const functionCall = item.functionCall;
                  newMessages.push({
                    id: Date.now() + index + itemIndex,
                    text: `**Function Call: ${functionCall.name}**\n\n${functionCall.args.input}`,
                    sender: 'bot',
                    timestamp: new Date().toISOString(),
                    type: 'function_call',
                  });
                }
              });
            }

            // Handle tool calls if present
            if (message.kwargs.tool_calls && message.kwargs.tool_calls.length > 0) {
              message.kwargs.tool_calls.forEach((toolCall, toolIndex) => {
                newMessages.push({
                  id: Date.now() + index + toolIndex + 1000,
                  text: `**Tool Call: ${toolCall.name}**\n\n${toolCall.args.input}`,
                  sender: 'bot',
                  timestamp: new Date().toISOString(),
                  type: 'tool_call',
                });
              });
            }
          } else if (isToolMessage) {
            // Handle tool message responses
            const content = message.kwargs?.content;
            if (content) {
              // Parse the content which might be a JSON string
              try {
                const parsedContent = JSON.parse(content);
                newMessages.push({
                  id: Date.now() + index + 2000,
                  text: typeof parsedContent === 'string' ? parsedContent : JSON.stringify(parsedContent, null, 2),
                  sender: 'bot',
                  timestamp: new Date().toISOString(),
                  type: 'tool_response',
                });
              } catch {
                // If parsing fails, use content as is
                newMessages.push({
                  id: Date.now() + index + 2000,
                  text: content,
                  sender: 'bot',
                  timestamp: new Date().toISOString(),
                  type: 'tool_response',
                });
              }
            }
          }
        });

        if (newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
        } else {
          // Fallback if no parseable content found
          const fallbackMessage: Message = {
            id: Date.now() + 1,
            text: 'I received your message but couldn\'t generate a proper response.',
            sender: 'bot',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, fallbackMessage]);
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

      // Add an error message to the chat
      const errorMessage: Message = {
        id: Date.now(),
        text: '❌ **Error**: Failed to send message. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMessage]);
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
