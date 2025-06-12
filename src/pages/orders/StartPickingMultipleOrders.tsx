import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateMultipleOrders } from "@/axios/order/order";
import { updatePickMultipleOrdersSuppliedQuantity, setPickMultipleOrders } from "@/redux/allOrders.slice";
import { IItemTypes } from "@/axios/order/types";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { RiArrowTurnBackFill, RiArrowTurnForwardFill } from "react-icons/ri";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { formatLocation, sortItems } from "./startPicking/StartPickingOrder";
import ScanOrderProduct from "./ScanOrderProduct";
import OpenBasketLableModal, { NotFoundModal } from "./outOfStock/OpenBasketLableModal";
import audioSuccess from "../../../public/assets/audio/beep-329314.mp3";
import audioError from "../../../public/assets/audio/beep-313342.mp3";

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
    const [baketNumber, setBasketNumber] = useState<number>(0);
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

    const handelOnSetBasket = () => {
        for (let i = 0; i < pickMultipleOrders.length; i++) {
            const basnketNumber = pickMultipleOrders[i].orderNumber;
            if (basnketNumber === currentItemOrder?.orderNumber) {
                return setBasketNumber(i + 1);
            }
        }
    };

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (orders.length) {
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
                const matchingOrder = pickMultipleOrders.find(order => order.orderNumber === orderNumber);

                if (!matchingOrder) continue;

                // Filter only changed items from this order
                const newItems = matchingOrder.items.filter(item =>
                    updateChanged.some(changed => changed._id === item._id)
                );

                if (newItems.length > 0) {
                    orderItems.push({ orderNumber, items: newItems.map(({ productId, supplied }) => ({ productId: productId._id, supplied })), deliveryStatus: status });
                }
            }
            setPacking(false)
            navigate("/dashboard/orders")
            updateChanged.length && await updateMultipleOrders(orderItems)
            dispatch(setPickMultipleOrders([]))
            queryClient.invalidateQueries({ queryKey: ["orders", (orders[0].requestDeliveryDate)] })

        }
        setPacking(false)
        navigate("/dashboard/orders")
        return;
    }

    const updateSuppliedQuintity = () => {
        const supplied = currentItem?.supplied + 1;

        if (supplied > currentItem?.quantity) return;

        dispatch(updatePickMultipleOrdersSuppliedQuantity({ _id: currentItem._id, supplied }));

        if (currentIndex + 1 === sortedItems.length) return;

        if (supplied === currentItem?.quantity) {
            handelOnSetBasket();
            setIsBasketLabelOpen(true); // Only open basket label, do not move index here
        }
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
        if (!barcode) return;
        const handleBasketLabelScan = () => {
            const match = barcode === currentItemOrder?.orderNumber?.toString();
            if (match) {
                audioPlaySuccess.play()
                setIsBasketLabelOpen(false);
                setCurrentIndex(currentIndex + 1)
            } else {
                audioPlayError.play()
                setBasketCheck(true)
            }
            return match;
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
        };

        const processed = isBasketLabelOpen
            ? handleBasketLabelScan()
            : handleProductScan();

        // Always clear barcode after handling
        if (processed) {
            setBarcode("");
        }

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

            dispatch(setPickMultipleOrders(pickingOrders));
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

            dispatch(setPickMultipleOrders(orderPlacedOrders));
        }
    }, [orders, user?._id, pickingMultipleOrders.length, pickNewMultipleOrders.length, dispatch]);


    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">

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
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md">
                                    <p className="text-2xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                    <div className="flex justify-center items-center gap-2 rounded-md bg-white px-2 text-xl">
                                        {aisle === lastAisle ? "" :
                                            aisle % 2 === 0 ?
                                                <p className="text-green-500 font-extrabold "
                                                    style={{ transform: 'scaleY(-1)' }}><RiArrowTurnForwardFill size={20} /></p> :
                                                <p className="text-green-500 font-extrabold"><RiArrowTurnBackFill size={20} /></p>
                                        }
                                        <p className={`${bay % 2 === 0 ? "text-green-500" : "text-gray-200"} font-extrabold`}><FaArrowLeft size={20} /></p>
                                        <p className={`${bay % 2 === 1 ? "text-green-500" : "text-gray-200"}  font-extrabold`}><FaArrowRight size={20} /></p>
                                    </div>
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
                                        <p className="text-xs">SKU: <strong className="text-xl"> {currentItem?.productId?.sku}</strong></p>
                                        <p className="text-xs">Price: ${currentItem?.productId?.price}</p>
                                        <p className="text-xs">SOH: {currentItem?.productId?.quantity}</p>
                                        <div className="flex justify-center items-center mt-2">
                                            <BarCodeGenerator value={currentItem?.productId?.qrCodeNumber} height={20} width={1} /></div>
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
                    baketNumber={baketNumber}
                    supplied={currentItem?.supplied}
                />}

        </>
    );
};

export default StartPickingMultipleOrders;