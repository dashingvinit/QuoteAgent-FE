import { useState, useCallback, useEffect, memo } from 'react';
import { useTheme } from '@/context/theme-provider';
import { DataEditor, GridColumn, Item, GridCell, EditableGridCell, GridCellKind } from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import './DataGridWrapper2.css';
import { allCells } from './cells';
import { darkTheme, lightTheme } from './cells/theme';

interface SimpleCellData {
  kind: GridCellKind;
  data: string | number | boolean | object | null;
}

interface DataGridWrapper2Props {
  headers: GridColumn[];
  data: SimpleCellData[][];
  onCellEdit: (rowIndex: number, columnIndex: number, newValue: any) => void;
  className?: string;
  height?: string | number;
  width?: string | number;
  maxColumnAutoWidth?: number;
  maxColumnWidth?: number;
  rowMarkers?: 'checkbox' | 'number' | 'clickable-number' | 'checkbox-visible' | 'both' | 'none';
  fillHandle?: boolean;
  onPaste?: boolean;
  search?: boolean;
  smoothScrollY?: boolean;
  fixedShadowX?: boolean;
  fixedShadowY?: boolean;
  autoHeight?: boolean;
  maxHeight?: string | number;
  rowHeight?: number;
}

export const DataGridWrapper2 = ({
  headers,
  data,
  onCellEdit,
  className = 'rounded-lg border-2 overflow-hidden bg-muted shadow-xl',
  height = '100%',
  width = 'fit-content',
  maxColumnAutoWidth = 500,
  maxColumnWidth = 2000,
  rowMarkers = 'both',
  fillHandle = true,
  onPaste = true,
  search = true,
  smoothScrollY = true,
  fixedShadowX = true,
  fixedShadowY = true,
  autoHeight = false,
  maxHeight = '70vh',
  rowHeight = 34,
}: DataGridWrapper2Props) => {
  const { theme } = useTheme();

  const [columns, setColumns] = useState<GridColumn[]>(headers);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const cellData = data[row][col];

      return {
        kind: cellData.kind,
        data: cellData.data,
        displayData: String(cellData.data ?? ''),
        allowOverlay: true,
        readonly: false,
      };
    },
    [data]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      const [col, row] = cell;
      onCellEdit(row, col, newValue);
    },
    [onCellEdit]
  );

  const onColumnResize = (col: GridColumn, newSize: number, index: number) => {
    const updated = [...columns];
    updated[index] = { ...col, width: newSize };
    setColumns(updated);
  };

  useEffect(() => {
    setColumns(headers);
  }, [headers]);

  // Calculate dynamic height based on content
  const calculateHeight = () => {
    if (!autoHeight) return height;

    const headerHeight = 50;
    const calculatedHeight = headerHeight + (data?.length || 0) * rowHeight;

    if (typeof maxHeight === 'string') {
      const result = `min(${calculatedHeight}px, ${maxHeight})`;
      return result;
    } else if (typeof maxHeight === 'number') {
      const result = Math.min(calculatedHeight, maxHeight);
      return result;
    }

    return calculatedHeight;
  };

  const dynamicHeight = calculateHeight();

  if (!data || !headers) return null;

  return (
    <div
      className={`${className} datagrid-custom-scrollbar`}
      style={{
        height: dynamicHeight,
        overflow: 'hidden',
        ...(autoHeight && { minHeight: 'fit-content' }),
      }}>
      <DataEditor
        theme={theme === 'dark' ? darkTheme : lightTheme}
        columns={columns}
        rows={data.length}
        rowMarkers={rowMarkers}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        onColumnResize={onColumnResize}
        maxColumnAutoWidth={maxColumnAutoWidth}
        maxColumnWidth={maxColumnWidth}
        rowHeight={rowHeight}
        height={autoHeight ? dynamicHeight : undefined}
        width={'100%'}
        scaleToRem={true}
        fixedShadowX={fixedShadowX}
        fixedShadowY={fixedShadowY}
        smoothScrollY={smoothScrollY}
        keybindings={{ search }}
        getCellsForSelection={true}
        fillHandle={fillHandle}
        onPaste={onPaste}
        customRenderers={allCells}
      />
    </div>
  );
};

export default memo(DataGridWrapper2);
