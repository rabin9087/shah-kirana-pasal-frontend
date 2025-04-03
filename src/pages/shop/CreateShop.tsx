import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createShop } from "@/axios/shop/shop";
import { IShop } from "@/axios/shop/types";
import { useAppSelector } from "@/hooks";
import { useNavigate } from "react-router";

export const CreateShop: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAppSelector(s => s.userInfo)
    const [formData, setFormData] = useState<IShop>({
        name: "",
        owner: user?._id || "",
        description: "",
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
        },
        slogan: "",
        logo: undefined, // Optional logo
    });

    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Handle form input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            owner: user?._id || "", // Ensure owner is always user._id
            ...(name.startsWith("location.")
                ? {
                    location: {
                        ...prev.location,
                        [name.split(".")[1]]: value,
                    },
                }
                : { [name]: value }),
        }));
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setPreview(URL.createObjectURL(file)); // Preview the uploaded image
        }
    };

    // React Query Mutation
    const mutation = useMutation({
        mutationFn: createShop,
        onSuccess: (data) => {
            console.log("Shop created successfully:", data);
        },
        onError: (error) => {
            console.error("Error creating shop:", error);
        },
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const shopData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && key === "location") {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    shopData.append(`location.${subKey}`, subValue as string);
                });
            } else {
                shopData.append(key, value as string);
            }
        });

        if (logo) {
            shopData.append("logo", logo);
        }

        mutation.mutate(shopData);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-start my-4">
                <Button onClick={() => navigate(-1)}>{"<"} Back</Button>
            </div>
            <h2 className="text-2xl font-bold mb-4">Create Shop</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" placeholder="Shop Name" onChange={handleChange} required />
                <Input name="owner" defaultValue={user.fName + " " + user.lName} placeholder={user?._id ? user.fName + " " + user.lName : "Owner Id"} onChange={handleChange} required />
                <textarea className="border-2 w-full rounded-md px-3 py-2 text-sm" name="description" rows={3} placeholder="Description" onChange={handleChange} />
                <Input name="location.address" placeholder="Address" onChange={handleChange} required />
                <Input name="location.city" placeholder="City" onChange={handleChange} required />
                <Input name="location.state" placeholder="State" onChange={handleChange} />
                <Input name="location.country" placeholder="Country" onChange={handleChange} required />
                <Input name="location.postalCode" placeholder="Postal Code" onChange={handleChange} />

                {/* File Input for Logo */}
                <input type="file" accept="image/*" onChange={handleFileChange} />

                {/* Image Preview */}
                {preview && <img src={preview} alt="Logo Preview" className="w-20 h-20 object-cover mt-2" />}

                <Input name="slogan" placeholder="Slogan" onChange={handleChange} required />

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? "Creating..." : "Create Shop"}
                </Button>
            </form>
        </div>
    );
};
