import { useState, useRef } from 'react';
import { useOrg } from '@/context/org-provider';
import { postChatMessage } from '../services/chatApi';
import type { 
  ComponentType,
  SchemaField,
  Schema,
  ApiMessage,
  ApiResponse,
  DisplayMessage
} from '../types';

const transformApiMessages = (apiMessages: ApiMessage[]): DisplayMessage[] => {
  if (!apiMessages) return [];
  return apiMessages.map((msg) => ({
    id: msg.kwargs.id,
    content: msg.kwargs.content,
    type: msg.id[2] as DisplayMessage['type'],
  }));
};

export const useChat = () => {
  const { activeOrg } = useOrg();
  const [message, setMessage] = useState<string>('');
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<DisplayMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to convert component type to schema format
  const convertComponentTypeToSchema = (componentType: ComponentType): Schema | null => {
    if (!componentType) return null;
    
    // Convert attributes to schema fields
    const fields: SchemaField[] = componentType?.attributes?.map((attr) => ({
      fieldId: attr.id || attr.name || `field_${Date.now()}`,
      fieldLabel: attr.label || attr.displayName || attr.name || 'Unnamed Field',
      fieldType: attr.type || attr.dataType || 'string',
    })) || [];

    // If no attributes exist, create a basic schema structure
    if (fields.length === 0) {
      fields.push(
        {
          fieldId: 'id',
          fieldLabel: 'ID',
          fieldType: 'string',
        },
        {
          fieldId: 'name',
          fieldLabel: 'Name',
          fieldType: 'string',
        }
      );
    }

    return {
      componentName: componentType.name,
      componentId: componentType._id,
      fields,
    };
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!message.trim() && !file) return;

    const userMsg: DisplayMessage = { id: `user-${Date.now()}`, content: message, type: 'HumanMessage' };
    setChatMessages((prev) => [...prev, userMsg]);

    // Store the message and file before clearing state
    const currentMessage = message;
    const currentFile = file;
    setMessage('');
    setFile(null);

    try {
      if (!selectedComponentType) {
        throw new Error('No component type selected. Please select a component type to proceed');
      }
      
      if (!activeOrg) {
        throw new Error('No active organization found');
      }
      
      // Convert component type to schema format
      const schema = convertComponentTypeToSchema(selectedComponentType);
      
      setIsUploading(true);
      // Use the dedicated service for the API call, passing both schema and component type
      const { data }: { data: ApiResponse } = await postChatMessage(activeOrg._id, currentMessage, currentFile, schema, selectedComponentType);

      if (data?.data) {
        console.log({ data });
        setChatMessages(transformApiMessages(data.data.messages));
        setProducts(data.data.transformed_data || []);
      }
    } catch (error: unknown) {
      console.error('Failed to send message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred.';
      const errorMsg: DisplayMessage = {
        id: `error-${Date.now()}`,
        content: errorMessage,
        type: 'AIMessage',
      };
      setChatMessages((prev) => [...prev.filter((m) => m.id !== userMsg.id), errorMsg]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  // Compute schema for ProductGrid from selectedComponentType
  const schema: SchemaField[] | null = selectedComponentType ? convertComponentTypeToSchema(selectedComponentType)?.fields || null : null;

  // Return everything the UI component needs
  return {
    message,
    setMessage,
    selectedComponentType,
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
  };
};
