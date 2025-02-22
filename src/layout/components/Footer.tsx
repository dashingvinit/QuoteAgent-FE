import { LogOut } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function UserInfo() {
  const { open } = useSidebar();
  return (
    <div className={`flex px-2 items-center ${!open && 'justify-center pt-0'}`}>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div
        className={`
          flex justify-between items-center
          overflow-hidden transition-all ${open ? 'w-52 ml-3' : 'w-0'}
        `}>
        <div className="leading-4">
          <h4 className="font-semibold">Vinit</h4>
          <span className="text-sm font-semibold">Vinit Jain</span>
        </div>
        <LogOut strokeWidth={2} size={15} />
      </div>
    </div>
  );
}

export default UserInfo;
