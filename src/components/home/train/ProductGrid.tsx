import { useState, useCallback, useEffect } from 'react';
import { useTheme } from '@/context/theme-provider';
import { DataEditor, GridColumn, Item, GridCell, GridCellKind, EditableGridCell } from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import { Button } from '@/components/ui/button';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';
import { allCells } from './cells';
import type { MultiSelectCell } from './cells/multi-select-cell';
import { darkTheme, lightTheme } from './cells/theme';

interface Product {
  product_name: string;
  info: string;
  price: number;
  common_names: string[];
}

export const ProductGrid = ({ data, setProducts }) => {
  const { theme } = useTheme();
  const { activeOrg } = useOrg();
  const [columns, setColumns] = useState<GridColumn[]>([
    { title: 'Name', id: 'product_name', width: 150 },
    { title: 'Tags', id: 'common_names', width: 300 },
    { title: 'Info', id: 'info', width: 300 },
    { title: 'Price', id: 'price', width: 100 },
  ]);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const dataRow = data[row];
      const indexes: (keyof Product)[] = ['product_name', 'common_names', 'info', 'price'];

      const item = indexes[col];
      const value = dataRow[item] ? dataRow[item] : [];

      if (col === 3) {
        return {
          kind: GridCellKind.Number,
          allowOverlay: true,
          readonly: false,
          displayData: String(value ?? 0),
          data: (value as number) ?? 0,
        };
      } else if (col === 1) {
        return {
          kind: GridCellKind.Custom,
          allowOverlay: true,
          copyData: value?.join(','),
          data: {
            kind: 'multi-select-cell',
            values: value,
            allowDuplicates: true,
            allowCreation: true,
          },
        } as MultiSelectCell;
      } else {
        return {
          kind: GridCellKind.Text,
          allowOverlay: true,
          readonly: false,
          displayData: String(value ?? ''),
          data: (value as string) ?? '',
        };
      }
    },
    [data]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      const [col, row] = cell;
      const indexes: (keyof Product)[] = ['product_name', 'common_names', 'info', 'price'];
      const key = indexes[col];

      if (newValue.kind === GridCellKind.Custom) {
        const customData = newValue.data as { values: string[] };
        if (!data[row][key]) {
          data[row][key] = [];
        }
        data[row][key] = customData.values;
      } else if (newValue.kind === GridCellKind.Text) {
        data[row][key] = newValue.data;
      }
    },
    [data]
  );

  const onColumnResize = (col: GridColumn, newSize: number, index: number) => {
    const updated = [...columns];
    updated[index] = { ...col, width: newSize };
    setColumns(updated);
  };

  const handleUpload = async () => {
    try {
      await Axios.post(`/org/save/${activeOrg._id}`, { data: data });
      setProducts(null);
    } catch (error) {
      alert('Could not upload');
      console.log('Error saving to db: ', error);
    }
  };

  useEffect(() => {
    setProducts(data);
  }, [data, setProducts]);

  if (!data) return null;

  return (
    <div className="rounded-lg border-2 w-full overflow-hidden h-3/4 bg-muted shadow-xl">
      <div className="m-4 flex gap-4 content-center">
        <div>
          <h2 className="text-base text-foreground font-semibold">
            Enrich the data with detailed context before uploading.
          </h2>
          <p className="text-sm text-muted-foreground">
            Ensure the information is complete and well-detailed for a more valuable knowledge base.
          </p>
        </div>
        <Button onClick={handleUpload} className="mt-2">
          Upload to Knowledge Base
        </Button>
      </div>

      <DataEditor
        theme={theme == 'dark' ? darkTheme : lightTheme}
        columns={columns}
        rows={data.length}
        rowMarkers="both"
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        onColumnResize={onColumnResize}
        overscrollX={200}
        overscrollY={200}
        maxColumnAutoWidth={500}
        maxColumnWidth={2000}
        scaleToRem={true}
        fixedShadowX={true}
        fixedShadowY={true}
        smoothScrollY={true}
        keybindings={{ search: true }}
        getCellsForSelection={true}
        fillHandle={true}
        onPaste={true}
        customRenderers={allCells}
      />
    </div>
  );
};

export default ProductGrid;
