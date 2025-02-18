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

  const {
    data = [],
    error,
    refetch
  } = useQuery<IProductTypes[]>({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const electronicsId = categories.find((item) => item.slug === "electronics");
  const chocolatesId = categories.find((item) => item.slug === "chocolates");

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

  const productsOnSale = products?.filter((item) => item.salesPrice > 0);
  const productsNotOnSale = products?.filter((item) => !item.salesPrice && item.status === "ACTIVE" && item.parentCategoryID !== electronicsId?._id).slice(0, 10);
  const chocolates = products?.filter((item) => !item.salesPrice && item.status === "ACTIVE" && item.parentCategoryID === chocolatesId?._id).slice(0, 10);
  // const chocolates = products?.filter((item) => !item.salesPrice && item.status === "ACTIVE" && item.parentCategoryID !== chocolates?._id).slice(0, 10);
  const halfPriceSpecials = products?.filter((item) => item.status === "ACTIVE" && item.salesPrice > 0).slice(0, 10);
  const electronicsNotOnSale = electronicsProducts?.filter((item) => !item.salesPrice && item.status === "ACTIVE")


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
        <h1 className="text-center md:text-start font-normal py-2 ps-4">Sales Products</h1>
        <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
          {productsOnSale.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
          ))}
        </div>
      </div>

      <div className="border-2 shadow-md my-32">
        <h1 className="text-center md:text-start font-normal py-2 ps-4">Electronics Items</h1>
        <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
          {electronicsNotOnSale.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
          ))}
        </div>
      </div>

      <div className="border-2 shadow-md">
        <h1 className="text-center md:text-start font-normal py-2 ps-4">Choclotes Items</h1>
        <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
          {chocolates.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
          ))}
          {chocolates.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
          ))}
        </div>
      </div>

      <div className="border-2 shadow-md mt-28">
      <h1 className="text-center md:text-start font-normal py-2 ps-4">More Products</h1>
      <div className="grid justify-center gap-1 py-4 grid-cols-2 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {productsNotOnSale.map((product: IProductTypes) => (
          <ProductCard key={product._id} item={product} />
        ))}
        </div>
      </div>

      <div className="border-2 shadow-md mt-32">
        <h1 className="text-center md:text-start font-normal py-2 ps-4">Half Price specials</h1>
        <div className="grid justify-center gap-1 py-4 grid-cols-2 sm:grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {halfPriceSpecials.map((product: IProductTypes) => (
            <ProductCard key={product._id} item={product} />
          ))}
        </div>
      </div>

    </Layout>
  );
}

export default Home;
