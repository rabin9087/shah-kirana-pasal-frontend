import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams } from "react-router";
import ProductDetails from "./components/ProductDetails";
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange";
import { Card, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAProduct } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import { setAProduct } from "@/redux/product.slice";
import { IProductTypes } from "@/types";
import ImageCarousel from "./components/ImageCarousel";
import { Link } from "react-router-dom";

const ProductLanding = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const { product } = useAppSelector((s) => s.productInfo);
    const { cart } = useAppSelector((state) => state.addToCartInfo);
    const orderQty = getOrderNumberQuantity(product._id, cart);
    const index = cart.find((item) => item._id === product._id);

    const { data = {} as IProductTypes, error } = useQuery<IProductTypes>({
        queryKey: ['products', params?.qrCodeNumber],
        queryFn: async () => getAProduct({ qrCodeNumber: params })
    });

    const fetchedImages: (string | { url: string })[] | undefined = product?.images;
    const images: { url: string; alt: string }[] = fetchedImages
        ? fetchedImages.map((image) => ({
            url: typeof image === 'string' ? image : image.url,
            alt: `${product.name}`,
        }))
        : [];

    useEffect(() => {
        if (data._id !== "") {
            dispatch(setAProduct(data));
        }
    }, [dispatch, data._id]);
    const history = window.history
    console.log(history.back)
    // if (isLoading || isFetching) return <Loading />;
    if (error) return <Error />;

    return (
        <Layout title={""}>
            <Link to={"/"} className="p-2 ms-8 mb-4 bg-primary text-white rounded-md">{"<"} Back</Link>

            <div className="container mx-auto p-4 mt-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image Carousel */}
                    <div className="flex justify-center items-center">
                        <Card className="w-full">
                            <CardDescription className="m-2 rounded-md">
                                <div className="mb-4 flex items-center justify-center bg-gray-100 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105">
                                    <ImageCarousel images={images || []} thumbnail={product.thumbnail} />
                                </div>
                            </CardDescription>
                        </Card>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{product.name}</h3>
                        <p className="text-xl text-gray-600 mb-4">${product.price}</p>
                        <p className="text-md text-gray-500 mb-4">{product.description}</p>

                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-4 mb-4">
                            {!itemExist(product._id, cart).length ? (
                                <AddToCartButton item={{ ...product, orderQuantity: orderQty || 0 }} />
                            ) : (
                                <ChangeItemQty item={{ ...product, orderQuantity: orderQty || 0 }} />
                            )}
                        </div>

                        {/* Stock Availability */}
                        {(index?.orderQuantity || 0) >= product.quantity && (
                            <span className="block text-center text-sm text-red-500">
                                {product.quantity} item(s) left
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Details Section */}
                <ProductDetails product={product} />
            </div>
        </Layout>
    );
};

export default ProductLanding;
