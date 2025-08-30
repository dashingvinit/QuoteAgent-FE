import { useState, useEffect } from 'react';
import { ChevronsUpDown, Plus, GalleryVerticalEnd } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useOrg } from '@/context/org-provider';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/services';

interface Organization {
  _id: string;
  name: string;
  about: string;
  website: string;
  email: string;
  support_email: string;
  contact: string;
  preferred_currency: string;
  createdAt: string;
}

interface ApiResponse {
  data: {
    data: Organization[];
  };
}

const getOrg = async (): Promise<ApiResponse> => {
  const response = await Axios.get('/organizations/');
  return response.data;
};

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const { activeOrg, setActiveOrg } = useOrg();
  const [showForm, setShowForm] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', email: '' });

  const { data } = useQuery({ queryFn: getOrg, queryKey: ['orgs'] });

  useEffect(() => {
    if (data?.data?.data?.length > 0 && !activeOrg) {
      setActiveOrg(data.data.data[0]);
    }
  }, [data, activeOrg, setActiveOrg]);

  const handleCreate = async () => {
    if (!newOrg.name || !newOrg.email) return;
    try {
      const { data } = await Axios.post('/organizations/create', { data: newOrg });
      setActiveOrg(data.data);
      setShowForm(false);
      setNewOrg({ name: '', email: '' });
    } catch (error) {
      console.log('Error occured in org creation', error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeOrg?.name}</span>
                <span className="truncate text-xs">{activeOrg?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {data?.data?.data?.map((org, index) => {
              return (
                <DropdownMenuItem
                  key={org._id}
                  onClick={() => setActiveOrg(org)}
                  className={`gap-2 p-2 ${activeOrg?._id === org._id && 'bg-accent'}`}>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <GalleryVerticalEnd className="size-4 shrink-0" />
                  </div>
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            {!showForm ? (
              <div
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowForm(true);
                }}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <h2 className="font-medium text-sm text-muted-foreground">Add org</h2>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                <Input
                  placeholder="Org name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                />
                <Input
                  placeholder="Org email"
                  value={newOrg.email}
                  onChange={(e) => setNewOrg({ ...newOrg, email: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreate}>
                    Submit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
