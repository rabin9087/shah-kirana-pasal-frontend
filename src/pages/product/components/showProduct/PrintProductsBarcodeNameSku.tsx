import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const PrintProductsQRCodeNameSku = () => {
    const { products } = useAppSelector((s) => s.productInfo);
    const navigate = useNavigate()
    const [width, setWidth] = useState(2); // State for width
    const [height, setHeight] = useState(40);
    return (
        <div className="p-4 print:p-0 w-[794px] mx-auto">
            <Button onClick={() => navigate(-1)}>{"<"} BACK</Button>
            <h1 className="text-center text-xl font-bold mb-2">Product Details</h1>
            <p className="text-center text-md font-bold mb-4">Total Products: {products.length}</p>
            <div className="flex gap-4 items-center mb-4">
                <label htmlFor="width">Select Barcode Width: </label>
                <input
                    id="width"
                    type="number"
                    className="border p-2 rounded"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="1"
                />
                <label htmlFor="height">Select Barcode Height: </label>
                <input
                    id="height"
                    type="number"
                    className="border p-2 rounded"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="1"
                />
            </div>
            <div
                className="grid grid-cols-2 gap-4"
                style={{ pageBreakInside: "avoid" }}
            >

                {products.map(({ qrCodeNumber, sku, name }) => (
                    <div
                        key={qrCodeNumber}
                        className="border p-2 rounded flex flex-col items-center text-center"
                    >
                        <Link
                            to={`/printSingleProductBarcodeNameSku/${qrCodeNumber}`}
                            state={{ name }}
                        >
                            <BarCodeGenerator value={qrCodeNumber as string} height={height} width={width} />
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
