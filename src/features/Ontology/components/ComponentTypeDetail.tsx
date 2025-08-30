import React, { useState, useEffect } from 'react';
import { useUpdateComponentType } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import type { ComponentType, NewAttribute, Attribute } from '../types';

interface ComponentTypeDetailProps {
  componentType: ComponentType | null;
  organizationId: string;
}

export const ComponentTypeDetail: React.FC<ComponentTypeDetailProps> = ({ componentType, organizationId }) => {
  const [editedData, setEditedData] = useState({ name: '', description: '', attributes: [] as Attribute[] });
  const [newAttribute, setNewAttribute] = useState<NewAttribute>({ name: '', dataType: 'String', unit: '' });
  const [isEditing, setIsEditing] = useState(false);
  const updateComponentMutation = useUpdateComponentType(organizationId);

  useEffect(() => {
    if (componentType) {
      setEditedData({
        name: componentType.name || '',
        description: componentType.description || '',
        attributes: componentType.attributes ? [...componentType.attributes] : [],
      });
      setIsEditing(false);
    } else {
      setEditedData({ name: '', description: '', attributes: [] });
    }
  }, [componentType]);

  if (!componentType) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-full text-gray-500">
          <p>Select a Component Type to view its details.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAddAttribute = () => {
    const trimmedName = newAttribute.name.trim();
    if (!trimmedName) return;
    const newAttr: Attribute = {
      name: trimmedName,
      dataType: newAttribute.dataType,
      unit: newAttribute.unit.trim() || undefined,
    };
    setEditedData((prev) => ({ ...prev, attributes: [...prev.attributes, newAttr] }));
    setNewAttribute({ name: '', dataType: 'String', unit: '' });
  };

  const handleDeleteAttribute = (index: number) => {
    setEditedData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleSaveChanges = () => {
    if (!componentType || !editedData.name.trim()) return;
    updateComponentMutation.mutate(
      {
        componentTypeId: componentType._id,
        updates: {
          name: editedData.name.trim(),
          description: editedData.description.trim() || undefined,
          attributes: editedData.attributes,
        },
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancelEdit = () => {
    if (componentType) {
      setEditedData({
        name: componentType.name || '',
        description: componentType.description || '',
        attributes: componentType.attributes ? [...componentType.attributes] : [],
      });
    }
    setIsEditing(false);
    setNewAttribute({ name: '', dataType: 'String', unit: '' });
  };

  const displayData = isEditing ? editedData : componentType;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editedData.name}
                  onChange={(e) => setEditedData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Component name"
                  className="font-semibold text-lg"
                />
                <Input
                  value={editedData.description}
                  onChange={(e) => setEditedData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Component description"
                  className="text-sm text-muted-foreground"
                />
              </div>
            ) : (
              <>
                <CardTitle>{displayData.name}</CardTitle>
                <CardDescription>{displayData.description || 'No description'}</CardDescription>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveChanges}
                  disabled={updateComponentMutation.isPending || !editedData.name.trim()}
                  size="sm">
                  {updateComponentMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="sm"
                  disabled={updateComponentMutation.isPending}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                Edit
              </Button>
            )}
          </div>
        </div>
        {updateComponentMutation.isError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{updateComponentMutation.error.message}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <h4 className="font-medium text-muted-primary mb-4">Attributes</h4>
        {displayData.attributes?.length === 0 && !isEditing ? (
          <p className="text-gray-500 text-sm py-4">No attributes defined</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attribute Name</TableHead>
                <TableHead>Data Type</TableHead>
                <TableHead>Unit</TableHead>
                {isEditing && (
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.attributes?.map((attr, index) => (
                <TableRow key={attr._id || `temp-${index}`}>
                  <TableCell>{attr.name}</TableCell>
                  <TableCell>{attr.dataType}</TableCell>
                  <TableCell>{attr.unit || 'N/A'}</TableCell>
                  {isEditing && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1 h-auto hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteAttribute(index)}>
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {isEditing && (
                <TableRow>
                  <TableCell>
                    <Input
                      placeholder="e.g., color"
                      value={newAttribute.name}
                      onChange={(e) => setNewAttribute((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={newAttribute.dataType}
                      onValueChange={(value) =>
                        setNewAttribute((prev) => ({
                          ...prev,
                          dataType: value as 'String' | 'Number' | 'Boolean' | 'Date',
                        }))
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="Date">Date</SelectItem>
                        <SelectItem value="Date">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="e.g., mm, kg"
                      value={newAttribute.unit}
                      onChange={(e) => setNewAttribute((prev) => ({ ...prev, unit: e.target.value }))}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={handleAddAttribute} size="sm" disabled={!newAttribute.name.trim()}>
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
