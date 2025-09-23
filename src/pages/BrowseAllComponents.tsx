import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';
import { GridColumn, GridCellKind } from '@glideapps/glide-data-grid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Plus } from 'lucide-react';
import { DataGridWrapper2 } from '@/features/Datagrid/DataGridWrapper2';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const getAllComponents = async () => {
    const { data } = await Axios.get(`/components/${activeOrg?._id}`);
    return data.data;
  };

  const updateComponent = async ({ id, updatedComponent }: { id: string; updatedComponent: Component }) => {
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
    },
    onError: (error) => {
      console.error('Update failed:', error);
    },
  });

  const handleCellEdit = (rowIndex: number, columnIndex: number, newValue: any) => {
    const component = filteredComponents[rowIndex];
    if (!component) return;

    const columnFields = [
      'Name',
      'componentTypeName',
      'Price',
      'Minimum Area',
      'Max Width Per Unit',
      'Max Height Per Unit',
      'Product Category',
      'Sub Category',
      'Phrase Tags',
    ];
    const field = columnFields[columnIndex];

    if (field) {
      let processedValue = newValue.data;

      // Convert to appropriate type based on field
      if (
        field === 'Price' ||
        field === 'Minimum Area' ||
        field === 'Max Width Per Unit' ||
        field === 'Max Height Per Unit'
      ) {
        processedValue = parseFloat(processedValue) || 0;
      }

      // Create updated component with the new value
      const updatedComponent = {
        ...component,
        ...(field === 'componentTypeName' ? { componentTypeName: processedValue } : {}),
        attributes: {
          ...component.attributes,
          ...(field !== 'componentTypeName' ? { [field]: processedValue } : {}),
        },
      };

      updateMutation.mutate({
        id: component._id,
        updatedComponent,
      });
    }
  };

  const handleAddComponent = () => {
    navigate('/components/upload');
  };

  // Define columns for the data grid
  const columns: GridColumn[] = useMemo(
    () => [
      {
        title: 'Name',
        id: 'name',
        width: 400,
      },
      {
        title: 'Type',
        id: 'type',
        width: 100,
      },
      {
        title: 'Price',
        id: 'price',
        width: 100,
      },
      {
        title: 'Min Area',
        id: 'minArea',
        width: 100,
      },
      {
        title: 'Max Width',
        id: 'maxWidth',
        width: 100,
      },
      {
        title: 'Max Height',
        id: 'maxHeight',
        width: 100,
      },
      {
        title: 'Category',
        id: 'category',
        width: 100,
      },
      {
        title: 'Sub Category',
        id: 'subCategory',
        width: 100,
      },
      {
        title: 'Tags',
        id: 'tags',
        width: 300,
      },
    ],
    []
  );

  // Filter and search logic
  const filteredComponents = useMemo(
    () =>
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
      }) || [],
    [components, searchQuery, categoryFilters]
  );

  // Transform data for the data grid
  const gridData = useMemo(() => {
    if (!filteredComponents) return [];

    return filteredComponents.map((component) => [
      {
        kind: GridCellKind.Text,
        data: component.attributes.Name || '',
      },
      {
        kind: GridCellKind.Text,
        data: component.componentTypeName || '',
      },
      {
        kind: GridCellKind.Number,
        data: component.attributes.Price || 0,
      },
      {
        kind: GridCellKind.Number,
        data: component.attributes['Minimum Area'] || 0,
      },
      {
        kind: GridCellKind.Number,
        data: component.attributes['Max Width Per Unit'] || 0,
      },
      {
        kind: GridCellKind.Number,
        data: component.attributes['Max Height Per Unit'] || 0,
      },
      {
        kind: GridCellKind.Text,
        data: component.attributes['Product Category'] || '',
      },
      {
        kind: GridCellKind.Text,
        data: component.attributes['Sub Category'] || '',
      },
      {
        kind: GridCellKind.Text,
        data: component.attributes['Phrase Tags'] || '',
      },
    ]);
  }, [filteredComponents]);

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

      {/* DataGrid Area */}
      <div className="flex-1 p-6 pt-4 overflow-hidden">
        <DataGridWrapper2
          headers={columns}
          data={gridData}
          onCellEdit={handleCellEdit}
          width="fit-content"
          height="100%"
          rowHeight={45}
          maxColumnAutoWidth={300}
          fillHandle={true}
          search={true}
          smoothScrollY={true}
          fixedShadowX={true}
          fixedShadowY={true}
        />

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
