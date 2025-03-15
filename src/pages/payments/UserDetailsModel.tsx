import React from "react";
interface IUser { 
    fName: string,
    lName: string,
    email: string,
    phone: string,
    address: string,
}
interface IUpdateUserDetails {
    isOpen: boolean;
    onClose: () => void;
    userDetails: IUser
    setUserDetails: (userDetails: IUser) => void;
}

export const UserDetailsModel = ({ isOpen, onClose, userDetails, setUserDetails }: IUpdateUserDetails) => {
   
    const handleOnUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onClose(); // Close the modal
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ${isOpen ? "block" : "hidden"
                }`}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit User Details</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="fName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            id="fName"
                            name="fName"
                            type="text"
                            value={userDetails.fName}
                            onChange={handleOnUserDetailsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lName"
                            name="lName"
                            type="text"
                            value={userDetails.lName}
                            onChange={handleOnUserDetailsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={userDetails.email}
                            onChange={handleOnUserDetailsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={userDetails.phone}
                            onChange={handleOnUserDetailsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={userDetails.address}
                            onChange={handleOnUserDetailsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};