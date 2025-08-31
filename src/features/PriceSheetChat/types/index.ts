// Shared types for PriceSheetChat feature

export interface ComponentType {
  _id: string;
  name: string;
  orgId: string;
  attributes: AttributeType[];
  displayName?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AttributeType {
  id?: string;
  name?: string;
  label?: string;
  displayName?: string;
  type?: string;
  dataType?: string;
}

export interface SchemaField {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
}

export interface Schema {
  componentName: string;
  componentId: string;
  fields: SchemaField[];
}

export interface DisplayMessage {
  id: string;
  content: string | ToolCallContent[];
  type: 'HumanMessage' | 'AIMessage' | 'ToolMessage';
  tool_calls?: ToolCall[];
  kwargs?: {
    id?: string;
    content?: string;
    [key: string]: unknown;
  };
}

export interface ToolCall {
  name: string;
  args?: Record<string, unknown>;
}

export interface ToolCallContent {
  functionCall: {
    name: string;
    args?: Record<string, unknown>;
  };
}

export interface ApiMessage {
  kwargs: {
    id: string;
    content: string;
  };
  id: [unknown, unknown, string];
}

export interface ApiResponse {
  data: {
    messages: ApiMessage[];
    transformed_data?: Record<string, unknown>[];
  };
}

// Props interfaces
export interface InputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  file: File | null;
  isUploading: boolean;
  onFileSelect: () => void;
  onSendMessage: () => void;
  setSelectedComponent: (componentType: ComponentType | null) => void;
  componentTypes: ComponentType[];
}

export interface ProductGridProps {
  schema: SchemaField[] | null;
  data: Record<string, unknown>[];
  setProducts: (products: Record<string, unknown>[]) => void;
}

export interface ChatDisplayProps {
  messages: DisplayMessage[];
}