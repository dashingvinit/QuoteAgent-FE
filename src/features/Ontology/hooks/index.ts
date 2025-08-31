import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ontologyApi } from '../services/api';
import type {
  Ontology,
  NewComponentType,
  NewRelationshipType,
  ComponentType,
  Attribute,
  RelationshipType,
} from '../types';

interface UpdateComponentTypeVars {
  componentTypeId: string;
  updates: {
    name?: string;
    description?: string;
    attributes?: Attribute[];
  };
}

const ontologyQueryKey = (organizationId: string) => ['ontology', organizationId];

export const useGetOntology = (organizationId: string) => {
  return useQuery<Ontology, Error>({
    queryKey: ontologyQueryKey(organizationId),
    queryFn: () => ontologyApi.getOntology(organizationId),
    enabled: !!organizationId,
  });
};

export const useAddComponentType = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ComponentType, Error, NewComponentType>({
    mutationFn: (newComponent) => ontologyApi.createComponentType(organizationId, newComponent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ontologyQueryKey(organizationId) });
    },
  });
};

export const useUpdateComponentType = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ComponentType, Error, UpdateComponentTypeVars>({
    mutationFn: ({ componentTypeId, updates }) =>
      ontologyApi.updateComponentType(organizationId, componentTypeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ontologyQueryKey(organizationId) });
    },
  });
};

export const useAddRelationshipType = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<RelationshipType, Error, NewRelationshipType>({
    mutationFn: (newRelationship) => ontologyApi.createRelationshipType(organizationId, newRelationship),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ontologyQueryKey(organizationId) });
    },
  });
};
