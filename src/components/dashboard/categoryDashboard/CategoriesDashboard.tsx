
import { updateACategoryAction } from "@/action/category.action"
import CustomModal from "@/components/CustomModal"
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

import { IoCreateOutline } from "react-icons/io5";
import { Link } from "react-router-dom"

const CategoriesDashboard = () => {

    const { categories } = useAppSelector(state => state.categoryInfo)
    const dispatch = useAppDispatch()

    const handelOnChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target

        await dispatch(updateACategoryAction({ _id: value, status: checked ? "ACTIVE" : "INACTIVE" }))
    }

    return (
        <>
            <p>Total Categories: {categories?.length}</p>
            <div className="flex justify-end items-center mb-4 me-4">
                <CustomModal create={"createCategory"} />             
            </div>
            <Table className="min-w-full table-auto border-collapse border border-gray-200">
               
                <TableCaption className="text-lg font-medium text-gray-900">All Categories</TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">S.N.</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Alternative Name</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</TableHead>
                        <TableHead className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map(({ _id, name, alternativeName, description, status }, i) => (
                        <TableRow key={_id} className="border-t">
                            <TableCell className="px-4 py-2 text-sm text-gray-700">{i + 1}.</TableCell>
                            <TableCell className="px-4 py-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="checkbox"
                                        id={_id}
                                        className="w-5 h-5"
                                        value={_id}
                                        defaultChecked={status === "ACTIVE"}
                                        onChange={handelOnChecked}
                                    />
                                    <Label htmlFor={_id} className="text-sm">
                                        {status}
                                    </Label>
                                </div>
                            </TableCell>
                            <TableCell className="px-4 py-2 text-sm text-gray-700">{name}</TableCell>
                            <TableCell className="px-4 py-2 text-sm text-gray-700">{alternativeName}</TableCell>
                            <TableCell className="px-4 py-2 text-sm text-gray-700">{description}</TableCell>
                            <TableCell className="px-4 py-2 text-sm text-gray-700">
                                <div className="flex gap-2">
                                    <Link to={`/category/update/${_id}`} className="text-yellow-500 hover:text-yellow-700">
                                        <IoCreateOutline size={20} />
                                    </Link>
                                    {/* <button
                                    onClick={() => handleDelete(_id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <MdDeleteOutline size={20} />
                                </button> */}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
        

    )
}
export default CategoriesDashboard