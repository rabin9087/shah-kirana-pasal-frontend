import OrdersList from "@/pages/orders/OrderList";
import { useQuery } from "@tanstack/react-query";
import { getAOrdersByDate } from "@/axios/order/order";
import { useState } from "react";
import { IOrder } from "@/axios/order/types";
import OrderChart from "./OrderChart";

const OrdersDashboard = () => {
        const [date, setDate] = useState(new Date());
        const { data = [] } = useQuery<IOrder[]>({
                queryKey: ['orders', date?.toISOString().split("T")[0]],
                queryFn: () => getAOrdersByDate(date?.toISOString().split("T")[0])
        })
        return (<>
                <OrderChart data={data} />
                <OrdersList data={data} date={date} setDate={setDate} />
        </>
        );
}

export default OrdersDashboard;