import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';
import { DataGridWrapper2 } from '@/features/Datagrid';
import { GridColumn, GridCellKind } from '@glideapps/glide-data-grid';
import { useMemo } from 'react';

interface Business {
  _id: string;
  orgId: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  preferences: Array<{ key: string; value: string; _id: string }>;
  discount: number;
  defaults: {
    shipping_method: string;
    warranty: string;
    support_level: string;
  };
  createdAt: string;
  updatedAt: string;
}

function Businesses() {
  const { activeOrg } = useOrg();

  const getBusinesses = async () => {
    const { data } = await Axios.get(`/businesses/${activeOrg?._id}`);
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['businesses', activeOrg?._id],
    queryFn: getBusinesses,
    enabled: !!activeOrg?._id,
  });

  const headers: GridColumn[] = useMemo(
    () => [
      { title: 'Name', id: 'name', width: 200 },
      { title: 'Email', id: 'email', width: 250 },
      { title: 'Phone', id: 'phone', width: 150 },
      { title: 'Address', id: 'address', width: 300 },
      { title: 'Discount (%)', id: 'discount', width: 120 },
    ],
    []
  );

  const transformedData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((business: Business) => {
      return [
        { kind: GridCellKind.Text, data: business.name },
        { kind: GridCellKind.Text, data: business.email },
        { kind: GridCellKind.Text, data: business.phone },
        { kind: GridCellKind.Text, data: business.address },
        { kind: GridCellKind.Number, data: business.discount },
      ];
    });
  }, [data]);

  const handleCellEdit = (rowIndex: number, columnIndex: number, newValue: any) => {
    console.log(`Editing row ${rowIndex}, column ${columnIndex}:`, newValue);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading businesses</div>;

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">Businesses</h1>
      <div className="h-[calc(100%-80px)]">
        <DataGridWrapper2 headers={headers} data={transformedData} onCellEdit={handleCellEdit} autoHeight />
      </div>
    </div>
  );
}

export default Businesses;
