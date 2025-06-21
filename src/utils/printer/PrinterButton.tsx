
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/axios/order/types";

type dataToPrint = {
    printOrder?: IOrder,
    printMultipleOrder?: IOrder[],
    printOutOfStockOrder?: IOrder[]
}

const PrinterButton = ({ printOrder}: dataToPrint) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <div>
            <Button onClick={reactToPrintFn}>Print</Button>
            {printOrder?._id && printOrder?.orderNumber && <div ref={contentRef}>
                <div>
                    <p>Name: {printOrder?.name}</p>
                    <p>Email: {printOrder?.email}</p>
                    <p>Address: {printOrder?.phone}</p>
                    <p>Address: {printOrder?.orderNumber}</p>
                    <p>Address: {printOrder?.phone}</p>
                    <p>Address: {printOrder?.phone}</p>
                    <BarCodeGenerator value={(printOrder?.orderNumber)?.toString()} height={40} width={1} />
                </div>
            </div>}
        </div>)
}
export default PrinterButton