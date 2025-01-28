import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams } from "react-router";
import ProductDetails from "./components/ProductDetails";
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAProduct } from "@/axios/product/product";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { setAProduct } from "@/redux/product.slice";
import { IProductTypes } from "@/types";
import ImageCarousel from "./components/ImageCarousel";

const ProductLanding = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { product } = useAppSelector((s) => s.productInfo);
    const { cart } = useAppSelector((state) => state.addToCartInfo)
    const orderQty = getOrderNumberQuantity(product._id, cart)
    const index = cart.find((item) => item._id === product._id)


    const { data = {} as IProductTypes, isLoading, error, isFetching } = useQuery<IProductTypes>({
        queryKey: ['products', params?.qrCodeNumber],
        queryFn: async () =>
            getAProduct({ qrCodeNumber: params })
    });
    const fetchedImages: (string | { url: string })[] | undefined = product?.images;

    const images: { url: string; alt: string }[] = fetchedImages
        ? fetchedImages?.map((image) => ({
            url: typeof image === 'string' ? image : image.url,
            alt: `${product.name}`,
        }
        )) : [];

    useEffect(() => {
        if (data._id !== "") {
            dispatch(setAProduct(data))
        }
    }, [dispatch, data._id]);

    if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />

    return (
        <Layout title={product.name}>
            <div className="block md:grid md:grid-cols-2 min-h-[73vh] gap-8 p-4">
                <div className="block md:flex justify-center lg:gap-8">
                    <div className="w-full md:w-2/3 flex justify-center items-start h-full">
                        <Card className="w-full">
                            <CardDescription className="m-2 rounded-md">

                                <div className="mb-4 flex items-center justify-center bg-gray-100 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105">
                                    <ImageCarousel images={images || []} thumbnail={product.thumbnail} />
                                </div>
                                {/* <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                /> */}
                            </CardDescription>
                            <CardContent >
                                <div className="mt-6 w-full lg:mt-0 border-2 border-blue-400/20 rounded-md p-4">
                                    <h3 className="w-full text-sm font-thin md:text-xl text-gray-700 px-4 lg:px-0 break-words whitespace-normal leading-snug">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl md:text-2xl mt-2 font-serif px-4 lg:px-0">
                                            ${product.price}
                                        </p>
                                        <p className="text-md mt-2 font-serif px-4 lg:px-0">
                                            ${product.price} / item
                                        </p>
                                    </div>
                                

                                    {/* <div className="px-4 lg:px-0 my-2"></div> */}
                                    <div className="px-4 lg:px-0 font-bold text-gray-700 mt-6 text-base md:text-xl">
                                        <div className="mt-6 space-y-4">
                                            {/* <span className="block text-start md:text-lg font-semibold">Quantity</span> */}
                                            {!itemExist(product._id, cart).length ?
                                                <AddToCartButton item={{ ...product, orderQuantity: orderQty || 0 }} />
                                                :
                                                <ChangeItemQty item={{ ...product, orderQuantity: orderQty || 0 }} />}

                                            {(index?.orderQuantity || 0) >= product.quantity && (
                                                <span className="block text-center text-sm text-red-500">
                                                    {product.quantity} item(s) left
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
                <ProductDetails product={product} />
            </div>
        </Layout>
    );
};

export default ProductLanding;
