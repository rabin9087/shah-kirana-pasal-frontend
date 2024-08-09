
import { IProductTypes } from "@/types";
import ProductCard from "../productCart/ProductCart";
import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { getAllProductAction } from "@/action/product.action";

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
    <div className="flex justify-center">
      <ProductCard data={data} />
    </div>
  </Layout>
  );
}

export default Home;
