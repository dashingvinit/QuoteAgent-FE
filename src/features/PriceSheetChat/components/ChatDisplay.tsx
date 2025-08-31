import { useEffect, useRef, memo } from 'react';
import { Wrench, MessageSquare, User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MarkdownView from '@/components/global/markdown-view';
import type { DisplayMessage, ToolCallContent, ChatDisplayProps } from '../types';

// Re-export for backward compatibility
export type { DisplayMessage };


const getMessageStyles = (type: DisplayMessage['type']) => {
  switch (type) {
    case 'HumanMessage':
      return {
        container: 'bg-primary text-primary-foreground',
        maxWidth: 'max-w-[85%] sm:max-w-2xl lg:max-w-3xl',
      };
    case 'ToolMessage':
      return {
        container: 'bg-muted text-muted-foreground',
        maxWidth: 'max-w-[95%] sm:max-w-4xl lg:max-w-5xl',
      };
    case 'AIMessage':
    default:
      return {
        container: 'bg-muted/50 text-foreground border border-border',
        maxWidth: 'max-w-[85%] sm:max-w-2xl lg:max-w-3xl',
      };
  }
};

const ChatDisplay = ({ messages }: ChatDisplayProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper function to truncate content if too long
  const truncateContent = (content: string, maxLength: number = 500) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Helper function to safely stringify objects
  const safeStringify = (obj: unknown): string => {
    try {
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'object' && obj !== null) {
        return JSON.stringify(obj, null, 2);
      }
      return String(obj);
    } catch {
      return '[Unable to display content]';
    }
  };

  // Enhanced avatar component
  const MessageAvatar = ({ type }: { type: DisplayMessage['type'] }) => {
    switch (type) {
      case 'HumanMessage':
        return (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              <User size={16} />
            </AvatarFallback>
          </Avatar>
        );
      case 'AIMessage':
        return (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
              <Bot size={16} />
            </AvatarFallback>
          </Avatar>
        );
      case 'ToolMessage':
        return (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-amber-500 text-white text-sm">
              <Wrench size={16} />
            </AvatarFallback>
          </Avatar>
        );
      default:
        return (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              <MessageSquare size={16} />
            </AvatarFallback>
          </Avatar>
        );
    }
  };

  // Centralized function to render the content of any message type
  const renderContent = (msg: DisplayMessage) => {
    const styles = getMessageStyles(msg.type);

    switch (msg.type) {
      case 'HumanMessage': {
        const humanContent = msg.kwargs?.content || msg.content;
        return (
          <div className="w-full flex justify-end">
            <div className="flex flex-row-reverse items-start gap-3 max-w-full">
              <MessageAvatar type={msg.type} />
              <div className={`${styles.container} ${styles.maxWidth} rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm`}>
                <MarkdownView>{String(humanContent)}</MarkdownView>
              </div>
            </div>
          </div>
        );
      }

      case 'AIMessage': {
        // Handle AI message with tool calls
        if (msg.tool_calls && msg.tool_calls.length > 0) {
          return (
            <div className="w-full flex justify-start">
              <div className="flex items-start gap-3 max-w-full">
                <MessageAvatar type={msg.type} />
                <div className={`${styles.maxWidth} space-y-3`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">AI Assistant</span>
                  </div>
                  <div className="space-y-2">
                    {msg.tool_calls.map((toolCall, index) => (
                      <div key={index} className="bg-muted/40 rounded-lg p-3 sm:p-4 border-l-4 border-primary/60">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="text-primary flex-shrink-0" size={16} />
                          <span className="font-mono text-sm font-medium text-foreground break-all">
                            {toolCall.name}
                          </span>
                        </div>
                        {toolCall.args && Object.keys(toolCall.args).length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Arguments:</span>
                            <pre className="mt-2 text-xs bg-background/50 p-2 rounded-sm overflow-x-auto border border-border">
                              {truncateContent(safeStringify(toolCall.args), 200)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Handle AI message that is in array format with function calls
        if (Array.isArray(msg.content) && msg.content.length > 0 && typeof msg.content[0] === 'object' && msg.content[0] !== null && 'functionCall' in msg.content[0] && msg.content[0].functionCall?.name) {
          const toolCallContent = msg.content as ToolCallContent[];
          return (
            <div className="w-full flex justify-start">
              <div className="flex items-start gap-3 max-w-full">
                <MessageAvatar type={msg.type} />
                <div className={`${styles.maxWidth} space-y-3`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">AI Assistant</span>
                  </div>
                  <div className="space-y-2">
                    {toolCallContent.map((item, index) => (
                      <div key={index} className="bg-muted/40 rounded-lg p-3 sm:p-4 border-l-4 border-primary/60">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="text-primary flex-shrink-0" size={16} />
                          <span className="font-mono text-sm font-medium text-foreground break-all">
                            {item.functionCall.name}
                          </span>
                        </div>
                        {item.functionCall.args && Object.keys(item.functionCall.args).length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Arguments:</span>
                            <pre className="mt-2 text-xs bg-background/50 p-2 rounded-sm overflow-x-auto border border-border">
                              {truncateContent(safeStringify(item.functionCall.args), 200)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Handle standard AI text message
        const aiContent = msg.kwargs?.content || msg.content;
        return (
          <div className="w-full flex justify-start">
            <div className="flex items-start gap-3 max-w-full">
              <MessageAvatar type={msg.type} />
              <div className={`${styles.container} ${styles.maxWidth} rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm`}>
                <MarkdownView>{String(aiContent)}</MarkdownView>
              </div>
            </div>
          </div>
        );
      }

      case 'ToolMessage': {
        const toolContent = msg.kwargs?.content || msg.content;
        let parsedContent: unknown;

        try {
          parsedContent = typeof toolContent === 'string' ? JSON.parse(toolContent) : toolContent;
        } catch {
          parsedContent = toolContent;
        }

        return (
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-2">
              <MessageAvatar type={msg.type} />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Tool Response</span>
            </div>
            <div
              className={`${styles.maxWidth} bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-3 sm:p-4 border-l-4 border-amber-400/60 dark:border-amber-500/40 w-full`}>
              {typeof parsedContent === 'object' && parsedContent !== null ? (
                <div className="space-y-3">
                  {(parsedContent as Record<string, unknown>).summary && (
                    <div className="text-sm">
                      <span className="font-medium text-amber-800 dark:text-amber-200">Summary:</span>
                      <span className="ml-2 text-foreground break-words">{String((parsedContent as Record<string, unknown>).summary)}</span>
                    </div>
                  )}
                  {(parsedContent as Record<string, unknown>).success !== undefined && (
                    <div className="text-sm">
                      <span className="font-medium text-amber-800 dark:text-amber-200">Status:</span>
                      <span
                        className={`ml-2 ${
                          (parsedContent as Record<string, unknown>).success ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                        }`}>
                        {(parsedContent as Record<string, unknown>).success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  )}
                  {(parsedContent as Record<string, unknown>).message && (
                    <div className="text-sm">
                      <span className="font-medium text-amber-800 dark:text-amber-200">Message:</span>
                      <span className="ml-2 text-foreground break-words">{String((parsedContent as Record<string, unknown>).message)}</span>
                    </div>
                  )}
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors">
                      View raw response
                    </summary>
                    <pre className="mt-2 text-xs bg-background/60 p-2 rounded-sm overflow-x-auto max-h-32 border border-border whitespace-pre-wrap break-words">
                      {truncateContent(safeStringify(parsedContent), 1000)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-sm text-amber-800 dark:text-amber-200 break-words">
                  {truncateContent(String(parsedContent), 300)}
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="w-full flex justify-center">
            <div className="flex items-center justify-center gap-2">
              <MessageAvatar type={msg.type} />
              <p className="italic text-muted-foreground">[Unsupported message content]</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-none">
      <div className="space-y-6 p-3 sm:p-4 lg:p-6">
        {messages.map((msg) => (
          <div key={msg.id} className="w-full">
            {renderContent(msg)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default memo(ChatDisplay);
