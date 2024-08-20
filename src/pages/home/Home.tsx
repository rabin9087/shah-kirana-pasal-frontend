
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import ProductCard from "../productCard/ProductCard";
import { useQueries, useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProducts } from "@/axios/product/product";
import { useEffect } from "react";
import { getACategory } from "@/axios/category/category";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

function Home(): JSX.Element {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector(state => state.productInfo)
  const { categories } = useAppSelector(s => s.categoryInfo)

  const { data = [], isLoading, error, isFetching } = useQuery<IProductTypes[]>({
    queryKey: ['product'],
    queryFn: async () =>
      getAllProducts()
    ,
  });

  const fruitId = categories.find((item) => item.slug === "sports")
  console.log(typeof (fruitId), fruitId)

  // const result = useQueries({
  //   queries: [
  //     { queryKey: ['category', 1], queryFn: getACategory(fruitId?._id as string) }
  //   ]
  // })

  // console.log(result[0].status)



  useEffect(() => {
    if (data.length) { dispatch(setProducts(data)) }
  }, [dispatch, data])


  if (isLoading || isFetching) return <Loading />;

  if (error) return <Error />

  return (<Layout types="products" title="All Products" >
    {/* return (<Layout types="products" title={`${data.length} products found`} data={data} setData={setData} > */}
    <div className="flex justify-center gap-4 items-center flex-wrap py-4">
      {products.map((product: IProductTypes) =>
        <ProductCard key={product._id} item={product} />
      )}
    </div>
  </Layout>
  );
}

export default Home;
