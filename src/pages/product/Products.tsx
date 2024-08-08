import { getAllProductAction, updateAProductStatusAction } from "@/action/product.action"
import Layout from "@/components/layout/Layout"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks"
import React, { useEffect } from "react"
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";


const AllProducts = () => {

    const { products } = useAppSelector(state => state.productInfo)
    const dispatch = useAppDispatch()

    const handelOnChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target

        await dispatch(updateAProductStatusAction(value, { statue: checked ? "ACTIVE" : "INACTIVE" }))
    }

    useEffect(() => {
        if (!products.length) {
            dispatch(getAllProductAction())
        }

    }, [dispatch, products.length])
    return (
        <Layout title="All Products" types="products">
            <div>
                <Table>
                    <TableCaption>A list of products.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">S.N.</TableHead>
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
                        {products.map(({ _id, image, status, name, price, quantity, qrCodeNumber, productLocation }, i) => (
                            <TableRow key={_id}>
                                <TableCell className="font-medium">{i + 1}.</TableCell>
                                <TableCell className="font-medium"><img src={image} width={"100px"} height={"100px"} /></TableCell>
                                <TableCell className={status === 'ACTIVE' ? "text-green-500" : "text-red-500"}>
                                    <React.Fragment>
                                        <div className="flex justify-start items-center gap-2 text-sm ">
                                            <Input type="checkbox" className="text-sm w-5 " value={_id} defaultChecked={status === "ACTIVE"} onChange={handelOnChecked} />
                                            <span className="">  {status}</span>
                                        </div>
                                    </React.Fragment>
                                    {/* <React.Fragment>
                                        <Input type="checkbox" className="text-sm w-5" value={_id} defaultChecked={status === "ACTIVE"} onChange={handelOnChecked} />
                                        <span>{status}</span>
                                    </React.Fragment> */}

                                </TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>${price}</TableCell>
                                <TableCell>{quantity}</TableCell>
                                <TableCell>{qrCodeNumber}</TableCell>
                                <TableCell>{productLocation}</TableCell>


                                <TableCell className="text-right text-yellow-500">
                                    <Link
                                        to={`/product/update/${qrCodeNumber}`}>
                                        <IoCreateOutline size={25} />
                                    </Link></TableCell>
                                <TableCell className="text-right text-red-500"><MdDeleteOutline size={25} /></TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>

        </Layout>
    )
}
export default AllProducts