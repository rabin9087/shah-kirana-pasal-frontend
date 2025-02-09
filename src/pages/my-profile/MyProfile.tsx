import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
// import { updateProfileImage } from "@/action/user.action"; // Replace with your actual action for updating the image
import { Button } from "@/components/ui/button"; // Replace with your button component
import { RiImageEditFill } from "react-icons/ri";
import { updateUserProfile } from "@/axios/user/user.axios";
import { FaSpinner } from "react-icons/fa";
import { updateProfileAction } from "@/action/user.action";
// import { useLocation, useNavigate } from "react-router";

const MyProfile = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    // const navigate = useNavigate()
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    // const location = useLocation();

    // Determine where the user was navigating from
    // const fromLocation = location?.state?.from?.pathname || location.pathname || "/";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setSelectedImage(URL.createObjectURL(file)); // Preview the selected image
        }
    };


    const handleSaveImage = async () => {
        setLoading(true)
        if (imageFile) {
            const formData = new FormData();
            formData.append("profile", imageFile); // Must match the key in the backend
            formData.append("phone", user?.phone); // Required to identify the user

            try {
                const res = await updateUserProfile(formData); // API call to update profile
                console.log(res.message);
                if (res.status === "success") {
                    dispatch(updateProfileAction())
                      
                } else {
                    alert(res.message);
                }
            } catch (error) {
                console.error("Error updating profile image", error);
                alert("Failed to update profile image.");
            }
        }
        setLoading(false)
    };

    return (
        <Layout title="My Profile">
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2">
                    {/* Profile Image Section */}
                    <div className="relative flex justify-center mb-6">
                        <img
                            src={selectedImage || user?.profile || "/default-profile.png"} // Default profile image fallback
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-fill border-4 border-gray-300"
                        />
                        {/* Edit Icon */}
                        <label
                            htmlFor="profileImage"
                            className="absolute bottom-0 right-16 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                        >
                            <RiImageEditFill />
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {/* User Information */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            {user?.fName} {user?.lName}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">{user?.role}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-500">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Phone:</span>
                            <span className="text-gray-500">{user?.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="text-gray-500">{user?.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Address:</span>
                            <span className="text-gray-500">
                                {user?.address || "No address provided"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Verified:</span>
                            <span className="text-gray-500">
                                {user?.isVerified ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>

                    {/* Save Button */}
                    {selectedImage && (
                        <div className="mt-6 text-center">
                            <Button onClick={handleSaveImage} className="bg-blue-500 text-white">
                                {loading ? <FaSpinner>"Updating..."</FaSpinner> :  "Update Image"}
                            </Button>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Joined on {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Last updated on {new Date(user?.updatedAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MyProfile;
