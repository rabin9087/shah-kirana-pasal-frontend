import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "react-modal";
import CardPaymentModal from "./CardPaymentModal";
import { FcMoneyTransfer } from "react-icons/fc";
import { CiCreditCard1 } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/hooks";
import SearchBarComponent, { SearchResults } from "./SearchUser";
import {decreaseQuantity, increaseQuantity, removeProduct } from "@/redux/storeCart";
import AddUser from "@/components/dashboard/userDashboard/AddUser";

interface StoreCartSidebarProps {
    isSidebarHovered: boolean;
    setIsSidebarHovered: (value: boolean) => void;
    result: any;
    setResults: (results: any) => void;
    actualTotal: number;
    customerCash: number;
    setCustomerCash: (value: number) => void;
    handlePayment: (method: string) => void;
    changeAmount: number;
    amountReceive: number;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    isOpenQRCode: boolean;
    setIsOpenQRCode: (value: boolean) => void;
    handleCardConfirmation: (method: string) => void;
}

const StoreCartSidebar: React.FC<StoreCartSidebarProps> = ({
    isSidebarHovered,
    setIsSidebarHovered,
    result,
    setResults,
    actualTotal,
    customerCash,
    setCustomerCash,
    handlePayment,
    changeAmount,
    amountReceive,
    isOpen,
    setIsOpen,
    isOpenQRCode,
    setIsOpenQRCode,
    handleCardConfirmation,
}) => {
    const dispatch = useAppDispatch();
    const { language } = useAppSelector(state => state.settings);
    const { customer } = useAppSelector(state => state.userInfo);
    const { totalAmount, items } = useAppSelector(state => state.storeCart);

    return (
        <div
            className="fixed right-0 top-0 h-full w-full md:w-[400px] shadow-2xl bg-white p-4 mt-[80px] rounded-l-2xl z-30 flex flex-col"
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
        >
            <h2 className="text-xl font-bold mb-4 text-center">Store Cart</h2>
            <div className="flex justify-start gap-2 items-center">
                <p className="w-1/3 ps-2">{customer?.fName + " " + customer?.lName}</p>
                <div className="flex flex-col gap-2 w-2/3">
                    <div className="flex justify-end items-center gap-2">
                        <div className="w-[120px]">
                            <SearchBarComponent
                                types="users"
                                results={result}
                                setResults={setResults}
                            />
                        </div>
                        <Button type="button" onClick={() => setIsOpen(true)}>
                            + Add
                        </Button>
                    </div>
                    <div className="flex justify-end me-4 bg-gray-500">
                        <SearchResults results={result} setResults={setResults} routePrefix="" />
                    </div>
                </div>
            </div>

            <div
                className={`mt-4 px-4 space-y-2 ${isSidebarHovered ? 'overflow-y-auto' : 'overflow-hidden'} max-h-[600px] sm:max-h-[500px] pb-8 mb-8`}
            >
                {items.map((item) => (
                    <div key={item._id} className="flex gap-2 mb-4 border-b pb-2 shadow rounded p-2">
                        <img
                            src={item?.thumbnail}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded"
                        />
                        <div className="flex flex-col w-full">
                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                            <div className='flex justify-between'>
                                <p className="text-sm text-gray-600">Rs. {(item.salesPrice ?? item.price).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">
                                    Subtotal: Rs. {((item.salesPrice ?? item.price) * item.orderQuantity).toFixed(2)}
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

            <div className="mt-2 border-t mb-20">
                <div className="flex flex-col me-4">
                    <div className="flex justify-between w-full md:w-[350px] text-l font-bold pt-2 px-2">
                        <span className="text-gray-600">{language === "en" ? "Subtotal" : "उपकुल राशि"}</span>
                        <span> {language === "en" ? "Rs." : "रु."}{totalAmount.toFixed(2)}</span>
                    </div>
                    {(actualTotal - totalAmount) > 0 && (
                        <div className="w-full text-sm md:w-[350px] flex justify-end font-bold px-2">
                            <span className="w-fit bg-yellow-400 rounded-md px-2 py-1">
                                {language === "en" ? "SAVING Rs." : "बचत गर्दै रु."} {(actualTotal - totalAmount).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <Input
                        type="number"
                        placeholder="Cash received"
                        value={customerCash}
                        onChange={(e) => setCustomerCash(Number(e.target.value))}
                    />
                    {totalAmount > 0 && (
                        <div className='flex justify-between items-center m-auto gap-4'>
                            <Button type='button' onClick={() => handlePayment("Cash")}><FcMoneyTransfer /> Pay Cash</Button>
                            <Button type='button' onClick={() => handlePayment("Card")}><CiCreditCard1 /> Pay Card</Button>
                        </div>
                    )}
                    {changeAmount > 0 && (
                        <div>
                            <p className="text-blue-600 text-2xl font-semibold mb-4">
                                Customer gave: Rs.{amountReceive?.toFixed(2)}
                            </p>
                            <hr />
                            <p className="text-green-600 text-2xl font-semibold mb-4">
                                Change return to customer: Rs.{changeAmount?.toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                    className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
                >
                    <AddUser />
                    <Button type="button" onClick={() => setIsOpen(false)} className="mt-4 w-full">
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
    );
};

export default StoreCartSidebar;
