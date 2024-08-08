
import { IProductTypes } from "@/types";
import ProductCard from "../productCart/ProductCart";
import Layout from "@/components/layout/Layout";

interface IHomeProps {
  data: IProductTypes[],
  setData: (data: IProductTypes[]) => void
}

function Home({ data, setData }: IHomeProps): JSX.Element {

  return (<Layout types="products" title={`${data.length} products found`} data={data} setData={setData} >
    <div className="flex justify-center">
      <ProductCard data={data} />
    </div>
  </Layout>
  );
}

export default Home;
