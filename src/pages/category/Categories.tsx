
import { getAllCategoriesAction, updateACategoryAction } from "@/action/category.action"
import Layout from "@/components/layout/Layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useEffect } from "react"
import { IoCreateOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom"

const AllCategories = () => {

    const { categories } = useAppSelector(state => state.categoryInfo)
    const dispatch = useAppDispatch()

    const handelOnChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target

        await dispatch(updateACategoryAction({ _id: value, status: checked ? "ACTIVE" : "INACTIVE" }))
    }

    useEffect(() => {
        if (!categories.length) {
            dispatch(getAllCategoriesAction())
        }

    }, [dispatch, categories.length])

    return (
        <Layout title="All Categories" >
            <Table className="mx-2 m-1 border-2 rounded-md">
                <TableCaption>A list of categories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">S.N.</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Edit</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map(({ _id, name, description, status }, i) => (
                        <TableRow key={_id}>
                            <TableCell className="font-medium">{i + 1}.</TableCell>
                            <TableCell className={status === 'ACTIVE' ? "text-green-500" : "text-red-500"}
                            >
                                <div className="flex justify-start items-center gap-2 text-sm ">
                                    <Input type="checkbox" id={_id} className="text-sm w-5 " value={_id} defaultChecked={status === "ACTIVE"} onChange={handelOnChecked} />
                                    <Label className="" htmlFor={_id}>  {status}</Label>
                                </div>
                            </TableCell>
                            <TableCell>{name}</TableCell>
                            <TableCell>{description}</TableCell>

                            <TableCell className="text-right text-yellow-500">
                                <Link to={`/category/update/${_id}`}>
                                    <IoCreateOutline size={25} />
                                </Link>
                            </TableCell>
                            <TableCell className="text-right text-red-500"><MdDeleteOutline size={25} /></TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>

        </Layout>
    )
}
export default AllCategories