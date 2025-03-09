import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { IUser } from '@/types';
import { getAUser, updateAUser } from '@/axios/user/user.axios';
import { useParams } from 'react-router';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfileEdit = () => {
    const { userPhone } = useParams();

    // Fetch user data using useQuery
    const { data } = useQuery<IUser | undefined>({
        queryKey: ["userDetails", userPhone],
        queryFn: async (): Promise<IUser | undefined> => await getAUser(userPhone as string),
        enabled: !!userPhone,
    });

    // Initialize state with fetched data or default to empty strings
    const [userData, setUserData] = useState<Partial<IUser>>({
        role: '',
        email: '',
        fName: '',
        lName: '',
        address: '',
        phone: '',
        status: '',
        isVerified: false,
    });

    useEffect(() => {
        if (data) {
            setUserData({
                role: data.role || '',
                email: data.email || '',
                fName: data.fName || '',
                lName: data.lName || '',
                address: data.address || '',
                phone: data.phone || '',
                status: data.status || '',
                isVerified: data.isVerified || false,
            });
        }
    }, [data]);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: checked }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(userData);
    };

    // Handle update mutation using useMutation
    const mutation = useMutation({
        mutationFn: async (data: Partial<IUser>) => {
            return await updateAUser(userPhone as string, data);
        },
        onSuccess: () => {
            // Handle success (e.g., show success message, refetch data, etc.)
            toast.success('User information updated successfully!')
        },
        onError: (err: any) => {
            // Handle error
            toast.error(`Error: ${err.message || 'Something went wrong!'}`);
        },
    });

    // Loading or error states
    // if (isLoading) return  <Loading/>;

    return (
        <Layout title="Edit User Profile">
            <Link to={"/dashboard"} className='ms-16 my-4 p-3 bg-primary rounded-md text-white mx-auto'>{"<"} Dashboard</Link>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
                <div className='flex justify-between'>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Profile</h2>
                    <div>
                        <img
                            src={data?.profile || ""}
                            alt="Product"
                            className="w-36 rounded-full h-36  object-cover"
                        />
                    </div>
                    
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={userData.role}
                            defaultValue={userData.role
                            }
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="SUPERADMIN">SUPERADMIN</option>
                            <option value="PICKER">PICKER</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label htmlFor="fName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="fName"
                            name="fName"
                            value={userData.fName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lName"
                            name="lName"
                            value={userData.lName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={userData.status}
                            value={userData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    {/* Verified */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isVerified"
                            name="isVerified"
                            checked={userData.isVerified}
                            onChange={handleCheckboxChange
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isVerified" className="ml-2 block text-sm font-medium text-gray-700">
                            Verified
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={mutation?.isPending}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {mutation?.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default UserProfileEdit;
