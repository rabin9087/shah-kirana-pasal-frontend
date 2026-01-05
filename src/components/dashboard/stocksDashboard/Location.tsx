import { getStocksBySKU } from "@/axios/cfStock/cfStock";
import { ProductTypeStock } from "@/axios/cfStock/types";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setStocks } from "@/redux/stock.slice";
import React, { useEffect, useState } from "react";

// export type ProductTypeStock = {
//     sku: string;
//     name: string;
//     location: string,
//     locationType: string,
//     category: string,
//     expiryDate: string; // ISO date string
//     quantity: number;
//     [key: string]: any; // for extra fields
// };

// export const sampleProducts: ProductTypeStock[] = [
//     // ===== Coca Cola 1.25L (SKU-1001) - 6 locations =====
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2027-01-10",
//         location: "ITAGFA1",
//         locationType: "ps",
//         quantity: 50,
//         category: "Beverages",
//     },
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2025-11-30",
//         location: "ITAGFA2",
//         locationType: "ps",
//         quantity: 20,
//         category: "Beverages",
//     },
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2026-01-10",
//         location: "ITAGFA3",
//         locationType: "ps",
//         quantity: 35,
//         category: "Beverages",
//     },
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2025-01-10",
//         location: "ITAGFA4",
//         locationType: "ps",
//         quantity: 18,
//         category: "Beverages",
//     },
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2026-06-22",
//         location: "ITAGFA5",
//         locationType: "ps",
//         quantity: 42,
//         category: "Beverages",
//     },
//     {
//         sku: "SKU-1001",
//         name: "Coca Cola 1.25L",
//         expiryDate: "2027-03-02",
//         location: "ITAGFA6",
//         locationType: "ps",
//         quantity: 15,
//         category: "Beverages",
//     },

//     // ===== Red Bull 250ml (SKU-1002) - 4 locations =====
//     {
//         sku: "SKU-1002",
//         name: "Red Bull 250ml",
//         expiryDate: "2024-12-01",
//         location: "ITAGFB1",
//         locationType: "ps",
//         quantity: 30,
//         category: "Energy Drink",
//     },
//     {
//         sku: "SKU-1002",
//         name: "Red Bull 250ml",
//         expiryDate: "2025-02-18",
//         location: "ITAGFB2",
//         locationType: "ps",
//         quantity: 12,
//         category: "Energy Drink",
//     },
//     {
//         sku: "SKU-1002",
//         name: "Red Bull 250ml",
//         expiryDate: "2024-09-15",
//         location: "ITAGFB3",
//         locationType: "ps",
//         quantity: 25,
//         category: "Energy Drink",
//     },
//     {
//         sku: "SKU-1002",
//         name: "Red Bull 250ml",
//         expiryDate: "2025-05-01",
//         location: "ITAGFB4",
//         locationType: "ps",
//         quantity: 18,
//         category: "Energy Drink",
//     },

//     // ===== Devondale Milk (SKU-1003) 5 locations =====
//     {
//         sku: "SKU-1003",
//         name: "Devondale Full Cream Milk 1L",
//         expiryDate: "2024-11-15",
//         location: "ITAGFC1",
//         locationType: "ps",
//         quantity: 80,
//         category: "Dairy",
//     },
//     {
//         sku: "SKU-1003",
//         name: "Devondale Full Cream Milk 1L",
//         expiryDate: "2024-10-10",
//         location: "ITAGFC2",
//         locationType: "ps",
//         quantity: 50,
//         category: "Dairy",
//     },
//     {
//         sku: "SKU-1003",
//         name: "Devondale Full Cream Milk 1L",
//         expiryDate: "2025-01-20",
//         location: "ITAGFC3",
//         locationType: "ps",
//         quantity: 60,
//         category: "Dairy",
//     },
//     {
//         sku: "SKU-1003",
//         name: "Devondale Full Cream Milk 1L",
//         expiryDate: "2024-12-30",
//         location: "ITAGFC4",
//         locationType: "ps",
//         quantity: 90,
//         category: "Dairy",
//     },
//     {
//         sku: "SKU-1003",
//         name: "Devondale Full Cream Milk 1L",
//         expiryDate: "2024-09-12",
//         location: "ITAGFC5",
//         locationType: "ps",
//         quantity: 35,
//         category: "Dairy",
//     },

