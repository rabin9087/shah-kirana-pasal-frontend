import { getAllProducts } from "@/axios/product/product";
import { BarCodeGenerator } from "@/components/QRCodeGenerator";
import SearchInput from "@/components/search/SearchInput";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setProducts } from "@/redux/product.slice";
import { IProductTypes } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const PrintProductsQRCodeNameSku = () => {
    const { products } = useAppSelector((s) => s.productInfo);
    const { language } = useAppSelector((s) => s.settings);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [barcodeDisplayValue, setBarcodeDisplayValue] = useState(false);
    const [width, setWidth] = useState(2); // State for width
    const [height, setHeight] = useState(40);
    const [productData, setProductData] = useState<IProductTypes[]>(products);

    const { data = [] } = useQuery<IProductTypes[]>({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
        // enabled: products.length === 0 && categories.length === 0
    });

    useEffect(() => {
        if (data.length) {
            dispatch(setProducts(data))
        }
    }, [dispatch, data])

    return (
        <div className="p-4 print:p-0 max-w-screen-md mx-auto">
            <Button onClick={() => navigate(-1)} className="mb-4">
                {"<"} BACK
            </Button>
            <h1 className="text-center text-xl font-bold mb-2">Product Details</h1>
            <p className="text-center text-md font-bold mb-4">Total Products: {products.length}</p>
            <SearchInput
                placeholder="Search product"
                data={products}
                searchKeys={["name"]}
                setFilteredData={(filtered) =>
                    setProductData(filtered.length > 0 || filtered === data ? filtered : data)
                }
            />
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
                <div className="flex-1">
                    <label htmlFor="width" className="block">Select Barcode Width: </label>
                    <input
                        id="width"
                        type="number"
                        className="border p-2 rounded w-full"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min="1"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="height" className="block">Select Barcode Height: </label>
                    <input
                        id="height"
                        type="number"
                        className="border p-2 rounded w-full"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="1"
                    />
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 my-6">
                <span className="text-lg font-semibold">Display Barcode Value:</span>
                <button
                    onClick={() => setBarcodeDisplayValue((prev) => !prev)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${barcodeDisplayValue ? "bg-green-500" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${barcodeDisplayValue ? "translate-x-8" : "translate-x-1"
                            }`}
                    />
                </button>
                <span className="text-base font-medium">
                    {barcodeDisplayValue ? "Showing" : "Hidden"}
                </span>
            </div>


            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                {productData.map(({ qrCodeNumber, sku, name, price, salesPrice }) => (
                    <div
                        key={qrCodeNumber}
                        className="border p-2 rounded flex flex-col items-center justify-center text-center"
                    >
                        <Link
                            to={`/printSingleProductBarcodeNameSku/${qrCodeNumber}`}
                            state={{ name }}
                        >
                            <div className="flex justify-center">
                                <BarCodeGenerator value={qrCodeNumber as string} height={height} width={width} displayValue={barcodeDisplayValue} />
                            </div>
                            <p className="text-base mt-2">{name}</p>
                        </Link>
                        <strong className="text-md mt-2">{sku}</strong>
                        <strong className="text-md mt-2">{language === "en" ? "Rs." : "रु"} {salesPrice ? salesPrice : price}</strong>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrintProductsQRCodeNameSku;
