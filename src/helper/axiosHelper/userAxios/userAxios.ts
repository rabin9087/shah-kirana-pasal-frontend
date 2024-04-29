import {AxiosResponse} from 'axios'
import { userAPI, axiosProcessorAPI } from '../axios/axios'
import { createUserParams, signInUserParams } from '@/helper/types'

interface ApiResponse {
    status: string;
    data: object;
    message?: string;
}

export const createAUser = (data: createUserParams): Promise<AxiosResponse<ApiResponse>> => {
    return axiosProcessorAPI({
        method: 'POST',
        url: userAPI + '/sign-up',
        data
    })
}

export const signInUser = (data: signInUserParams): Promise<AxiosResponse<ApiResponse>> => {
    return axiosProcessorAPI({
        method: 'POST',
        url: userAPI+ "/login",
        data
    })
}