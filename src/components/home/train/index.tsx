import InputArea from './InputArea';

const ChatLayout = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4">{/* Render chat messages here */}</div>
      <InputArea />
    </div>
  );
};

export default ChatLayout;
