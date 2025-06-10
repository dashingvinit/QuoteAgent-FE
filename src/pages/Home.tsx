import Train from '@/components/home/train';
import Test from '@/components/home/test';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <Train />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Test />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Home;
