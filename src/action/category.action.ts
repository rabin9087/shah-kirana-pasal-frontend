import { createCategory, getACategory, getAllCategories, updateACategory } from "@/axios/category/category";
import { IGetACategoryParams } from "@/axios/category/types";
import { UpdateCategorySchema } from "@/pages/category/categoryFormValidation";
import { setACategory, setCategory } from "@/redux/category.slice";
import { AppDispatch } from "@/store";
import { ICategoryTypes, serverReturnDataType } from "@/types";
import { toast } from "react-toastify";

export const getAllCategoriesAction = () => async (dispatch: AppDispatch) => {
        try {
                const response: serverReturnDataType = await getAllCategories();
                if (response.categoryList && Array.isArray(response.categoryList)) {
                        dispatch(setCategory(response.categoryList));
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
};

export const createCategoryAction = (data: ICategoryTypes) => async (dispatch: AppDispatch) => {
         try {
        const response: serverReturnDataType = await createCategory(data);
                if (response.status === "success") {
                        dispatch(getAllCategoriesAction());
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
}

export const getACategoryAction = (_id: IGetACategoryParams) => async (dispatch: AppDispatch) => {
        try {
                const pending = getACategory(_id)
          toast.promise(pending, {
                pending: "Please wait"
            })

                const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success" && response.category) {
                       dispatch(setACategory(response?.category))
                } else if (response.status === "error" && response.message === "Product Not Found!") {
                        console.log("error")
                       
                } else {
                        console.log('error')
                }
        } catch (error) {
                console.log(error)
        }
}

export const updateACategoryAction = (data: UpdateCategorySchema) => async (dispatch: AppDispatch) => {
        try {
                const pending = updateACategory(data)
                toast.promise(pending, {
                pending: "Please wait"
            })

                const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success" && response.category) {
                       dispatch(setACategory(response?.category))
                } else if (response.status === "error" && response.message === "Category Not Found!") {
                        console.log("error")
                       
                } else {
                        console.log('error')
                }
        } catch (error) {
                console.log(error)
        }
}