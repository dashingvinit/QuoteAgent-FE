import { Axios } from '@/services';
import type { Ontology, NewComponentType, NewRelationshipType, NewAttribute, Attribute } from '../types';

export const ontologyApi = {
  getOntology: async (organizationId: string): Promise<Ontology> => {
    const { data } = await Axios.get(`/ontology/${organizationId}`);
    return data?.data;
  },

  createComponentType: async (organizationId: string, componentData: NewComponentType) => {
    const { data } = await Axios.post(`/ontology/components/${organizationId}`, componentData);
    return data?.data;
  },

  createRelationshipType: async (organizationId: string, relationData: NewRelationshipType) => {
    const { data } = await Axios.post(`/ontology/relationships/${organizationId}`, relationData);
    return data?.data;
  },

  updateComponentType: async (
    organizationId: string,
    componentTypeId: string,
    updates: { name?: string; description?: string; attributes?: Attribute[] }
  ) => {
    const { data } = await Axios.put(`/ontology/components/${organizationId}/${componentTypeId}`, updates);
    return data?.data;
  },

  addAttributeToComponentType: async (organizationId: string, componentTypeId: string, attribute: NewAttribute) => {
    const { data } = await Axios.post(
      `/ontology/components/${organizationId}/${componentTypeId}/attributes`,
      attribute
    );
    return data?.data;
  },

  deleteAttributeFromComponentType: async (organizationId: string, componentTypeId: string, attributeId: string) => {
    const { data } = await Axios.delete(
      `/ontology/components/${organizationId}/${componentTypeId}/attributes/${attributeId}`
    );
    return data?.data;
  },
};
