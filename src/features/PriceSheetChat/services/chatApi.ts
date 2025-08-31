import { Axios } from '@/services'; // Your pre-configured Axios instance
import type { AxiosResponse } from 'axios';
import type { ComponentType, Schema, ApiResponse } from '../types';

/**
 * Posts a chat message with an optional file to the server.
 * @param orgId - The ID of the organization.
 * @param message - The text message.
 * @param file - The file to upload, if any.
 * @param schema - The schema for the component type.
 * @param componentType - The component type object.
 * @returns The promise from the Axios post request.
 */
export const postChatMessage = (
  orgId: string,
  message: string,
  file: File | null,
  schema: Schema | null,
  componentType: ComponentType
): Promise<AxiosResponse<ApiResponse>> => {
  // Always use FormData for consistency
  const formData = new FormData();

  if (file) {
    formData.append('files', file);
  }

  formData.append('message', message);
  formData.append('msgType', 'HumanMessage');
  formData.append('schema', JSON.stringify(schema));
  formData.append('componentType', JSON.stringify(componentType));

  return Axios.post<ApiResponse>(`/components/chat/${orgId}`, formData);
};
