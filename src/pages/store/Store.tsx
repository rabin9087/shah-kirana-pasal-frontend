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
import SearchInput from '@/components/search/SearchInput';
import { IDue } from '@/axios/due/types';
import { createDue } from '@/axios/due/due';

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
    const [newPrices, setNewPrices] = useState<{ [key: string]: number }>({});
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const { products } = useAppSelector(state => state.productInfo);
    const { user, customer } = useAppSelector(state => state.userInfo);
    const { items } = useAppSelector(state => state.storeCart);
    const dispatch = useAppDispatch();
    const [productData, setProductData] = useState<IProductTypes[]>(products);

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
            const foundProduct = productData.find(p => p.qrCodeNumber === barcode);
            if (foundProduct) {
                dispatch(addProduct(foundProduct));
            } else {
                toast.error("Product not found");
            }
            setBarcode("");
        }
    }, [barcode, productData, dispatch]);

    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = productData.filter(p => p.name?.toLowerCase().includes(searchTerm?.toLowerCase()));
    const saleProducts = filteredProducts.filter(p => p.salesPrice);
    const nonSaleProducts = filteredProducts.filter(p => !p.salesPrice);

    const storeSaleItems: IStoreSaleItemTypes[] = items.map((item) => ({
        productId: item._id,
        price: newPrices[item._id] ?? item.salesPrice ?? item.price,
        orderQuantity: item.orderQuantity,
    }));

    const handlePayment = async (paymentMethod: string) => {


        const customeSale: IStoreSale = {
            name: `${customer.fName} ${customer.lName}`,
            phone: customer.phone,
            email: customer.email,
            items: storeSaleItems,
            paymentMethod,
            paymentStatus: paymentMethod === "Card" || paymentMethod === "Cash" ? "Paid": "Pending",
            amount: dynamicTotalAmount - discount + addVat,
            saler: { userId: user._id, name: `${user.fName} ${user.lName}` },
        };

        if (items.length === 0) {
            return toast.error("Cart is empty.");
        }

        if (paymentMethod === "Cash") {
            if (customerCash < (dynamicTotalAmount - discount + addVat)) {
                return toast.error("Customer cash is less than the total amount.");
            }

            setChangeAmount(customerCash - dynamicTotalAmount + discount - addVat);
            setAmountRecieve(customerCash);
            await createStoreSales(customeSale);
            toast.success("Cash payment successful!");
            dispatch(clearStoreCart());
            setSearchTerm('')
            dispatch(resetCustomer());
            setCustomerCash(0);
            setDiscount(0);
            setAddVat(0);
        } else if (paymentMethod === "Card") {
            setIsOpenQRCode(true);
        } else if (paymentMethod === "Due") {
            if (!customer._id) {
                return toast.error("Please select the customer");
            }
            const storeSales = await createStoreSales(customeSale);
            const customeDue: IDue = {
                userId: `${customer._id}`,
                totalAmout: dynamicTotalAmount - discount + addVat,
                dueAmount: dynamicTotalAmount - discount + addVat - customerCash,
                duePaymentStatus: "Not paid",
                isActive: true,
                salesId: storeSales?._id as string
            };

            await createDue(customeDue);
            setChangeAmount(customerCash - dynamicTotalAmount + discount - addVat);
            setAmountRecieve(customerCash);
            toast.success("Customer Due created successful!");
            dispatch(clearStoreCart());
            setSearchTerm('')
            dispatch(resetCustomer());
            setCustomerCash(0);
            setDiscount(0);
            setAddVat(0);
        }
    };

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
        setSearchTerm('')
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
                            <SearchInput
                                placeholder="Search product"
                                data={products}
                                searchKey={`name`}
                                setFilteredData={(filtered) => {
                                    setProductData(filtered.length > 0 || filtered === products ? filtered : products);
                                }}
                            />
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
                        setNewPrices={setNewPrices}
                        newPrices={newPrices}
                    />
                </div>

                {/* Mobile button */}
                <div className="fixed  w-full text-center bottom-4 lg:hidden z-10">
                    <Button
                        className="w-full bg-green-600 max-w-xs mx-auto hover:bg-green-500"
                        onClick={() => setShowMobileSidebar(true)}
                    >
                        Open Cart
                    </Button>
                </div>


                {/* Mobile Sidebar */}
                {showMobileSidebar && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-end">
                        <div className="bg-white w-full h-full rounded-t-lg shadow-lg transform transition-all duration-500 translate-y-0 p-2 px-4">
                            <div className="flex justify-end items-center mb-4">
                                <button
                                    onClick={() => setShowMobileSidebar(false)}
                                    className="text-lg font-bold px-2 py-1 border rounded"
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
                                setNewPrices={setNewPrices}
                                newPrices={newPrices}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};
