import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { IProductTypes } from "@/types/index";
import Layout from "@/components/layout/Layout";
import ProductNotFound from "../product/components/ProductNotFound";
import { useQuery } from "@tanstack/react-query";
import { setSelectedProducts } from "@/redux/product.slice";
import { getAllProductsByCategory } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import ProductCard from "../productCard/ProductCard";


const ProductCardByCategory: React.FC = () => {

    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { slug } = useParams()
    const searchTerm = searchParams.get('searchTerm') || ''
    const { selectedProducts } = useAppSelector(state => state.productInfo)
    const saleOnProducts = selectedProducts.filter((item) => item.salesPrice > 0)
    const NotsaleOnProducts = selectedProducts.filter((item) => !item.salesPrice)
  
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
        },
        // enabled: products.length === 0 && categories.length === 0
    });

    useEffect(() => {
        if (data?.length) { dispatch(setSelectedProducts(data)) }
        // dispatch(toggleSideBar());
    }, [dispatch, slug, data.length, searchTerm])

    // if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />

    return (<Layout title={`${(slug || searchTerm).toUpperCase()} PRODUCTS`} types="category">
        {data.length < 1 ? <ProductNotFound open={false} onClose={() => { }} /> :

            <div className="my-12 px-2 md:px-8 max-w-[1440px] md:mx-auto shadow-md rounded-md pb-4 border-t">
                <div className=" shadow-md mt-6 md:mt-24">
                    <h1 className="text-center md:text-start font-normal py-2 ps-4">Sales Products</h1>
                    <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
                        {saleOnProducts.map((product: IProductTypes) => (
                            <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
                        ))}
                    </div>
                </div>

                <div className="grid justify-center  gap-1 py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5">
                    {NotsaleOnProducts.map((product: IProductTypes) =>
                        <ProductCard key={product._id} item={product} />
                    )}
                </div>
            </div>
        }
    </Layout>
    );
};

export default ProductCardByCategory;