
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/axios/order/types";
import { useAppSelector } from "@/hooks";

type dataToPrint = {
    printOrder?: IOrder,
    printMultipleOrder?: IOrder[],
    printOutOfStockOrder?: IOrder[]
    printButton?: boolean
}

const PrinterButton = ({
    printOrder,
    printMultipleOrder,
    printOutOfStockOrder,
    printButton,
}: dataToPrint) => {
    const { user } = useAppSelector((s) => s.userInfo);
    const contentRef = useRef<HTMLDivElement>(null);
    const [hasPrinted, setHasPrinted] = useState(false);

    const allOrdersToPrint: IOrder[] = [
        ...(printOrder ? [printOrder] : []),
        ...(printMultipleOrder || []),
        ...(printOutOfStockOrder || []),
    ];

    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: `Order_Labels`,
        onAfterPrint: () => setHasPrinted(true),
    });

    useEffect(() => {
        if (allOrdersToPrint.length > 0 && !hasPrinted && typeof window !== "undefined") {
            try {
                !printButton && reactToPrintFn?.();
            } catch (err) {
                console.warn("Print failed or was blocked:", err);
            }
        }
    }, [allOrdersToPrint.length, hasPrinted]);

    return (
        <div>
            {/* Hidden container that holds all the labels to print */}
            {allOrdersToPrint.length > 0 && (
                <div
                    ref={contentRef}
                    className="hidden print:block"
                >
                    {allOrdersToPrint.map((order, index) => (
                        <div
                            key={order._id || index}
                            className="print:flex print:w-[384px] print:h-[576px] print:flex-col
                         print:justify-center print:items-center print:text-[12px]
                         print:leading-tight print:m-auto print:p-4 print:border print:border-black page-break-after"
                        >
                            <div className="flex justify-start text-[50px] font-bold mb-4">
                                {index + 1}
                            </div>
                            <div className="w-full flex justify-between mb-4">
                                <div className="w-1/2 text-sm">
                                    <p className="bold"><strong>{order.name.toUpperCase()}</strong> </p>
                                    <p><strong>Phone:</strong> {order.phone}</p>
                                </div>
                                <div className="w-1/2 text-sm text-right">
                                    <p><strong>Picker:</strong> {user.fName} {user.lName}</p>
                                </div>
                            </div>
                            <div className="border-b w-full mb-4"></div>
                            {order?.orderNumber && <div className="mt-4 flex justify-center items-center w-full">
                                <BarCodeGenerator
                                    value={order?.orderNumber.toString()}
                                    width={1.5}
                                    height={30}
                                    displayValue={true}
                                />
                            </div>}
                        </div>
                    ))}
                </div>
            )}

            {/* Optional print button for manual trigger */}
            {printButton && (
                <Button onClick={reactToPrintFn} className="mt-2">
                    Print
                </Button>
            )}
        </div>
    );
};

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