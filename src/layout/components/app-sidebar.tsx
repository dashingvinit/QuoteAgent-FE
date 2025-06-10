import { Calendar, Home, Inbox, Settings } from 'lucide-react';
import { OrgSwitcher } from './org-switcher';
import Footer from './Footer';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'History',
    url: 'history',
    icon: Calendar,
  },
  {
    title: 'Inbox',
    url: 'inbox',
    icon: Inbox,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full flex flex-col">
      {/* Sidebar Header */}
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Brain</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
