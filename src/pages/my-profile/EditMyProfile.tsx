import { getAUser, updateAUser } from "@/axios/user/user.axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks";
import { IUser } from "@/types/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type IEditMyProfileProps = {
    setIsEditProfileOpen: (isEditProfileOpen: boolean) => void;
};

const EditMyProfile = ({ setIsEditProfileOpen }: IEditMyProfileProps) => {
    const { user } = useAppSelector((s) => s.userInfo);
    const { data, isLoading } = useQuery<IUser | undefined>({
        queryKey: ["userDetails", user?.phone],
        queryFn: async () => await getAUser(user?.phone as string),
    });

    const [formData, setFormData] = useState<Partial<IUser>>({
        fName: "",
        lName: "",
        phone: "",
        email: "",
        address: ""
    });

    useEffect(() => {
     
            setFormData({
                fName: user?.fName,
                lName: user?.lName,
                phone: user?.phone,
                email: user?.email,
                address: user?.address
            });
        
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        mutation.mutate(formData);
        // here you can call your update API
    };

    const mutation = useMutation({
        mutationFn: async (data: Partial<IUser>) => {
            return await updateAUser(user?.phone as string, data);
        },
        onSuccess: () => {
            // Handle success (e.g., show success message, refetch data, etc.)
            toast.success('User information updated successfully!')
            setIsEditProfileOpen(false)
        },
        onError: (err: any) => {
            // Handle error
            toast.error(`Error: ${err.message || 'Something went wrong!'}`);
        },
    });

    if (isLoading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-center">Edit My Profile</h2>

            <div className="space-y-4">
                <Input
                    name="fName"
                    value={formData.fName}
                    onChange={handleChange}
                    placeholder="First Name"
                />
                <Input
                    name="lName"
                    value={formData.lName}
                    onChange={handleChange}
                    placeholder="Last Name"
                />
                <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                />
                <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />
                <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                />
            </div>

            <div className="flex justify-between pt-6 gap-2">
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
        </div>
    );
};

export default EditMyProfile;
