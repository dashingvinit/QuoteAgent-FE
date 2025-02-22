import Train from '@/components/home/train';
import Test from '@/components/home/test';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { TrainingProvider } from '../context/useTraning';

const Home = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <TrainingProvider>
            <Train />
          </TrainingProvider>
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
