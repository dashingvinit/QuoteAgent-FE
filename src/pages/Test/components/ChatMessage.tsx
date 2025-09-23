import { memo } from 'react';
import Markdown from '@/components/global/markdown-view'; // Assuming this is the correct path

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type?: 'text' | 'function_call' | 'tool_call' | 'tool_response';
}

interface ChatMessageProps {
  msg: Message;
}

const ChatMessage = memo(({ msg }: ChatMessageProps) => {
  const isUser = msg.sender === 'user';

  // Determine alignment and styling based on the sender and message type
  const alignment = isUser ? 'justify-end' : 'justify-start';

  // Enhanced styling based on message type
  let bubbleStyles = isUser ? 'bg-primary text-primary-foreground' : 'bg-muted';
  let borderStyle = '';

  if (!isUser && msg.type) {
    switch (msg.type) {
      case 'function_call':
        bubbleStyles = 'bg-blue-50 border-blue-200 text-blue-900';
        borderStyle = 'border-l-4 border-blue-400';
        break;
      case 'tool_call':
        bubbleStyles = 'bg-purple-50 border-purple-200 text-purple-900';
        borderStyle = 'border-l-4 border-purple-400';
        break;
      case 'tool_response':
        bubbleStyles = 'bg-green-50 border-green-200 text-green-900';
        borderStyle = 'border-l-4 border-green-400';
        break;
      default:
        bubbleStyles = 'bg-muted';
    }
  }

  // Check if the message starts with function/tool call markers
  const isFunctionCall = msg.text.startsWith('**Function Call:') || msg.text.startsWith('**Tool Call:');

  if (isFunctionCall && !isUser) {
    bubbleStyles = 'bg-amber-50 border-amber-200 text-amber-900';
    borderStyle = 'border-l-4 border-amber-400';
  }

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${bubbleStyles} ${borderStyle}`}>
        <Markdown>{msg.text}</Markdown>
        <div className="mt-1 text-xs opacity-70">
          {new Date(msg.timestamp).toLocaleTimeString()}
          {!isUser && msg.type && (
            <span className="ml-2 text-xs opacity-50">
              • {msg.type.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
