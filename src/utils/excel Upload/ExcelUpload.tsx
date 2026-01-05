import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploader = () => {
    const [excelData, setExcelData] = useState<Record<string, any>[]>([]);

    const [columns, setColumns] = useState<string[]>([]);
    const [error, setError] = useState<string>("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        const file = e.target.files?.[0];
        if (!file) {
            setError("No file selected");
            return;
        }

        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const buffer = evt.target?.result;
                if (!buffer) throw new Error("Cannot read file");

                const workbook = XLSX.read(buffer, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                setExcelData(json as []);
                setColumns(json.length > 0 ? Object.keys(json[0] as {}) : []);

            } catch (error: any) {
                console.error(error);
                setError("Invalid Excel file");
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // const uploadToBackend = () => {
    //     console.log("SEND THIS:", excelData);
    //     alert("Uploading...");
    // };

    const uploadToBackend = async () => {
        const response = await fetch("http://localhost:4000/api/excel/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: excelData }),
        });

        const result = await response.json();
        console.log(result);
    };

    return (<Layout title="Upload Excel File ">
        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">

            {/* File input */}
            <div className="mb-4 w-fit" >
                <label className="block font-semibold text-gray-700 mb-2">
                    Upload Excel File
                </label>

                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-900 
                 file:mr-5 file:py-2 file:px-4 
                 file:rounded-lg file:border-0 
                 file:text-sm file:font-semibold 
                 file:bg-blue-50 file:text-blue-700 
                 hover:file:bg-blue-100 cursor-pointer"
                />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            {/* Preview Table */}
            {excelData.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">
                        Preview Excel Data
                    </h2>

                    <div className="overflow-auto max-h-screen border rounded-lg shadow-sm">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col}
                                            className="border-b px-4 py-2 text-left text-gray-700 font-semibold text-sm"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col}
                                                className="border-b px-4 py-2 text-sm text-gray-700"
                                            >
                                                {row[col]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Upload button */}
            <div className="mt-6 flex justify-end">
                <Button
                    onClick={uploadToBackend}
                >
                    Upload Excel
                </Button>
            </div>
        </div>

    </Layout>

    );
};

export default ExcelUploader;
