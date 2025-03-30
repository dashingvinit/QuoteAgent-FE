import React, { useState, useCallback } from 'react';
import { useTheme } from '@/context/theme-provider';
import { DataEditor, GridColumn, Item, GridCell, GridCellKind, EditableGridCell } from '@glideapps/glide-data-grid';
import '@glideapps/glide-data-grid/dist/index.css';
import { Button } from '@/components/ui/button';
import { Axios } from '@/services';
import { useOrg } from '@/context/org-provider';

const lightTheme = {
  accentColor: '#217346',
  accentFg: '#FFFFFF',
  accentLight: '#E5F3EC',
  textDark: '#2A2A2A',
  textMedium: '#5E5E5E',
  textLight: '#9B9B9B',
  textBubble: '#FFFFFF',
  bgIconHeader: '#737373',
  fgIconHeader: '#FFFFFF',
  textHeader: '#2A2A2A',
  textHeaderSelected: '#FFFFFF',
  bgCell: '#FFFFFF',
  bgCellMedium: '#F8F8F8',
  bgHeader: '#F5F5F5',
  bgHeaderHasFocus: '#E0E0E0',
  bgHeaderHovered: '#E8E8E8',
  bgBubble: '#217346',
  bgBubbleSelected: '#1A5C38',
  bgSearchResult: '#FFF9C4',
  borderColor: '#E0E0E0',
  drilldownBorder: '#217346',
  linkColor: '#217346',
  cellHorizontalPadding: 8,
  cellVerticalPadding: 3,
  headerFontStyle: '600 13px',
  baseFontStyle: '13px',
  fontFamily: 'Inter, sans-serif',
  editorFontSize: '13px',
  lineHeight: 1.4,
};

// Define your dark theme
const darkTheme = {
  accentColor: '#4CAF50',
  accentFg: '#FFFFFF',
  accentLight: '#2E7D32',
  textDark: '#E0E0E0',
  textMedium: '#A0A0A0',
  textLight: '#707070',
  textBubble: '#FFFFFF',
  bgIconHeader: '#A0A0A0',
  fgIconHeader: '#FFFFFF',
  textHeader: '#E0E0E0',
  textHeaderSelected: '#FFFFFF',
  bgCell: '#121212',
  bgCellMedium: '#1E1E1E',
  bgHeader: '#1E1E1E',
  bgHeaderHasFocus: '#2E2E2E',
  bgHeaderHovered: '#252525',
  bgBubble: '#4CAF50',
  bgBubbleSelected: '#3D8B40',
  bgSearchResult: '#5D4037',
  borderColor: '#333333',
  drilldownBorder: '#4CAF50',
  linkColor: '#4CAF50',
  cellHorizontalPadding: 8,
  cellVerticalPadding: 3,
  headerFontStyle: '600 13px',
  baseFontStyle: '13px',
  fontFamily: 'Inter, sans-serif',
  editorFontSize: '13px',
  lineHeight: 1.4,
};

