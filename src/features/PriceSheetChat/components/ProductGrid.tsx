import { memo } from 'react';
import { DataGridWrapper } from '@/features/Datagrid';

export const ProductGrid = ({ schema, data, setProducts }) => {
  if (!data || !schema) return null;

  return <DataGridWrapper schema={schema} data={data} onDataChange={setProducts} />;
};

export default memo(ProductGrid);
