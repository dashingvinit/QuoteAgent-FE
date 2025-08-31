import { memo } from 'react';
import { DataGridWrapper } from '@/features/Datagrid';
import type { ProductGridProps } from '../types';

export const ProductGrid = ({ schema, data, setProducts }: ProductGridProps) => {
  if (!data || !schema) return null;

  return <DataGridWrapper schema={schema} data={data} onDataChange={setProducts} />;
};

export default memo(ProductGrid);
