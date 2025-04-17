import { IJobCategory, createJobCategory } from "@/axios/jobCategory/jobCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const JobCategoryForm = () => {
    const {user} = useAppSelector(s => s.userInfo)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<IJobCategory>();

    const { mutate, isPending } = useMutation({
        mutationFn: createJobCategory,
        onSuccess: () => {
            toast.success("Job Category created successfully!");
            reset();
        },
        onError: () => {
            toast.error("Failed to create job category!");
        }
    });
    
    useEffect(() => {
        if (user?._id) {
            setValue("user", user._id); // Set user._id when component loads
        }
    }, [user, setValue]);

    const onSubmit = (data: IJobCategory) => {
        mutate(data);
    };
  return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Create Job</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                  <Input
                      type="text"
                      placeholder="Job category Name"
                      {...register("name", { required: "Job Category name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Creating..." : "Create Job Category"}
              </Button>
          </form>
      </div>
  )
}
export default JobCategoryForm