import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProducts } from "@/axios/product/product";
import { useEffect, useMemo } from "react";
import NetworkError from "@/components/network Error/NetworkError";

function Home(): JSX.Element {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.productInfo);
  const { categories } = useAppSelector((s) => s.categoryInfo);

  const { data = [], error, refetch } = useQuery<IProductTypes[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  useEffect(() => {
    if (data.length) {
      dispatch(setProducts(data));
    }
  }, [dispatch, data]);

  const categoryMap = useMemo(
    () =>
      categories
        .filter((category) => category.slug) // Filter out categories without a slug
        .reduce((acc, category) => {
          acc[category.slug!] = category._id!;
          return acc;
        }, {} as Record<string, string>),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const activeProducts = products.filter(
      (item) => item.status === "ACTIVE" && !item.salesPrice
    );

    return {
      productsOnSale: products.filter((item) => item.salesPrice > 0),
      electronics: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["electronics"]
      ),
      chocolates: activeProducts
        .filter((item) => item.parentCategoryID === categoryMap["chocolates"])
        .slice(0, 10),
      snacks: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["snacks"]
      ),
      biscuit: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["biscuit"]
      ),
      soap: activeProducts.filter(
        (item) => item.parentCategoryID === categoryMap["soap-and-saraf"]
      ),
      // soap- and - saraf
      allProducts: activeProducts,
    };
  }, [products, categoryMap]);

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
    productList,
  }: {
    title: string;
    productList: IProductTypes[];
  }) => (
    <>
      {productList.length > 0 && (
        <div className="border-2 shadow-md my-16">
          <h1 className="text-center md:text-start font-normal py-2 ps-4">
            {title}
          </h1>
          <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
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
    <Layout types="products" title="">
      <ProductSection
        title="Sales Products"
        productList={filteredProducts.productsOnSale}
      />
      <ProductSection
        title="Snacks"
        productList={filteredProducts.snacks}
      />
      <ProductSection
        title="Chocolates"
        productList={filteredProducts.chocolates}
      />
      <ProductSection
        title="Biscuits"
        productList={filteredProducts.biscuit}
      />
      <ProductSection
        title="Soaps"
        productList={filteredProducts.soap}
      />
      <ProductSection
        title="Electronics Devices"
        productList={filteredProducts.electronics}
      />
      <ProductSection
        title="Our Products"
        productList={filteredProducts.allProducts}
      />
    </Layout>
  );
}
export default Home;