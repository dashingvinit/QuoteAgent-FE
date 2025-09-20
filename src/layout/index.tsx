import { ThemeProvider } from '@/context/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import Topbar from './components/Topbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased flex h-screen">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider defaultOpen={true}>
          <div className="grid grid-cols-[auto,1fr] w-full">
            <AppSidebar />
            <main className="flex flex-col h-screen overflow-hidden">
              <header className="sticky top-0 z-10">
                <Topbar />
              </header>
              <div className="flex-1 overflow-auto">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
