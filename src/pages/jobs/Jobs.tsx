import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IJobs, createJob } from "@/axios/jobs/jobs";
import { useParams } from "react-router";

const Jobs = () => {

    const { _id } = useParams()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IJobs>();

    const { mutate, isPending } = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            toast.success("Job created successfully!");
            reset();
        },
        onError: () => {
            toast.error("Failed to create job");
        }
    });

    const onSubmit = (data: IJobs) => {
        mutate(data);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Create Job</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="hidden">
                    <Input
                        type="text"
                        placeholder="Job category"
                        defaultValue={_id}
                        disabled={true}
                        {...register("jobCatergory", { required: "JobCatergory is required" })}
                    />
                    {errors.jobCatergory && <p className="text-red-500 text-sm">{errors.jobCatergory.message}</p>}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Contractor Name"
                        {...register("name", { required: "Contractor name is required" })}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <Input
                        type="text"
                        placeholder="Job Name"
                        {...register("jobTypes", { required: "Job name is required" })}
                    />
                    {errors.jobTypes && <p className="text-red-500 text-sm">{errors.jobTypes.message}</p>}
                </div>

                <div>
                    <Input
                        type="text"
                        placeholder="Advanced Payment By"
                        {...register("advancePaymenyBy")}
                    />
                    {errors.advancePaymenyBy && <p className="text-red-500 text-sm">{errors.advancePaymenyBy.message}</p>}
                </div>
            
                <div>
                    <Input
                        type="number"
                        placeholder="Advanced Amount"
                        {...register("advanceAmount", {
                            valueAsNumber: true
                        })}
                    />
                    {errors.advanceAmount && <p className="text-red-500 text-sm">{errors.advanceAmount.message}</p>}
                </div>

                <div>
                    <Input
                        type="number"
                        placeholder="Contract Amount"
                        {...register("contractAmount", {
                            required: "Contract amount is required",
                            valueAsNumber: true
                        })}
                    />
                    {errors.contractAmount && <p className="text-red-500 text-sm">{errors.contractAmount.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Creating..." : "Create Job"}
                </Button>
            </form>
        </div>
    );
};

export default Jobs;
