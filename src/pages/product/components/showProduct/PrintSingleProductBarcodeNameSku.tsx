import { useEffect, useState } from "react";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router";
import { useLocation } from "react-router-dom";

const PrintSingleProductBarcodeNameSku = () => {
    const location = useLocation();
    const [name, setName] = useState("");
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
        <div className="p-4 print:p-0 w-[794px] mx-auto">
            <Button onClick={() => navigate(-1)}>{"<"} BACK</Button>
            <h2 className="text-center text-xl font-bold mb-4">Product Name: {name}</h2>

            <div className="flex gap-4 items-center mb-4">
                <label htmlFor="count">Select Quantity to print Barcode: </label>
                <select
                    id="count"
                    className="border p-2 rounded"
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

            <div className="grid grid-cols-2 gap-2" style={{ pageBreakInside: "avoid" }}>
                {generatedArray.map((_, index) => {
                    return (
                        <div
                            key={index}
                            className="border p-2 rounded flex flex-col items-center text-center"
                        >
                            <BarCodeGenerator value={qrCodeNumber as string} height={height} width={width} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrintSingleProductBarcodeNameSku;
