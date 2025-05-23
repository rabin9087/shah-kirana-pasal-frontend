import { useEffect, useState } from "react";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";

const PrintSingleProductBarcodeNameSku = () => {
    const location = useLocation();
    const [name, setName] = useState("");
    const [barcodeDisplayValue, setBarcodeDisplayValue] = useState(false);
    const { qrCodeNumber } = useParams();
    const [count, setCount] = useState(1);
    const [width, setWidth] = useState(1); // State for width
    const [height, setHeight] = useState(25); // State for height
    const navigate = useNavigate();

    // Create an array of desired length
    const generatedArray = Array.from({ length: count });

    useEffect(() => {
        if (location?.state) {
            setName(location?.state?.name);
        }
    }, [location]);

    return (
        <div className="p-4 print:p-0 max-w-screen-md mx-auto">
            <Button onClick={() => navigate(-1)} className="mb-4">
                {"<"} BACK
            </Button>
            <h2 className="text-center text-xl font-bold mb-4">Product Name: {name}</h2>
            <p className="text-center text-l font-bold mb-4">Barcode Value: {qrCodeNumber}</p>
            <div className="flex items-center justify-center gap-4 my-6">
                <span className="text-lg font-semibold">Display Barcode Value:</span>
                <button
                    onClick={() => setBarcodeDisplayValue((prev) => !prev)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${barcodeDisplayValue ? "bg-green-500" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${barcodeDisplayValue ? "translate-x-8" : "translate-x-1"
                            }`}
                    />
                </button>
                <span className="text-base font-medium">
                    {barcodeDisplayValue ? "Showing" : "Hidden"}
                </span>
            </div>


            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                <label htmlFor="count" className="flex-1">Select Quantity to print Barcode: </label>
                <select
                    id="count"
                    className="border p-2 rounded flex-1"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                >
                    <option value="0">0</option>
                    {[...Array(500)].map((_, index) => {
                        const value = (index + 1) * 1;
                        return (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                <div className="flex-1">
                    <label htmlFor="width" className="block">Select Barcode Width: </label>
                    <input
                        id="width"
                        type="number"
                        className="border p-2 rounded w-full"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min="1"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="height" className="block">Select Barcode Height: </label>
                    <input
                        id="height"
                        type="number"
                        className="border p-2 rounded w-full"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="1"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4" style={{ pageBreakInside: "avoid" }}>
                {generatedArray.map((_, index) => {
                    return (
                        <div
                            key={index}
                            className="border p-2 rounded flex flex-col items-center text-center"
                        >
                            <BarCodeGenerator value={qrCodeNumber as string} height={height} width={width} displayValue={barcodeDisplayValue} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrintSingleProductBarcodeNameSku;
