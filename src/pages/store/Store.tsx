import { useAppSelector, useAppDispatch } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { setProducts } from '@/redux/product.slice';
import { Button } from '@/components/ui/button';
import { IProductTypes } from '@/types/index';
import { getAllProducts } from '@/axios/product/product';
import { addProduct, clearStoreCart } from '@/redux/storeCart';
import CustomModal from '@/components/CustomModal';
import { toast } from 'react-toastify';
import { StoreProductCard } from './StoreProductCard';
import { createStoreSales } from '@/axios/storeSale/storeSale';
import { IStoreSale, IStoreSaleItemTypes } from './types';
import StoreCartSidebar from './StoreSidebar';
import { resetCustomer } from '@/redux/user.slice';
import Layout from '@/components/layout/Layout';

export const Store = () => {
    const [barcode, setBarcode] = useState("");
    const [dynamicTotalAmount, setDynamicTotalAmount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenQRCode, setIsOpenQRCode] = useState(false);
    const [result, setResults] = useState([]);
    const [customerCash, setCustomerCash] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [addVat, setAddVat] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [amountRecieve, setAmountRecieve] = useState(0);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const { products } = useAppSelector(state => state.productInfo);
    const { user, customer } = useAppSelector(state => state.userInfo);
    const { items, totalAmount } = useAppSelector(state => state.storeCart);
    const dispatch = useAppDispatch();

    const { data = [] } = useQuery<IProductTypes[]>({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
    });

    useEffect(() => {
        if (data.length) {
            dispatch(setProducts(data));
        }
    }, [dispatch, data]);

    useEffect(() => {
        if (barcode) {
            const foundProduct = products.find(p => p.qrCodeNumber === barcode);
            if (foundProduct) {
                dispatch(addProduct(foundProduct));
            } else {
                toast.error("Product not found");
            }
            setBarcode("");
        }
    }, [barcode, products, dispatch]);

    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const saleProducts = filteredProducts.filter(p => p.salesPrice);
    const nonSaleProducts = filteredProducts.filter(p => !p.salesPrice);

    const storeSaleItems: IStoreSaleItemTypes[] = items.map((item) => ({
        productId: item._id,
        price: item.salesPrice ? item.salesPrice : item.price,
        orderQuantity: item.orderQuantity,
    }));

    const handlePayment = async (paymentMethod: string) => {
        if (items.length === 0) {
            return toast.error("Cart is empty.");
        }

        if (paymentMethod === "Cash") {
            if (customerCash < (totalAmount - discount + addVat)) {
                return toast.error("Customer cash is less than the total amount.");
            }

            const customeSale: IStoreSale = {
                name: `${customer.fName} ${customer.lName}`,
                phone: customer.phone,
                email: customer.email,
                items: storeSaleItems,
                paymentMethod,
                paymentStatus: "Paid",
                amount: dynamicTotalAmount - discount + addVat,
                saler: { userId: user._id, name: `${user.fName} ${user.lName}` },
            };

            setChangeAmount(customerCash - dynamicTotalAmount + discount - addVat);
            setAmountRecieve(customerCash);
            await createStoreSales(customeSale);
            toast.success("Cash payment successful!");
            dispatch(clearStoreCart());
            dispatch(resetCustomer());
            setCustomerCash(0);
            setDiscount(0);
            setAddVat(0);
        } else if (paymentMethod === "Card") {
            setIsOpenQRCode(true);
        }
    };
    console.log("new amount",dynamicTotalAmount - discount + addVat)
    const handleCardConfirmation = async (method: string) => {
        const customeSale: IStoreSale = {
            name: `${customer.fName} ${customer.lName}`,
            phone: customer.phone,
            email: customer.email,
            items: storeSaleItems,
            paymentMethod: method,
            paymentStatus: "Paid",
            amount: dynamicTotalAmount - discount + addVat,
            saler: { userId: user._id, name: `${user.fName} ${user.lName}` },
        };

        await createStoreSales(customeSale);
        toast.success("Card payment successful!");
        dispatch(clearStoreCart());
        dispatch(resetCustomer());
        setDiscount(0);
        setAddVat(0);
        setIsOpenQRCode(false);
    };

    useEffect(() => {
        if (items.length > 0) {
            setChangeAmount(0);
        }
    }, [items.length]);

    return (
        <Layout title=''>
            <div className="flex relative">
                <div className="w-full p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-72 ml-auto">
                            {/* <SearchBarComponent
                                results={ }
                                setResults={ }
                                types=''
                                
                             /> */}
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="border rounded p-2 w-full pr-8" // Add right padding for the button
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-all"
                                >
                                    &#10005; {/* Or use an icon like <XIcon /> */}
                                </button>
                            )}
                        </div>


                        <div className="text-center ps-20 sm:ps-0 w-full">
                            <CustomModal scanCode={setBarcode} scan={true} />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Sale Products</h2>
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mr-0 lg:mr-[400px]">
                            {saleProducts.map((product: IProductTypes) => (
                                <StoreProductCard key={product._id} item={product} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Non-Sale Products</h2>
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 mr-0 lg:mr-[400px]">
                            {nonSaleProducts.map((product: IProductTypes) => (
                                <StoreProductCard key={product._id} item={product} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar for larger screens */}
                <div className="hidden lg:block">
                    <StoreCartSidebar
                        isSidebarHovered={isSidebarHovered}
                        setIsSidebarHovered={setIsSidebarHovered}
                        result={result}
                        setResults={setResults}
                        onTotalChange={(amount: number) => setDynamicTotalAmount(amount)}
                        customerCash={customerCash}
                        setCustomerCash={setCustomerCash}
                        handlePayment={handlePayment}
                        changeAmount={changeAmount}
                        amountReceive={amountRecieve}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        isOpenQRCode={isOpenQRCode}
                        setIsOpenQRCode={setIsOpenQRCode}
                        handleCardConfirmation={handleCardConfirmation}
                        addVat={addVat}
                        discount={discount}
                        setDiscount={setDiscount}
                        setAddVat={setAddVat}
                    />
                </div>

                {/* Mobile button */}
                <div className="fixed w-full text-center bottom-4 xl:hidden z-10">
                    <Button
                        className="w-full max-w-xs mx-auto"
                        onClick={() => setShowMobileSidebar(true)}
                    >
                        Open Cart
                    </Button>
                </div>


                {/* Mobile Sidebar */}
                {showMobileSidebar && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-end">
                        <div className="bg-white w-full h-full rounded-t-lg shadow-lg transform transition-all duration-500 translate-y-0 p-4">
                            <div className="flex justify-end items-center mb-4">
                                <button
                                    onClick={() => setShowMobileSidebar(false)}
                                    className="text-lg font-bold px-3 py-1 border rounded"
                                >
                                    Close
                                </button>
                            </div>
                            <StoreCartSidebar
                                isSidebarHovered={isSidebarHovered}
                                setIsSidebarHovered={setIsSidebarHovered}
                                result={result}
                                setResults={setResults}
                                customerCash={customerCash}
                                onTotalChange={(amount: number) => setDynamicTotalAmount(amount)}
                                setCustomerCash={setCustomerCash}
                                handlePayment={handlePayment}
                                changeAmount={changeAmount}
                                amountReceive={amountRecieve}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                isOpenQRCode={isOpenQRCode}
                                setIsOpenQRCode={setIsOpenQRCode}
                                handleCardConfirmation={handleCardConfirmation}
                                addVat={addVat}
                                discount={discount}
                                setDiscount={setDiscount}
                                setAddVat={setAddVat}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
