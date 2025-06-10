import OrdersList from "@/pages/orders/OrderList";
import { useQuery } from "@tanstack/react-query";
import { getAOrdersByDate, updateAOrder } from "@/axios/order/order";
import { useState, useMemo, useEffect } from "react";
import { IOrder } from "@/axios/order/types";
import OrderChart from "./OrderChart";
import ScanOrderProduct from "@/pages/orders/ScanOrderProduct";
import { OrderUpdate } from "./OrderUpdate";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { DateNavigator } from "@/pages/orders/OrderTable";
import OpenStartPickingModal from "@/pages/orders/startPicking/OpenStartPickingModal";

const OrdersDashboard = () => {
        const { user } = useAppSelector((state) => state.userInfo);
        const adminRoles = ["ADMIN", "PICKER", "SUPERADMIN"];
        const navigate = useNavigate();
        const [buff, setBuff] = useState("");
        const [barcode, setBarcode] = useState("");
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isOpenPicking, setIsOpenPicking] = useState(false);
        const [date, setDate] = useState(new Date());
        // Get the year, month, and day



        const formattedDate = (date: Date) => {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1 and pad with '0'
                const day = date.getDate().toString().padStart(2, '0');       // Pad with '0'
                return `${year}-${month}-${day}`;
        }

        const { data = [] } = useQuery<IOrder[]>({
                queryKey: ["orders", formattedDate(date)],
                queryFn: () => getAOrdersByDate(formattedDate(date)),
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

        const notSupppliedItems = []
        for (let i = 0; i < data.length; i++) {
                const items = (data[i]?.items || []);
                notSupppliedItems.push(...items)
        }

        const outOfStock = useMemo(
                () => data.filter((order) => order.deliveryStatus === "Packed"),
                [data, user]
        );

        const handleOnExpressOrderPick = async () => {
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
                setIsOpenPicking(false);
                setIsModalOpen(true);

        };

        const handleOnOrdersPick = async () => {
                if (ordersPicking.length > 0) {
                        navigate(`/order/orderNumber=/${ordersPicking[0].orderNumber}`);
                        return;
                }

                if (ordersToPick.length > 0) {
                        // await updateAOrder(ordersToPick[0]._id as string, {
                        //         deliveryStatus: "Picking",
                        //         picker: { userId: user._id, name: `${user.fName} ${user.lName}` },
                        // });
                        navigate(`/orders/pickup`);
                }
                setIsOpenPicking(false);
                setIsModalOpen(true);

        };

        const handleOnOutodStock = async () => {
                if (outOfStock.length > 0 && notSupppliedItems.length) {
                        navigate(`/orders/out-of-stock`);
                        return;
                }
                setIsOpenPicking(false);
                setIsModalOpen(true);
        }

        useEffect(() => {
                const handleKeyPress = (e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                                setBarcode(buff.trim());  // Finalize the barcode
                                setBuff("");              // Reset buffer
                        } else {
                                setBuff(prev => prev + e.key); // Accumulate scanned chars
                        }
                };

                window.addEventListener("keypress", handleKeyPress);
                return () => {
                        window.removeEventListener("keypress", handleKeyPress);
                };
        }, [buff]);

        return (
                <>
                        <>
                                {adminRoles.includes(user.role) && (
                                        <div className="flex justify-between items-center">
                                                <div className="flex flex-col items-cente gap-1">
                                                        <Button type="button" onClick={() => setIsOpenPicking(true)}>Start Picking</Button>
                                                </div>

                                                <div>
                                                        <p>Orders to pick: {ordersToPick.length}</p>
                                                        {ordersPicking.length > 0 && <p>You are picking: {ordersPicking.length}</p>}

                                                </div>
                                                <ScanOrderProduct setBarcode={setBarcode} />
                                        </div>
                                )}

                                <OrderChart data={data} />

                                {user.role === "PICKER" &&
                                        <DateNavigator data={data} date={date} setDate={setDate} />}

                                {(user.role === "ADMIN" || user.role === "SUPERADMIN") &&
                                        <OrdersList data={data} date={date} setDate={setDate} />}
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
                        {isOpenPicking && <OpenStartPickingModal
                                isOpenPicking={isOpenPicking}
                                setIsOpenPicking={setIsOpenPicking}
                                handleOnOrdersPick={handleOnOrdersPick}
                                handleOnExpressOrderPick={handleOnExpressOrderPick}
                                handleOnOutodStock={handleOnOutodStock}
                        />}

                </>
        );
};

export default OrdersDashboard;