// const data = [
//   {
//     product_name: '10MM.T.CLR',
//     price: 74.67,
//     info: '10MM.TGH',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4A',
//     price: 33.4,
//     info: '4mm ANN CLR DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4AAS',
//     price: 55,
//     info: '4mm ANN A/SUN DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4AP',
//     price: 45.19,
//     info: '4mm ANN OBS COT/STI DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4AP2',
//     price: 45.19,
//     info: '4mm ANN OBS GROUP 2 DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4APLAN',
//     price: 37.32,
//     info: '4A4AS/COAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4A.4ASATIN',
//     price: 74.67,
//     info: '4mm ANN SATIN DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4ALL.4AKS',
//     price: 45.19,
//     info: '4mm ANN LOW IRON S/COAT DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4ALI.4APLA',
//     price: 45.19,
//     info: '4mm ANN LOW IRON S/COAT DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4AP.4APLAN',
//     price: 49.14,
//     info: '4mm ANN OBS COT/STI/4 A SC',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4AP2.4PLAN',
//     price: 49.14,
//     info: '4mm ANN OBS GROUP 2/4 A',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4ASAT.4APL',
//     price: 63.85,
//     info: '4MM ANN SATIN.4MM ANN SC',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T',
//     price: 17.69,
//     info: '4mm TGH CLR',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.AT',
//     price: 49.14,
//     info: '4mm TGH CLR DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.AT.AT',
//     price: 77,
//     info: '4mm TGH TRIPLE GLAZE',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.47.4TPL',
//     price: 81.08,
//     info: '4mm TGH TRIPLE SCOAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4770/35',
//     price: 82.43,
//     info: '4mm TGH SN 70/35 DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4TASBR',
//     price: 78.59,
//     info: '4mm TGH BRONZE DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.ATASGRE',
//     price: 78.59,
//     info: '4mm TGH GREY DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4TP',
//     price: 60.91,
//     info: '4mm TGH OBS COT/STI DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4TP2',
//     price: 60.91,
//     info: '4mm TGH OBS GROUP 2 DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4TPL1.0',
//     price: 57.75,
//     info: '4T.4ATSCOAT1.0',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.4TPLAN',
//     price: 53.04,
//     info: '4mm TGH SCOAT DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.ATSATIN',
//     price: 85.45,
//     info: '4mm TGH/SATIN',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.6FIRESA',
//     price: 408.24,
//     info: '4T.6MM FIRESAFE',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4T.6LSC',
//     price: 82.22,
//     info: '4mm TGH/6.4 LAM SOFTCOAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TSN7035.4TP',
//     price: 92.93,
//     info: '4TSN7035.4TPLAN1.0',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TACB.4TKS',
//     price: 106.09,
//     info: '4MM TGH ACTIVB.4TSCOAT KS',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TACB.4TPL',
//     price: 106.09,
//     info: '4MM TGH ACTIVB.4TSCOAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TACN.4TKS',
//     price: 106.09,
//     info: '4TACTNEU.ATSCOAT KS',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TACT.4T4S',
//     price: 147.95,
//     info: '4mm TGH ACTIV/PLANI 4S DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TACT.ATDT',
//     price: 106.09,
//     info: '4TACTNEU.4TSCOAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TAS',
//     price: 44.19,
//     info: '4mm TGH A/S SINGLE',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TG.4TAS',
//     price: 91.34,
//     info: '4mm TGH PLAN / 4T A/S',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TLILATKS',
//     price: 61.89,
//     info: '4mm TGH L IRON.4MM KS',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TLI.ATPLA',
//     price: 61.89,
//     info: '4mm TGH L IRON DGU',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TP',
//     price: 36.33,
//     info: '4mm TGH OBS',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TP.4TPLAN',
//     price: 64.84,
//     info: '4mm TGH OBS COT/STI/4TPLAN',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TP2.4TPL',
//     price: 64.84,
//     info: '4mm TGH OBS GROUP 2 /4TPL',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TPL.ATBAR',
//     price: 324.19,
//     info: '4TPL.4TBARONSTAR',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: 'ATSAT.4TP1',
//     price: 107.1,
//     info: '4TSAT.ATPLANI1',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TSAT.4TPL',
//     price: 107.1,
//     info: '4TSAT.4TPLANI',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4TSAT.64SC',
//     price: 103.43,
//     info: '4mm TGH SATIN.6.4 SOFTCOAT',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: 'ATSAT.6L',
//     price: 88.5,
//     info: '4mm TGH SATIN.6.4 CLEAR',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: 'ATSN70.4TP',
//     price: 110.25,
//     info: '4tsn7035.4TP',
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '4mm TGH CLR DGU',
//     price: 134.58,
//     common_names: ['4TST150.4T'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.8LAMIACCOUSTIC.4TPLANI',
//     price: 92.93,
//     common_names: ['6.8LAC4TPL'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.8L LAM PHON 4TPLANI',
//     price: 100.36,
//     common_names: ['6.8LP.4TPL'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm ANN CLR DGU',
//     price: 55,
//     common_names: ['6A.6A'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm ANN LOWE DGU',
//     price: 80.54,
//     common_names: ['6A.6AK'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm ANN OBS LOWE DGU',
//     price: 92.34,
//     common_names: ['6AP.6AK'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm LAM CLR',
//     price: 55,
//     common_names: ['6L'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM 4mm ANN PLAN',
//     price: 77.68,
//     common_names: ['6L.4APLAN'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM 4mm TGH',
//     price: 81.52,
//     common_names: ['6L.4T'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM 4mmTGH',
//     price: 89.02,
//     common_names: ['6L.4TPL'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM CLR DGU',
//     price: 84.47,
//     common_names: ['6L.6L'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM CLR 6.4 LAM',
//     price: 110.01,
//     common_names: ['6L.6LPLAN'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4LAMPLANI.4TPAT',
//     price: 97.13,
//     common_names: ['6LPLAN.4TP'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm TGH',
//     price: 39.29,
//     common_names: ['6T'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mmTUF/ 4mm TUF PLANI',
//     price: 82.43,
//     common_names: ['6T.4TPLAN'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm TGH / 6.4 LAM SOFTCOAT',
//     price: 97.92,
//     common_names: ['6T.6LSC'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm TGH CLEAR DGU',
//     price: 82.52,
//     common_names: ['6T.6T'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6TSN 70/35.6TCLR',
//     price: 92.93,
//     common_names: ['6T.6T70/35'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6mm TGH PLAN DGU',
//     price: 102.17,
//     common_names: ['6T.6TPLAN'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: "6mm TGH OBS/K' DGU",
//     price: 121.82,
//     common_names: ['6TP.6TK'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4LAMI.6TPLANITHERM',
//     price: 98.24,
//     common_names: ['6TPLAN.6L'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '6.4mm LAM 4mm TGH PLAN',
//     price: 78.59,
//     common_names: ['6L4TPLAN'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '8.8 LAM CLR',
//     price: 76.63,
//     common_names: ['8.8LAM'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: '8 TOUGH CLEAR',
//     price: 55,
//     common_names: ['8T'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
//   {
//     product_name: 'SPECIAL DGU TOUGH -NO PRICE',
//     price: 0,
//     common_names: ['XXT'],
//     orgId: '67e79d57d9b97932a504318b',
//   },
// ];

