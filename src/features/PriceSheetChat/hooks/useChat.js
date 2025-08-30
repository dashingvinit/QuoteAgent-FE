import { useState, useRef } from 'react';
import { useOrg } from '@/context/org-provider';
import { postChatMessage } from '../services/chatApi';

const transformApiMessages = (apiMessages) => {
  if (!apiMessages) return [];
  return apiMessages.map((msg) => ({
    id: msg.kwargs.id,
    content: msg.kwargs.content,
    type: msg.id[2],
  }));
};

export const useChat = () => {
  const { activeOrg } = useOrg();
  const [message, setMessage] = useState('');
  const [schema, setSchema] = useState('');
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;

    const userMsg = { id: `user-${Date.now()}`, content: message, type: 'HumanMessage' };
    setChatMessages((prev) => [...prev, userMsg]);
    
    // Store the message and file before clearing state
    const currentMessage = message;
    const currentFile = file;
    setMessage('');
    setFile(null);

    try {
      if (!schema) {
        throw new Error('No schema selected. Please select a schema to proceed');
      }
      setIsUploading(true);
      // Use the dedicated service for the API call
      const { data } = await postChatMessage(activeOrg._id, currentMessage, currentFile, schema);

      if (data?.data) {
        console.log({ data });
        setChatMessages(transformApiMessages(data.data.messages));
        setProducts(data.data.transformed_data || []);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg = {
        id: `error-${Date.now()}`,
        content: `An error occurred. ${error.message}.`,
        type: 'AIMessage',
      };
      setChatMessages((prev) => [...prev.filter((m) => m.id !== userMsg.id), errorMsg]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  // Return everything the UI component needs
  return {
    message,
    setMessage,
    schema,
    setSchema,
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
