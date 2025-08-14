import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import { ArrowLeft, Package, Star, Calendar, ShoppingCart } from "lucide-react";
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange";
import { IProductComboOffer, IProductOfferTypes } from "@/axios/productComboOffer/types";
import { IProductTypes } from "@/types/index";

interface ComboProductItemProps {
    comboOffer: IProductComboOffer;
    onBack?: () => void;
}

const ComboProductItem: React.FC<ComboProductItemProps> = ({ comboOffer, onBack }) => {
    const { cart } = useAppSelector((state) => state.addToCartInfo);
    const { language } = useAppSelector((state) => state.settings);

    const savingsPercentage = ((comboOffer.discountAmount / comboOffer.totalAmount) * 100).toFixed(0);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const comboOrderQty = getOrderNumberQuantity(comboOffer?._id as string, cart);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Back Button */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>{language === "en" ? "Back to Combos" : "कम्बो अफरहरूमा फर्कनुहोस्"}</span>
                    </button>
                </div>

                {/* Combo Offer Card */}
                <Card className="shadow-xl rounded-2xl overflow-hidden mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <Package className="w-8 h-8" />
                                    <h1 className="text-3xl font-bold truncate">{comboOffer.offerName}</h1>
                                </div>
                                <p className="text-primary-100 mb-4 truncate">
                                    {comboOffer.description || "Special combo offer with amazing savings!"}
                                </p>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Valid until: {formatDate(comboOffer?.offerEndDate?.toString() ?? "")}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Package className="w-4 h-4" />
                                        <span>{comboOffer.items.length} Products Included</span>
                                    </div>
                                </div>
                            </div>

                            {/* Savings */}
                            <div className="mt-4 md:mt-0 text-right">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                                    <div className="text-sm opacity-90">Total Savings</div>
                                    <div className="text-3xl font-bold">
                                        {language === "en" ? "$" : "रु."}{comboOffer.discountAmount.toFixed(2)}
                                    </div>
                                    <div className="text-sm bg-green-400 text-green-900 px-2 py-1 rounded-full inline-block mt-2">
                                        {savingsPercentage}% OFF
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                        <div className="flex items-center space-x-4">
                            <img
                                src={comboOffer.thumbnail}
                                alt={comboOffer.offerName}
                                className="w-20 h-20 object-cover rounded-xl shadow-md"
                            />
                            <div>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-green-600">
                                        {language === "en" ? "$" : "रु."}{Math.floor(comboOffer.price)}
                                    </span>
                                    <span className="text-lg text-green-600">
                                        {((comboOffer.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-lg text-gray-500 line-through">
                                        {language === "en" ? "$" : "रु."}{comboOffer.totalAmount.toFixed(2)}
                                    </span>
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                                        Save {language === "en" ? "$" : "रु."}{comboOffer.discountAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 sm:mt-0 transform hover:scale-105 transition-transform duration-300">
                            {itemExist(comboOffer?._id as string, cart) ? (
                                <ChangeItemQty
                                    item={{
                                        ...comboOffer,
                                        orderQuantity: comboOrderQty || 0,
                                        offerName: comboOffer.offerName,
                                    }}
                                />
                            ) : (
                                <AddToCartButton
                                    item={{
                                        ...comboOffer,
                                        orderQuantity: comboOrderQty || 0,
                                        offerName: comboOffer.offerName,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </Card>

                {/* Products in Combo */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {language === "en" ? "Products in this Combo" : "यो कम्बोमा रहेका उत्पादनहरू"}
                        </h2>
                        <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            {comboOffer.items.length} {language === "en" ? "Items" : "वस्तुहरू"}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-wrap sm:flex-row gap-4">
                        {comboOffer.items.map((item, index) => {
                            const product = item?.productId as IProductTypes || item as IProductOfferTypes;
                            return (
                                <div
                                    key={product?._id}
                                    className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full border rounded-2xl p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white"
                                >
                                    {/* Index */}
                                    <div className="text-sm font-semibold text-gray-500 w-full sm:w-6 mb-2 sm:mb-0">
                                        {index + 1}.
                                    </div>

                                    {/* Thumbnail */}
                                    <Link
                                        to={`/product/${product.qrCodeNumber}`}
                                        className="w-28 h-28 flex-shrink-0 mb-3 sm:mb-0 sm:mr-4"
                                    >
                                        <img
                                            src={product?.thumbnail}
                                            alt={product?.name}
                                            className="w-full h-full object-cover rounded-xl"
                                            loading="lazy"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col justify-between text-sm font-medium text-gray-800 ">
                                        <Link to={`/product/${product.qrCodeNumber}`} className="hover:underline mb-2">
                                            {language === "en" ? product?.name : product?.alternateName || product?.name}
                                        </Link>
                                        <span className="text-gray-500 text-xs mb-1">Qty: {item?.qty || 1}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="text-base font-bold text-gray-900 mt-2 sm:mt-0 text-right w-24">
                                        {language === "en" ? "$" : "रु."}{product?.price?.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>

                {/* Combo Benefits */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Star className="w-6 h-6 text-yellow-500 mr-2" />
                            {language === "en" ? "Why Choose This Combo?" : "यो कम्बो किन छान्ने?"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-2">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{savingsPercentage}%</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{language === "en" ? "Maximum Savings" : "अधिकतम बचत"}</p>
                                    <p className="text-sm text-gray-600">{language === "en" ? "Save more than buying individually" : "अलग-अलग किन्दा भन्दा बढी बचत"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{language === "en" ? "Curated Selection" : "चुनिएका उत्पादनहरू"}</p>
                                    <p className="text-sm text-gray-600">{language === "en" ? "Perfectly matched products" : "उत्तम मिल्ने उत्पादनहरू"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2">
                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{language === "en" ? "One-Click Purchase" : "एक क्लिकमा खरिद"}</p>
                                    <p className="text-sm text-gray-600">{language === "en" ? "Add all items at once" : "सबै वस्तुहरू एकैसाथ थप्नुहोस्"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default ComboProductItem;