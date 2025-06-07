import { getAProduct } from "@/axios/product/product";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { IProductTypes } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useEffect } from "react";
import { setAProduct } from "@/redux/product.slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductNotFoundModal from "../components/ProductNotFound";

const ShowFullProductDetails = () => {
    const { _id } = useParams();
    const { product } = useAppSelector((s) => s.productInfo);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery<IProductTypes>({
        queryKey: ["products", _id],
        queryFn: async () => getAProduct({ qrCodeNumber: _id }),
        enabled: !!_id,
        retry: false, // optional: avoid retrying on 404
    });

    useEffect(() => {
        if (data?._id) {
            dispatch(setAProduct(data));
        } else {
            dispatch(setAProduct({} as IProductTypes));
        }
    }, [data?._id, dispatch]);

    return (
        <Layout title="Product Details">
            <div className="container mx-auto p-4 md:p-6">
                <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-100">
                    {"<"} Back
                </Button>

                {isLoading && (
                    <p className="text-center mt-10 text-gray-500 text-lg">Loading product details...</p>
                )}

                {!isLoading && error && (
                    <ProductNotFoundModal open={true} onClose={() => navigate(-1)} />
                    
                )}

                {!isLoading && !error && !product?._id && (
                    <p className="text-center mt-10 text-gray-500 text-lg">Product not found.</p>
                )}

                {!isLoading && product?._id && (
                    <div className="bg-white rounded-2xl shadow-md p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex justify-center items-center">
                            <img
                                src={product.thumbnail || "/default-product.png"}
                                alt={product.name}
                                className="rounded-xl object-contain max-h-[350px] w-full"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                            {product.alternateName && (
                                <p className="text-gray-500 mb-2 italic">({product.alternateName})</p>
                            )}
                            <p className="text-gray-600 mb-4">{product.description}</p>

                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline">SKU: {product.sku}</Badge>
                                <Badge variant="secondary">Stored At: {product.storedAt}</Badge>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <p className="text-3xl font-semibold text-blue-600">${product.price}</p>
                                {product.salesPrice && product.salesPrice < product.price && (
                                    <p className="text-xl line-through text-gray-400">${product.salesPrice}</p>
                                )}
                                {product.aggrateRating && (
                                    <div className="flex items-center gap-1">
                                        <Star className="text-yellow-400 w-5 h-5" />
                                        <span className="text-gray-700">{product.aggrateRating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Cost Price:</strong> ${product.costPrice || "N/A"}</p>
                                <p><strong>Retailer Price:</strong> ${product.retailerPrice || "N/A"}</p>
                                <p><strong>Product Weight:</strong> {product.productWeight || "N/A"}</p>
                                <p><strong>Location:</strong> {product.productLocation || "N/A"}</p>
                                <p><strong>Slug:</strong> {product.slug}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ShowFullProductDetails;
