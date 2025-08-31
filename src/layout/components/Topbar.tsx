import BreadcrumbDemo from './BreadcrumbDemo';
import ModeToggle from './ModeToggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Topbar = () => {
  return (
    <div className="flex items-center justify-between border-b p-1 shadow-sm bg-background">
      <div className="flex items-center gap-2">
        <div>
          <SidebarTrigger />
        </div>
        <div>
          <BreadcrumbDemo />
        </div>
      </div>
      <div className="flex items-center gap-2 px-2">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Topbar;
