import { useState } from 'react';
import InputArea from './InputArea';
import OrgDetails from './OrgDetails';
import ProductGrid from './ProductGrid';

const ChatLayout = () => {
  const [products, setProducts] = useState();
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-x-hidden p-4 space-y-2">
        {products ? <ProductGrid data={products} /> : <OrgDetails />}
      </div>
      <InputArea setProducts={setProducts} />
    </div>
  );
};

export default ChatLayout;
