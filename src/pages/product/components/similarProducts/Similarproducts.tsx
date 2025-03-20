import React from "react";
import ProductCard from "@/pages/productCard/ProductCard";
import { IProductTypes } from "@/types/index";

interface SimilarProductsProps {
    products: IProductTypes[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products }) => {
    return (
        <div className="grid justify-center gap-1 py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
                <ProductCard key={product._id} item={product} />
            ))}
        </div>
    );
};

export default SimilarProducts;
