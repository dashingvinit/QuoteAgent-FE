import { createContext, useState, useContext, ReactNode } from 'react';
import { Axios } from '@/services';

interface Organization {
  _id: string;
  name: string;
  email: string;
  support_email: string;
  about: string;
  context: {
    key: string;
    value: string;
  };
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  organization: Organization | null;
  addMessage: (message: string) => void;
  updateContext: (key: string, value: string) => Promise<void>;
  uploadSheet: (file: File) => Promise<void>;
}

const TrainingContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function TrainingProvider({ children }: ChatProviderProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const updateContext = async (key: string, value: string): Promise<void> => {
    try {
      const res = await Axios.post(`/training/context/67642c3b315fd62aa89b9aff`, { key, value });
      console.log(res);
      setOrganization(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadSheet = async (file: File): Promise<void> => {
    try {
      console.log(file);
      const formData = new FormData();
      formData.append('files', file);
      const res = await Axios.post('/training/upload/67642c3b315fd62aa89b9aff', formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const value: ChatContextType = {
    messages,
    organization,
    addMessage,
    updateContext,
    uploadSheet,
  };

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
}

export const useTraining = (): ChatContextType => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a ChatProvider');
  }
  return context;
};
