import { Home, Inbox, Settings, Building, Component, Quote, History } from 'lucide-react';
import { OrgSwitcher } from './org-switcher';
import Footer from './Footer';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { NavGrouped } from './nav-grouped';
import { NavPrimary } from './nav-primary';

const items = {
  navPrimary: [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Ontology Builder', url: '/ontology', icon: History },
  ],
  navGrouped: [
    {
      title: 'Components',
      url: '#',
      icon: Component,
      isVisible: true,
      items: [
        { title: 'Browse All', url: '/components' },
        { title: 'Upload New', url: '/components/upload' },
        { title: 'Build Relations', url: '/components/relations' },
      ],
    },
    {
      title: 'Quotes',
      url: '#',
      icon: Quote,
      isVisible: true,
      items: [
        { title: 'All Quotes', url: '/quotes' },
        { title: 'Generate Quote', url: '/quotes/generate' },
        { title: 'Quote History', url: '/quotes/history' },
      ],
    },
  ],
  navSecondary: [
    { title: 'Inbox', url: '/inbox', icon: Inbox },
    { title: 'Businesses', url: '/businesses', icon: Building },
    { title: 'Settings', url: '/settings', icon: Settings },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full flex flex-col">
      {/* Sidebar Header */}
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-1 overflow-y-auto">
        <NavPrimary items={items?.navPrimary} />
        <NavGrouped items={items?.navGrouped} />
        <NavPrimary items={items?.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}
