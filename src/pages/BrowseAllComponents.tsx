import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Plus } from 'lucide-react';

interface Component {
  _id: string;
  orgId: string;
  name: string;
  componentTypeName: string;
  attributes: {
    Name: string;
    Price: number;
    'Minimum Area': number;
    'Max Width Per Unit': number;
    'Max Height Per Unit': number;
    'Product Category': string;
    'Sub Category': string;
    'Phrase Tags': string;
  };
  processedForKG: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

function BrowseAllComponents() {
  const { activeOrg } = useOrg();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Component | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const getAllComponents = async () => {
    const { data } = await Axios.get(`/components/${activeOrg?._id}`);
    return data.data;
  };

  const updateComponent = async ({ id, updatedComponent }: { id: string; updatedComponent: Component }) => {
    // Dummy function - you will replace this with actual API call
    console.log('Updating component:', id, updatedComponent);
    const { data } = await Axios.put(`/components/${id}`, updatedComponent);
    return data;
  };

  const {
    data: components,
    isLoading,
    error,
  } = useQuery<Component[]>({
    queryKey: ['components', activeOrg?._id],
    queryFn: getAllComponents,
    enabled: !!activeOrg?._id,
  });

  const updateMutation = useMutation({
    mutationFn: updateComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components', activeOrg?._id] });
      setEditingId(null);
      setEditingData(null);
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });

  const handleEdit = (component: Component) => {
    setEditingId(component._id);
    setEditingData({ ...component });
  };

  const handleSave = () => {
    if (editingData) {
      updateMutation.mutate({ id: editingData._id, updatedComponent: editingData });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleAttributeChange = (key: string, value: string | number) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        attributes: {
          ...editingData.attributes,
          [key]: value,
        },
      });
    }
  };

  const handleAddComponent = () => {
    navigate('/components/upload');
  };

  // Filter and search logic
  const filteredComponents =
    components?.filter((component) => {
      const matchesSearch =
        component.attributes.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.componentTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.attributes['Product Category'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.attributes['Phrase Tags'].toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilters.length === 0 ||
        categoryFilters.includes(component.attributes['Product Category']) ||
        categoryFilters.includes(component.attributes['Sub Category']);

      return matchesSearch && matchesCategory;
    }) || [];

  // Get unique categories for filter options
  const uniqueCategories = [
    ...new Set(
      components?.flatMap((c) => [c.attributes['Product Category'], c.attributes['Sub Category']]).filter(Boolean) || []
    ),
  ];

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  const clearFilters = () => {
    setCategoryFilters([]);
    setStatusFilter('All');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading components...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-destructive text-lg">Error loading components: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Title and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">All Components</h1>
          <Button onClick={handleAddComponent} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Component
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search for a component..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
            <Badge variant="secondary" className="text-sm font-medium">
              {filteredComponents.length} components
            </Badge>
          </div>

          {/* Right side - Filters */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Status: All</SelectItem>
                <SelectItem value="Active">Status: Active</SelectItem>
                <SelectItem value="Inactive">Status: Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter Dropdown */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                  {categoryFilters.length > 0 && (
                    <Badge variant="default" className="ml-1 text-xs">
                      {categoryFilters.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filter by Category</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      Clear all
                    </Button>
                  </div>

                  <ScrollArea className="h-60">
                    <div className="space-y-2 pr-4">
                      {uniqueCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={categoryFilters.includes(category)}
                            onChange={() => toggleCategoryFilter(category)}
                            className="rounded border-input"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 p-6 pt-4 overflow-hidden">
        <Card className="h-full flex flex-col overflow-hidden">
          {/* Table Header - Fixed */}
          <div className="flex-shrink-0 border-b">
            <div className="min-w-[1200px] bg-muted/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Name</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="w-[100px]">Price</TableHead>
                    <TableHead className="w-[100px]">Min Area</TableHead>
                    <TableHead className="w-[110px]">Max Width</TableHead>
                    <TableHead className="w-[110px]">Max Height</TableHead>
                    <TableHead className="w-[130px]">Category</TableHead>
                    <TableHead className="w-[130px]">Sub Category</TableHead>
                    <TableHead className="w-[160px]">Tags</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
          </div>

          {/* Scrollable Table Body */}
          <ScrollArea className="flex-1">
            <div className="min-w-[1200px]">
              <Table>
                <TableBody>
                  {filteredComponents?.map((component) => (
                    <TableRow key={component._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium w-[140px]">
                        {editingId === component._id ? (
                          <Input
                            type="text"
                            value={editingData?.attributes.Name || ''}
                            onChange={(e) => handleAttributeChange('Name', e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          component.attributes.Name
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground w-[120px]">
                        {component.componentTypeName}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        {editingId === component._id ? (
                          <Input
                            type="number"
                            value={editingData?.attributes.Price || 0}
                            onChange={(e) => handleAttributeChange('Price', parseFloat(e.target.value))}
                            step="0.01"
                            className="h-8 text-sm"
                          />
                        ) : (
                          <span className="font-medium">${component.attributes.Price}</span>
                        )}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        {editingId === component._id ? (
                          <Input
                            type="number"
                            value={editingData?.attributes['Minimum Area'] || 0}
                            onChange={(e) => handleAttributeChange('Minimum Area', parseFloat(e.target.value))}
                            step="0.1"
                            className="h-8 text-sm"
                          />
                        ) : (
                          component.attributes['Minimum Area']
                        )}
                      </TableCell>
                      <TableCell className="w-[110px]">
                        {editingId === component._id ? (
                          <Input
                            type="number"
                            value={editingData?.attributes['Max Width Per Unit'] || 0}
                            onChange={(e) => handleAttributeChange('Max Width Per Unit', parseFloat(e.target.value))}
                            className="h-8 text-sm"
                          />
                        ) : (
                          component.attributes['Max Width Per Unit']
                        )}
                      </TableCell>
                      <TableCell className="w-[110px]">
                        {editingId === component._id ? (
                          <Input
                            type="number"
                            value={editingData?.attributes['Max Height Per Unit'] || 0}
                            onChange={(e) => handleAttributeChange('Max Height Per Unit', parseFloat(e.target.value))}
                            className="h-8 text-sm"
                          />
                        ) : (
                          component.attributes['Max Height Per Unit']
                        )}
                      </TableCell>
                      <TableCell className="w-[130px]">
                        {editingId === component._id ? (
                          <Input
                            type="text"
                            value={editingData?.attributes['Product Category'] || ''}
                            onChange={(e) => handleAttributeChange('Product Category', e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            {component.attributes['Product Category']}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="w-[130px]">
                        {editingId === component._id ? (
                          <Input
                            type="text"
                            value={editingData?.attributes['Sub Category'] || ''}
                            onChange={(e) => handleAttributeChange('Sub Category', e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {component.attributes['Sub Category']}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="w-[160px]">
                        {editingId === component._id ? (
                          <Input
                            type="text"
                            value={editingData?.attributes['Phrase Tags'] || ''}
                            onChange={(e) => handleAttributeChange('Phrase Tags', e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {component.attributes['Phrase Tags'].split(',').map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[140px]">
                        {editingId === component._id ? (
                          <div className="flex gap-1">
                            <Button
                              onClick={handleSave}
                              disabled={updateMutation.isPending}
                              size="sm"
                              className="h-8 px-3 text-xs">
                              {updateMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                            <Button onClick={handleCancel} variant="outline" size="sm" className="h-8 px-3 text-xs">
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleEdit(component)}
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs">
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </Card>

        {/* Empty States */}
        {(!filteredComponents || filteredComponents.length === 0) && components && components.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-2">No components match your search criteria.</div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}>
              Clear filters
            </Button>
          </div>
        )}

        {(!components || components.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">No components found for this organization.</div>
            <Button onClick={handleAddComponent} className="gap-2">
              <Plus className="w-4 h-4" />
              Add your first component
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseAllComponents;
