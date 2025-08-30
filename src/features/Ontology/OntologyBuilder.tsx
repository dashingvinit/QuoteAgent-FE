import { useState } from 'react';
import { useGetOntology } from './hooks';
import { ComponentTypeList, ComponentTypeDetail, RelationshipTypeList, ErrorState, LoadingState } from './components';
import type { ComponentType } from './types';
import { useOrg } from '@/context/org-provider';

export const OntologyBuilder = () => {
  const { activeOrg } = useOrg();
  const { data: ontology, isLoading, isError, error } = useGetOntology(activeOrg?._id);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null);

  if (isLoading) return <LoadingState />;

  if (isError || !ontology) if (error) return <ErrorState error={error.message} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-1 space-y-6">
        <ComponentTypeList
          components={ontology.components}
          onSelect={setSelectedComponent}
          selectedId={selectedComponent?._id}
          organizationId={activeOrg?._id}
        />
        <RelationshipTypeList relationships={ontology.relationships} organizationId={activeOrg?._id} />
      </div>
      <div className="md:col-span-2">
        <ComponentTypeDetail componentType={selectedComponent} organizationId={activeOrg?._id} />
      </div>
    </div>
  );
};
