import React, { useState, useEffect } from "react";

const RFScannerInput: React.FC = () => {
    const [barcode, setBarcode] = useState("");
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [inputBuffer, setInputBuffer] = useState("");

    useEffect(() => {
        let buffer = "";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                setScannedData(buffer);
                setBarcode(buffer);
                buffer = "";
                setInputBuffer("");
            } else {
                buffer += e.key;
                setInputBuffer(buffer);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">RF Scanner Input</h2>
            <p className="mb-2">Scanned Data: <span className="font-mono">{scannedData}</span></p>
            <p className="mb-2">Scanned Data: <span className="font-mono">{barcode}</span></p>
            <input
                type="text"
                value={inputBuffer}
                className="border p-2 rounded"
                readOnly
                placeholder="Waiting for scan..."
            />
        </div>
    );
};

export default RFScannerInput;
