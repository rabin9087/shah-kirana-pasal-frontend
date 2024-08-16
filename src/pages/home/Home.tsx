
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProducts } from "@/axios/product/product";
import { useEffect } from "react";

function Home(): JSX.Element {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector(state => state.productInfo)

  const { data = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['product'],
    queryFn: async () =>
      getAllProducts()
    ,
  });

  useEffect(() => {
    if (data.length) { dispatch(setProducts(data)) }
  }, [dispatch, data])


  if (isLoading || isFetching) return <Layout title=""> <div className="w-full h-full flex justify-center items-center my-20">
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span>

    </div>
    <span className="ms-2">Loading...</span>
  </div> </Layout>;
  if (error) return <Layout title=""><div className="w-full text-center my-20 text-red-500">Error loading products...</div> </Layout>

  return (<Layout types="products" title="All Products" >
    {/* return (<Layout types="products" title={`${data.length} products found`} data={data} setData={setData} > */}
    <div className="flex justify-center gap-5 items-center p-5 flex-wrap min-h-screen">
      {products.map((product: IProductTypes) =>
        <ProductCard key={product._id} item={product} />
      )}
    </div>
  </Layout>
  );
}

export default Home;
