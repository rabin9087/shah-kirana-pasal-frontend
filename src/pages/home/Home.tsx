import Layout from "@/components/layout/Layout";
import { useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsByLimit } from "@/axios/product/product";
import { useEffect, useMemo, useState } from "react";
import NetworkError from "@/components/network Error/NetworkError";
import CarouselWithAutoplay from "./Carousel";
import { Sparkles, Tag, ShoppingCart, Gift, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProductTypes } from "@/types/index";
import ComboProduct from "./productCombo/ComboProduct";
import {  SkeletonCard } from "@/components/ui/Loading";

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
    initialData: { products: [], pagination: { totalPages: 1, page: 1, limit, total: 0 } },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
      (item: IProductTypes) => item.status === "ACTIVE"
    ) || [];

    return {
      productsOnSale: activeProducts.filter((item) => item.salesPrice && item.salesPrice > 0),
      electronics: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["electronics"] && !item.salesPrice
      ),
      chocolates: activeProducts
        .filter((item) => item.parentCategoryID === categoryMap["chocolates"] && !item.salesPrice)
        .slice(0, 10),
      snacks: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["snacks"] && !item.salesPrice
      ),
      biscuit: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["biscuit"] && !item.salesPrice
      ),
      soap: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["soap-and-saraf"] && !item.salesPrice
      ),
      allProducts: activeProducts.filter((item) => !item.salesPrice),
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
        <div className="w-full px-2 md:px-8 flex justify-center ">
          <div className="w-full max-w-[1440px] bg-white shadow-md rounded-2xl p-4 mb-12">
            <div className="flex items-center gap-2 mb-4">
              {icon}
              <h2 className="text-2xl font-semibold">{title}</h2>
            </div>

            {/* Horizontally scrollable row */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-stretch space-x-4 py-2 px-1 min-w-full">
                {productList.map((product) => (
                  <ProductCard
                    key={product._id}
                    item={product}
                    addClass="min-w-[200px] max-w-[250px] flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <Layout types="products" title={page === 1 ? "Smart Shop" : ""}>
      {/* {page === 1 && (
        <div className="flex justify-end me-2 m-2">
          <Shop />
        </div>
      )} */}
    
      {page === 1 && (
        <div className="w-full mb-8">
          <CarouselWithAutoplay />
        </div>
      )}
      {page === 1 && <div className="my-12 px-2 md:px-8 max-w-[1440px] md:mx-auto shadow-md rounded-md pb-4 border-t">
        <ComboProduct />
      </div>}
      
      <ProductSection
        title="Hot Deals & Sales"
        icon={<Tag className="text-orange-500" />}
        productList={filteredProducts.productsOnSale}
      />
      <ProductSection
        title="Snacks & Munchies"
        icon={<ShoppingCart className="text-amber-500" />}
        productList={filteredProducts.snacks} // Exclude biscuits from snacks
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

      <div className="my-12 px-2 md:px-8 max-w-[1440px] md:mx-auto shadow-md rounded-md pb-4 border-t">
        <h2 className=" font-semibold mb-6 text-center">All Products</h2>
        {page !== 1 && isFetching && <SkeletonCard />}
        {filteredProducts.allProducts.length === 0 && !isFetching ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
              {filteredProducts.allProducts.map((product: IProductTypes) => (
                <ProductCard key={product._id} item={product} />
              ))}
            </div>

            {/* Pagination */}
          </>
        )}
        
      </div>
      <div className="flex justify-center items-center flex-wrap gap-1 my-4">
        <Button
          variant="outline"
          className="flex items-center"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          {"< Previous"}
        </Button>

        {(() => {
          const totalPages = data.pagination.totalPages || 1;
          const range: (number | "...")[] = [];

          const start = Math.max(1, page - 1);
          const end = Math.min(totalPages, page + 1);

          if (start > 1) {
            range.push(1);
            if (start > 2) range.push("...");
          }

          for (let i = start; i <= end; i++) {
            range.push(i);
          }

          if (end < totalPages) {
            if (end < totalPages - 1) range.push("...");
            range.push(totalPages);
          }

          return range.map((p, index) => (
            <button
              key={index}
              disabled={p === "..."}
              onClick={() => typeof p === "number" && setPage(p)}
              className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm rounded border transition-colors duration-200 ${p === page
                ? "bg-primary text-white border-primary"
                : p === "..."
                  ? "cursor-default text-gray-400 border-gray-300"
                  : "hover:bg-accent border-gray-300"
                }`}
            >
              {p}
            </button>
          ));
        })()}

        <Button
          variant="outline"
          className="flex items-center text-sm"
          disabled={page === data.pagination.totalPages}
          onClick={() =>
            setPage((prev) =>
              data.pagination.totalPages
                ? Math.min(prev + 1, data.pagination.totalPages)
                : prev + 1
            )
          }
        >
          {"Next >"}
        </Button>
      </div>

    </Layout>
  );
}

export default Home;