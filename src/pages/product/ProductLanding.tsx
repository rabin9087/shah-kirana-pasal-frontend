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
import { IProductTypes } from "@/types/index";
import ImageCarousel from "./components/ImageCarousel";
import { Button } from "@/components/ui/button";
import YouMayLike from "./components/youMayLike/YouMayLikeProducts";
import { ArrowLeft, Star, Shield, Truck, Package, Heart, Share2, AlertTriangle, CheckCircle, Info } from "lucide-react";

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
    const [isWishlisted, setIsWishlisted] = useState(false);

    const { data = {} as IProductTypes, error } = useQuery<IProductTypes>({
        queryKey: ['products', params?._id],
        queryFn: async () => getAProduct({ qrCodeNumber: params }),
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
        setSelectedImage(url);
    };

    const handleWishlistToggle = () => {
        setIsWishlisted(!isWishlisted);
    };

    const getStockStatus = () => {
        if (product.quantity === 0) return { status: 'out', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle };
        if (product.quantity <= 5) return { status: 'low', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle };
        return { status: 'in', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle };
    };

    const stockInfo = getStockStatus();
    const StockIcon = stockInfo.icon;

    return (
        <Layout title={""}>
            {/* Enhanced Back Button */}
            <div className="container mx-auto px-4 py-4">
                <Button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary transition-all duration-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === "en" ? "Back" : "पछाडि"}</span>
                </Button>
            </div>

            <div className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Enhanced Product Image Section */}
                    <div className="relative">
                        <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-gray-50 to-white">
                            <CardDescription className="m-0">
                                <div className="flex items-start gap-4 p-6">
                                    {/* Thumbnail Images */}
                                    <div className="hidden sm:flex flex-col gap-3 flex-shrink-0">
                                        {images.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`relative group border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${selectedImage === item.url
                                                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                                                        : "border-gray-200 hover:border-primary/50"
                                                    }`}
                                                onClick={() => handleImageClick(item.url)}
                                            >
                                                <img
                                                    src={item.url || ""}
                                                    alt={item.alt}
                                                    className="w-20 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Main Image */}
                                    <div className="relative flex-1 bg-white rounded-2xl shadow-inner p-6">
                                        <ImageCarousel
                                            thumbnail={selectedImage || product.thumbnail}
                                            selectedImage={selectedImage}
                                        />

                                        {/* Image overlay badges */}
                                        {product.salesPrice > 0 && (
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                                {Math.round(((product.price - product.salesPrice) / product.price) * 100)}% OFF
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardDescription>
                        </Card>
                    </div>

                    {/* Enhanced Product Details */}
                    <div className="space-y-6">
                        {/* Product Header */}
                        <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg p-6 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

                            <div className="relative">
                                {/* Action buttons */}
                                <div className="flex justify-end space-x-2 mb-4">
                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`p-2 rounded-full border transition-all duration-300 ${isWishlisted
                                                ? "bg-red-50 border-red-200 text-red-600"
                                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                                    </button>
                                    <button className="p-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Product Name */}
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                    {language === "en" ? product.name : product.alternateName ? product.alternateName : product.name}
                                </h1>

                                {/* Rating */}
                                {product.aggrateRating && (
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < (product.aggrateRating ?? 0)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">({product.aggrateRating} out of 5)</span>
                                    </div>
                                )}

                                {/* SKU */}
                                {product.sku && (
                                    <div className="text-sm text-gray-500 mb-4">
                                        SKU: <span className="font-mono">{product.sku}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-sm text-gray-600">
                                        {language === "en" ? "$" : "रु."}
                                    </span>
                                    <span className="text-4xl font-bold text-green-600">
                                        {Math.floor(product.salesPrice > 0 ? product.salesPrice : product.price)}
                                    </span>
                                    <span className="text-xl text-green-600">
                                        {((product.salesPrice > 0 ? product.salesPrice : product.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        {language === "en" ? "Rs." : "रु."}{product.salesPrice > 0 ? product.salesPrice : product.price}/item
                                    </p>
                                </div>
                            </div>

                            {/* Sale Price */}
                            {product.salesPrice > 0 && (
                                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                                            SAVE {language === "en" ? "Rs." : "रु."}{(product.price - product.salesPrice).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="text-lg text-gray-500 line-through">
                                        {language === "en" ? "$" : "रु."}{product.price.toFixed(2)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className={`rounded-2xl border p-4 ${stockInfo.bg} ${stockInfo.border}`}>
                            <div className="flex items-center space-x-3">
                                <StockIcon className={`w-5 h-5 ${stockInfo.color}`} />
                                <div className="flex-1">
                                    <p className={`font-medium ${stockInfo.color}`}>
                                        {stockInfo.status === 'out' && (language === "en" ? "Out of Stock" : "स्टक सकिएको")}
                                        {stockInfo.status === 'low' && (language === "en" ? `Only ${product.quantity} left in stock!` : `स्टकमा केवल ${product.quantity} बाँकी!`)}
                                        {stockInfo.status === 'in' && (language === "en" ? "In Stock" : "स्टकमा उपलब्ध")}
                                    </p>
                                    {(index?.orderQuantity || 0) >= product.quantity && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {product.quantity} item(s) left
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Section */}
                        <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {language === "en" ? "Add to Cart" : "कार्टमा थप्नुहोस्"}
                            </h3>

                            <div className="space-y-4">
                                <div className="transform hover:scale-105 transition-transform duration-300">
                                    {!itemExist(product._id, cart) ? (
                                        <AddToCartButton item={{ ...product, orderQuantity: orderQty || 0 }} />
                                    ) : (
                                        <ChangeItemQty item={{ ...product, orderQuantity: orderQty || 0 }} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-300">
                                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">
                                    {language === "en" ? "Fast Delivery" : "छिटो डेलिभरी"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {language === "en" ? "Same day delivery" : "सोही दिन डेलिभरी"}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-300">
                                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">
                                    {language === "en" ? "Quality Assured" : "गुणस्तर सुनिश्चित"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {language === "en" ? "100% authentic" : "१००% वास्तविक"}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-300">
                                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">
                                    {language === "en" ? "Easy Returns" : "सजिलो फिर्ता"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {language === "en" ? "7 days return" : "७ दिन फिर्ता"}
                                </p>
                            </div>
                        </div>

                        {/* Product Description */}
                        {product.description && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <Info className="w-5 h-5 text-primary mr-2" />
                                    {language === "en" ? "Product Details" : "उत्पादन विवरण"}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced You May Like Section */}
                <div className="mt-16">
                    <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {language === "en" ? "You May Also Like" : "तपाईंलाई मन पर्न सक्छ"}
                        </h2>
                        <p className="text-gray-600">
                            {language === "en" ? "Discover more products from the same category" : "सोही श्रेणीका थप उत्पादनहरू खोजी गर्नुहोस्"}
                        </p>
                    </div>
                    <YouMayLike
                        parentCategoryId={product.parentCategoryID}
                        qrCodeNumber={product?.qrCodeNumber as string}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default ProductLanding;