import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateAOrder, updateMultipleOrders } from "@/axios/order/order";
import { updatePickMultipleOrdersSuppliedQuantity, setPickMultipleOrders } from "@/redux/allOrders.slice";
import { IItemTypes } from "@/axios/order/types";
import { RiArrowTurnBackFill, RiArrowTurnForwardFill } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { formatLocation, sortItems } from "./startPicking/StartPickingOrder";
import ScanOrderProduct from "./ScanOrderProduct";
import OpenBasketLableModal, { NotFoundModal } from "./outOfStock/OpenBasketLableModal";
import audioSuccess from "../../../public/assets/audio/beep-329314.mp3";
import audioError from "../../../public/assets/audio/beep-313342.mp3";
import PrinterButton from "@/utils/printer/PrinterButton";

type ItemSummary = {
    productId: string;
    supplied?: number;
};

const StartPickingMultipleOrders = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { orders, pickMultipleOrders } = useAppSelector((s) => s.ordersInfo);
    const { user } = useAppSelector((s) => s.userInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBasketLabelOpen, setIsBasketLabelOpen] = useState(false);
    const [basketCheck, setBasketCheck] = useState(false);
    const [articleCheck, setArticleCheck] = useState(false);
    const [packing, setPacking] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [basketNumber, setBasketNumber] = useState<number>(0);
    const [buff, setBuff] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);
    const queryClient = useQueryClient()
    const audioPlaySuccess = new Audio(audioSuccess);
    const audioPlayError = new Audio(audioError);


    let allItems = []

    const pickingMultipleOrders = useMemo(
        () => orders.filter((order) => order.deliveryStatus === "Picking" && order.picker?.userId === user?._id),
        [orders, user]
    );

    const pickNewMultipleOrders = useMemo(
        () => orders.filter((order) => order.deliveryStatus === "Order placed"),
        [orders, user]
    );

    // const handelOnSetBasket = () => {
    //     for (const basket in pickMultipleOrders) {
    //         const basnketNumber = pickMultipleOrders[basket].orderNumber;
    //         if (basnketNumber === currentItemOrder?.orderNumber) {
    //             return setBasketNumber(parseInt(basket) + 1);
    //         }
    //     }
    // };

    for (let i = 0; i < pickMultipleOrders.length; i++) {
        const items = (pickMultipleOrders[i]?.items || []);
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

    const totalProductOfSameId = sortedItems.filter((item) => item?.productId?._id === currentItem?.productId?._id)?.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)
    const totalItemsToPick = sortedItems.reduce((acc, { quantity }) => {
        return acc + (quantity as number)
    }, 0)
    const timeAllocatedToPick = totalItemsToPick * 20
    const totalPickingTime = (): number => {
        const updatedAt = pickMultipleOrders[0]?.startPickingTime;

        if (!updatedAt) return 0;

        const startTime = new Date(updatedAt).getTime();
        const now = Date.now();
        return Math.floor((now - startTime) / 1000);
    };

    const currentItemOrder = pickMultipleOrders?.find(order =>
        order.items.some(item => item._id === currentItem?._id)
    );

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
        setBasketCheck(false)
        setArticleCheck(false)
        setModalImage(null);
    };

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true);

        if (!pickMultipleOrders.length) {
            setPacking(false);
            return;
        }

        // Step 1: Extract unique orderNumbers from pickMultipleOrders
        const allOrderNumbers = Array.from(
            new Set(pickMultipleOrders.map(order => order.orderNumber))
        );

        // Step 2: Get matching orders
        const multipleOrderPicking = orders.filter(order =>
            allOrderNumbers.includes(order?.orderNumber as number)
        );

        // Step 3: Flatten all existing items from matched orders
        const oldMultipleOrdersItems: IItemTypes[] = multipleOrderPicking.flatMap(order => order.items || []);

        // Step 4: Get only updated items
        const updateChanged: IItemTypes[] = getChangedItems(oldMultipleOrdersItems, sortedItems);

        // Step 5: Build unique orderItems array
        const orderItems: { orderNumber: number, items: ItemSummary[], deliveryStatus: string, endPickingTime?: Date | null }[] = [];

        for (const orderNumber of allOrderNumbers) {
            const matchingOrder = pickMultipleOrders.find(order => order.orderNumber === orderNumber);

            if (!matchingOrder) continue;

            // Filter only changed items from this order
            const newItems = matchingOrder.items.filter(item =>
                updateChanged.some(changed => changed._id === item._id)
            );

            if (newItems.length > 0) {
                orderItems.push({
                    orderNumber: orderNumber as number,
                    items: newItems.map(({ productId, supplied }) => ({
                        productId: productId._id,
                        supplied
                    })),
                    deliveryStatus: status,
                    endPickingTime: status === "Packed" ? new Date() : null
                });
            }
        }
        // Step 6: Call API if there are changes

        // Step 7: Cleanup
        setPacking(false);
        navigate("/dashboard/orders");

        if (updateChanged.length) {
            await updateMultipleOrders(orderItems);
        }
        queryClient.invalidateQueries({ queryKey: ["orders", orders[0]?.requestDeliveryDate] });
        // dispatch(setPickMultipleOrders([]));
    };

    const updateSuppliedQuintity = () => {
        const supplied = currentItem?.supplied + 1;

        if (supplied > currentItem?.quantity) return;

        dispatch(updatePickMultipleOrdersSuppliedQuantity({ _id: currentItem._id, supplied }));

        if (supplied === currentItem?.quantity) {
            // handelOnSetBasket();
            setIsBasketLabelOpen(true); // Only open basket label, do not move index here
        }
        if (currentIndex + 1 === sortedItems.length) return;
    };

    const resetSuppliedQuintity = () => {
        dispatch(updatePickMultipleOrdersSuppliedQuantity({ _id: currentItem._id, supplied: 0 }))
    }

    const handleBarcodeScan = (scannedCode: string) => {
        setBarcode(scannedCode);
        if (scannedCode === currentItem?.productId?.qrCodeNumber) {
            setBarcode("");
            updateSuppliedQuintity();
        } else {
            setBasketCheck(true)
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
                setBarcode(buff.trim());
                // Finalize the barcode
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
        for (const basket in pickMultipleOrders) {
            const basnketNumber = pickMultipleOrders[basket].orderNumber;
            if (basnketNumber === currentItemOrder?.orderNumber) {
                setBasketNumber(parseInt(basket) + 1);
            }
        }
        if (!barcode) return;
        const handleBasketLabelScan = () => {
            const match = barcode === currentItemOrder?.orderNumber?.toString();
            if (match) {
                audioPlaySuccess.play()
                setIsBasketLabelOpen(false);
                if (sortedItems.length !== currentIndex + 1) {
                    setCurrentIndex(currentIndex + 1)
                }

            } else {
                audioPlayError.play()
                setBasketCheck(true)
                setArticleCheck(true)
            }
            return setBarcode("")

        };

        const handleProductScan = () => {
            const match = barcode === currentItem?.productId?.qrCodeNumber;
            if (match) {
                audioPlaySuccess.play()
                updateSuppliedQuintity();
            } else {
                audioPlayError.play()
                setArticleCheck(true)
            }
            return setBarcode("");
        };

        isBasketLabelOpen
            ? handleBasketLabelScan()
            : handleProductScan();

        // Always clear barcode after handling

        const timeout = setTimeout(() => setBarcode(""), 500);

        return () => clearTimeout(timeout);
    }, [barcode, currentItemOrder?.orderNumber, currentItem?.productId?.qrCodeNumber]);

    useEffect(() => {
        if (!orders || orders.length === 0) return;

        if (pickingMultipleOrders.length > 0) {
            const pickingOrders = orders
                .filter(
                    order =>
                        order.deliveryStatus === "Picking" &&
                        order.picker?.userId === user?._id &&
                        order.items.some(item => (item.supplied as number) < item.quantity)
                )
                .map(order => ({
                    ...order,
                    items: order.items.filter(item => (item.supplied as number) < item.quantity)
                }));

            dispatch(setPickMultipleOrders(pickingOrders.slice(0, 4)));
            return; // ✅ stop here if pickingMultipleOrders
        }

        if (pickNewMultipleOrders.length > 0) {
            const orderPlacedOrders = orders
                .filter(
                    order =>
                        order.deliveryStatus === "Order placed" &&
                        order.items.some(item => (item.supplied as number) < item.quantity)
                )
                .map(order => ({
                    ...order,
                    items: order.items.filter(item => (item.supplied as number) < item.quantity)
                }));
            dispatch(setPickMultipleOrders(orderPlacedOrders.slice(0, 4)));
        }
    }, [orders, user?._id, pickingMultipleOrders.length, pickNewMultipleOrders.length, dispatch]);

    useEffect(() => {
        const updateOrders = async () => {
            if (pickMultipleOrders.length && user._id) {
                for (const order of pickMultipleOrders) {
                    if (!order._id || order.deliveryStatus === "Picking") continue;

                    await updateAOrder(order._id, {
                        deliveryStatus: "Picking",
                        picker: {
                            userId: user._id,
                            name: `${user.fName} ${user.lName}`,
                        },
                        startPickingTime: new Date()
                    });
                }
            }
        };
        updateOrders();
    }, [pickMultipleOrders.length, user._id,]);

    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p- border rounded-lg shadow-lg bg-white">
                    <div>
                        <Button className="bg-primary text-white p-2 rounded-md ms-2 mt-2"
                            onClick={() => updateDeliveryStatus("Picking")}
                            disabled={packing}
                        >
                            {"<"} BACK
                        </Button>
                    </div>
                    {pickMultipleOrders.length && <PrinterButton printMultipleOrder={pickMultipleOrders} />}

                    <div className="mt-1 space-y-1 flex-1 overflow-auto max-h-screen">
                        {currentItem && (
                            <CardContent className="flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm bg-gray-100">
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md gap-2">
                                    <p className="text-[28px] font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="text-white">
                                            <p className="font-thin text-sm">{(currentItem?.quantity < totalProductOfSameId) ? (currentItem?.quantity + "/" + totalProductOfSameId) : "All"} </p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2 rounded-md bg-white px-2">

                                            <p className={`${bay % 2 === 1 ? "text-green-500" : "text-gray-200"} font-extrabold`}><FaArrowLeft size={20} /></p>
                                            <p className={`${bay % 2 === 0 ? "text-green-500" : "text-gray-200"}  font-extrabold`}><FaArrowRight size={20} /></p>
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
                                                        <div className="flex-1 text-center bg-gray-100 p-2 rounded-md border shadow-sm">
                                                            <p className="text-xs text-gray-500">Basket</p>
                                                            <p className="text-lg font-medium">{basketNumber}</p>
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
                            <div className="flex justify-around px-2 gap-1 mt-2">
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


            </div>}

            {(basketCheck || articleCheck) &&
                <NotFoundModal
                    articleCheck={articleCheck}
                    basketCheck={basketCheck}
                    isBasketLabelOpen={isBasketLabelOpen}
                    closeNotFoundModal={closeModal} />}

            {isBasketLabelOpen &&
                <OpenBasketLableModal
                    isBasketLabelOpen={isBasketLabelOpen}
                    closeModal={closeModal}
                    orderNumber={currentItemOrder?.orderNumber as number}
                    basketNumber={basketNumber}
                    supplied={currentItem?.supplied}
                />}

        </>
    );
};

export default StartPickingMultipleOrders;