import { UpdateStocksByIdentifier, getStocksByIdentifier } from "@/axios/cfStock/cfStock";
import { ProductTypeStock } from "@/axios/cfStock/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { productStockInitialState, setAStock } from "@/redux/stock.slice";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

// type ProductType = {
//     sku: string;
//     name: string;
//     price: number;
//     expiryDate: string;
//     quantity: number;
//     [key: string]: any;
// };

const TransferStock = () => {
    const [locationCode, setLocationCode] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");
    const [product, setProduct] = useState<ProductTypeStock>(productStockInitialState);
    const [selectedProduct, setSelectedProduct] = useState<ProductTypeStock | null>(null);
    const [transferQty, setTransferQty] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { stock } = useAppSelector(s => s.stockInfo);
    // ⬇ Fetch items for scanned location
    const fetchLocationItems = async (code: string) => {
        try {
            const response = await getStocksByIdentifier(code)
            setProduct(response);
        } catch (err) {
            console.error(err);
        }
    };

    const debouncedFetch = useMemo(
        () => debounce((val: string) => fetchLocationItems(val), 500),[]
    );
    // ⬇ Handle scanning location
    const handleLocationScan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value;
        setLocationCode(code);
        // Debounce: clear old timer and set new one
        if (code !== "" ) debouncedFetch(code);
};

    // ⬇ Handle scanning new destination location
    const handleDestinationScan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const code = e.target.value;
        setDestinationLocation(code);
    };

    // ⬇ Open modal when product clicked
    const openTransferModal = (product: ProductTypeStock) => {
        setSelectedProduct(product);
        setTransferQty(0);
        setModalOpen(true);
    };

    // ⬇ Save transfer
    const handleTransfer = async () => {
        if (!selectedProduct) return;

        if (transferQty <= 0 || transferQty > selectedProduct.quantity) return;

        const payload = {
            identifier: selectedProduct.identifier,
            fromLocation: locationCode,
            toLocation: destinationLocation,
            quantity: transferQty,
        };
        UpdateStocksByIdentifier(payload)
        console.log("TRANSFER PAYLOAD:", payload);

        // Example backend call
        // await axios.post("/api/stock/transfer", payload);

        setModalOpen(false);
    };
    console.log(product)
    useEffect(() => {
        if (product?._id) {
            dispatch(setAStock(product));
            setModalOpen(true)
        }
    }, [product?._id, product, dispatch]);

    return (
        <div className="p-4">

            {/* SCAN LOCATION INPUT */}
            <div className="mb-4">
                <label className="font-semibold">Scan Location Barcode</label>
                <input
                    type="text"
                    value={locationCode}
                    onChange={handleLocationScan}
                    className="w-full mt-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Scan location..."
                />
            </div>

            {product?._id  && (
                <div className="mb-4">
                    <label className="font-semibold">Scan New Destination Location</label>
                    <input
                        type="text"
                        value={destinationLocation}
                        onChange={handleDestinationScan}
                        className="w-full mt-1 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Scan new location..."
                    />
                </div>
            )}

            {/* PRODUCTS LIST */}
            {/* {product?._id ? (
                <div>
                    <h2 className="text-lg font-bold mb-2">Items in this Location</h2>

                    <div className="bg-white shadow rounded-lg divide-y">
                        {product
                            <div
                                className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between"
                        onClick={() => openTransferModal(product)}
                            >
                                <span className="font-medium">{p.name}</span>
                                <span className="text-sm text-gray-600">Qty: {p.quantity}</span>
                    </div>
                            }
                    </div>
                </div>
            ) : (
                locationCode.length > 2 && <p>No items found for this location.</p>
            )}

            {/* TRANSFER MODAL */}
            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white w-96 p-5 rounded-xl shadow-lg animate-fadeIn">
                        <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>

                        <p className="text-gray-600 mb-4">
                            Available Quantity: {selectedProduct.quantity}
                        </p>

                        <label className="font-semibold">Enter Quantity to Transfer</label>
                        <input
                            type="number"
                            value={transferQty}
                            min={0}
                            max={selectedProduct.quantity}
                            onChange={(e) => setTransferQty(Number(e.target.value))}
                            className="w-full mt-1 px-3 py-2 border rounded-md bg-white"
                        />

                        <div className="flex justify-between mt-5">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleTransfer}
                                disabled={transferQty <= 0 || transferQty > selectedProduct.quantity}
                                className={`px-4 py-2 rounded-md text-white ${transferQty > 0 && transferQty <= selectedProduct.quantity
                                    ? "bg-blue-600"
                                    : "bg-blue-300 cursor-not-allowed"
                                    }`}
                            >
                                Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )} 
            {/* } */}

        </div>
    );
};

export default TransferStock;
