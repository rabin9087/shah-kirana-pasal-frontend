import { createProduct, getAProduct, getAllProducts, getAllProductsByCategory, updateAProductStatus, updateProduct } from "@/axios/product/product";
import { ProductSchema } from "@/pages/product/formValidation";
import { setAProduct, setAProductFoundStatus, setProducts } from "@/redux/product.slice";
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
                        return true
                } else {
                        console.log("error")
                        return false
                        
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

export const updateAProductStatusAction = (_id: string, data: object) => async (dispatch: AppDispatch) => {
        try {
            const pending = updateAProductStatus(_id, data);
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

export const getAllProductByCategoryAction = (slug: string) => async (dispatch: AppDispatch) => {
        try {
                console.log(slug)
            const pending = getAllProductsByCategory(slug);
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
                console.log(response)
                toast[response.status](response.message)
                if (response.status === "success" && response.product) {
                        console.log("success")
                        dispatch(setAProduct(response?.product))
                        return true
                } else if (response.status === "error" && response.message === "Product Not Found!") {
                        console.log("error")
                        dispatch(setAProductFoundStatus({ status: false, openNotFoundModal: true }))
                        return false
                } else {
                        console.log('error')
                }
        } catch (error) {
                console.log(error)
                return false
        }
};