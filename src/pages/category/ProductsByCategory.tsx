import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { IProductTypes } from "@/types";
import Layout from "@/components/layout/Layout";
import ProductNotFound from "../product/components/ProductNotFound";
import { useQuery } from "@tanstack/react-query";
import { setProducts } from "@/redux/product.slice";
import { getAllProductsByCategory } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import ProductCard from "../productCard/ProductCard";

// interface IProductCardProps {
//     data: IProductTypes[],
//     setData: (data: IProductTypes[]) => void
// }

const ProductCardByCategory: React.FC = () => {

    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { slug } = useParams()
    const searchTerm = searchParams.get('searchTerm') || ''
    const { products } = useAppSelector(state => state.productInfo)
    // const [data, setData] = useState<IProductTypes[]>(products)

    const saleOnProducts = products.filter((item) => item.salesPrice > 0)
    const NotsaleOnProducts = products.filter((item) => !item.salesPrice)
    
    const { data = [] as IProductTypes[], error } = useQuery<IProductTypes[]>({
        queryKey: ["categories", slug, searchTerm],
        queryFn: async () => {
            if (searchTerm) {
                return await getAllProductsByCategory(searchTerm as string);
            }
            if (slug) {
                return await getAllProductsByCategory(slug as string);
            }
            return [];
        }
    });
    useEffect(() => {
        if (data?.length) { dispatch(setProducts(data)) }
        // dispatch(toggleSideBar());
    }, [dispatch, slug, data.length, searchTerm])

    // if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />

    return (<Layout title={`${(slug || searchTerm).toUpperCase()} PRODUCTS`} types="category">
        {data.length < 1 ? <ProductNotFound /> :
            
            <>
                <div className=" shadow-md mt-6 md:mt-24">
                    <h1 className="text-center md:text-start font-normal py-2 ps-4">Sales Products</h1>
                    <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
                        {saleOnProducts.map((product: IProductTypes) => (
                            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
                        ))}
                    </div>
                </div>
                
                <div className="grid justify-center  gap-1 py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {NotsaleOnProducts.map((product: IProductTypes) =>
                    <ProductCard key={product._id} item={product} />
                )}
            </div>
            </>
        }
    </Layout>
    );
};

export default ProductCardByCategory;