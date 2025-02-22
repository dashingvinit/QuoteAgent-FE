'use client';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { QuoteIcon } from 'lucide-react';

export default function Header() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton>
          <QuoteIcon />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
