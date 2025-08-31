import { memo } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InputArea, ProductGrid, ChatDisplay } from '@/features/PriceSheetChat/components';
import { useChat } from '@/features/PriceSheetChat/hooks/useChat';
import { useOrg } from '@/context/org-provider';
import { useGetOntology } from '@/features/Ontology/hooks';

const ChatLayout = () => {
  const { activeOrg } = useOrg();
  const { data: ontology } = useGetOntology(activeOrg?._id);
  const {
    message,
    setMessage,
    setSelectedComponentType,
    schema,
    file,
    products,
    setProducts,
    isUploading,
    chatMessages,
    fileInputRef,
    handleSendMessage,
    handleFileSelect,
    handleFileChange,
  } = useChat();

  return (
    <div className="flex h-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel className="min-w-0">
          <div className="flex flex-col h-full overflow-hidden">
            <ScrollArea className="px-2 space-y-2 h-full overflow-hidden">
              <div className="overflow-hidden">
                <ChatDisplay messages={chatMessages} />
              </div>
            </ScrollArea>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div className="flex-shrink-0 overflow-hidden">
              <InputArea
                message={message}
                setMessage={setMessage}
                file={file}
                isUploading={isUploading}
                onFileSelect={handleFileSelect}
                onSendMessage={handleSendMessage}
                setSelectedComponent={setSelectedComponentType}
                componentTypes={ontology?.components}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="min-w-0">
          <div className="h-full overflow-hidden">
            <ProductGrid schema={schema} data={products} setProducts={setProducts} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default memo(ChatLayout);