//     // ===== Bread (SKU-1004) - 4 locations =====
//     {
//         sku: "SKU-1004",
//         name: "Tip Top Bread 700g",
//         expiryDate: "2024-10-20",
//         location: "ITAGFD1",
//         locationType: "ps",
//         quantity: 40,
//         category: "Bakery",
//     },
//     {
//         sku: "SKU-1004",
//         name: "Tip Top Bread 700g",
//         expiryDate: "2024-10-08",
//         location: "ITAGFD2",
//         locationType: "ps",
//         quantity: 22,
//         category: "Bakery",
//     },
//     {
//         sku: "SKU-1004",
//         name: "Tip Top Bread 700g",
//         expiryDate: "2024-09-28",
//         location: "ITAGFD3",
//         locationType: "ps",
//         quantity: 17,
//         category: "Bakery",
//     },
//     {
//         sku: "SKU-1004",
//         name: "Tip Top Bread 700g",
//         expiryDate: "2024-10-15",
//         location: "ITAGFD4",
//         locationType: "ps",
//         quantity: 33,
//         category: "Bakery",
//     },

//     // ===== Baked Beans (SKU-1005) - 3 locations =====
//     {
//         sku: "SKU-1005",
//         name: "Heinz Baked Beans 420g",
//         expiryDate: "2026-02-05",
//         location: "ITAGFE1",
//         locationType: "ps",
//         quantity: 120,
//         category: "Canned Food",
//     },
//     {
//         sku: "SKU-1005",
//         name: "Heinz Baked Beans 420g",
//         expiryDate: "2025-11-21",
//         location: "ITAGFE2",
//         locationType: "ps",
//         quantity: 60,
//         category: "Canned Food",
//     },
//     {
//         sku: "SKU-1005",
//         name: "Heinz Baked Beans 420g",
//         expiryDate: "2026-01-15",
//         location: "ITAGFE3",
//         locationType: "ps",
//         quantity: 90,
//         category: "Canned Food",
//     },

//     // ===== Snacks (SKU-1006, 1007) - 6 items =====
//     {
//         sku: "SKU-1006",
//         name: "Nature Valley Oats Bar",
//         expiryDate: "2024-08-01",
//         location: "ITAGFF1",
//         locationType: "ps",
//         quantity: 25,
//         category: "Snacks",
//     },
//     {
//         sku: "SKU-1006",
//         name: "Nature Valley Oats Bar",
//         expiryDate: "2024-10-20",
//         location: "ITAGFF2",
//         locationType: "ps",
//         quantity: 12,
//         category: "Snacks",
//     },
//     {
//         sku: "SKU-1007",
//         name: "Doritos Corn Chips 170g",
//         expiryDate: "2025-07-23",
//         location: "ITAGFG1",
//         locationType: "ps",
//         quantity: 60,
//         category: "Snacks",
//     },
//     {
//         sku: "SKU-1007",
//         name: "Doritos Corn Chips 170g",
//         expiryDate: "2025-06-11",
//         location: "ITAGFG2",
//         locationType: "ps",
//         quantity: 42,
//         category: "Snacks",
//     },

//     // ===== Nescafe (SKU-1008) - 3 items =====
//     {
//         sku: "SKU-1008",
//         name: "Nescafe Blend 43 250g",
//         expiryDate: "2027-04-11",
//         location: "ITAGFH1",
//         locationType: "ps",
//         quantity: 15,
//         category: "Coffee",
//     },
//     {
//         sku: "SKU-1008",
//         name: "Nescafe Blend 43 250g",
//         expiryDate: "2027-01-10",
//         location: "ITAGFH2",
//         locationType: "ps",
//         quantity: 25,
//         category: "Coffee",
//     },
//     {
//         sku: "SKU-1008",
//         name: "Nescafe Blend 43 250g",
//         expiryDate: "2026-12-01",
//         location: "ITAGFH3",
//         locationType: "ps",
//         quantity: 10,
//         category: "Coffee",
//     },

//     // ===== Dairy Milk (SKU-1009) - 3 items =====
//     {
//         sku: "SKU-1009",
//         name: "Cadbury Dairy Milk 180g",
//         expiryDate: "2025-03-13",
//         location: "ITAGFI1",
//         locationType: "ps",
//         quantity: 75,
//         category: "Chocolate",
//     },
//     {
//         sku: "SKU-1009",
//         name: "Cadbury Dairy Milk 180g",
//         expiryDate: "2025-05-01",
//         location: "ITAGFI2",
//         locationType: "ps",
//         quantity: 40,
//         category: "Chocolate",
//     },
//     {
//         sku: "SKU-1009",
//         name: "Cadbury Dairy Milk 180g",
//         expiryDate: "2024-12-12",
//         location: "ITAGFI3",
//         locationType: "ps",
//         quantity: 30,
//         category: "Chocolate",
//     },

