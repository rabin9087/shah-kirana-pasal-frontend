import OrdersList from "@/pages/orders/OrderList";
import { useQuery } from "@tanstack/react-query";
import { getAOrdersByDate, updateAOrder } from "@/axios/order/order";
import { useState, useMemo } from "react";
import { IOrder } from "@/axios/order/types";
import OrderChart from "./OrderChart";
import ScanOrderProduct from "@/pages/orders/ScanOrderProduct";
import { OrderUpdate } from "./OrderUpdate";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { DateNavigator } from "@/pages/orders/OrderTable";

const OrdersDashboard = () => {
        const { user } = useAppSelector((state) => state.userInfo);
        const adminRoles = ["ADMIN", "PICKER", "SUPERADMIN"];
        const navigate = useNavigate();

        const [barcode, setBarcode] = useState("");
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [date, setDate] = useState(new Date());

        const formattedDate = useMemo(() => date.toISOString().split("T")[0], [date]);

        const { data = [] } = useQuery<IOrder[]>({
                queryKey: ["orders", formattedDate],
                queryFn: () => getAOrdersByDate(formattedDate),
        });

        // Filter orders based on status and user role
        const ordersToPick = useMemo(
                () => data.filter((order) => order.deliveryStatus === "Order placed"),
                [data]
        );

        const ordersPicking = useMemo(
                () => data.filter((order) => order.deliveryStatus === "Picking" && order.picker?.userId === user?._id),
                [data, user]
        );

        const handleOnOrderPick = async () => {
                if (ordersPicking.length > 0) {
                        navigate(`/order/orderNumber=/${ordersPicking[0].orderNumber}`);
                        return;
                }

                if (ordersToPick.length > 0) {
                        await updateAOrder(ordersToPick[0]._id as string, {
                                deliveryStatus: "Picking",
                                picker: { userId: user._id, name: `${user.fName} ${user.lName}` },
                        });
                        navigate(`/order/orderNumber=/${ordersToPick[0].orderNumber}`);
                        return;
                }

                setIsModalOpen(true);
        };

        return (
                <>
                        <>
                                {adminRoles.includes(user.role) && (
                                        <div className="flex justify-between items-center">
                                                <Button type="button" onClick={handleOnOrderPick}>Start Picking</Button>
                                                <div>
                                                        <p>Orders to pick: {ordersToPick.length}</p>
                                                        {ordersPicking.length > 0 && <p>You are picking: {ordersPicking.length}</p>}

                                                </div>
                                                <ScanOrderProduct setBarcode={setBarcode} />
                                        </div>
                                )}

                                <OrderChart data={data} />

                                {user.role === "PICKER" && <DateNavigator data={data} date={date} setDate={setDate} />}

                                {(user.role === "ADMIN" || user.role === "SUPERADMIN") && <OrdersList data={data} date={date} setDate={setDate} />}
                                {isModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                <div className="bg-white p-4 mx-10 rounded-md shadow-md max-w-md w-full flex flex-col justify-center items-center">
                                                        <h3 className="text-red-500">No more orders to pick</h3>
                                                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="mt-2">
                                                                Close
                                                        </Button>
                                                </div>
                                        </div>
                                )}
                        </>
                        {barcode && <OrderUpdate barcode={barcode} setBarcode={setBarcode} />}
                </>
        );
};

export default OrdersDashboard;
