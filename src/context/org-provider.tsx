import { createContext, useState, useContext, ReactNode } from 'react';

interface Organization {
  _id: string;
  name: string;
  email: string;
  support_email?: string;
  about?: string;
  website?: string;
  preferred_currency?: string;
  createdAt?: string;
}

interface Message {
  id: number;
  content: string;
  timestamp: string;
}

interface OrgContextType {
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => void;
  messages: Message[];
  setMessages: (message: Message[]) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [messages, setMessages] = useState<Message[] | null>([]);

  const value: OrgContextType = {
    activeOrg,
    setActiveOrg,
    messages,
    setMessages,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrg = (): OrgContextType => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useTraining must be used within a ChatProvider');
  }
  return context;
};
