
import Layout from "@/components/layout/Layout";
import { useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsByLimit } from "@/axios/product/product";
import { useMemo, useState } from "react";
import NetworkError from "@/components/network Error/NetworkError";
import CarouselWithAutoplay from "./Carousel";
import { Sparkles, Tag, ShoppingCart, Gift, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProductTypes } from "@/types/index";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ProductResponse {
  products: IProductTypes[];
  pagination: Pagination;
}

function Home(): JSX.Element {
  const { categories } = useAppSelector((s) => s.categoryInfo);

  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, error, refetch, isFetching } = useQuery<ProductResponse>({
    queryKey: ["products", page],
    queryFn: () => getAllProductsByLimit({ page, limit }),
    // Default to an empty response shape to avoid runtime errors
    initialData: { products: [], pagination: { totalPages: 1, page: 1, limit, total: 0 } },
  });

  const categoryMap = useMemo(
    () =>
      categories
        .filter((category) => category.slug)
        .reduce((acc, category) => {
          acc[category.slug!] = category._id!;
          return acc;
        }, {} as Record<string, string>),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const activeProducts = data?.products.filter(
      (item: IProductTypes) => item.status === "ACTIVE" && !item.salesPrice
    ) || [];  // Make sure `activeProducts` defaults to an empty array if `data` is undefined

    return {
      productsOnSale: activeProducts.filter((item: IProductTypes) => item.salesPrice > 0),
      electronics: activeProducts.filter(
        (item: IProductTypes) => item.parentCategoryID === categoryMap["electronics"]
      ),
      chocolates: activeProducts
        .filter((item: IProductTypes) => item.parentCategoryID === categoryMap["chocolates"])
        .slice(0, 10),
      snacks: activeProducts.filter(
        (item: IProductTypes) => item.parentCategoryID === categoryMap["snacks"]
      ),
      biscuit: activeProducts.filter(
        (item: IProductTypes) => item.parentCategoryID === categoryMap["biscuit"]
      ),
      soap: activeProducts.filter(
        (item: IProductTypes) => item.parentCategoryID === categoryMap["soap-and-saraf"]
      ),
      allProducts: activeProducts,
    };
  }, [data, categoryMap]);



  if (error) {
    return (
      <NetworkError
        message="Failed to load products. Please check your connection."
        onRetry={refetch}
      />
    );
  }

  const ProductSection = ({
    title,
    icon,
    productList,
  }: {
    title: string;
    icon?: React.ReactNode;
    productList: IProductTypes[];
  }) => (
    <>
      {productList.length > 0 && (
        <div className="bg-white shadow-md rounded-2xl p-4 mb-12">
          <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          <div className="flex gap-4 items-center overflow-x-auto scrollbar-hide py-2 px-1">
            {productList.map((product) => (
              <ProductCard
                key={product._id}
                item={product}
                addClass="min-w-[200px] max-w-[250px]"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout types="products" title="Shop Smart">
      <div className="w-full mb-8">
        <CarouselWithAutoplay />
      </div>

      <ProductSection
        title="Hot Deals & Sales"
        icon={<Tag className="text-orange-500" />}
        productList={filteredProducts.productsOnSale}
      />
      <ProductSection
        title="Snacks & Munchies"
        icon={<ShoppingCart className="text-amber-500" />}
        productList={filteredProducts.snacks}
      />
      <ProductSection
        title="Chocolates"
        icon={<Gift className="text-pink-500" />}
        productList={filteredProducts.chocolates}
      />
      <ProductSection
        title="Biscuits Collection"
        icon={<Sparkles className="text-green-500" />}
        productList={filteredProducts.biscuit}
      />
      <ProductSection
        title="Soap & Personal Care"
        icon={<Sparkles className="text-blue-500" />}
        productList={filteredProducts.soap}
      />
      <ProductSection
        title="Electronics Devices"
        icon={<Monitor className="text-purple-500" />}
        productList={filteredProducts.electronics}
      />

      <div className="my-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">All Products</h2>
        {isFetching && <p className="text-center text-gray-500">Loading products...</p>}
        {filteredProducts.allProducts.length === 0 && !isFetching ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
              {filteredProducts.allProducts.map((product: IProductTypes) => (
                <ProductCard key={product._id} item={product} />
              ))}
              </div>            

            {/* Pagination Buttons */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <p>
                  Page {page} of {data.pagination.totalPages || 1}
                </p>
                <Button
                  variant="outline"
                  disabled={page === data.pagination.totalPages}
                  onClick={() =>
                    setPage((prev) =>
                      data.pagination.totalPages ? Math.min(prev + 1, data.pagination.totalPages) : prev + 1
                    )
                  }
                >
                  Next
                </Button>
              </div>
          </>
        )}
      </div>
    </Layout>
  );
}
export default Home;
