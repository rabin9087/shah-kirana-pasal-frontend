import CustomModal from "@/components/CustomModal";
// import Modal from 'react-modal';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UpdateProductLocation from "./productLocation/UpdateProductLocation";

const ScanProduct = () => {
    const [barcode, setBarcode] = useState<string>("");
    const [activeInput, setActiveInput] = useState<"barcode" | "productLocation" | null>("productLocation");
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

    // const handleOnClose = () => {
    //     setIsOpen(false);
    // };

    useEffect(() => {
        if (barcode !== "") {
            navigate(`/search/product/fullDetails/${barcode}`);
        }
        if (productLocation !== "") {
            setIsOpen(true);
        }
    }, [barcode, productLocation, navigate]);

    useEffect(() => {
        let buffer = "";
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (activeInput === "barcode") {
                    setBarcode(buffer);
                } else if (activeInput === "productLocation") {
                    setProductLocation(buffer);
                }
                buffer = "";
            } else {
                buffer += e.key;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeInput]); // ✅ depends on which input is active

    return (
        <Layout title="Scan Product">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6 space-y-6">
                <h2 className="text-xl font-bold text-center text-gray-700">Scan & Search Product</h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* View Product Details */}

                    {/* View Product Location */}
                    <div
                        onClick={() => setActiveInput("productLocation")}
                        className={`bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition ${activeInput === "productLocation" ? "bg-blue-200" : ""}`}>
                        <Label htmlFor="productLocation" className="text-lg font-semibold text-gray-700 mb-2 block">
                            View Product Location
                        </Label>
                        <div className="flex justify-center items-center mt-4">
                            <CustomModal setProductLocation={setProductLocation} scan={true} />
                        </div>
                    </div>
                    <div
                        onClick={() => setActiveInput("barcode")}
                        className={`bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition ${activeInput === "barcode" ? "bg-blue-200" : ""}`}>
                        <Label htmlFor="barcode" className="text-lg font-semibold text-gray-700 mb-2 block">
                            View Product Details
                        </Label>
                        <div className="flex justify-center items-center mt-4">
                            <CustomModal scanCode={setBarcode} scan={true} />
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
                <div className="flex justify-center gap-2 ">
                    <div className="flex justify-center ">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto hover:bg-gray-200"
                            onClick={() => navigate("/printProductsQRCodeNameSku")}
                        >
                            View Product QRCode List
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full sm:w-auto hover:bg-gray-200"
                            onClick={() => navigate("/barcode-qrcode")}
                        >
                            Generate barcode/qrCode
                        </Button>
                    </div>
                </div>

                <UpdateProductLocation
                    setProductLocation={setProductLocation}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    productLocation={productLocation}
                />
            </div>
{/* 
            <Modal
                isOpen={isOpen}
                onRequestClose={handleOnClose}
                overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-screen overflow-y-auto"
            >
                <div className="bg-gray-300 p-4 mx-16 rounded-md shadow-lg max-w-md w-72  flex flex-col justify-center items-center">
                    <h3>Article not found!</h3>
                </div>
                <div className="mt-6">
                    <Button variant="secondary" onClick={handleOnClose} className="w-full">
                        Close
                    </Button>
                </div>
            </Modal> */}

        </Layout>
    );
};

export default ScanProduct;
