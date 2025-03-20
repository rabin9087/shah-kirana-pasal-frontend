import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const PrintProductsQRCodeNameSku = () => {
    const { products } = useAppSelector((s) => s.productInfo);
    const navigate = useNavigate();
    const [barcodeDisplayValue, setBarcodeDisplayValue] = useState(false);
    const [width, setWidth] = useState(2); // State for width
    const [height, setHeight] = useState(40);

    return (
        <div className="p-4 print:p-0 max-w-screen-md mx-auto">
            <Button onClick={() => navigate(-1)} className="mb-4">
                {"<"} BACK
            </Button>
            <h1 className="text-center text-xl font-bold mb-2">Product Details</h1>
            <p className="text-center text-md font-bold mb-4">Total Products: {products.length}</p>

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


            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                {products.map(({ qrCodeNumber, sku, name }) => (
                    <div
                        key={qrCodeNumber}
                        className="border p-2 rounded flex flex-col items-center text-center"
                    >
                        <Link
                            to={`/printSingleProductBarcodeNameSku/${qrCodeNumber}`}
                            state={{ name }}
                        >
                            <BarCodeGenerator value={qrCodeNumber as string} height={height} width={width} displayValue={barcodeDisplayValue} />
                        </Link>
                        <strong className="text-md mt-2">{sku}</strong>
                        <p className="text-xs">{name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrintProductsQRCodeNameSku;
