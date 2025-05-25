import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { IOrder } from "@/axios/order/types";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { initialState, setOrders } from "@/redux/allOrders.slice";

interface IOrderList {
    data: IOrder[];
    date: Date;
    setDate: (date: Date) => void;
}

export const DateNavigator = ({ data, date, setDate }: IOrderList) => {
    const dispatch = useAppDispatch()
    const { orders } = useAppSelector(s => s.ordersInfo)

    const changeDate = async (newDate: Date) => {
        setDate(newDate);
    };

    useEffect(() => {
        if (data?.length && JSON.stringify(data) !== JSON.stringify(orders)) {
            dispatch(setOrders(data as IOrder[]));
        } else if (data.length < 1) {
            dispatch(setOrders(initialState.orders));
        }
    }, [dispatch, data, orders]);

    return (
        <div className="flex justify-center gap-2 mb-4 mt-8">
            <button
                className="p-2 border rounded-md hover:bg-gray-200"
                onClick={() => changeDate(subDays(date, 1))}
            >
                <ChevronLeft size={16} />
            </button>

            <div className="relative">
                <input
                    type="date"
                    className="border rounded-md px-3 py-2"
                    value={format(date, "yyyy-MM-dd")}
                    onChange={(e) => changeDate(new Date(e.target.value))}
                />
            </div>

            <button
                className="p-2 border rounded-md hover:bg-gray-200"
                onClick={() => changeDate(addDays(date, 1))}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};