import { getAUser } from "@/axios/user/user.axios";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setAUserDetail } from "@/redux/dashboard.slice";
import { IUser } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const UserDetails = () => {
    const { userPhone } = useParams();
    const dispatch = useAppDispatch();
    const { userDetail } = useAppSelector((s) => s.dashboardData);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data = {} as IUser } = useQuery<IUser | undefined>({
        queryKey: ["userDetails", userPhone],
        queryFn: async (): Promise<IUser | undefined> => await getAUser(userPhone as string),
        enabled: !!userPhone,
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (data?._id) {
            dispatch(setAUserDetail(data as IUser));
        }
    }, [dispatch, data]); // Remove userPhone from dependencies

    return (
        <Layout title="User Details">
            <Link
                to="/dashboard"
                className="inline-flex ms-2 items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium shadow hover:bg-primary/90 transition"
            >
                <span className="text-base">←</span> Back
            </Link>

            {<div className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mt-5">

                <div className="flex items-center space-x-4" >
                    <img
                        onClick={openModal}
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
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center  justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl mx-2 w-full max-w-sm text-center">

                            {/* Profile Image */}
                            <img
                                src={userDetail?.profile || ""}
                                alt="Profile"
                                className="w-64 h-64 rounded-full object-cover border-4 border-primary shadow-md mx-auto"
                            />

                            {/* Optional Name or Info (Add if needed) */}
                            {/* <h3 className="mt-4 text-lg font-semibold">{userDetail?.name}</h3> */}

                            {/* Close Button */}
                            <div className="mt-6">
                                <Button variant="outline" onClick={closeModal} className="w-full">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>

                )}
            </div>}
        </Layout>
    );
};

export default UserDetails;
