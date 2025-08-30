import React, { useState } from 'react';
import { useAddRelationshipType } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RelationshipType } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RelationshipTypeListProps {
  relationships: RelationshipType[];
  organizationId: string;
}

export const RelationshipTypeList: React.FC<RelationshipTypeListProps> = ({ relationships, organizationId }) => {
  const [newRelName, setNewRelName] = useState('');
  const addRelationshipMutation = useAddRelationshipType(organizationId);

  const handleAdd = () => {
    if (!newRelName.trim()) return;
    addRelationshipMutation.mutate({ name: newRelName }, { onSuccess: () => setNewRelName('') });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationship Types</CardTitle>
        <CardDescription>The "verbs" that connect your components.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          {relationships?.length > 0 ? (
            <ul className="space-y-2">
              {relationships.map((rt) => (
                <li key={rt._id} className="p-2 bg-gray-50 rounded-md border border-gray-100">
                  <div className="font-medium text-gray-800">{rt.name}</div>
                  {rt.description && <div className="text-sm text-gray-500 mt-1">{rt.description}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No relationship types yet</p>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Input
          placeholder="New relationship name..."
          value={newRelName}
          onChange={(e) => setNewRelName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={addRelationshipMutation.isPending || !newRelName.trim()}>
          {addRelationshipMutation.isPending ? 'Adding...' : 'Add'}
        </Button>
      </CardFooter>
      {addRelationshipMutation.isError && (
        <div className="p-4 border-t">
          <p className="text-sm text-red-600">{addRelationshipMutation.error.message}</p>
        </div>
      )}
    </Card>
  );
};
