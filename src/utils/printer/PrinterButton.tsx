
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/axios/order/types";

type dataToPrint = {
    printOrder?: IOrder,
    printMultipleOrder?: IOrder[],
    printOutOfStockOrder?: IOrder[]
    printButton?: boolean
}

const PrinterButton = ({ printOrder, printButton }: dataToPrint) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <div>

            {printOrder?._id && printOrder?.orderNumber &&
                <div ref={contentRef}
                    className="ms-4 mt-2 hidden print:block mx-auto w-full">
                    <p>Name: {printOrder?.name}</p>
                    <p>Email: {printOrder?.email}</p>
                    <p>phone: {printOrder?.phone}</p>
                    <p>Order Number: {printOrder?.orderNumber}</p>
                    <BarCodeGenerator value={(printOrder?.orderNumber)?.toString()} height={40} width={2} displayValue={true} />
                    {/* <p>Items: {printOrder?.items.map((item) => (item.price))}</p> */}
                </div>}
            {printButton && <Button onClick={reactToPrintFn}>Print</Button>}
        </div>
    )
}
export default PrinterButton

type barcodeToPrint = {
    value: string | number,
    qty: number,
    width: number,
    height: number,
    displayValue: boolean,
}
export const PrintBarcode = ({ value, qty = 1, width, height, displayValue }: barcodeToPrint) => {
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrintError = (err: unknown) => {
        console.error("Printing failed:", err);
        setError("An error occurred while trying to print. Please try again.");
    };
    const reactToPrintFn = useReactToPrint({
        contentRef,
        onAfterPrint: () => setError(null),
        onPrintError: handlePrintError,
        documentTitle: `Barcode_${value}`,
    });
    return (
        <div>
            <div
                ref={contentRef}
                className="hidden print:block p-4 print:p-0 print:m-0 print:w-[210mm] print:h-[297mm] print:overflow-hidden"
            >
                <div className="flex flex-wrap gap-4 justify-start items-start mt-4 ms-4">
                    {Array.from({ length: qty }).map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                            <BarCodeGenerator
                                value={value.toString()}
                                width={width}
                                height={height}
                                displayValue={displayValue}
                                className="text-sm mt-4"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {<Button onClick={reactToPrintFn}>Print</Button>}
            {/* Error message */}
            {error && (
                <p className="text-red-500 mt-2 text-sm">{error}</p>
            )}
        </div>
    )
}