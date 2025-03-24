import CustomModal from "@/components/CustomModal";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UpdateProductLocation from "./productLocation/UpdateProductLocation";

const ScanProduct = () => {
    const [barcode, setBarcode] = useState<string>("");
    const [productLocation, setProductLocation] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [sku, setSKU] = useState<string>("");
    const navigate = useNavigate();

    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearch(value);
    };

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (search.trim() !== "") {
            navigate(`/search/product?barcode=${search.trim()}`);
            return;
        }

        if (sku.trim() !== "") {
            navigate(`/search/product?sku=${sku.trim()}`);
            return;
        }
    };


    useEffect(() => {
        if (barcode !== "") {
            navigate(`/search/product/fullDetails/${barcode}`);
        }
        if (productLocation !== "") {
            setIsOpen(true);
        }
    }, [barcode, productLocation, navigate]);

    return (
        <Layout title="Scan Product">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 space-y-6">
                <h2 className="text-xl font-bold text-center text-gray-700">Scan & Search Product</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* View Product Details */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                        <Label htmlFor="barcode" className="text-lg font-semibold text-gray-700 mb-2 block">
                            View Product Details
                        </Label>
                        <div className="flex justify-center items-center mt-4">
                            <CustomModal scanCode={setBarcode} scan={true} />
                        </div>
                    </div>

                    {/* View Product Location */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition">
                        <Label htmlFor="productLocation" className="text-lg font-semibold text-gray-700 mb-2 block">
                            View Product Location
                        </Label>
                        <div className="flex justify-center items-center mt-4">
                            <CustomModal setProductLocation={setProductLocation} scan={true} />
                        </div>
                    </div>
                </div>


                {/* Search by Barcode */}
                <form onSubmit={handleOnSubmit} className="space-y-2">
                    <Label className="font-medium text-gray-600">Search Product by Barcode</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="Enter product barcode"
                            onChange={handelOnChange}
                            className="flex-1"
                        />
                        <Button type="submit" className="w-full sm:w-auto">
                            Search
                        </Button>
                    </div>
                </form>

                {/* Search by SKU */}
                <form onSubmit={handleOnSubmit} className="space-y-2">
                    <Label className="font-medium text-gray-600">Search Product by SKU</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            onChange={(e) => setSKU(e.target.value)}
                            placeholder="Enter product SKU"
                            className="flex-1"
                        />
                        <Button type="submit" className="w-full sm:w-auto">
                            Search
                        </Button>
                    </div>
                </form>

                {/* Button for QR Codes List */}
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full sm:w-auto"
                        onClick={() => navigate("/printProductsQRCodeNameSku")}
                    >
                        View Product QRCode List
                    </Button>
                </div>

                <UpdateProductLocation
                    setProductLocation={setProductLocation}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    productLocation={productLocation}
                />
            </div>
        </Layout>
    );
};

export default ScanProduct;
