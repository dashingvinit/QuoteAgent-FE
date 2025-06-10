import { useState } from 'react';
import InputArea from './InputArea';
import OrgDetails from './OrgDetails';
import ProductGrid from './ProductGrid';

const ChatLayout = () => {
  const [products, setProducts] = useState();

  const data = [
    {
      product_name: '6TPLAN.6L',
      price: 98.24,
      info: '6.4LAMI.6TPLANITHERM',
      orgId: '67e79d57d9b97932a504318b',
    },
    {
      product_name: '6L4TPLAN',
      price: 78.59,
      info: '6.4mm LAM 4mm TGH PLAN',
      orgId: '67e79d57d9b97932a504318b',
    },
    {
      product_name: '8.8LAM',
      price: 76.63,
      info: '8.8 LAM CLR',
      orgId: '67e79d57d9b97932a504318b',
    },
    {
      product_name: '8T',
      price: 55,
      info: '8 TOUGH CLEAR',
      orgId: '67e79d57d9b97932a504318b',
    },
    {
      product_name: 'XXT',
      price: 0,
      info: 'SPECIAL DGU TOUGH -NO PRICE',
      orgId: '67e79d57d9b97932a504318b',
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-x-hidden p-4 space-y-2">
        {products ? <ProductGrid data={products} setProducts={setProducts} /> : <OrgDetails />}
      </div>
      <InputArea setProducts={setProducts} />
    </div>
  );
};

export default ChatLayout;
