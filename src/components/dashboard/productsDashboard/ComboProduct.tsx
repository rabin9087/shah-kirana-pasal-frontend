import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IoCreateOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks";
import SearchInput from "@/components/search/SearchInput";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { getAllProductComboOffer } from "@/axios/productComboOffer/productComboOffer";
import { setComboProduct } from "@/redux/product.slice";
import { SkeletonCard } from "@/components/ui/Loading";

export default function ComboProductDashboard() {
    const { comboProducts } = useAppSelector(s => s.productInfo);
    const [searchData, setSearchData] = useState(comboProducts)
    const dispatch = useAppDispatch()
    const { data = [], isLoading } = useQuery<IProductComboOffer[]>({
        queryKey: ['combo-products'],
        queryFn: () => getAllProductComboOffer(),
        enabled: comboProducts.length < 1, // Only fetch if no combo products are cached
    });
    useEffect(() => {
        if (data?.length) {
            dispatch(setComboProduct(data))
        }
    }, [data.length, dispatch, comboProducts.length]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                < SkeletonCard />
                < SkeletonCard />
                < SkeletonCard />
                < SkeletonCard />
                < SkeletonCard />
            </div>)

    }

    return (
        <div>
            <h3 className="flex justify-center uppercase font-bold underline mt-2">Combo Products Management</h3>
            <p>Total Combo Products: {comboProducts?.length}</p>

            {/* Top Controls Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 bg-white rounded-md shadow-sm border mb-4">

                {/* Left: Category Filter (always at start) */}
                {/* <div className="w-full md:w-1/3">
                        <Select onValueChange={handelOnChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                <SelectItem value="allProducts">All Products</SelectItem>
                                {categories.map(({ _id, name }) => (
                                    <SelectItem key={_id} value={_id as string}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select> */}
            </div>

            {/* Right: Search + Add Product (stacked on mobile, aligned right on desktop) */}
            <div className="w-full md:w-2/3 flex flex-row md:justify-end items-center gap-2">
                {/* Search Input */}
                <div className="w-full md:w-2/3">
                    <SearchInput
                        placeholder="Search the product"
                        data={comboProducts}
                        searchKeys={["offerName", "status"]}
                        setFilteredData={(filtered) =>
                            setSearchData(filtered.length > 0 || filtered === comboProducts ? filtered : comboProducts)
                        }
                    />
                </div>

                {/* Add Product Button */}
                <div className="w-1/3 md:w-auto flex justify-end">
                    <Link to="/product/create" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto">+ Add Combo Product</Button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableCaption className="text-lg text-gray-700 mb-4">
                    All list of combo products.
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead>S.N.</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Offer Name</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Final Price</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead className="text-right">Edit</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {searchData.map(({
                        _id,
                        status,
                        offerName,
                        thumbnail,
                        totalAmount,
                        discountAmount,
                        price,
                        offerStartDate,
                        offerEndDate
                    }, i) => (
                        <TableRow
                            key={_id}
                            className="even:bg-gray-50 hover:scale-[1.01] hover:shadow-md transition-transform cursor-pointer"
                        >
                            <TableCell className="font-medium">{i + 1}.</TableCell>
                            <TableCell className="w-20 h-20">
                                <img
                                    src={thumbnail}
                                    alt={offerName}
                                    className="w-16 h-12 rounded-md border-2 border-gray-300 object-cover hover:scale-110 transition-transform duration-300"
                                />
                            </TableCell>
                            <TableCell className={status === 'ACTIVE' ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id={`checkbox-${_id}`}
                                        type="checkbox"
                                        className="w-4 h-4"
                                        value={_id}
                                        defaultChecked={status === "ACTIVE"}
                                    // onChange={(e) =>
                                    //     onStatusChange(_id!, e.target.checked ? "ACTIVE" : "INACTIVE")
                                    // }
                                    />
                                    <span>{status}</span>
                                </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{offerName}</TableCell>
                            <TableCell className="whitespace-nowrap">$ {totalAmount.toFixed(2)}</TableCell>
                            <TableCell className="whitespace-nowrap text-red-500"> $ {discountAmount.toFixed(2)}</TableCell>
                            <TableCell className="whitespace-nowrap text-green-600">$ {price.toFixed(2)}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                {offerStartDate ? format(new Date(offerStartDate), "dd MMM yyyy") : "-"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {offerEndDate ? format(new Date(offerEndDate), "dd MMM yyyy") : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link
                                    to={`/update/combo-product/${_id}`}
                                    className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                                >
                                    <IoCreateOutline size={25} />
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