interface Product {
  product_name: string;
  info: string;
  price: number;
  common_names: string[];
}

export const ProductGrid = ({ data }) => {
  const { theme } = useTheme();
  const { activeOrg } = useOrg();
  const [columns, setColumns] = useState<GridColumn[]>([
    { title: 'Name', id: 'product_name', width: 200 },
    { title: 'Tags', id: 'common_names', width: 300 },
    { title: 'Info', id: 'info', width: 300 },
    { title: 'Price', id: 'price', width: 100 },
  ]);

  const getCellContent = useCallback(([col, row]: Item): GridCell => {
    const dataRow = data[row];
    const indexes: (keyof Product)[] = ['product_name', 'common_names', 'info', 'price'];

    const item = indexes[col];
    const value = dataRow[item];

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
        kind: GridCellKind.Bubble,
        allowOverlay: true,
        data: Array.isArray(value) ? value : [],
      };
    } else {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: String(value ?? ''),
        data: (value as string) ?? '',
      };
    }
  }, []);

  type MyGridCell = EditableGridCell | { kind: GridCellKind.Bubble; data: any }; // Replace 'any' with your actual data type

  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: MyGridCell) => {
      const indexes: (keyof Product)[] = ['product_name', 'common_names', 'info', 'price'];
      const key = indexes[col];

      if (newValue.kind === GridCellKind.Bubble) {
        const updatedData = [...data];
        updatedData[row].tags = newValue.data;
      } else {
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
      console.log('Updated data: ', data);
      await Axios.post(`/org/save/${activeOrg._id}`, { data });
    } catch (error) {
      alert('Could not upload');
      console.log('Error saving to db: ', error);
    }
  };

  if (!data) return null;

  return (
    <div className="rounded-lg border-2 w-min overflow-hidden h-3/4">
      <div>
        <h2>Complete the data and add as much as detail you can to make the data rich in context.</h2>
        <p>Once done upload it to knowledge base.</p>
        <Button onClick={handleUpload}>Upload</Button>
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
      />
    </div>
  );
};

export default ProductGrid;
