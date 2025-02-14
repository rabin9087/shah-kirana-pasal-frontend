import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getAOrderAction } from "@/action/order.action";

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
    const { orderNumber } = useParams();
    const { order } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                <div className="text-center text-md text-gray-600">
                    {currentIndex + 1}/{sortedItems.length}
                </div>
                <p className="text-sm text-gray-600 text-center">Order No: {order?.orderNumber}</p>
                <div className="flex flex-col items-start justify-start p-2">
                    <p>Name: {order?.name}</p>
                    <p>Phone: {order?.phone}</p>
                    <p>Email: {order?.email}</p>
                    <p>Address: {order?.address}</p>
                </div>
                <div className="mt-4 space-y-3 flex-1 overflow-auto">
                    {currentItem && (
                        <CardContent className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-gray-100">
                            <div className="flex flex-col text-left w-full">
                                <div className="border-2 w-full text-center p-2 bg-primary rounded-md">
                                    <p className="text-2xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                </div>
                                <h3 className="text-lg my-2 font-semibold line-clamp-4">{currentItem?.productId.name}</h3>
                                <p className="text-xs">SKU: {currentItem?.productId.sku}</p>
                                <p className="text-xs">Price: ${currentItem?.productId.price}</p>
                                <p className="text-xs">Ordered: {currentItem?.quantity}</p>
                                <p className="text-xs">Supplied: {currentItem?.supplied ? currentItem?.supplied : 0}</p>
                                <p className="text-xs">SOH: {currentItem?.productId.quantity}</p>
                            </div>
                            <img
                                src={currentItem?.productId?.thumbnail}
                                alt={currentItem?.productId?.name}
                                className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                onClick={() => openModal(currentItem?.productId?.thumbnail)}
                            />
                        </CardContent>
                    )}
                </div>

                <div className="mt-auto flex justify-around p-2 border-t">
                    <Button variant="outline" onClick={handleBack} disabled={currentIndex === 0}>
                        {"<"} Back
                    </Button>
                    <Button onClick={handleNext} disabled={currentIndex === sortedItems.length - 1}>
                        Next {">"}
                    </Button>
                </div>
            </Card>

            {/* Modal for displaying the image */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 mx-10 rounded-md shadow-lg max-w-md w-full flex flex-col justify-center items-center">
                        <img
                            src={modalImage || ""}
                            alt="Product"
                            className="w-full h-full object-cover rounded-md"
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
