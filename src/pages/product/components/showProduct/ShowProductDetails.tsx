import { getAProduct, getAProductBySKU } from "@/axios/product/product";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setAProduct } from "@/redux/product.slice";
import { IProductTypes } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export const formatLocation = (location: string): string => {
    const parts = location.split(".").map((num) => num.padStart(2, ""));
    return `A${parts[0]} - B${parts[1]} - S${parts[2]}`;
};

const ShowProductDetails = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const { product } = useAppSelector((state) => state.productInfo);
    const [searchParams] = useSearchParams();
    const sku = searchParams.get("sku");
    const barcode = searchParams.get("barcode");

    const { data = {} as IProductTypes } = useQuery<IProductTypes>({
        queryKey: ["product", sku, barcode],
        queryFn: async () => {
            if (barcode) {
                return await getAProduct({ qrCodeNumber: barcode });
            }
            if (sku) {
                return await getAProductBySKU(sku);
            }
            return {} as IProductTypes;
        },
        enabled: Boolean(sku || barcode), // <-- enable query only when sku or barcode is truthy
    });

    useEffect(() => {
        if (data?._id) {
            dispatch(setAProduct(data));
        }

    }, [dispatch, data]); // <- depend on full data

    return (
        <Layout title="">
            <div className="flex justify-start gap-2 mt-4 items-center ps-4 font-bold">
                <Button onClick={() => navigate(-1)}>{"<"} BACK</Button>
                <p>ARTICLE DETAILA</p>
            </div>
            {product?._id && <div>
                <div>
                    <div className="flex flex-col w-full border-2 p-2 mt-2 bg-primary text-white">
                        <div className="flex justify-between items-center ms-2">
                            <h1 className="text-sm font-bold">Article {sku}</h1>
                            <p className="text-end w-fit bg-blue-900 px-2 text-white bg-primary rounded-md whitespace-nowrap p-1">
                                {product?.productLocation ? formatLocation(product?.productLocation) : "N/A"}
                            </p>                    </div>
                        <div>
                            <p className="ms-2">{product?.name}</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
                    <div className="flex flex-row gap-2">

                        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">

                            <div className="mt-4">
                                <span className="text-xl font-semibold text-gray-800">
                                    Price: ${product?.price}
                                </span> {product?.salesPrice && (
                                    <span className="text-lg text-red-500 ml-2">
                                        Sale Price: ${product?.salesPrice}
                                    </span>
                                )}
                                <p className="text-gray-600">
                                    <strong>SOH:</strong> {product?.quantity}
                                </p>

                            </div>
                            <div className="mt-4">
                                Status:  <span
                                    className={`px-2 py-1 rounded-md text-sm ${product?.status === 'ACTIVE'
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                        }`}
                                >
                                    {product?.status}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-600">
                                    <strong>Brand:</strong> {product?.brand || 'N/A'}
                                </p>

                                <p className="text-gray-600">
                                    <strong>SKU:</strong> {product?.sku}
                                </p>

                            </div>
                            <p className="text-gray-600 mt-2">Description: {product?.description}</p>
                        </div>
                    </div>
                    <div className="md:w-1/3 w-fit flex justify-center items-center mt-4 ">
                        <img
                            src={product?.thumbnail || 'default-image.jpg'}
                            alt={product?.name}
                            className="w-64 h-80 object-cover rounded-md"
                        />
                    </div>
                </div>
                <Link to={`/update/product/sku_value/${product.sku}`} className="bg-primary p-2 w-full mt-4 flex justify-center rounded-md text-white">
                    Update
                </Link>
            </div>}
        </Layout>

    )
}
export default ShowProductDetails