//     // ===== Colgate (SKU-1010) - 4 items =====
//     {
//         sku: "SKU-1010",
//         name: "Colgate Toothpaste 120g",
//         expiryDate: "2028-09-09",
//         location: "ITAGFJ1",
//         locationType: "ps",
//         quantity: 90,
//         category: "Personal Care",
//     },
//     {
//         sku: "SKU-1010",
//         name: "Colgate Toothpaste 120g",
//         expiryDate: "2027-12-03",
//         location: "ITAGFJ2",
//         locationType: "ps",
//         quantity: 70,
//         category: "Personal Care",
//     },
//     {
//         sku: "SKU-1010",
//         name: "Colgate Toothpaste 120g",
//         expiryDate: "2028-01-01",
//         location: "ITAGFJ3",
//         locationType: "ps",
//         quantity: 54,
//         category: "Personal Care",
//     },
//     {
//         sku: "SKU-1010",
//         name: "Colgate Toothpaste 120g",
//         expiryDate: "2027-08-11",
//         location: "ITAGFJ4",
//         locationType: "ps",
//         quantity: 36,
//         category: "Personal Care",
//     },
// ];

const Location = () => {
    const [barcode, setBarcode] = useState("");
    const [products, setProducts] = useState<ProductTypeStock[]>([]);
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();
    const { stocks } = useAppSelector(s => s.stockInfo);

    const handleSearch = async () => {
        try {
            setError("");

            if (!barcode.trim()) {
                setError("Please enter or scan a barcode.");
                return;
            }

            const response = await getStocksBySKU(barcode.toUpperCase())
            let data: ProductTypeStock[] = response;

            // Priority order for locationType
            const priorityOrder = ["PSBAVEG", "PSBADRY", "PSBAMEA"];

            data = data.sort((a, b) => {
                // 1️⃣ Sort by locationType priority
                const priorityA = priorityOrder.indexOf(a.locationType);
                const priorityB = priorityOrder.indexOf(b.locationType);

                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }

                // 2️⃣ If same locationType → sort by expiryDate
                const dateA = new Date(a.expiryDate).getTime();
                const dateB = new Date(b.expiryDate).getTime();
                return dateA - dateB; // earliest expiry first
            });

            setProducts(data);

        } catch (err) {
            setError("Product not found or backend error.");
        }
    };

    // Handle scan trigger: Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        if (stocks.length) {
            dispatch(setStocks(products));
        }
    }, [stocks.length, products, dispatch]);

    return (
        <div className="p-6 space-y-6 w-full">
            <h2 className="text-xl font-semibold">Scan or Enter SKU</h2>

            {/* Input Box */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Scan SKU..."
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border px-3 py-2 rounded w-full shadow-sm focus:ring focus:ring-blue-300"
                />
                <button
                    onClick={handleSearch}
                    className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex text-green-600 font-bold">{products[0]?.name}</div>
            {/* Product Table */}
            {products.length > 0 && (
                <div className="overflow-x-auto border rounded-lg shadow">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">SKU</th>
                                <th className="border px-3 py-2 text-left">Identifier</th>
                                <th className="border px-3 py-2 text-left">Location</th>
                                <th className="border px-3 py-2 text-left">Location Type</th>
                                <th className="border px-3 py-2 text-left">Qty</th>
                                <th className="border px-3 py-2 text-left">Expiry</th>

                            </tr>
                        </thead>

                        <tbody className="hover:bg-gray-500">
                            {products.map((p, idx) => (
                                <tr
                                    key={idx}
                                    className={`${new Date(p.expiryDate) < new Date()
                                            ? "bg-red-200 hover:bg-red-300 text-red-900 font-semibold"  // expired
                                            : idx % 2 === 0
                                                ? "bg-white hover:bg-blue-100"
                                                : "bg-gray-50 hover:bg-blue-100" } transition-colors cursor-pointer`}
                                >
                                    <td className="border px-3 py-2 ">{p.sku}</td>
                                    {/* <td className="border px-3 py-2">{p.name}</td> */}
                                    <td className="border px-3 py-2">{p.identifier}</td>
                                    <td className="border px-3 py-2">{p.location}</td>
                                    <td className="border px-3 py-2">{p.locationType}</td>
                                    <td className="border px-3 py-2">{p.quantity}</td>
                                    <td className="border px-3 py-2">
                                        {new Date(p.expiryDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Location;
