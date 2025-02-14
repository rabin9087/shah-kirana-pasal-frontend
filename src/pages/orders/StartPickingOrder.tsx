import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAOrderAction } from "@/action/order.action";
import { updateAOrder } from "@/axios/order/order";

type ProductLocation = {
    A: number;
    B: number;
    S: number;
};

const formatLocation = (location: string): string => {
    const parts = location.split(".").map((num) => num.padStart(2,""));
    return `A${parts[0]} - B${parts[1]} - S${parts[2]}`;
};

const parseLocation = (location: string): ProductLocation => {
    const [A, B, S] = location.split(".").map((num) => parseInt(num));
    return { A, B, S };
};

const sortItems = (items: any) => {
    return [...items].sort((a, b) => {
        const locA = parseLocation(a.productId.productLocation);
        const locB = parseLocation(b.productId.productLocation);
        return locA.A - locB.A || locA.B - locB.B || locA.S - locB.S;
    });
};

const StartPickingOrder = () => {
    const dispatch = useAppDispatch();
    const navignate = useNavigate()
    const { orderNumber } = useParams();
    const { order } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packing, setPacking] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);

    const sortedItems = sortItems(order?.items || []);

    useEffect(() => {
        dispatch(getAOrderAction(orderNumber as string));
    }, [dispatch, orderNumber]);

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
        setModalImage(null);
    };

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (order?._id) {
            await updateAOrder(order._id, { deliveryStatus: status })
            setPacking(false)
            return navignate("/all-orders")
        }
        setPacking(false)
        return;
    }

    const currentItem = sortedItems[currentIndex];

    return (
        <div className="p-4 w-full h-screen max-w-md mx-auto flex flex-col">
            <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">
                <div className="p-2 bg-primary w-fit rounded-md">
                    <Link to={"/all-orders"} className="text-white">
                        {"<"} back
                    </Link>
                </div>
                <h2 className="text-xl font-bold text-center mb-2">Order Details</h2>
                
                <p className="text-sm text-gray-600 text-center">Order No: {order?.orderNumber}</p>
                <div className="flex flex-col items-start justify-start p-2">
                    <p>Name: {order?.name}</p>
                    <p>Phone: {order?.phone}</p>
                    <p>Email: {order?.email}</p>
                    <p>Address: {order?.address}</p>
                </div>
                <div className="mt-4 space-y-3 flex-1 overflow-auto h-full">
                    {currentItem && (
                        <CardContent className="flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm bg-gray-100">
                            <div className="flex justify-between w-full border-2 text-center p-2 bg-primary rounded-md">
                                <p className="text-2xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                <div className="text-center text-md me-2 text-white">
                                    {sortedItems.length - currentIndex}/{sortedItems.length}
                                </div>
                            </div>
                            <div className="min-h-[4rem]">
                                <h3 className="text-l my-2 text-start font-medium ms-2 space-y-4">
                                    {currentItem?.productId.name}
                                </h3>
                            </div>
                            
                            <div className="flex justify-around gap-4 py-2">
                                <p className="text-xs border p-2">Ordered: <span className="text-xl"> {currentItem?.quantity}</span> </p>
                                <p className="text-xs border p-2">Supplied:  <span className="text-xl"> {currentItem?.supplied ? currentItem?.supplied : 0} </span></p>
                            </div>

                            <div className="flex justify-between gap-2 text-left w-full">
                                <div className="ms-2">
                                <p className="text-xs">SKU: {currentItem?.productId.sku}</p>
                                <p className="text-xs">Price: ${currentItem?.productId.price}</p>
                                <p className="text-xs">SOH: {currentItem?.productId.quantity}</p>
                            </div>
                            <img
                                src={currentItem?.productId?.thumbnail}
                                alt={currentItem?.productId?.name}
                                className="w-16 h-16 mt-4 object-cover rounded-md cursor-pointer"
                                onClick={() => openModal(currentItem?.productId?.thumbnail)}
                                />
                            </div>
                        </CardContent>
                    )}
                    
                    <div className="flex flex-col">
                        <div className="flex justify-around px-2 gap-1">
                            <Button
                                className="w-1/2"
                                onClick={handleBack}>
                                 ScanProduct
                            </Button>
                        
                            <Button
                                className="w-1/2"
                                onClick={handleNext} >
                                WSCAN
                            </Button>
                        </div>
                        <div className="flex justify-around p-2 gap-1">
                            <Button
                                className="w-1/3"
                                onClick={handleBack} disabled={currentIndex === 0}>
                                {"<"} BACK
                            </Button>
                            <Button
                                className="w-1/3"
                                onClick={handleBack}>
                                RESET
                            </Button>
                            <Button
                                className="w-1/3"
                                onClick={handleNext} disabled={currentIndex === sortedItems.length - 1}>
                                NEXT {">"}
                            </Button>
                        </div>

                        {currentIndex + 1 === order?.items.length && (
                            <div className="flex justify-center items-center bg-primary mx-2 rounded-lg shadow-md mt-1">
                                <Button
                                    className="px-6 text-white py-2 text-lg font-medium"
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
                            className="w-full h-screen/2 object-cover rounded-md"
                        />
                        <div className="flex justify-center items-center mt-2">
                            <Button variant="outline" onClick={closeModal} className="mt-2">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StartPickingOrder;
