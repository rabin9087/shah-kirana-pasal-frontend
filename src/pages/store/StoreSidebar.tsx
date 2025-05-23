import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "react-modal";
import CardPaymentModal from "./CardPaymentModal";
import { FcMoneyTransfer } from "react-icons/fc";
import { CiCreditCard1 } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/hooks";
import SearchBarComponent, { SearchResults } from "./SearchUser";
import { decreaseQuantity, increaseQuantity, removeProduct } from "@/redux/storeCart";
import AddUser from "@/components/dashboard/userDashboard/AddUser";
import { toast } from "react-toastify";
import { resetCustomer } from "@/redux/user.slice";
import { CalculatorIcon } from "lucide-react";
import Calculator from "@/components/calculator/Calculator";
import CustomerDue from "../customer/CustomerDue";

interface StoreCartSidebarProps {
    isSidebarHovered: boolean;
    setIsSidebarHovered: (value: boolean) => void;
    result: any;
    setResults: (results: any) => void;
    customerCash: number;
    onTotalChange: (amount: number) => void;
    setCustomerCash: (value: number) => void;
    setDiscount: (discount: number) => void;
    setAddVat: (addVat: number) => void;
    handlePayment: (method: string) => void;
    changeAmount: number;
    addVat: number;
    discount: number;
    amountReceive: number;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isOpenQRCode: boolean;
    setIsOpenQRCode: (value: boolean) => void;
    handleCardConfirmation: (method: string) => void;
    setNewPrices: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    newPrices: { [key: string]: number };
    storeData: boolean
}

