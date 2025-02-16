import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProducts, getAllProductsByCategory } from "@/axios/product/product";
import { useEffect } from "react";
import NetworkError from "@/components/network Error/NetworkError";

function Home(): JSX.Element {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.productInfo)
  const { categories } = useAppSelector(s => s.categoryInfo)
  const activeProducts = products?.filter((item) => item.status === "ACTIVE");

  const {
    data = [],
    error,
    refetch
  } = useQuery<IProductTypes[]>({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const electronicsId = categories.find((item) => item.slug === "electronics");

  const { data: electronicsProducts = [], error: electronicsError } = useQuery<IProductTypes[]>({
    queryKey: ["category", electronicsId],
    queryFn: async () => {
      if (electronicsId) {
        return await getAllProductsByCategory(electronicsId.slug as string);
      }
      return [];
    },
    enabled: !!electronicsId, // Prevents query from running if `electronicsId` is undefined
  });
  

  useEffect(() => {
    if (data.length) {
      dispatch(setProducts(data));
    }
  }, [dispatch, data]);

  // if (isLoading || isFetching) return <Loading />;

  if (error || electronicsError) {
    return (
      <NetworkError
        message="Failed to load products. Please check your connection."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Layout types="products" title="All Products">
      <div className="border-2 shadow-md">
        <h1 className="text-center md:text-start font-normal py-2 ps-4">Electronics Items</h1>
        <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
          {electronicsProducts.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
          ))}
        </div>
      </div>
      <div className="grid justify-center gap-1 py-4 grid-cols-2 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {activeProducts.map((product: IProductTypes) => (
          <ProductCard key={product._id} item={product} />
        ))}
      </div>
    </Layout>
  );
}

export default Home;
