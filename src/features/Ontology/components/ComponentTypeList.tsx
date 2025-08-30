import React, { useState } from 'react';
import { useAddComponentType } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ComponentType } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ComponentTypeListProps {
  components: ComponentType[];
  onSelect: (componentType: ComponentType) => void;
  selectedId?: string;
  organizationId: string;
}

export const ComponentTypeList: React.FC<ComponentTypeListProps> = ({
  components,
  onSelect,
  selectedId,
  organizationId,
}) => {
  const [newTypeName, setNewTypeName] = useState('');
  const addComponentMutation = useAddComponentType(organizationId);

  const handleAdd = () => {
    if (!newTypeName.trim()) return;
    addComponentMutation.mutate({ name: newTypeName }, { onSuccess: () => setNewTypeName('') });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Types</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          {components?.map((ct) => (
            <button
              key={ct._id}
              onClick={() => onSelect(ct)}
              className={`w-full text-left p-2 rounded-md hover:bg-muted transition-colors ${
                selectedId === ct._id ? 'bg-muted' : ''
              }`}>
              <div className="font-medium">{ct.name}</div>
              {ct.description && <div className="text-sm text-muted-primary mt-1">{ct.description}</div>}
              <div className="text-xs text-gray-400 mt-1">
                {ct.attributes.length} attribute{ct.attributes.length !== 1 ? 's' : ''}
              </div>
            </button>
          ))}
          {components?.length === 0 && <p className="text-gray-500 text-center py-4">No component types yet</p>}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Input
          placeholder="New type name..."
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} className="w-full" disabled={addComponentMutation.isPending || !newTypeName.trim()}>
          {addComponentMutation.isPending ? 'Adding...' : 'Add New Type'}
        </Button>
      </CardFooter>
    </Card>
  );
};
