import { memo } from 'react';
import Markdown from '@/components/global/markdown-view'; // Assuming this is the correct path

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatMessageProps {
  msg: Message;
}

const ChatMessage = memo(({ msg }: ChatMessageProps) => {
  const isUser = msg.sender === 'user';

  // Determine alignment and styling based on the sender
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleStyles = isUser ? 'bg-primary text-primary-foreground' : 'bg-muted';

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${bubbleStyles}`}>
        <Markdown>{msg.text}</Markdown>
        <div className="mt-1 text-xs opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
});

export default ChatMessage;