const StoreCartSidebar: React.FC<StoreCartSidebarProps> = ({
    isSidebarHovered,
    setIsSidebarHovered,
    result,
    setResults,
    customerCash,
    setCustomerCash,
    handlePayment,
    changeAmount,
    amountReceive,
    isOpen,
    onTotalChange,
    setIsOpen,
    isOpenQRCode,
    setIsOpenQRCode,
    handleCardConfirmation,
    setDiscount,
    setAddVat,
    addVat,
    discount,
    setNewPrices,
    newPrices,
    storeData,
}) => {
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.settings);
    const { customer } = useAppSelector(state => state.userInfo);
    const { totalAmount, items } = useAppSelector(state => state.storeCart);
    const actualTotal = items.reduce((acc, { orderQuantity, price }) => acc + orderQuantity * price, 0);
    const [calculator, setCalculator] = useState<boolean>(false)
    const [showCustomerDue, setShowCustomerDue] = useState<boolean>(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handelOnClearCustomer = () => {
        dispatch(resetCustomer());
    }

    const dynamicTotalAmount = items.reduce((acc, item) => {
        const price = newPrices[item._id] ?? item.salesPrice ?? item.price;
        return acc + price * item.orderQuantity;
    }, 0);

    useEffect(() => {
        onTotalChange(dynamicTotalAmount);
    }, [dynamicTotalAmount]);

    const scrollToItem = (index: number) => {
        if (scrollContainerRef.current) {
            const itemElement = scrollContainerRef.current?.children[index];
            itemElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };


    useEffect(() => {
        if (items.length > 0) scrollToItem(items.length - 1);
    }, [items.length]);

    return (
        <div
            className="mb- fixed right-0 top-0 h-full w-full md:w-[400px] shadow-2xl bg-white p-4 mt-[80px] rounded-l-2xl z-30 flex flex-col"
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
        >
            <h2 className="text-xl font-bold mb-4 text-center">Store Cart</h2>
            <div className="flex justify-start gap-2 items-center">
                <p className="w-1/3 ps-2 hover:text-gray-500 hover:cursor-pointer"
                    onClick={() => setShowCustomerDue(true)}>
                    {customer?.fName + " " + customer?.lName}</p>

                <div className="flex flex-col gap-2 w-2/3">
                    <div className="flex justify-end items-center gap-2">
                        {customer?._id && <p onClick={() => handelOnClearCustomer()}
                            className="p-1 border px-2 bg-red-500 text-white rounded-md text-end hover:focus: hover:bg-red-300">
                            x</p>}                        <div className="w-[120px]">
                            <SearchBarComponent
                                types="users"
                                results={result}
                                setResults={setResults}
                            />
                        </div>
                        <Button className="py-1" type="button" onClick={() => setIsOpen(true)}>
                            + Add
                        </Button>
                    </div>
                    <div className="flex justify-end me-4 bg-gray-500">
                        <SearchResults results={result} setResults={setResults} routePrefix="" />
                    </div>
                </div>
            </div>

            <div >
                <div
                    className={`border border-blue-400 mt-2 px-4 space-y-1 ${isSidebarHovered ? 'overflow-y-auto' : 'overflow-hidden'} max-h-[400px] sm:max-h-[350px] pb-2 mb-2 z-30`}
                >
                    {items.map((item, index) => (
                        <div key={item._id}
                            onClick={() => scrollToItem(index)}
                            className="flex gap-2 mb-4 border-b pb-2 shadow rounded p-2">
                            <img
                                src={item?.thumbnail}
                                alt={item.name}
                                className="w-14 h-14 object-fill rounded text-center mt-3"
                            />
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center">
                                    <strong className="font-semibold text-sm line-clamp-2">{item.name}</strong>
                                    <input
                                        type="number"
                                        className="w-16 border border-blue-500 rounded-md ps-2 text-sm"
                                        placeholder="New Price"
                                        value={newPrices[item._id] ?? item.salesPrice ?? item.price}
                                        onChange={(e) =>
                                            setNewPrices((prev) => ({
                                                ...prev,
                                                [item._id]: Number(e.target.value),
                                            }))
                                        }

                                    />
                                </div>

                                <div className='flex justify-between'>
                                    <p className="text-sm text-gray-600">Rate: $ {(item.salesPrice ?? item.price).toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">
                                        Subtotal: $ {((item.salesPrice ?? item.price) * item.orderQuantity).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center gap-2 mt-2">
                                    <div className='flex justify-between items-center gap-3'>
                                        <Button className='w-1/3' size="sm" onClick={() => dispatch(decreaseQuantity(item._id))}> - </Button>
                                        <p className="w-1/2 font-medium">{item.orderQuantity}</p>
                                        <Button className='w-1/3' size="sm" onClick={() => dispatch(increaseQuantity(item._id))}> + </Button>
                                    </div>
                                    <Button size="sm" variant="destructive" onClick={() => dispatch(removeProduct(item._id))}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-2 border-t mb-20 ">

                    <div className="flex justify-between items-center">
                        <div className="flex justify-between border-r items-center w-full md:w-[350px] text-sm font-bold pt-2 px-2">
                            <p className="w-1/2 text-gray-600">{language === "en" ? "Discount" : "छुट"}</p>
                            <input
                                className="w-1/2 text-sm border py-1 ps-2 me-4 md:me-0"
                                type="number"
                                placeholder="Enter discount"
                                value={discount}
                                min={0}
                                onChange={(e) => {
                                    const enteredDiscount = Number(e.target.value);
                                    const maxDiscount = totalAmount * 0.3;

                                    if (enteredDiscount > maxDiscount) {
                                        toast.error(`Discount can't exceed 30% (${maxDiscount.toFixed(2)}) of total (${totalAmount}).`);
                                        setDiscount(0);
                                    } else {
                                        setDiscount(enteredDiscount);
                                    }
                                }}
                            />

                        </div>
                        <div className="flex justify-between items-center w-full md:w-[350px] text-sm font-bold pt-2 px-2">
                            <p className="w-1/2 text-gray-600">{language === "en" ? "Add VAT" : ""}</p>
                            <input
                                className="w-1/2 text-sm border py-1 ps-2 me-4 md:me-0"
                                type="number"
                                placeholder="Enter VAT"
                                value={addVat}
                                min={0}
                                onChange={(e) => {
                                    const enteredDiscount = Number(e.target.value);
                                    // const maxDiscount = totalAmount * 0.1;
                                    setAddVat(enteredDiscount);
                                    // if (enteredDiscount > maxDiscount) {
                                    //     toast.error(`Discount can't exceed 10% (${maxDiscount.toFixed(2)}) of total (${totalAmount}).`);
                                    //     setDiscount(0);
                                    // } else {
                                    //     setVat(enteredDiscount);
                                    // }
                                }}
                            />

                        </div>
                    </div>

                    <div className="flex flex-col me-4">
                        <div className="flex justify-between w-full md:w-[350px] text-base md:text-xl font-bold pt-2 px-2">
                            <span className="text-gray-600">
                                {language === "en" ? "Final Total" : "छुट पछि कुल"}
                            </span>
                            <span>
                                {language === "en" ? "$" : "रु."}
                                {(dynamicTotalAmount - discount + addVat).toFixed(2)}
                            </span>
                        </div>
                        {(actualTotal - totalAmount + discount - addVat) > 0 && (
                            <div className="w-full text-sm md:w-[350px] flex justify-end font-bold px-2 mb-1">
                                <span className="w-fit bg-yellow-400 rounded-md px-2 py-1 text-sm">
                                    {language === "en" ? "SAVING $" : "बचत गर्दै रु."}
                                    {(actualTotal - dynamicTotalAmount + discount - addVat).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 my-2">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex-2">
                                <Input
                                    type="number"
                                    placeholder="Cash received"
                                    value={customerCash}
                                    onChange={(e) => setCustomerCash(Number(e.target.value))}
                                />
                            </div>
                            <div className="flex-1 items-center justify-center">
                                <Button type='button' className="hover:bg-blue-400" disabled={storeData} onClick={() => handlePayment("Cash")}><FcMoneyTransfer />Cash</Button>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <CalculatorIcon
                                    className="cursor-pointer w-8 h-8 text-muted-foreground hover:text-primary"
                                    onClick={() => setCalculator(true)}
                                />
                            </div>
                        </div>


                        {totalAmount > 0 && (
                            <div className='flex justify-between items-center m-auto gap-4 mt-2'>
                                <Button type='button' className="w-full hover:bg-blue-400" disabled={storeData} onClick={() => handlePayment("Exact")}>
                                    Exact Amount
                                </Button>
                                <Button type='button' className="hover:bg-blue-400" disabled={storeData} onClick={() => handlePayment("Card")}><CiCreditCard1 />Card</Button>
                                <Button type='button' className="hover:bg-blue-400" disabled={storeData} onClick={() => handlePayment("Due")}><CiCreditCard1 />Due</Button>
                            </div>
                        )}
                        {(
                            <div>
                                <p className="text-blue-600 text-2xl font-semibold mb-4">
                                    Received: ${amountReceive?.toFixed(2)}
                                </p>
                                <hr />
                                <p className="text-green-600 text-2xl font-semibold mb-4">
                                    Change: ${changeAmount?.toFixed(2)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* show user signup form */}
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                        className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
                    >
                        <AddUser />
                        <div>

                        </div>
                        <Button type="button" onClick={() => setIsOpen(false)} className="mt-4 w-full">
                            Close
                        </Button>
                    </Modal>

                    {/* Show customer Due */}
                    <Modal
                        isOpen={showCustomerDue}
                        onRequestClose={() => setShowCustomerDue(false)}
                        overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                        className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
                    >
                        <CustomerDue />
                        <div>

                        </div>
                        <Button type="button" onClick={() => setShowCustomerDue(false)} className="mt-4 w-full">
                            Close
                        </Button>
                    </Modal>

                    {/* Show calculator */}
                    <Modal
                        isOpen={calculator}
                        onRequestClose={() => setCalculator(false)}
                        overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                        className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
                    >
                        <Calculator />
                        <div>

                        </div>
                        <Button type="button" onClick={() => setCalculator(false)} className="mt-4 w-full">
                            Close
                        </Button>
                    </Modal>

                    <CardPaymentModal
                        isOpenQRCode={isOpenQRCode}
                        setIsOpenQRCode={setIsOpenQRCode}
                        onPaymentConfirm={handleCardConfirmation}
                    />
                </div>
            </div>
        </div>
    );
};

export default StoreCartSidebar;