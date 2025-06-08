import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateAOrder } from "@/axios/order/order";
import { setOutOfStockOrders, updateSuppliedQuantity } from "@/redux/allOrders.slice";
import ScanOrderProduct from "./ScanOrderProduct";
import { IItemTypes } from "@/axios/order/types";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import { RiArrowTurnBackFill, RiArrowTurnForwardFill } from "react-icons/ri";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { formatLocation, sortItems } from "./StartPickingOrder";

const OutOfStockOrders = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const { order, orders, outOfStockOrders } = useAppSelector((s) => s.ordersInfo);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [packing, setPacking] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [buff, setBuff] = useState("");
    const [modalImage, setModalImage] = useState<string | null>(null);
    const sortedItems = sortItems(order?.items || []);
    const currentItem = sortedItems[currentIndex];
    const lastItem = sortedItems[currentIndex - 1];

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
        setNotFound(false)
        setModalImage(null);
    };

    const updateDeliveryStatus = async (status: string) => {
        setPacking(true)
        if (order?._id) {

            const { items } = pikingOrder[0]
            const updateItems = order?.items
            const updateChanged = getChangedItems(items, updateItems as IItemTypes[])
            updateChanged.length && await updateAOrder(order._id, { deliveryStatus: status, items: updateChanged.map(({ productId, supplied }) => ({ productId: productId._id, supplied })) })
            setPacking(false)
            navigate(-1)
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
            setNotFound(true)
        }

        setTimeout(() => setBarcode(""), 500); // Optional reset
    }, [barcode]);

    console.log(outOfStockOrders)

    useEffect(() => {
        if (orders && orders.length > 0 && outOfStockOrders.length === 0) {
            const filtered = orders?.filter(order =>order.deliveryStatus === "Packed");
            dispatch(setOutOfStockOrders(filtered));
        }
    }, [orders.length, outOfStockOrders.length, dispatch]);

    return (
        <>
            {<div className="w-full h-screen max-w-md mx-auto flex flex-col">
                <Card className="flex flex-col flex-1 p-4 border rounded-lg shadow-lg bg-white">
                    <h2 className="text-xl font-bold text-center mb-2">Order Details</h2>
                    <div>
                        <Button className="bg-primary text-white p-2 rounded-md ms-2"
                            onClick={() => updateDeliveryStatus("Packed")}
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
                                <div className="flex justify-between items-center w-full border-2 text-center p-2 bg-primary rounded-md">
                                    <p className="text-3xl font-bold text-white">{formatLocation(currentItem?.productId?.productLocation)}</p>
                                    <div className="flex justify-center items-center gap-2 rounded-md bg-white px-2 text-3xl">
                                        {aisle === lastAisle ? "" :
                                            aisle % 2 === 0 ?
                                                <p className="text-green-500 font-extrabold "
                                                    style={{ transform: 'scaleY(-1)' }}><RiArrowTurnForwardFill size={25} /></p> :
                                                <p className="text-green-500 font-extrabold"><RiArrowTurnBackFill size={25} /></p>
                                        }
                                        <p className={`${bay % 2 === 0 ? "text-green-500" : "text-gray-200"} font-extrabold`}><FaArrowLeft size={25} /></p>
                                        <p className={`${bay % 2 === 1 ? "text-green-500" : "text-gray-200"}  font-extrabold`}><FaArrowRight size={25} /></p>


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

                            {currentIndex + 1 === order?.items.length && (
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

export default OutOfStockOrders;
