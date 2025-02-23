import { updateAProductStatusAction } from "@/action/product.action"
import { deleteAProduct, getAllProducts } from "@/axios/product/product";
import Error from "@/components/ui/Error";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks"
import { setProducts } from "@/redux/product.slice";
import { IProductTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react"
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ProductsDashboard = () => {

    const { products } = useAppSelector(state => state.productInfo)
    const { categories } = useAppSelector(state => state.categoryInfo)
    const dispatch = useAppDispatch()
    const { data = [], error } = useQuery<IProductTypes[]>({
        queryKey: ['products'],
        queryFn: () =>
            getAllProducts()
    });

    useEffect(() => {
        if (data.length) { dispatch(setProducts(data)) }
    }, [dispatch, data])

    const handelOnChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target
        await dispatch(updateAProductStatusAction(value, { status: checked ? "ACTIVE" : "INACTIVE" }))
    }

    const handelOnChange = async (value: string) => {
        console.log(value)
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

    // const screenWidth = screen.width;
    // console.log(`Device screen width: ${screenWidth}px`);

    // const viewportWidth = window.innerWidth;
    // console.log(`Viewport width: ${viewportWidth}px`);
    // if (isLoading || isFetching) return <Loading />;

    if (error) return <Error />
    return (
        <div>
            <div className="flex justify-between me-4 px-2">
                <div className="w-full me-4">
                    <Select onValueChange={handelOnChange} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent className="px-2 mx-4">
                            <SelectItem value={"allProducts"}>All Products</SelectItem>
                            {categories.map(({ _id, name }) => (
                                <SelectItem key={_id} value={_id as string}>{name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Link to={"/product/create"}>
                    <Button>
                        Add product
                    </Button>
                </Link>
            </div>

            <div className="mt-4 border w-full px-2 overflow-x-scroll">
                {products.length < 1 ? <div className="flex justify-center py-4">

                </div> : <Table>
                    <TableCaption>All list of products.</TableCaption>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[60px]">S.N.</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>BarCodeNumber</TableHead>
                            <TableHead>ProductLocation</TableHead>

                            <TableHead className="text-right">Edit</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(({ _id, status, name, price, quantity, qrCodeNumber, productLocation, salesPrice, thumbnail }, i) => (
                            <TableRow key={_id}>
                                <TableCell className="font-medium">{i + 1}.</TableCell>
                                <TableCell className="font-medium"><img src={thumbnail} width={"30px"} height={"30px"} /></TableCell>
                                <TableCell className={status === 'ACTIVE' ? "text-green-500" : "text-red-500"}>
                                    <React.Fragment>
                                        <div className="flex justify-start items-center gap-2 text-sm">
                                            <label htmlFor={`checkbox-${_id}`} className="flex items-center gap-2">
                                                <Input
                                                    id={`checkbox-${_id}`}
                                                    type="checkbox"
                                                    className="text-sm w-5"
                                                    value={_id}
                                                    defaultChecked={status === "ACTIVE"}
                                                    onChange={handelOnChecked}
                                                />
                                                <span>{status}</span>
                                            </label>
                                        </div>

                                    </React.Fragment>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">{name}</TableCell>
                                <TableCell className=""><div>
                                    ${price}
                                </div>{salesPrice && <span className="flex text-yellow-500 min-w-fit"> Sale:$ {salesPrice}</span>}</TableCell>
                                <TableCell>{quantity}</TableCell>
                                <TableCell>{qrCodeNumber}</TableCell>
                                <TableCell>{productLocation}</TableCell>


                                <TableCell className="text-right text-yellow-500">
                                    <Link
                                        to={`/product/update/${qrCodeNumber}`}>
                                        <IoCreateOutline size={25} />
                                    </Link></TableCell>
                                <TableCell className="text-right text-red-500 hover:text-red-400">
                                    <MdDeleteOutline size={25} onClick={() => handelOnDelete(_id)} />
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}

            </div>

        </div>
    )
}
export default ProductsDashboard