import { getAllProductComboOffer } from "@/axios/productComboOffer/productComboOffer";
import { IProductComboOffer } from "@/axios/productComboOffer/types";
import ProductComboOfferCard from "@/pages/productCard/ProductOfferCard";
import { useQuery } from "@tanstack/react-query";
import { Package, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import ComboProductItem from "./ComboProductItem";
import { SkeletonCard } from "@/components/ui/Loading";

// Modal Component
const ComboModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    comboOffer: IProductComboOffer | null;
}> = ({ isOpen, onClose, comboOffer }) => {
    if (!isOpen || !comboOffer) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto">
                <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 mt-4 mb-4">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                        <X className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
                    </button>

                    {/* Modal Content */}
                    <div className="rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto">
                        <ComboProductItem
                            comboOffer={comboOffer as IProductComboOffer}
                            onBack={onClose}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced ProductComboOfferCard with click handler
const ClickableProductComboOfferCard: React.FC<{
    item: IProductComboOffer;
    onClick: () => void;
    addClass?: string;
}> = ({ item, onClick, addClass }) => {
    return (
        <div
            className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
        >
            <ProductComboOfferCard
                onClick={onClick}
                item={item}
                addClass={`${addClass} hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/20`}
            />
        </div>
    );
};

const ComboProduct = () => {
    const { data = [], error, isLoading } = useQuery<IProductComboOffer[]>({
        queryKey: ['combo-products'],
        queryFn: () => getAllProductComboOffer(),
    });

    // Modal state
    const [selectedCombo, setSelectedCombo] = useState<IProductComboOffer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle combo card click
    const handleComboClick = (comboOffer: IProductComboOffer) => {
        setSelectedCombo(comboOffer);
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedCombo(null), 300); // Delay to allow animation
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <SkeletonCard/>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-red-600 font-medium">Failed to load combo offers</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (!data.length) {
        return (
            <div className="w-full py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Package className="h-12 w-12 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-700">No Combo Offers Available</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        We're working on bringing you amazing combo deals. Check back soon!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full py-6">
                {/* Section Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                🎉 Special Combo Offers
                            </h2>
                            <p className="text-gray-600">
                                Save more with our curated product bundles - Limited time offers!
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Click on any combo to see all included products
                            </p>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                            <Package className="h-4 w-4" />
                            <span>{data.length} combo{data.length !== 1 ? 's' : ''} available</span>
                        </div>
                    </div>

                    {/* Decorative line */}
                    <div className="mt-4 h-1 w-20 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                </div>

                {/* Combo Products Grid/Flex */}
                <div className="relative">
                    {/* Desktop: Horizontal scroll, Mobile: Grid */}
                    <div className="block">
                        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
                            <div className="flex space-x-6 min-w-max">
                                {data.map((item, index) => (
                                    <div
                                        key={item._id}
                                        className="flex-shrink-0"
                                        style={{
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <ClickableProductComboOfferCard
                                            item={item}
                                            onClick={() => handleComboClick(item)}
                                            addClass="w-[280px] relative group"
                                        />

                                        {/* Click indicator overlay */}
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none">
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                                    <Package className="w-6 h-6 text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        {data.length > 3 && (
                            <div className="flex justify-center mt-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Scroll to see more</span>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom CTA */}
                {data.length > 0 && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
                            <span className="text-sm font-medium text-primary">
                                🔥 Click any combo to explore all products inside!
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <ComboModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                comboOffer={selectedCombo}
            />
        </>
    );
};

export default ComboProduct;