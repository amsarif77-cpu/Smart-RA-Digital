import * as XLSX from 'xlsx';

/**
 * Exports JSON object array to a genuine Microsoft Excel (.xlsx) file
 */
export function exportJsonToExcel<T extends Record<string, any>>(
  data: T[],
  fileName: string,
  sheetName: string = 'Data'
) {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    const safeFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
    XLSX.writeFile(wb, safeFileName);
  } catch (err) {
    console.error('Failed to export to Excel:', err);
  }
}

/**
 * Exports 2D array (headers + rows) to a genuine Microsoft Excel (.xlsx) file
 */
export function exportArrayToExcel(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
  fileName: string,
  sheetName: string = 'Data'
) {
  try {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    const safeFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
    XLSX.writeFile(wb, safeFileName);
  } catch (err) {
    console.error('Failed to export to Excel:', err);
  }
}
