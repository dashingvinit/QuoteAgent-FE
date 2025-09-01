import React from 'react';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';

function UpdateVectors() {
  const { activeOrg } = useOrg();

  const handleUpdateVectors = async () => {
    try {
      const { data } = await Axios.put(`/components/vectors/${activeOrg?._id}`);
      console.log('Vectors updated successfully:', data);
    } catch (error) {
      console.error('Error updating vectors:', error);
    }
  };

  return (
    <div>
      <h1>Update Vectors</h1>
      <button onClick={handleUpdateVectors}>Update Vectors</button>
    </div>
  );
}

export default UpdateVectors;
