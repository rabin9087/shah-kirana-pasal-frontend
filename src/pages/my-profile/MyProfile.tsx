import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/hooks";
// import { updateProfileImage } from "@/action/user.action"; // Replace with your actual action for updating the image
import { Button } from "@/components/ui/button"; // Replace with your button component
import { RiImageEditFill } from "react-icons/ri";
import { updateUserProfile } from "@/axios/user/user.axios";
import { FaSpinner } from "react-icons/fa";
import { updateProfileAction } from "@/action/user.action";
import { toast } from "react-toastify";
import EditMyProfile from "./EditMyProfile";
import logo from "/assets/shahKiranaPasal.png"
// import { useLocation, useNavigate } from "react-router";

const MyProfile = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const { language } = useAppSelector((state) => state.settings);
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    // const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
        console.log(imageFile)
        setLoading(true)
        if (imageFile) {
            console.log(imageFile)
            let formData = new FormData();
            formData.append("profile", imageFile); // Must match the key in the backend
            formData.append("phone", user?.phone); // Required to identify the user

            try {
                const res = await updateUserProfile(formData); // API call to update profile
                if (res.status === "success") {
                    dispatch(updateProfileAction())
                } else {
                    toast(res.message);
                }
            } catch (error) {
                console.error("Error updating profile image", error);
                toast("Failed to update profile image.");
            }
        }
        setLoading(false)
    };

    return (
        <Layout title="My Profile">
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2">
                    <div className="flex justify-end">
                        <Button onClick={ () => setIsEditProfileOpen(true)}>Edit</Button>
                    </div>
                    {/* Profile Image Section */}
                    <div className="relative flex justify-center mb-6">
                        <img
                            onClick={openModal}
                            src={(selectedImage || user?.profile) ? (selectedImage || user?.profile) : logo} // Default profile image fallback
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
                        <p className="text-sm text-gray-500 mb-4">{language === "en" ? user?.role : user?.role === "USER" ? "प्रयोगकर्ता" : user?.role}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{language === "en" ? "Email" : "इमेल"}:</span>
                            <span className="text-gray-500">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{language === "en" ? "Phone" : "फोन"}:</span>
                            <span className="text-gray-500">{user?.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{language === "en" ? "Status" : "प्रोफाइल स्थिति"}:</span>
                            <span className="text-gray-500">
                                {language === "en" ? user?.status : user?.status ? "सक्रिय" : "निष्क्रिय"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{language === "en" ? "Address" : "ठेगाना"}: </span>
                            <span className="text-gray-500 text-end">
                                {user?.address || "No address provided"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">{language === "en" ? "Verified" : "प्रमाणित"}:</span>
                            <span className="text-gray-500">
                                {language === "en" ? user?.isVerified ? "Yes" : "No" : user?.isVerified ? "छ" : "छैन"}
                            </span>
                        </div>
                    </div>

                    {/* Save Button */}
                    {selectedImage && (
                        <div className="mt-6 text-center">
                            <Button onClick={handleSaveImage} className="bg-blue-500 text-white">
                                {loading ? <FaSpinner>"Updating..."</FaSpinner> : "Update Image"}
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
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 mx-10 rounded-md shadow-md max-w-md w-full flex flex-col  justify-center items-center">
                            <img
                                src={user.profile || logo}
                                alt="Product"
                                className="w-72 rounded-full h-72 object-cover"
                            />
                            <div className="flex justify-center items-center mt-2">
                                <Button variant="outline" onClick={closeModal} className="mt-2">
                                    {language === "en" ? "Close" : "बन्द"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditProfileOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 mx-10 rounded-md shadow-md max-w-md w-full flex flex-col  justify-center items-center">
                            <EditMyProfile setIsEditProfileOpen={setIsEditProfileOpen} />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyProfile;
