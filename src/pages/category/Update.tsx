import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema, UpdateCategorySchema, updateCategorySchema } from "./categoryFormValidation"
import { Input } from "@/components/ui/input"
import { Status } from "../product/formValidation"
import { getACategoryAction, updateACategoryAction } from "@/action/category.action"
import { ICategoryTypes } from "@/types"
import { useParams } from "react-router"

const UpdateCategory = () => {
    const dispatch = useAppDispatch()
    const { selectedCategory } = useAppSelector(state => state.categoryInfo)
    const [form, setForm] = useState<ICategoryTypes>(selectedCategory);
    const { _id } = useParams()

    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setValue(name as keyof UpdateCategorySchema, value);

    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateCategorySchema>({
        resolver: zodResolver(updateCategorySchema),
    });

    const onSubmit = async (data: UpdateCategorySchema) => {
        await dispatch(updateACategoryAction(data))

    };

    console.log(_id)

    useEffect(() => {
        if (_id !== "") {
            dispatch(getACategoryAction(_id as string))
        }
    }, [dispatch, _id])

    useEffect(() => {
        setForm(selectedCategory)
        Object.keys(selectedCategory).forEach((key) => {
            setValue(key as keyof UpdateCategorySchema, selectedCategory[key as keyof CategorySchema]);
        });
    }, [selectedCategory, setForm, setValue])


    return (
        <Layout title='Update Category Details'>
            <div className='flex justify-center w-full '>
                <form className='m-2 flex flex-col gap-2 w-full  md:max-w-[780px] border-2 p-4 rounded-md shadow-sm' onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-span-full">
                        <Label htmlFor="description" className="block text-md font-medium leading-6 text-gray-900">
                            Status
                        </Label>
                        <div className="mt-2">

                            <select
                                className="w-full p-2 border-2 rounded-md"
                                id="storedAt"
                                {...register('status')}
                                defaultValue={form?.status}
                                onChange={handelOnChange}
                            >
                                <option value="">--Select a Category--</option>
                                <option value={Status.ACTIVE}>--{Status.ACTIVE}--</option>
                                <option value={Status.INACTIVE}>--{Status.INACTIVE}--</option>
                            </select>

                            {errors.status && <span className="text-red-600">{errors?.status?.message}</span>}
                        </div>
                    </div>
                    <div className="col-span-full">
                        <Label htmlFor="name" className="block text-md font-medium leading-6 text-gray-900">
                            Name
                        </Label>
                        <div className="mt-2">
                            <Input
                                id="name"
                                {...register('name')}
                                defaultValue={form.name}
                                onChange={handelOnChange}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder='Enter Category name'
                            />
                            {errors.name && <span className="text-red-600">{errors?.name?.message}</span>}
                        </div>
                    </div>

                    <div className="col-span-full">
                        <Label htmlFor="description" className="block text-md font-medium leading-6 text-gray-900">
                            Description
                        </Label>
                        <div className="mt-2">
                            <textarea
                                id="description"
                                {...register('description')}
                                defaultValue={form.description}
                                rows={5}
                                onChange={handelOnChange}
                                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder='Enter Category description'
                            />
                            {errors.description && <span className="text-red-600">{errors?.description?.message}</span>}
                        </div>
                    </div>
                    <hr />



                    <div className="mt-2 flex items-center justify-end gap-2">
                        <Button
                            type="submit"
                        >
                            Save
                        </Button >
                        <Button
                            type="reset"
                            variant={"outline"}
                        >
                            Cancel
                        </Button >


                    </div>

                </form>
            </div>
        </Layout>
    )
}
export default UpdateCategory