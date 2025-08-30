import { useEffect, useRef, memo } from 'react';
import { Wrench } from 'lucide-react';
import MarkdownView from '@/components/global/markdown-view';

// The interface remains the same
export interface DisplayMessage {
  id: string;
  content: string | any[];
  type: 'HumanMessage' | 'AIMessage' | 'ToolMessage';
}

interface ChatDisplayProps {
  messages: DisplayMessage[];
}

const getAlignment = (type: DisplayMessage['type']) => {
  switch (type) {
    case 'HumanMessage':
      return 'justify-end';
    case 'ToolMessage':
      return 'justify-center';
    case 'AIMessage':
    default:
      return 'justify-start';
  }
};

const getStyle = (type: DisplayMessage['type']) => {
  switch (type) {
    case 'HumanMessage':
      return 'bg-blue-500 text-white';
    case 'ToolMessage':
      return 'bg-gray-100 text-gray-600';
    case 'AIMessage':
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const ChatDisplay = ({ messages }: ChatDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Centralized function to render the content of any message type
  const renderContent = (msg: DisplayMessage) => {
    switch (msg.type) {
      case 'HumanMessage':
        return <MarkdownView>{String(msg.content)}</MarkdownView>;

      case 'AIMessage':
        // Handle AI message that is a tool call
        if (Array.isArray(msg.content) && msg.content[0]?.functionCall?.name) {
          const toolName = msg.content[0].functionCall.name;
          return (
            <div className="flex items-center gap-2">
              <Wrench className="text-gray-500" size={16} />
              <span className="font-mono text-sm">Calling tool: {toolName}</span>
            </div>
          );
        }
        // Handle a standard string AI message
        return <MarkdownView>{String(msg.content)}</MarkdownView>;

      case 'ToolMessage':
        return (
          <div className="flex items-center gap-2">
            <Wrench className="text-green-500 flex-shrink-0" size={16} />
            {/* <MarkdownView>{String(msg.content)}</MarkdownView> */}
          </div>
        );

      default:
        return <p className="italic">[Unsupported message content]</p>;
    }
  };

  return (
    <div className="space-y-4 p-2">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${getAlignment(msg.type)}`}>
          <div className={`max-w-xl rounded-lg px-4 py-2 shadow-sm ${getStyle(msg.type)}`}>{renderContent(msg)}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(ChatDisplay);
