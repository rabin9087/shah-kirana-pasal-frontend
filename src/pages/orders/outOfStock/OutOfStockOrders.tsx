import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateMultipleOrders } from "@/axios/order/order";
import { setOutOfStockOrders, updateOutOfStockSuppliedQuantity } from "@/redux/allOrders.slice";
import ScanOrderProduct from "../ScanOrderProduct";
import { IItemTypes } from "@/axios/order/types";
import { RiArrowTurnBackFill, RiArrowTurnForwardFill } from "react-icons/ri";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { formatLocation, sortItems } from "../startPicking/StartPickingOrder";
import { NotFoundModal } from "./OpenBasketLableModal";
import { useQueryClient } from "@tanstack/react-query";
import { GoDotFill } from "react-icons/go";
import PrinterButton from "@/utils/printer/PrinterButton";

type ItemSummary = {
    productId: string;
    supplied?: number;
};

const OutOfStockOrders = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { orders, outOfStockOrders } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [packing, setPacking] = useState(false);
    const [articleCheck, setArticleCheck] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [buff, setBuff] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);
    const queryClient = useQueryClient()
    let allItems = []

    for (let i = 0; i < outOfStockOrders.length; i++) {
        const items = (outOfStockOrders[i]?.items || []);
        allItems.push(...items)
    }

    const sortedItems = sortItems(allItems)
    const currentItem = sortedItems[currentIndex];
    const lastItem = sortedItems[currentIndex - 1];

    function getChangedItems(oldArr: IItemTypes[], newArr: IItemTypes[]): IItemTypes[] {

        return newArr.filter((newItem) => {
            const match = oldArr.find(
                (oldItem) => oldItem._id === newItem._id
            );

            if (!match) return true; // new item

            // Compare values
            return (
                newItem.productId?._id !== match.productId?._id ||
                newItem.quantity !== match.quantity ||
                newItem.supplied !== match.supplied
            );
        });
    }

    const currentItemOrder = outOfStockOrders?.find(order =>
        order.items.some(item => item._id === currentItem?._id)
    );

    const totalProductOfSameId = sortedItems.filter((item) => item?.productId?._id === currentItem?.productId?._id)?.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)

    const totalItemsToPick = sortedItems.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)

    const timeAllocatedToPick = totalItemsToPick * 20

    const totalPickingTime = (): number => {
        const updatedAt = outOfStockOrders[0]?.startPickingTime;

        if (!updatedAt) return 0;

        const startTime = new Date(updatedAt).getTime();
        const now = Date.now();
        return Math.floor((now - startTime) / 1000);
    };

    const handleNext = () => {
        if (currentIndex < sortedItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setBarcode("")
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setBarcode("")
        }
    };

    const openModal = (image: string) => {
        setModalImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setArticleCheck(false)
        setModalImage(null);
    };

    if (outOfStockOrders.length) { <PrinterButton printOutOfStockOrder={outOfStockOrders} /> }

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (outOfStockOrders.length) {
            const oldOutOfStocks: IItemTypes[] = [];
            const allOrderNumbers: number[] = [];

            // Only consider orders with "Packed" status
            const stockNeeded = orders.filter(order => order.deliveryStatus === "Packed");

            // Collect all old items and orderNumbers from packed orders
            for (const order of stockNeeded) {
                oldOutOfStocks.push(...(order.items || []));
                if (order.orderNumber !== undefined) {
                    allOrderNumbers.push(order.orderNumber);
                }
            }

            // Find updated (changed) items compared to original packed items
            const updateChanged: IItemTypes[] = getChangedItems(oldOutOfStocks, sortedItems);

            // Build an array of orders with updated items
            const orderItems: { orderNumber: number, items: ItemSummary[], deliveryStatus: string }[] = [];

            for (const orderNumber of allOrderNumbers) {
                const matchingOrder = outOfStockOrders.find(order => order.orderNumber === orderNumber);

                if (!matchingOrder) continue;

                // Filter only changed items from this order
                const newItems = matchingOrder.items.filter(item =>
                    updateChanged.some(changed => changed._id === item._id)
                );

                if (newItems.length > 0) {
                    orderItems.push({
                        orderNumber,
                        items: newItems.map(({ productId, supplied }) =>
                            ({ productId: productId._id, supplied })), deliveryStatus: status
                    });
                }
            }
            setPacking(false)
            navigate("/dashboard/orders")
            updateChanged.length && await updateMultipleOrders(orderItems)
            queryClient.invalidateQueries({ queryKey: ["orders", (outOfStockOrders[0].requestDeliveryDate)] })
            dispatch(setOutOfStockOrders([]))

        }
        setPacking(false)
        return;
    }

    const updateSuppliedQuintity = () => {
        // setIsBasketLabelOpen(true)
        const supplied = currentItem?.supplied + 1
        if (supplied > currentItem?.quantity) {
            return
        }
        dispatch(updateOutOfStockSuppliedQuantity({ _id: currentItem._id, supplied }))
        if (currentIndex + 1 === sortedItems.length) {
            return
        }
        if (supplied === currentItem?.quantity) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    const resetSuppliedQuintity = () => {
        dispatch(updateOutOfStockSuppliedQuantity({ _id: currentItem._id, supplied: 0 }))
    }

    const handleBarcodeScan = (scannedCode: string) => {
        setBarcode(scannedCode);
        if (scannedCode === currentItem?.productId?.qrCodeNumber) {
            setBarcode("");
            updateSuppliedQuintity();
        } else {
            setArticleCheck(true)
        }
    };

    // Extracting aisle (A) and bay (B) from location format "A.B.S"
    const location = currentItem?.productId?.productLocation ?? "";
    const lastItemLocation = lastItem?.productId?.productLocation ?? "";
    const parts = location.split(".");
    const aisle = parseInt(parts[0], 10); // A
    const bay = parseInt(parts[1], 10);   // B
    const lastParts = lastItemLocation.split(".");
    const lastAisle = parseInt(lastParts[0], 10);

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

    useEffect(() => {
        if (!barcode) return;
        if (barcode === currentItem?.productId?.qrCodeNumber) {
            setBarcode("");
            updateSuppliedQuintity();
        } else {
            setArticleCheck(true)
            // setNotFound(true)
        }

        setTimeout(() => setBarcode(""), 500); // Optional reset
    }, [barcode]);

    useEffect(() => {
        if (orders && orders.length > 0 && outOfStockOrders.length === 0) {
            // Filter orders to find those that are "Packed" and contain at least one out-of-stock item.
            const filteredOrdersWithOutOfStockItems = orders
                ?.filter(order => order.deliveryStatus === "Packed")
                .filter(order =>
                    order.items.some(item => (item.supplied as number) < item.quantity)
                )
                .map(order => {
                    // For each such order, create a new order object.
                    // You might want to create a deep copy if you modify other properties of the order later
                    // or just modify the items array. For simplicity, we'll create a new object.
                    return {
                        ...order,
                        // Filter the items within this order to only include the out-of-stock ones.
                        items: order.items.filter(item => (item.supplied as number) < item.quantity)
                    };
                });

            dispatch(setOutOfStockOrders(filteredOrdersWithOutOfStockItems || [])); // Ensure it's an array for dispatch
        }
    }, []);

    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">

                    <h2 className="text-xl font-bold text-center mb-2">Out Of Stock Orders</h2>
                    <p className="text-xl font-bold text-center mb-2">{currentItemOrder?.orderNumber}</p>
                    <div>
                        <Button className="bg-primary text-white p-2 rounded-md ms-2"
                            onClick={() => updateDeliveryStatus("Packed")}
                            disabled={packing}
                        >
                            {"<"} BACK
                        </Button>
                    </div>
                    <div className="flex flex-col items-start justify-start p-2">

                    </div>
                    <div className="mt-4 space-y-3 flex-1 overflow-auto h-full">
                        {currentItem && (
                            <CardContent className="flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm bg-gray-100">
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md gap-2">
                                    <p className="text-[28px] font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-white">
                                            <p className="font-thin text-sm">{(currentItem?.quantity < totalProductOfSameId) ? (currentItem?.quantity + "/" + totalProductOfSameId) : "All"} </p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2 rounded-md bg-white px-2">

                                            <p className={`${bay % 2 === 0 ? "text-green-500" : "text-gray-200"} font-extrabold`}><FaArrowLeft size={20} /></p>
                                            <p className={`${bay % 2 === 1 ? "text-green-500" : "text-gray-200"}  font-extrabold`}><FaArrowRight size={20} /></p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2 rounded-md bg-white px-2">
                                            {aisle === lastAisle ? "" :
                                                aisle % 2 === 0 ?
                                                    <p className="text-green-500 font-extrabold "
                                                        style={{ transform: 'scaleY(-1)' }}><RiArrowTurnForwardFill size={20} /></p> :
                                                    <p className="text-green-500 font-extrabold"><RiArrowTurnBackFill size={20} /></p>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-center text-md text-white p-2 shadow-md rounded-md bg-blue-700">
                                        <div className="flex justify-between items-center gap-2">
                                            <div className="rounded-full">
                                                <GoDotFill className={`
                                                   ${timeAllocatedToPick > totalPickingTime() && "bg-green-500 rounded-full text-green-500"} 
                                                ${(totalPickingTime() === timeAllocatedToPick || (totalPickingTime() >= timeAllocatedToPick && totalPickingTime() <= timeAllocatedToPick / 0.1)) && "bg-yellow-500 rounded-full text-yellow-500"} 
                                                ${timeAllocatedToPick < totalPickingTime() && "bg-red-500 rounded-full text-red-500"} 
                                                
                                                `} size={15} />
                                            </div>
                                            <p>{sortedItems.length - currentIndex}/{sortedItems.length} </p>
                                        </div>
                                        <div className="flex flex-col text-center">

                                            <p className="font-thin text-sm">left in trip</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="min-h-[4rem]">
                                    <h3 className="text-base my-2 text-start font-bold ms-2">
                                        {currentItem?.productId?.name}
                                    </h3>
                                </div>

                                <div className="space-y-1 w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md p-1 border border-gray-200">
                                    {/* Ordered & Supplied */}
                                    <div className="flex items-center justify-between p-2 gap-2 mx-auto">
                                        <div className="flex flex-col justify-between">
                                            <div className="flex justify-around gap-2">
                                                <div className="flex-1 text-center  bg-gray-50 p-3 rounded-md border shadow-sm">
                                                    <p className="text-gray-500 text-xs">Ordered</p>
                                                    <p className="text-xl font-semibold text-gray-800">{currentItem?.quantity}</p>
                                                </div>
                                                <div className="flex-1 text-center bg-gray-50 p-3 rounded-md border shadow-sm">
                                                    <p className="text-gray-500 text-xs">Supplied</p>
                                                    <p className="text-xl font-semibold text-blue-600">
                                                        {currentItem?.supplied ?? 0}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Product Details & Image */}
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                {/* Left Side: Product Info */}
                                                <div className="flex-1 space-y-1 w-full">
                                                    {/* SKU & Price */}
                                                    <div className="flex justify-between items-center mt-1 bg-blue-50 p-1 rounded-md border shadow-sm">
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            <span className="text-xl font-bold ms-4">{currentItem?.productId?.sku}</span>
                                                        </p>
                                                        <p className="text-blue-600 font-semibold me-4">${currentItem?.productId?.price}</p>
                                                    </div>

                                                    {/* SOH & Basket */}
                                                    <div className="flex justify-between gap-2">
                                                        <div className="flex-1 text-center bg-gray-100 p-2 rounded-md border shadow-sm">
                                                            <p className="text-xs text-gray-500">SOH</p>
                                                            <p className="text-lg font-medium">{currentItem?.productId?.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-20 shrink-0">
                                            <img
                                                src={currentItem?.productId?.thumbnail}
                                                alt={currentItem?.productId?.name}
                                                className="w-full h-full object-cover rounded-lg border shadow cursor-pointer"
                                                onClick={() => openModal(currentItem?.productId?.thumbnail)}
                                            />

                                        </div>
                                    </div>

                                    {/* Optional Note */}
                                    {currentItem?.note && (
                                        <p className="font-thin text-base text-red-500 border border-red-200 rounded-md px-2 py-1 text-center bg-red-50">
                                            {currentItem?.note}
                                        </p>
                                    )}
                                </div>

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

                            {currentIndex + 1 === sortedItems.length && (
                                <div className="flex justify-center items-center bg-primary mx-2 rounded-lg shadow-md mt-1">
                                    <Button
                                        className="px-6 text-white py-2 text-lg font-medium"
                                        disabled={packing}
                                        onClick={() => updateDeliveryStatus("Completed")}
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

                {(articleCheck) &&
                    <NotFoundModal
                        articleCheck={articleCheck}
                        closeNotFoundModal={closeModal} />}
            </div>}

        </>
    );
};

export default OutOfStockOrders;
