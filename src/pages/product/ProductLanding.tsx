import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange";
import { Card, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAProduct } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import { setAProduct } from "@/redux/product.slice";
import { IProductTypes } from "@/types";
import ImageCarousel from "./components/ImageCarousel";
import { Button } from "@/components/ui/button";

const ProductLanding = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { product } = useAppSelector((s) => s.productInfo);
    const { cart } = useAppSelector((state) => state.addToCartInfo);
    const { language } = useAppSelector((state) => state.settings)
    const orderQty = getOrderNumberQuantity(product._id, cart);
    const index = cart.find((item) => item._id === product._id);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // State for the selected image

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

    if (error) return <Error />;

    const handleImageClick = (url: string) => {
        setSelectedImage(url); // Set selected image on click
    };

    return (
        <Layout title={""}>
            <Button onClick={() => navigate(-1)} className="p-2 ms-8 mb-4 bg-primary text-white rounded-md">{"<"} Back</Button>

            <div className="container mx-auto p-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image Carousel */}
                    <div className="flex justify-center items-center">
                        <Card className="w-full">
                            <CardDescription className="m-2 rounded-md">
                                <div className="mb-4 flex items-center justify-center gap-2 bg-gray-100 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105">
                                    <div className="hidden sm:block p-2">
                                        {images.map((item) => (
                                            <div
                                                key={item.url}
                                                className={`border-2 p-2 rounded-md transition-all duration-300 ${selectedImage === item.url ? "border-primary" : "border-transparent"
                                                    }`}
                                                onClick={() => handleImageClick(item.url)}
                                            >
                                                <img
                                                    src={item.url || ""}
                                                    alt={item.alt}
                                                    className="w-16 h-16 object-cover cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-4/5">
                                        <ImageCarousel images={images || []} thumbnail={selectedImage || product.thumbnail} selectedImage={selectedImage} />
                                    </div>
                                </div>
                            </CardDescription>
                        </Card>
                    </div>

                    {/* Product Details */}
                    <div className="border-4 border-primary md:mx-16 ps-6 p-2 ">
                        <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-4">
                            {language === "en" ? product.name : product.alternateName ? product.alternateName : product.name}

                        </h3>
                        <div className="flex justify-between items-center font-bold">
                            <div className="flex justify-start items-start font-bold">
                                <span className={`text-xl mt-1 text-gray-600 ${product.salesPrice > 0 ? "mb-1" : "mb-4"}`}>
                                    {language === "en" ? "Rs.": "रु."}
                                </span>
                                <span className="text-3xl">
                                    {Math.floor(product.salesPrice > 0 ? product.salesPrice : product.price)}
                                </span>
                                <span className="text-xl">
                                    {((product.salesPrice > 0 ? product.salesPrice : product.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex justify-center items-center me-4">
                                <p className="text-sm text-gray-400">{language === "en" ? "Rs." : "रु."}{product.salesPrice > 0 ? product.salesPrice : product.price }/item</p>
                            </div>
                           
                        </div>

                        {product.salesPrice > 0 && <p className="text-sm rounded-sm bg-yellow-400 w-fit px-2 text-gray-600 mb-4">save {language === "en" ? "Rs." : "रु."}{(product.price - product.salesPrice).toFixed(2)}</p>}
                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-4 mb-4 mt-4 w-full md:w-48">
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
                <div className="mt-8">
                    <h2>Product Details</h2>
                    <div>

                    </div>
                    <p className="text-md text-gray-500 mb-4">{product.description}</p>
                </div>
            </div>
        </Layout>
    );
};

export default ProductLanding;
