import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import ProductNotFound from "../product/components/ProductNotFound";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProductsByCategory } from "@/axios/product/product";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProductCard from "../productCard/ProductCard";

// interface IProductCardProps {
//     data: IProductTypes[],
//     setData: (data: IProductTypes[]) => void
// }

const ProductCardByCategory: React.FC = () => {

    const dispatch = useAppDispatch();
    const { slug } = useParams()
    const { products } = useAppSelector(state => state.productInfo)
    // const [data, setData] = useState<IProductTypes[]>(products)

    const { data = [] as IProductTypes[], isLoading, error, isFetching } = useQuery<IProductTypes[]>({
        queryKey: ["categories", slug],
        queryFn: async () =>
            await getAllProductsByCategory(slug as string)
    });
    useEffect(() => {
        if (data?.length) { dispatch(setProducts(data)) }
        // dispatch(toggleSideBar());
    }, [dispatch, slug, data.length])

    if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />

    return (<Layout title={`All ${slug} products`} types="category">
        {data.length < 1 ? <ProductNotFound /> :
            <div className="flex justify-center gap-4 items-center flex-wrap py-4">
                {products.map((product: IProductTypes) =>
                    <ProductCard key={product._id} item={product} />
                )}
            </div>}

    </Layout>
    );
};

export default ProductCardByCategory;
