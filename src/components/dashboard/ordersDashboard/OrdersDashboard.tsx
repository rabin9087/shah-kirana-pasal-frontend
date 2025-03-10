import OrdersList from "@/pages/orders/OrderList";
import { useQuery } from "@tanstack/react-query";
import { getAOrdersByDate, updateAOrder } from "@/axios/order/order";
import { useState } from "react";
import { IOrder } from "@/axios/order/types";
import OrderChart from "./OrderChart";
import ScanOrderProduct from "@/pages/orders/ScanOrderProduct";
import { OrderUpdate } from "./OrderUpdate";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";

const OrdersDashboard = () => {
        const { user } = useAppSelector(s => s.userInfo)
        const adminRoles = ["ADMIN", "PICKER"];
        const navigate = useNavigate()
        const [barcode, setBarcode] = useState("");
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [date, setDate] = useState(new Date());
        const { data = [] } = useQuery<IOrder[]>({
                queryKey: ['orders', date?.toISOString().split("T")[0]],
                queryFn: () => getAOrdersByDate(date?.toISOString().split("T")[0])
        })

        if (barcode !== "") {
                return <OrderUpdate barcode={barcode} setBarcode={setBarcode} />
        }
        const ordersToPick = data?.filter((item) => item.deliveryStatus === "Order placed")
        const ordersPicking = data?.filter((item) => item.deliveryStatus === "Picking" && item.picker?.userId === user?._id)
        const handelOnOrderPick = async () => {
                if (ordersPicking.length > 0) {
                        return navigate(`/order/orderNumber=/${ordersPicking[0].orderNumber}`)
                }
                if (ordersToPick.length) {
                        await updateAOrder(ordersToPick[0]?._id as string, { deliveryStatus: "Picking", picker: { userId: user._id, name: user.fName + " " + user.lName } });
                        return navigate(`/order/orderNumber=/${ordersToPick[0].orderNumber}`)
                }
                return setIsModalOpen(true)
        }


        return (<>
                {adminRoles.includes(user.role) &&
                        <div className="flex justify-between items-center">
                                <Button type="button" onClick={handelOnOrderPick}>Start Picking</Button>
                                <ScanOrderProduct setBarcode={setBarcode} />
                        </div>}

                <OrderChart data={data} />
                <OrdersList data={data} date={date} setDate={setDate} />
                {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-4 mx-10 rounded-md shadow-md max-w-md w-full flex flex-col  justify-center items-center">
                                        <h3 className="text-red-500">No more orders to pick</h3>
                                        <div className="flex justify-center items-center mt-2">
                                                <Button variant="outline" onClick={() => setIsModalOpen(false)} className="mt-2">
                                                        Close
                                                </Button>
                                        </div>
                                </div>
                        </div>
                )}
        </>
        );
}

export default OrdersDashboard;