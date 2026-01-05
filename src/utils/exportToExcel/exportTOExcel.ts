import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = <T,>(jsonData: T[], fileName: string = "data"): void => {
  // Convert JSON data to worksheet
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

  // Create a new workbook
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate Excel buffer
  const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Create a Blob and trigger download
  const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(fileData, `${fileName}.xlsx`);
};
