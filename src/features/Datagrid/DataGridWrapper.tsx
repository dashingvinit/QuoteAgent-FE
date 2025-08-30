import { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useTheme } from '@/context/theme-provider';
import { DataEditor, GridColumn, Item, GridCell, GridCellKind, EditableGridCell } from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import { allCells } from './cells';
import type { MultiSelectCell } from './cells/multi-select-cell';
import { darkTheme, lightTheme } from './cells/theme';

interface SchemaField {
  fieldId: string;
  fieldLabel: string;
  fieldType?: 'String' | 'Number' | 'Array';
}

interface DataGridWrapperProps {
  schema: SchemaField[];
  data: any[];
  onDataChange: (data: any[]) => void;
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
}

export const DataGridWrapper = ({
  schema,
  data,
  onDataChange,
  className = 'rounded-lg border-2 w-full overflow-hidden h-full bg-muted shadow-xl',
  height = '100%',
  width = '100%',
  maxColumnAutoWidth = 500,
  maxColumnWidth = 2000,
  rowMarkers = 'checkbox',
  fillHandle = true,
  onPaste = true,
  search = true,
  smoothScrollY = true,
  fixedShadowX = true,
  fixedShadowY = true,
}: DataGridWrapperProps) => {
  const { theme } = useTheme();

  const transformedColumns = useMemo(() => {
    if (!schema || schema.length === 0) return [];
    const containerWidth = window.innerWidth / 2;
    const columnWidth = Math.floor(containerWidth / schema.length);

    return schema.map(
      (field: SchemaField): GridColumn => ({
        title: field?.fieldLabel || field.fieldId,
        id: field?.fieldId,
        width: columnWidth,
      })
    );
  }, [schema]);

  const [columns, setColumns] = useState<GridColumn[]>(transformedColumns);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      const dataRow = data[row];
      const field = schema[col];
      const value = dataRow[field.fieldId];

      // Handle different data types based on field type
      switch (field.fieldType) {
        case 'Array':
          console.log(field.fieldType);
          return {
            kind: GridCellKind.Custom,
            allowOverlay: true,
            copyData: Array.isArray(value) ? value.join(',') : String(value ?? ''),
            data: {
              kind: 'multi-select-cell',
              values: Array.isArray(value) ? value : value ? [value] : [],
              allowDuplicates: true,
              allowCreation: true,
            },
          } as MultiSelectCell;

        case 'Number':
          return {
            kind: GridCellKind.Number,
            allowOverlay: true,
            readonly: false,
            displayData: String(value ?? 0),
            data: typeof value === 'number' ? value : parseFloat(value) || 0,
          };

        case 'String':
        default:
          return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: String(value ?? ''),
            data: String(value ?? ''),
          };
      }
    },
    [data, schema]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      const [col, row] = cell;
      const field = schema[col];
      const key = field.fieldId;

      // Create a copy of the data to avoid direct mutation
      const updatedData = [...data];

      if (newValue.kind === GridCellKind.Custom) {
        const customData = newValue.data as { values: string[] };
        updatedData[row] = {
          ...updatedData[row],
          [key]: customData.values,
        };
      } else if (newValue.kind === GridCellKind.Text) {
        updatedData[row] = {
          ...updatedData[row],
          [key]: newValue.data,
        };
      } else if (newValue.kind === GridCellKind.Number) {
        updatedData[row] = {
          ...updatedData[row],
          [key]: newValue.data,
        };
      }

      // Update the data
      onDataChange(updatedData);
    },
    [data, schema, onDataChange]
  );

  const onColumnResize = (col: GridColumn, newSize: number, index: number) => {
    const updated = [...columns];
    updated[index] = { ...col, width: newSize };
    setColumns(updated);
  };

  useEffect(() => {
    setColumns(transformedColumns);
  }, [transformedColumns]);

  if (!data || !schema) return null;

  return (
    <div className={className} style={{ height, width }}>
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

export default memo(DataGridWrapper);
