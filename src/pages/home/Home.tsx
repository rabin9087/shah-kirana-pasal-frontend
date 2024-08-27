
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProducts, getAllProductsByCategory } from "@/axios/product/product";
import { useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

function Home(): JSX.Element {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector(state => state.productInfo)
  const { categories } = useAppSelector(s => s.categoryInfo)

  const { data = [], isLoading, error, isFetching } = useQuery<IProductTypes[]>({
    queryKey: ['products'],
    queryFn: () =>
      getAllProducts()
  });

  const electronicsId = categories.find((item) => item.slug === "electronics")
  const { data: elecytronicsProduct = [] } = useQuery<IProductTypes[]>({
    queryKey: ["category", electronicsId],
    queryFn: () =>
      getAllProductsByCategory(electronicsId?.slug as string)
  });

  useEffect(() => {
    if (data.length) { dispatch(setProducts(data)) }
  }, [dispatch, data])

  if (isLoading || isFetching) return <Loading />;

  if (error) return <Error />

  return (<Layout types="products" title="All Products" >
    <div className=" border-2 shadow-md">
      <h1 className="text-center md:text-start font-normal py-2 ps-4">Electronics Items</h1>
      <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
        {elecytronicsProduct.map((product: IProductTypes) => (
          <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
        ))}
      </div>
    </div>
    <div className="flex justify-center gap-4 items-center flex-wrap py-4">
      {products.map((product: IProductTypes) =>
        <ProductCard key={product._id} item={product} />
      )}
    </div>
  </Layout>
  );
}

export default Home;
