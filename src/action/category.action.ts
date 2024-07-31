import { createCategory, getAllCategories } from "@/axios/category/category";
import { setCategory } from "@/redux/category.slice";
import { AppDispatch } from "@/store";
import { ICategoryTypes, serverReturnDataType } from "@/types";

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