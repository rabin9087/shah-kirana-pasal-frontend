import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { verifyEmail } from "@/axios/user/user.axios";


export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const { data, isLoading, isError, error } = useQuery<{}>({
        queryKey: ["verifyEmail", token, email],
        queryFn: () => verifyEmail(token as string, email as string) ,
        retry: false,
    });

    console.log(data, isLoading, isError, error);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600 text-lg">Verifying your email...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="p-6 bg-red-100 border border-red-300 rounded-lg shadow-sm text-center">
                    <h2 className="text-red-700 text-xl font-semibold">❌ Error</h2>
                    <p className="text-red-600">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            {data === "success" ? (
                <div className="p-6 bg-green-100 border border-green-300 rounded-lg shadow-sm text-center">
                    <h2 className="text-green-700 text-xl font-semibold">✅ Success!</h2>
                    <p className="text-green-600">{"Email verified successfully"}</p>
                </div>
            ) : (
                <div className="p-6 bg-red-100 border border-red-300 rounded-lg shadow-sm text-center">
                    <h2 className="text-red-700 text-xl font-semibold">❌ Error</h2>
                    <p className="text-red-600">{"Verification failed."}</p>
                </div>
            )}
        </div>
    );
}
