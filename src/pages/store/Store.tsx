import { useAppSelector, useAppDispatch } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { setProducts } from '@/redux/product.slice';
import { Button } from '@/components/ui/button';
import { IProductTypes } from '@/types/index';
import { getAllProducts } from '@/axios/product/product';
import { addProduct, decreaseQuantity, increaseQuantity, removeProduct, clearStoreCart } from '@/redux/storeCart';
import CustomModal from '@/components/CustomModal';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { resetCart } from '@/redux/addToCart.slice';
import { StoreProductCard } from './StoreProductCard';
import { createStoreSale } from '@/axios/storeSale/storeSale';
import { IStoreSale, IStoreSaleItemTypes } from './types';

export const Store = () => {
    const [barcode, setBarcode] = useState("");
    const [customerCash, setCustomerCash] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [amountRecieve, setamountRecieve] = useState(0);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const { products } = useAppSelector(state => state.productInfo);
    const { user } = useAppSelector(state => state.userInfo);
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

    // Separate sale and non-sale products
    const saleProducts = filteredProducts.filter(p => p.salesPrice);
    const nonSaleProducts = filteredProducts.filter(p => !p.salesPrice);

    const storeSaleItems: IStoreSaleItemTypes[] = items.map((item) => ({
        productId: item._id, price: item.salesPrice ? item.salesPrice : item.price, orderQuantity: item.orderQuantity
    }));

    const handlePayment = async (paymentMethod: string) => {
        if (customerCash >= totalAmount) {
            setChangeAmount(customerCash - totalAmount);
            setamountRecieve(customerCash)
            toast.success("Payment Successful!");
            const customeSale: IStoreSale = {
                name: "",
                address: "",
                phone: "",
                email: "",
                items: storeSaleItems,
                paymentMethod: paymentMethod,
                paymentStatus: "Paid",
                amount: totalAmount,
                saler: { userId: user._id, name: user.fName + " " + user.lName },
            }

            await createStoreSale(customeSale)
            dispatch(clearStoreCart());
            dispatch(resetCart());
            setCustomerCash(0);
        } else {
            toast.error("Customer cash is less than total amount");
        }
    };

    useEffect(() => {
        if (items.length > 0) {
            setChangeAmount(0)
        }
    }, [items.length])


    return (
        <div className="flex relative">
            <div className="w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border rounded p-2 w-72 ml-auto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="text-center w-full">
                        <CustomModal scanCode={setBarcode} scan={true} />
                    </div>
                </div>

                {/* Sale Products */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Sale Products</h2>
                    <div className="grid gap-4 grid-cols-2 sm::grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mr-[400px]">
                        {saleProducts.map((product: IProductTypes) => (
                            <div key={product._id}>
                                <StoreProductCard item={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Non-Sale Products */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Non-Sale Products</h2>
                    <div className="grid gap-4 grid-cols-2 sm::grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mr-[400px]">
                        {nonSaleProducts.map((product: IProductTypes) => (
                            <div key={product._id}>
                                <StoreProductCard item={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className="fixed right-0 top-0 h-full w-[400px] shadow-2xl bg-white p-4 mt-[80px] rounded-l-2xl z-30 flex flex-col"
                onMouseEnter={() => setIsSidebarHovered(true)}
                onMouseLeave={() => setIsSidebarHovered(false)}
            >
                <h2 className="text-xl font-bold mb-4 text-center">Store Cart</h2>
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
                                    <p className="text-sm text-gray-600">Rs. {item.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600">Subtotal: Rs. {(item.price * item.orderQuantity)?.toFixed(2)}</p>
                                </div>

                                <div className="flex justify-between items-center gap-2 mt-2 ">
                                    <div className='flex justify-between items-center gap-3'>
                                        <Button className='w-1/3'
                                            size="sm"
                                            onClick={() => dispatch(decreaseQuantity(item._id))}>
                                            -
                                        </Button>
                                        <p className="w-1/2 font-medium">{item.orderQuantity}</p>
                                        <Button className='w-1/3'
                                            size="sm"
                                            onClick={() => dispatch(increaseQuantity(item._id))}>
                                            +
                                        </Button>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => dispatch(removeProduct(item._id))}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t pt-4 mb-20">
                    <h3 className="font-bold text-lg text-center">Total:  Rs. {totalAmount?.toFixed(2)}</h3>

                    <div className="flex flex-col gap-2 mt-4">
                        <Input
                            type="number"
                            placeholder="Cash received"
                            value={customerCash}
                            onChange={(e) => setCustomerCash(Number(e.target.value))}
                        />
                        <Button type='submit' onClick={() => handlePayment("Cash")}>Pay Cash</Button>
                        {changeAmount > 0 && (
                            <div>
                                <p className="text-blue-600 text-2xl font-semibold mb-4">
                                    You gave: Rs.{amountRecieve?.toFixed(2)}
                                </p>
                                <hr/>
                                <p className="text-green-600 text-2xl font-semibold mb-4">
                                    Change to return: Rs.{changeAmount?.toFixed(2)}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

        </div>
    );
};
