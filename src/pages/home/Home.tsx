
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getAllProductAction } from "@/action/product.action";
import ProductCard from "../productCard/ProductCard";

// interface IHomeProps {
//   data: IProductTypes[],
//   setData: (data: IProductTypes[]) => void
// }

function Home(): JSX.Element {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.productInfo)



  const [data, setData] = useState<IProductTypes[]>(products)

  useEffect(() => {
    dispatch(getAllProductAction())
    setData(products)
  }, [dispatch, products.length])


  return (<Layout types="products" title={`${data.length} products found`} data={data} setData={setData} >
    <div className="flex justify-center gap-5 items-center p-5 flex-wrap ">

      {products.map((product) =>
        <ProductCard key={product._id} item={product} />

      )}
    </div>
  </Layout>
  );
}

export default Home;
