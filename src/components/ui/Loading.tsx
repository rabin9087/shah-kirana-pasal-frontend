import { Loader2 } from "lucide-react"
import Layout from "../layout/Layout"


const Loading = () => {
    return (
        <Layout title="">
            <div className="w-full h-full flex justify-center items-center my-20">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>

            </div>
            <span className="ms-2">Loading...</span>
        </div>
        </Layout>
    )
}
export default Loading

export const LoadingData = () => {
    return (
            <div className="w-full h-full flex justify-center items-center my-20">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>

                </div>
                <span className="ms-2">Loading...</span>
            </div>
    )

}

export const LoadingDataWithText = ({ text }: { text: string }) => { 

    return (
        <div className="w-full py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-gray-600 font-medium">{text}</p>
            </div>
        </div>
    )
}