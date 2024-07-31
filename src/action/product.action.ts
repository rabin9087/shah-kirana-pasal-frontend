import { createProduct, getAProduct, getAllProducts, updateProduct } from "@/axios/product/product";
import { ProductSchema } from "@/pages/product/formValidation";
import { setAProduct, setProducts } from "@/redux/product.slice";
import { AppDispatch } from "@/store";
import { serverReturnDataType } from "@/types";
import { toast } from "react-toastify"

export const createProductAction = (data: ProductSchema) => async (dispatch: AppDispatch) => {
        try {
            const pending = createProduct(data);
            toast.promise(pending, {
                pending: "Please wait"
            })

            const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success") {
                      dispatch(getAllProductAction())
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
};

export const updateProductAction = (data: ProductSchema) => async (dispatch: AppDispatch) => {
        try {
            const pending = updateProduct(data);
            toast.promise(pending, {
                pending: "Please wait"
            })

            const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success") {
                      dispatch(getAllProductAction())
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
};

export const getAllProductAction = () => async (dispatch: AppDispatch) => {
        try {
            const pending = getAllProducts();
            toast.promise(pending, {
                pending: "Please wait"
            })

            const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success") {
                       dispatch(setProducts(response?.products ?? []))
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
};

export const getAProductAction = ({...data}) => async (dispatch: AppDispatch) => {
        try {
            const pending = getAProduct({...data});
            toast.promise(pending, {
                pending: "Please wait"
            })

            const response: serverReturnDataType = await pending
                toast[response.status](response.message)
                if (response.status === "success" && response.product) {
                       dispatch(setAProduct(response?.product))
                } else {
                        console.log("error")
                }
        } catch (error) {
                console.log(error)
        }
};