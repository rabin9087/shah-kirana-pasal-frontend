import OrdersList from "@/pages/orders/OrderList";
import { useQuery } from "@tanstack/react-query";
import { getAOrdersByDate } from "@/axios/order/order";
import { useState } from "react";
import { IOrder } from "@/axios/order/types";
import OrderChart from "./OrderChart";
import ScanOrderProduct from "@/pages/orders/ScanOrderProduct";
import { OrderUpdate } from "./OrderUpdate";

const OrdersDashboard = () => {
        const [barcode, setBarcode] = useState("");
        const [date, setDate] = useState(new Date());
        const { data = [] } = useQuery<IOrder[]>({
                queryKey: ['orders', date?.toISOString().split("T")[0]],
                queryFn: () => getAOrdersByDate(date?.toISOString().split("T")[0])
        })

        if (barcode !== "") {
                return <OrderUpdate barcode={barcode} setBarcode={setBarcode} />
        }
        return (<>
                <div className="flex justify-end items-center me-6">
                        <ScanOrderProduct setBarcode={setBarcode} />
                </div>
                <OrderChart data={data} />
                <OrdersList data={data} date={date} setDate={setDate} />
        </>
        );
}

export default OrdersDashboard;