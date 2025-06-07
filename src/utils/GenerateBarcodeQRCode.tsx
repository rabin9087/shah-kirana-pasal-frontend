import { useEffect, useState } from "react";
import { BarCodeGenerator, QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ToggleSwitch } from "@/pages/product/components/showProduct/PrintSingleProductBarcodeNameSku";
import { Input } from "@/components/ui/input";

const GenerateBarcodeQRCode = () => {
    const navigate = useNavigate();
    const [barcodeQrCode, setBarcodeQrCode] = useState("")
    const [barcodeDisplayValue, setBarcodeDisplayValue] = useState(false);
    const [generateBarcode, setGenerateBarcode] = useState(true);
    const [generateQRcode, setGenerateQRcode] = useState(false);
    const [count, setCount] = useState(1);
    const [QRHeightWidth, setQRHeightWidth] = useState(50);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(25);

    const generatedArray = Array.from({ length: count });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.trim() === "") {
            setBarcodeQrCode("");
        } else {
            setBarcodeQrCode(value);
        }
    }

    useEffect(() => {
        let buffer = "";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                setBarcodeQrCode(buffer);
                buffer = "";
                // setInputBuffer("");
            } else {
                buffer += e.key;
                // setInputBuffer(buffer);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="p-4 print:p-0 max-w-screen-md mx-auto">
            <Button onClick={() => navigate(-1)} className="mb-4">
                {"<"} BACK
            </Button>

            {/* Toggle Controls Section */}
            <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-8 max-w-2xl mx-auto w-full">
                <div className="flex flex-col gap-6 sm:gap-8">
                    <Input
                        type="text"
                        id="barcodeQrCode"
                        value={barcodeQrCode}
                        onChange={handleOnChange}
                        placeholder="Enter the barcode/qrCode" />


                    {/* Display Barcode Value Text */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-base sm:text-lg font-medium text-gray-700">
                            Display Barcode Value
                        </span>
                        <ToggleSwitch
                            value={barcodeDisplayValue}
                            onToggle={() => setBarcodeDisplayValue((prev) => !prev)}
                        />
                    </div>

                    {/* Show Barcode Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-base sm:text-lg font-medium text-gray-700">
                            Show Barcode
                        </span>
                        <ToggleSwitch
                            value={generateBarcode}
                            onToggle={() => setGenerateBarcode((prev) => !prev)}
                        />
                    </div>

                    {/* Show QR Code Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-base sm:text-lg font-medium text-gray-700">
                            Show QR Code
                        </span>
                        <ToggleSwitch
                            value={generateQRcode}
                            onToggle={() => setGenerateQRcode((prev) => !prev)}
                        />
                    </div>

                </div>
            </div>


            {/* Quantity selector */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                <label htmlFor="count" className="flex-1">
                    Select Quantity to Print:
                </label>
                <select
                    id="count"
                    className="border p-2 rounded flex-1"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                >
                    {[...Array(500)].map((_, index) => (
                        <option key={index} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* Size controls */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                <div className="flex-1">
                    <label htmlFor="width" className="block">
                        Barcode Width:
                    </label>
                    <input
                        type="number"
                        className="border p-2 rounded w-full"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min="1"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="height" className="block">
                        Barcode Height:
                    </label>
                    <input
                        type="number"
                        className="border p-2 rounded w-full"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="1"
                    />
                </div>
            </div>

            {/* QR size control */}
            <div className="mb-4">
                <label className="block">QR Code Size (width & height):</label>
                <input
                    type="number"
                    className="border p-2 rounded w-full"
                    value={QRHeightWidth}
                    onChange={(e) => setQRHeightWidth(Number(e.target.value))}
                    min="1"
                />
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4" style={{ pageBreakInside: "avoid" }}>
                {generatedArray.map((_, index) => (
                    <div
                        key={index}
                        className={`border p-2 rounded flex ${generateBarcode && generateQRcode ? "flex-row justify-between" : "flex-col"
                            } gap-4 items-center text-center`}
                    >
                        {generateBarcode && (
                            <div className="flex-1 flex justify-center">
                                <BarCodeGenerator
                                    value={barcodeQrCode as string}
                                    height={height}
                                    width={width}
                                    displayValue={barcodeDisplayValue}
                                />
                            </div>
                        )}
                        {generateQRcode && (
                            <div className="flex-1 flex justify-center">
                                <QRCodeGenerator
                                    value={barcodeQrCode as string}
                                    height={QRHeightWidth}
                                    width={QRHeightWidth}
                                />
                            </div>
                            
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default GenerateBarcodeQRCode