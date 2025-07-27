import { updateAProductStatusAction } from "@/action/product.action"
import { deleteAProduct, getAllProducts } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks"
import { setProducts } from "@/redux/product.slice";
import { IProductTypes } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react"
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import SearchInput from "@/components/search/SearchInput";
import { formatLocation } from "@/pages/orders/startPicking/StartPickingOrder";

export const sortOptions = [
    { label: "Name", value: "name" },
    { label: "Expire Date", value: "expireDate" },
    { label: "SOH", value: "quantity" }, // Stock on Hand
    { label: "Location", value: "productLocation" },
    { label: "Price", value: "price" },
] as const;

export const sortProducts = (
    products: IProductTypes[],
    sortBy: typeof sortOptions[number]["value"],
    order: "asc" | "desc" = "asc"
): IProductTypes[] => {
    const sorted = [...products].sort((a, b) => {
        const valA = a[sortBy as keyof IProductTypes];
        const valB = b[sortBy as keyof IProductTypes];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "string" && typeof valB === "string") {
            return order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
            return order === "asc" ? valA - valB : valB - valA;
        }

        return 0;
    });

    return sorted;
};

type SortField = typeof sortOptions[number]["value"];


const ProductsDashboard = () => {
    const { products } = useAppSelector(state => state.productInfo)
    const { categories } = useAppSelector(state => state.categoryInfo)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState(products)
    const [sortBy, setSortBy] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    
    const { data = [], error } = useQuery<IProductTypes[]>({
        queryKey: ['products'],
        queryFn: () => getAllProducts(),
    });

    useEffect(() => {
        if (data.length) {
            const sortedUsers = [...data].sort((a, b) => a.name.localeCompare(b.name));
            dispatch(setProducts(sortedUsers))
        }
    }, [dispatch, data])

    const handelOnChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target
        await dispatch(updateAProductStatusAction(value, { status: checked ? "ACTIVE" : "INACTIVE" }))
    }

    const handelOnChange = async (value: string) => {
        if (value === "allProducts") {
            return dispatch(setProducts(data))
        }

        const newProducts = data.filter((product) => product.parentCategoryID === value)
        return dispatch(setProducts(newProducts))
    }

    const handelOnDelete = async (_id: string) => {
        if (window.confirm("Are you sure want to delete a Product")) {
            const deleteProduct = await deleteAProduct(_id)
            if (deleteProduct === "success") {
                return toast({
                    title: "Success",
                    description: "Product has been successfully deleted!",
                })
            }
            return toast({
                title: "Failed",
                description: "Unable to delete Product!",
            })
        }
    }

    useEffect(() => {
        const sorted = sortProducts(products, sortBy, sortOrder);
        setSearchData(sorted);
    }, [products, sortBy, sortOrder]);

    // const screenWidth = screen.width;
    // console.log(`Device screen width: ${screenWidth}px`);

    // const viewportWidth = window.innerWidth;
    // console.log(`Viewport width: ${viewportWidth}px`);
    // if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />
    return (
        <div>
            <h3 className="flex justify-center uppercase font-bold underline">Products Dashboard</h3>
            <p>Total Products: {products?.length}</p>

            {/* Top Controls Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 bg-white rounded-md shadow-sm border mb-4">

                {/* Left: Category Filter (always at start) */}
                <div className="w-full md:w-1/3">
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
                    </Select>
                </div>

                {/* Right: Search + Add Product (stacked on mobile, aligned right on desktop) */}
                <div className="w-full md:w-2/3 flex flex-row md:justify-end items-center gap-2">
                    {/* Search Input */}
                    <div className="w-full md:w-2/3">
                        <SearchInput
                            placeholder="Search the product"
                            data={products}
                            searchKeys={["name", "productLocation", "price", "quantity", "expireDate"]}
                            setFilteredData={(filtered) =>
                                setSearchData(filtered.length > 0 || filtered === data ? filtered : data)
                            }
                        />
                    </div>

                    {/* Add Product Button */}
                    <div className="w-1/3 md:w-auto flex justify-end">
                        <Link to="/product/create" className="w-full md:w-auto">
                            <Button className="w-full md:w-auto">+ Add Product</Button>
                        </Link>
                    </div>
                </div>
            </div>


            {/* Sorting Controls */}
            <div className="flex sm:flex-row sm:items-center sm:justify-center gap-3 px-2 my-4">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortField)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Order */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Order:</span>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-4 border w-full px-2 overflow-x-scroll">
                {products.length < 1 ? <div className="flex justify-center">

                </div> :
                    <Table>
                        <TableCaption className="text-lg text-gray-700 mb-4">All list of products.</TableCaption>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead>S.N.</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Alt_Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Cost_Price</TableHead>
                                <TableHead>Sale_Price</TableHead>
                                <TableHead>Retailer_Price</TableHead>
                                <TableHead>SOH</TableHead>
                                <TableHead>Barcode</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Expire</TableHead>
                                <TableHead className="text-right">Edit</TableHead>
                                <TableHead className="text-right">Delete</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchData.map(({ _id, status, name, alternateName, price, quantity, qrCodeNumber, productLocation, salesPrice, thumbnail, sku, costPrice, retailerPrice, expireDate }, i) => (
                                <TableRow
                                    key={_id}
                                    className="even:bg-gray-50 hover:scale-[1.01] hover:shadow-md transition-transform cursor-pointer"
                                >
                                    <TableCell className="font-medium">{i + 1}.</TableCell>
                                    <TableCell className="w-20 h-20">
                                        <img
                                            src={thumbnail}
                                            alt={name}
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
                                                onChange={handelOnChecked}
                                            />
                                            <span>{status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigate(`/update/product/sku_value/${sku}`)}
                                        className="whitespace-nowrap text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
                                    >
                                        {name}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigate(`/update/product/sku_value/${sku}`)}
                                        className="whitespace-nowrap">{alternateName ? "Yes" : "No"}</TableCell>
                                    <TableCell className="whitespace-nowrap">$ {price}</TableCell>
                                    <TableCell className="whitespace-nowrap">$ {costPrice}</TableCell>
                                    <TableCell className="whitespace-nowrap">{(
                                        <span className="text-yellow-500 block whitespace-nowrap">$ {salesPrice ? salesPrice: null}</span>
                                    )}</TableCell>
                                    <TableCell className="whitespace-nowrap">$ {retailerPrice}</TableCell>
                                    <TableCell>{quantity}</TableCell>
                                    <TableCell className="whitespace-nowrap">{qrCodeNumber}</TableCell>
                                    <TableCell>{sku}</TableCell>
                                    <TableCell className="whitespace-nowrap">{formatLocation(productLocation as string)}</TableCell>
                                    <TableCell className="whitespace-nowrap">{expireDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            to={`/update/product/sku_value/${sku}`}
                                            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
                                        >
                                            <IoCreateOutline size={25} />
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <MdDeleteOutline
                                            size={25}
                                            className="text-red-500 hover:text-red-400 transition-colors duration-300 cursor-pointer"
                                            onClick={() => handelOnDelete(_id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }

            </div>

        </div>
    )
}
export default ProductsDashboard