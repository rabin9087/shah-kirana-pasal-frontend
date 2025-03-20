import { IProductTypes } from "@/types/index";
import { ISalesProps } from "./Sales";


export function getProductSalesData(sales: ISalesProps) {
    const productSalesMap = new Map<string, number>();

    // Sum up all quantities per productId
    sales.forEach(sale => {
        sale.items.forEach(item => {
            productSalesMap.set(
                item.productId,
                (productSalesMap.get(item.productId) || 0) + item.quantity
            );
        });
    });

    // Convert to an array for sorting
    const productSalesArray = Array.from(productSalesMap.entries()).map(([productId, quantity]) => ({
        productId,
        quantity,
    }));

    // Sort products by quantity sold in descending order
    productSalesArray.sort((a, b) => b.quantity - a.quantity);

    return {
        mostSoldProduct: productSalesArray[0], // The product with the highest quantity sold
        uniqueProductsCount: productSalesArray.length, // Total unique products
        allProducts: productSalesArray, // List of all products and their sales count
    };
}

// Example usage:

type ProductSales = {
  productId: string;
  quantity: number;
}[];

export function mapProductNames(allProducts: ProductSales, products: IProductTypes[]) {
  return allProducts.map((product) => {
    const matchedProduct = products.find((p) => p._id === product.productId);
    return {
      productId: product.productId,
      name: matchedProduct ? matchedProduct.name : "Unknown Product",
      quantity: product.quantity,
    };
  });
}