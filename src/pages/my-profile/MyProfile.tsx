import Layout from "@/components/layout/Layout";
import { useAppSelector } from "@/hooks";


const MyProfile = () => {

    const {user} = useAppSelector((state) => state.userInfo);

    return (
      <Layout title="">
            <div>MyProfile</div> 
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2">
                   
                    <div className="flex justify-center mb-6">
                        <img
                            src={user.profile|| "No Profile"}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                        />
                        
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            {user.fName} {user.lName}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">{user.role}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-500">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Phone:</span>
                            <span className="text-gray-500">{user.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="text-gray-500">{user.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Address:</span>
                            <span className="text-gray-500">{user.address || "No address provided"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Verified:</span>
                            <span className="text-gray-500">{user.isVerified ? "Yes" : "No"}</span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-sm">Last updated on {new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
      </Layout>
    
  )
}
export default MyProfile