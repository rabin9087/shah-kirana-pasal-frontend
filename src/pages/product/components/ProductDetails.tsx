import { useState } from "react";
import { Button } from "@/components/ui/button"; // Ensure this path is correct

const ProductDetails: React.FC<{ product: { description: string } }> = ({ product }) => {
    const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

    return (
        <div className="block w-full shadow-lg pb-8 mx-auto lg:mx-4 text-center">
            <span className="block py-2 text-xl md:text-2xl font-sans underline">
                Product Details
            </span>
            <div className="flex justify-center gap-4 bg-gray-200 p-2 rounded-md mt-4">
                <Button
                    className={`w-1/2 ${activeTab === "description" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}
                    onClick={() => setActiveTab("description")}
                >
                    Description
                </Button>
                <Button
                    className={`w-1/2 ${activeTab === "reviews" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}
                    onClick={() => setActiveTab("reviews")}
                >
                    Reviews
                </Button>
            </div>
            <div className="mt-4 px-4 md:px-8">
                {activeTab === "description" ? (
                    <p>{product.description}</p>
                ) : (
                    <p>Reviews section is not implemented yet.</p> // Replace with actual reviews content
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
