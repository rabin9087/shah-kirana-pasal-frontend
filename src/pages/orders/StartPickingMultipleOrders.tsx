import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  updateAOrder } from "@/axios/order/order";
import {  updateSuppliedQuantity } from "@/redux/allOrders.slice";
import ScanOrderProduct from "./ScanOrderProduct";


type ProductLocation = {
    A: number;
    B: number;
    S: number;
};

const formatLocation = (location: string): string => {
    const parts = location.split(".").map((num) => num.padStart(2, ""));
    return `A${parts[0]} - B${parts[1]} - S${parts[2]}`;
};
const parseLocation = (location: string): ProductLocation => {
    const [A, B, S] = location.split(".").map((num) => parseInt(num));
    return { A, B, S };
};

const sortItems = (items: any) => {
    return [...items].sort((a, b) => {
        const locA = parseLocation(a.productId?.productLocation);
        const locB = parseLocation(b.productId?.productLocation);
        return locA.A - locB.A || locA.B - locB.B || locA.S - locB.S;
    });
};

const StartPickingMultipleOrders = () => {
    const {orders} = useAppSelector(s => s.ordersInfo)
    const dispatch = useAppDispatch();
    const navignate = useNavigate()
    // const { orderNumber } = useParams();
    const { order } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [packing, setPacking] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);

    const ordersToPick = orders.map(({ items }) => items)
    console.log(ordersToPick)

    const sortedItems = sortItems(order?.items || []);
    const currentItem = sortedItems[currentIndex];

    // const { data = initialState.order } = useQuery<IOrder>({
    //     queryKey: ['order', orderNumber],
    //     queryFn: () => getAOrder(orderNumber as string)
    // })

    console.log(orders)

    // useEffect(() => {
    //     if (data?._id && JSON.stringify(data) !== JSON.stringify(order)) {
    //         dispatch(setAOrder(data as IOrder));
    //     } else if (data?._id === "") {
    //         dispatch(setAOrder(initialState.order as IOrder));
    //     }
    // }, [dispatch, data]);

    const handleNext = () => {
        if (currentIndex < sortedItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const openModal = (image: string) => {
        setModalImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNotFound(false)
        setModalImage(null);
    };

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (order?._id) {
            const items = order?.items.map(({ productId, quantity, _id, price, note, supplied, costPrice }) =>
                ({ productId: productId._id, price, quantity, note, supplied, _id, costPrice }));
            await updateAOrder(order._id, { deliveryStatus: status, items })
            setPacking(false)
            return navignate(-1)
        }
        setPacking(false)
        return;
    }

    const updateSuppliedQuintity = () => {
        const supplied = currentItem?.supplied + 1
        if (supplied > currentItem?.quantity) {
            return
        }
        dispatch(updateSuppliedQuantity({ _id: currentItem._id, supplied }))
        if (currentIndex + 1 === order?.items?.length) {
            return
        }
        if (supplied === currentItem?.quantity) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    const resetSuppliedQuintity = () => {
        dispatch(updateSuppliedQuantity({ _id: currentItem._id, supplied: 0 }))
    }

    const handleBarcodeScan = (scannedCode: string) => {
        setBarcode(scannedCode);
        if (scannedCode === currentItem?.productId?.qrCodeNumber) {
            setBarcode("");
            updateSuppliedQuintity();
        } else {
            setNotFound(true)
        }
    };

    useEffect(() => {
        let buffer = "";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                setBarcode(buffer);
                if (buffer === currentItem?.productId?.qrCodeNumber) {
                    setBarcode("");
                    updateSuppliedQuintity();
                } else {
                    setNotFound(true)
                }
                buffer = "";
                // setInputBuffer("");
            } else {
                buffer += e.key;
                // setInputBuffer(buffer);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-bold text-center mb-2">Order Details</h2>
                    <div>
                        <Button className="bg-primary text-white p-2 rounded-md ms-2"
                            onClick={() => updateDeliveryStatus(order?.deliveryStatus === "Order placed" ? "Picking" : order?.deliveryStatus as string)}
                        >
                            {"<"} BACK
                        </Button>
                        <p className="text-sm text-gray-600 text-center">Order No: {order?.orderNumber}</p>
                    </div>
                    <div className="flex flex-col items-start justify-start p-2">
                        <p>Name: {order?.name}</p>
                        <p>Phone: {order?.phone}</p>
                        <p>Email: {order?.email}</p>
                        <p>Address: {order?.address}</p>
                    </div>
                    <div className="mt-4 space-y-3 flex-1 overflow-auto h-full">
                        {currentItem && (
                            <CardContent className="flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm bg-gray-100">
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md">
                                    <p className="text-3xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                    <div className="text-center text-md me-2 text-white">
                                        {sortedItems.length - currentIndex}/{sortedItems.length}
                                    </div>
                                </div>
                                <div className="min-h-[4rem]">
                                    <h3 className="text-base my-2 text-start font-bold ms-2">
                                        {currentItem?.productId?.name}
                                    </h3>
                                </div>

                                <div className="flex justify-around gap-4 py-2">
                                    <p className="text-xs border p-2">Ordered: <strong className="text-xl"> {currentItem?.quantity}</strong> </p>
                                    <p className="text-xs border p-2">Supplied:  <strong className="text-xl"> {currentItem?.supplied ? currentItem?.supplied : 0} </strong></p>
                                </div>

                                <div className="flex justify-between gap-2 text-left w-full">
                                    <div className="ms-2 py-2">
                                        <p className="text-xs">SKU: <strong className="text-xl"> {currentItem?.productId?.sku}</strong> {barcode}</p>
                                        <p className="text-xs">Price: ${currentItem?.productId?.price}</p>
                                        <p className="text-xs">SOH: {currentItem?.productId?.quantity}</p>
                                        <p className="text-xs font-thin">{currentItem?.productId?.qrCodeNumber}</p>
                                    </div>
                                    <img
                                        src={currentItem?.productId?.thumbnail}
                                        alt={currentItem?.productId?.name}
                                        className="w-16 h-16 mt-4 object-cover rounded-md cursor-pointer"
                                        onClick={() => openModal(currentItem?.productId?.thumbnail)}
                                    />
                                </div>
                                <p className={`text-xs min-h-[2rem] text-center text-red-400 
                                ${currentItem?.note !== "" && "border px-2"}`}>
                                    {currentItem?.note ? currentItem?.note : ""}</p>
                            </CardContent>
                        )}

                        <div className="flex flex-col">
                            <div className="flex justify-around px-2 gap-1">
                                <ScanOrderProduct setBarcode={handleBarcodeScan} />
                                <Button
                                    className="w-1/2"
                                    disabled={packing}
                                    onClick={updateSuppliedQuintity} >
                                    WSCAN
                                </Button>
                            </div>
                            <div className="flex justify-around p-2 gap-1">
                                <Button
                                    className="w-1/3"

                                    onClick={handleBack} disabled={currentIndex === 0 || packing}>
                                    {"<"} BACK
                                </Button>
                                <Button
                                    className="w-1/3"
                                    disabled={packing}
                                    onClick={resetSuppliedQuintity}>
                                    RESET
                                </Button>
                                <Button
                                    className="w-1/3"
                                    onClick={handleNext} disabled={currentIndex === sortedItems.length - 1 || packing}>
                                    NEXT {">"}
                                </Button>
                            </div>

                            {currentIndex + 1 === order?.items.length && (
                                <div className="flex justify-center items-center bg-primary mx-2 rounded-lg shadow-md mt-1">
                                    <Button
                                        className="px-6 text-white py-2 text-lg font-medium"
                                        disabled={packing}
                                        onClick={() => updateDeliveryStatus("Packed")}
                                    >
                                        {packing ? "PACKING..." : "PACK"}
                                    </Button>
                                </div>
                            )}
                        </div>

                    </div>
                </Card>

                {/* Modal for displaying the image */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 mx-10 rounded-md shadow-lg max-w-md w-full flex flex-col justify-center items-center">
                            <img
                                src={modalImage || ""}
                                alt="Product"
                                className="p-2 w-56 h-64 object-fill rounded-md"
                            />
                            <div className="flex justify-center items-center mt-2">
                                <Button variant="outline" onClick={closeModal} className="mt-2">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {notFound && (
                    <div className="fixed inset-0 w-fit my-auto h-full  max-w-md mx-auto bg-black bg-opacity-50 flex items-center justify-center mt-20 z-50">
                        <div className="bg-white p-4 mx-16 rounded-md shadow-lg max-w-md w-72  flex flex-col justify-center items-center">
                            <h3>Article not found!</h3>
                            <div className="flex justify-center items-center mt-2">
                                <Button variant="outline" onClick={closeModal} className="mt-2">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>}
        </>
    );
};

export default StartPickingMultipleOrders;
