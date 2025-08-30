import { Axios } from '@/services'; // Your pre-configured Axios instance

/**
 * Posts a chat message with an optional file to the server.
 * @param {string} orgId - The ID of the organization.
 * @param {string} message - The text message.
 * @param {File | null} file - The file to upload, if any.
 * @returns {Promise} The promise from the Axios post request.
 */
export const postChatMessage = (orgId, message, file, schema) => {
  // Always use FormData for consistency
  const formData = new FormData();

  if (file) {
    formData.append('files', file);
  }

  formData.append('message', message);
  formData.append('msgType', 'HumanMessage');
  formData.append('schema', JSON.stringify(schema));

  return Axios.post(`/components/chat/${orgId}`, formData);
};
