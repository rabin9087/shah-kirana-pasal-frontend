import { useAppSelector } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsByCategory } from "@/axios/product/product";
import { IProductTypes } from "@/types/index";
import ProductCard from "@/pages/productCard/ProductCard";

type Props = {
    parentCategoryId?: string;
    qrCodeNumber?: string
};

const YouMayLike: React.FC<Props> = ({ parentCategoryId, qrCodeNumber }) => {
    const { categories } = useAppSelector((state) => state.categoryInfo);

    // Find slug from parentCategoryId
    const category = categories.find((cat) => cat._id === parentCategoryId);
    const slug = category?.slug;

    const { data: relatedProducts = [], isLoading, error } = useQuery<IProductTypes[]>({
        queryKey: ["relatedProducts", slug],
        queryFn: () => (slug ? getAllProductsByCategory(slug) : Promise.resolve([])),
        enabled: !!slug, // only run if slug is available
    });

    const saleOnProducts = relatedProducts.filter((item) => item.salesPrice > 0 && item.qrCodeNumber !== qrCodeNumber)
    const NotsaleOnProducts = relatedProducts.filter((item) => !item.salesPrice && item.qrCodeNumber !== qrCodeNumber)

    if (!slug) return null;
    if (isLoading) return <p>Loading suggestions...</p>;
    if (error) return <p>Failed to load suggestions.</p>;

    return (
        <>
            {saleOnProducts.length ?  <div className=" shadow-md mt-6 md:mt-24">
                <h1 className="text-center md:text-start font-normal py-2 ps-4">Sales Products</h1>
                <div className="mx-auto flex gap-4 items-center overflow-x-auto py-4 px-2 w-full">
                    {saleOnProducts.map((product: IProductTypes) => (
                        <ProductCard key={product._id} item={product} addClass="min-w-[200px] max-w-[250px]" />
                    ))}
                </div>
            </div> : null}

            {NotsaleOnProducts.length ? <div className="grid justify-center  gap-1 py-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {NotsaleOnProducts.map((product: IProductTypes) =>
                    <ProductCard key={product._id} item={product} />
                )}
            </div> : null}
        </>
    );
};

export default YouMayLike;
