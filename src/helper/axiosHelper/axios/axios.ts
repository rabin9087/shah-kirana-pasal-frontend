import axios, { Method } from 'axios'
import {AxiosRequestConfig} from 'axios'

interface AxiosProcessorAPIConfig extends AxiosRequestConfig{
    method: Method;
    url: string;
    refreshToken?: boolean;
    rest?: object
}

export const getAccessJWT = (): string | null => {
    return sessionStorage.getItem("accessJWT")
}

export const getRefreshJWT = (): string | null => {
    return localStorage.getItem('refreshJWT')
 }

// export const rootAPI = import.meta.env.VITE_API_ROOT
export const rootAPI = "http://localhost:8800"
export const axiosAPI = `${rootAPI}/api/v1`
export const userAPI = `${axiosAPI}/user`

export const axiosProcessorAPI = async ({method, url, ...rest}: AxiosProcessorAPIConfig) :Promise<any> => {
    try {     
        // const token = refreshToken ? getRefreshJWT() : getAccessJWT()

        // if(!token) throw new Error("No token Available")

        // const headers = {
        //     Authorization: `${token}`
        // }
        const {data} = await axios({
            method, url, ...rest
        })
        return data
    } catch (error) {
        // if(error.response?.data?.message?.includes("jwt expired")){
        //     return axiosProcessorAPI({method, url, ...rest, refreshToken: false})
        // }
        return {
            status: "error",
            // message: error.response?.data?.message || "Unknown error"
        }
    }
} 




