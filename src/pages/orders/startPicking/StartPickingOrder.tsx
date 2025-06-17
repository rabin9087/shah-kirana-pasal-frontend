import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAOrder, updateAOrder } from "@/axios/order/order";
import { initialState, setAOrder, updateSuppliedQuantity } from "@/redux/allOrders.slice";
import ScanOrderProduct from "../ScanOrderProduct";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IItemTypes, IOrder } from "@/axios/order/types";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { RiArrowTurnBackFill, RiArrowTurnForwardFill } from "react-icons/ri";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { NotFoundModal } from "../outOfStock/OpenBasketLableModal";
import { GoDotFill } from "react-icons/go";

type ProductLocation = {
    A: number;
    B: number;
    S: number;
};

export const formatLocation = (location: string): string => {
    const parts = location.split(".").map((num) => num.padStart(2, ""));
    return `A${parts[0]} - B${parts[1]} - S${parts[2]}`;
};
export const parseLocation = (location: string): ProductLocation => {
    const [A, B, S] = location.split(".").map((num) => parseInt(num));
    return { A, B, S };
};

export const sortItems = (items: any) => {
    return [...items].sort((a, b) => {
        const locA = parseLocation(a.productId?.productLocation);
        const locB = parseLocation(b.productId?.productLocation);
        return locA.A - locB.A || locA.B - locB.B || locA.S - locB.S;
    });
};

const StartPickingOrder = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { orderNumber } = useParams();
    const { order, orders } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleCheck, setArticleCheck] = useState(false);
    const [packing, setPacking] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [buff, setBuff] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);

    const sortedItems = sortItems(order?.items || []);
    const currentItem = sortedItems[currentIndex];
    const lastItem = sortedItems[currentIndex - 1];

    const { data = initialState.order } = useQuery<IOrder>({
        queryKey: ['order', orderNumber],
        queryFn: () => getAOrder(orderNumber as string)
    })

    const queryClient = useQueryClient()
    const pikingOrder = orders?.filter((item) => item.orderNumber === order?.orderNumber);

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

    useEffect(() => {
        if (data?._id && JSON.stringify(data) !== JSON.stringify(order)) {
            dispatch(setAOrder(data as IOrder));
        } else if (data?._id === "") {
            dispatch(setAOrder(initialState.order as IOrder));
        }
    }, [dispatch, data]);

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

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (order?._id) {

            const { items } = pikingOrder[0]
            const updateItems = order?.items
            const updateChanged = getChangedItems(items, updateItems as IItemTypes[])
            const itemsQuantityLength = items?.reduce((acc, { quantity }) => {
                return acc + (quantity as number)
            }, 0)

            const updateChangedLength = updateChanged?.reduce((acc, { supplied }) => {
                return acc + (supplied as number)
            }, 0)
            const updateStatus = itemsQuantityLength === updateChangedLength ? "Completed" : status
            setPacking(false)
            navigate("/dashboard/orders")
            updateChanged.length && await updateAOrder(order._id, { deliveryStatus: updateStatus, items: updateChanged.map(({ productId, supplied }) => ({ productId: productId._id, supplied })), endPickingTime: status === "Packed" && new Date() })
            queryClient.invalidateQueries({ queryKey: ['order', orderNumber] })
            queryClient.invalidateQueries({ queryKey: ["orders", (order.requestDeliveryDate)] })
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
            setArticleCheck(false)
        }
    };

    const totalProductOfSameId = sortedItems.filter((item) => item?.productId?._id === currentItem?.productId?._id)?.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)

    const totalItemsToPick = sortedItems.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)

    const timeAllocatedToPick = totalItemsToPick * 20

    const totalPickingTime = (): number => {
        const updatedAt = order?.startPickingTime;

        if (!updatedAt) return 0;

        const startTime = new Date(updatedAt).getTime();
        const now = Date.now();
        return Math.floor((now - startTime) / 1000);
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
            setArticleCheck(false)
        }

        setTimeout(() => setBarcode(""), 500); // Optional reset
    }, [barcode]);


    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-bold text-center mb-2">Order Details</h2>
                    <div>
                        <Button className="bg-primary text-white p-2 rounded-md ms-2"
                            onClick={() => updateDeliveryStatus(order?.deliveryStatus === "Order placed" ? "Picking" : order?.deliveryStatus as string)}
                            disabled={packing}
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
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md gap-2">
                                    <p className="text-2xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
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

                                    {/* Barcode */}
                                    <div className="flex justify-center pt-2">
                                        <BarCodeGenerator value={currentItem?.productId?.qrCodeNumber} height={25} width={2} />
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

                {(articleCheck) &&
                    <NotFoundModal
                        articleCheck={articleCheck}
                        closeNotFoundModal={closeModal} />}
            </div>}
        </>
    );
};

export default StartPickingOrder;
