import { getAUser } from "@/axios/user/user.axios";
import Layout from "@/components/layout/Layout";
import { LoadingData } from "@/components/ui/Loading";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setAUserDetail } from "@/redux/dashboard.slice";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const UserDetails = () => {
    const { userPhone } = useParams();
    const dispatch = useAppDispatch();
    const { userDetail } = useAppSelector((s) => s.dashboardData);

    const { data = {} as IUser, isFetching, isLoading } = useQuery<IUser | undefined>({
        queryKey: ["userDetails", userPhone],
        queryFn: async (): Promise<IUser | undefined> => await getAUser(userPhone as string),
        enabled: !!userPhone,
    });


    useEffect(() => {
        if (data?._id) {
            dispatch(setAUserDetail(data as IUser));
        }
    }, [dispatch, data]); // Remove userPhone from dependencies

    return (
        <Layout title="User Details">
            <Link to={"/dashboard"} className='ms-16 my-4 p-3 bg-primary rounded-md text-white mx-auto'>{"<"} Dashboard</Link>

            {isFetching || isLoading ? <LoadingData /> : <div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-5">

                <div className="flex items-center space-x-4">
                    <img
                        src={userDetail?.profile || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">
                            {userDetail?.fName} {userDetail?.lName}
                        </h2>
                        <p className="text-gray-500">{userDetail?.role}</p>
                        <p
                            className={`text-sm font-semibold mt-1 ${userDetail?.isVerified ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {userDetail?.isVerified ? "Verified" : "Not Verified"}
                        </p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <p className="text-gray-700">
                        <strong>Email:</strong> {userDetail?.email}
                    </p>
                    <p className="text-gray-700">
                        <strong>Phone:</strong> {userDetail?.phone || "N/A"}
                    </p>
                    <p className="text-gray-700">
                        <strong>Address:</strong> {userDetail?.address || "Not Provided"}
                    </p>
                    <p className="text-gray-700">
                        <strong>Status:</strong> {userDetail?.status}
                    </p>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <p>
                        <strong>Cart Items:</strong> {userDetail?.cart?.length}
                    </p>
                    <p>
                        <strong>Order History:</strong> {userDetail?.cartHistory?.length}
                    </p>
                </div>
            </div>}
        </Layout>
    );
};

export default UserDetails;
