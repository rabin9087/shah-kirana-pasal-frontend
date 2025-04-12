import { IJobs, getAllJobs, updateAJob, updateAJobPayment } from "@/axios/jobs/jobs";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button"; // Adjust to your button path
import { toast } from "react-toastify";
import { MdOutlineEdit } from "react-icons/md";

Modal.setAppElement("#root"); // replace with your app root id

const AllJobs = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<IJobs | null>(null);
    const [additionalAmount, setAdditionalAmount] = useState("");
    const queryClient = useQueryClient();

    const { data = [] } = useQuery<IJobs[]>({
        queryKey: ["allJobs"],
        queryFn: () => getAllJobs(),
    });

    const [formState, setFormState] = useState({
        name: "",
        jobTypes: "",
        contractAmount: "",
        subject: "",
        amount: "",
    });

    const [editFormState, setEditFormState] = useState({
        name: false,
        jobTypes: false,
        contractAmount: false,
        subject: false,
        amount: false,
    });

    const toggleEdit = (field: keyof typeof editFormState) => {
        setEditFormState((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleEditClick = (job: IJobs) => {
        setSelectedJob(job);
        setFormState({
            name: job.name || "",
            jobTypes: job.jobTypes || "",
            contractAmount: String(job.contractAmount || ""),
            subject: "",
            amount: "",
        });
        setIsOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedJob(null);
        setAdditionalAmount("");
        setSubject("")
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdditionalAmount(e.target.value);
    };

    const [subject, setSubject] = useState("");
    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value);
    };

    const handleUpdate = async () => {
        if (!additionalAmount || !subject) {
            toast.error("Please enter both subject and amount.");
            return;
        }

        await updateAJobPayment(selectedJob?._id as string, {
            subject: subject, // this will be the value from input like "Site material"
            amount: Number(additionalAmount),
        },)

        // Refetch the job list after update
        queryClient.invalidateQueries({ queryKey: ["allJobs"] });
        toast.success("Payment updated successfully.");

        handleClose();
    };

    const handleOnUpdateField = async (field: keyof typeof formState) => {
        setEditFormState({ amount: false, subject: false, contractAmount: false, jobTypes: false, name: false });

        try {
            await updateAJob(selectedJob?._id as string, { [field]: formState[field] });
            toast.success(`${field} updated successfully.`);
            queryClient.invalidateQueries({ queryKey: ["allJobs"] });
        } catch (error) {
            toast.error(`Failed to update ${field}`);
        }
    };

    // Calculate totals
    const totals = data.reduce(
        (acc, job) => {
            const additionalPaid = job?.newPayment?.reduce((sum, pay) => sum + Number(pay.amount || 0), 0) || 0;
            const totalPaid = Number(job.advanceAmount) + additionalPaid;
            const remainingDue = Number(job.contractAmount) - totalPaid;

            acc.totalContract += Number(job.contractAmount || 0);
            acc.totalPaid += totalPaid;
            acc.totalRemaining += remainingDue;

            return acc;
        },
        { totalContract: 0, totalPaid: 0, totalRemaining: 0 }
    );


    return (
        <div className="overflow-x-auto p-4">
            <Table className="min-w-full border rounded-xl overflow-hidden shadow-sm">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableCell className="text-xs md:text-sm font-semibold">S.N.</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Name</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Status</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Job Type</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Contract Amount</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Total Payment</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Remaining Due</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Created At</TableCell>
                        <TableCell className="text-xs md:text-sm font-semibold">Edit</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((job, index) => {
                        const additionalPaid = job?.newPayment?.reduce((acc, curr) => acc + Number(curr.amount || 0), 0) || 0;
                        const totalPaid = Number(job.advanceAmount) + additionalPaid;
                        const remainingDue = Number(job.contractAmount) - totalPaid;

                        return (
                            <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="whitespace-nowrap text-sm">{index + 1}</TableCell>
                                <TableCell className="whitespace-nowrap text-sm font-medium">{job.name}</TableCell>
                                <TableCell className={`whitespace-nowrap text-sm font-semibold ${remainingDue === 0 ? "text-green-600" : "text-red-600"} `}>{remainingDue === 0 ? "Paid" : "Due"}</TableCell>
                                <TableCell className="whitespace-nowrap text-sm hover:cursor-pointer font-semibold" onClick={() => handleEditClick(job)} >{job.jobTypes}</TableCell>
                                <TableCell className="whitespace-nowrap text-blue-600 font-semibold text-sm">Rs. {(job.contractAmount as number).toLocaleString("en-IN")}</TableCell>
                                <TableCell className="whitespace-nowrap text-sm text-green-600">
                                    Rs. {(totalPaid).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-sm text-red-600 font-semibold">
                                    Rs. {remainingDue.toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-sm">
                                    {new Date(job.createdAt as Date).toLocaleDateString("ne-NP")}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEditClick(job)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {/* Summary Row */}
                    <TableRow className="bg-gray-200 font-semibold text-sm">
                        <TableCell colSpan={4} className="text-right pr-4">Total:</TableCell>
                        <TableCell className="text-blue-700">Rs. {totals.totalContract.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-green-700">Rs. {totals.totalPaid.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-red-700">Rs. {totals.totalRemaining.toLocaleString("en-IN")}</TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <Modal
                isOpen={isOpen}
                onRequestClose={handleClose}
                overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
            >
                {selectedJob && (
                    <div>
                        <div className="space-y-6">
                            {/* Job Types (Heading style) */}
                            <div className="flex items-center justify-between px-4 py-2 border-b gap-2">
                                <div className="flex-1 text-lg font-semibold text-gray-800 text-center">
                                    {editFormState.jobTypes ? (
                                        <input
                                            type="text"
                                            name="jobTypes"
                                            value={formState.jobTypes}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-md p-2 text-center"
                                        />
                                    ) : (
                                        selectedJob.jobTypes
                                    )}
                                </div>
                                {editFormState.jobTypes ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button onClick={() => handleOnUpdateField("jobTypes")}>Update</Button>
                                        <Button onClick={() => toggleEdit("jobTypes")} className="bg-red-600 hover:bg-red-400">X</Button>
                                    </div>
                                ) : (
                                    <MdOutlineEdit
                                        size={22}
                                        className="cursor-pointer text-gray-500 hover:text-blue-500 transition"
                                        onClick={() => toggleEdit("jobTypes")}
                                    />
                                )}
                            </div>

                            {/* Contractor Name */}
                            <div className="flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm gap-2">
                                {editFormState.name ? (
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            className="w-2/3 border rounded-md p-2 text-sm text-gray-700"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => handleOnUpdateField("name")}>Update</Button>
                                            <Button onClick={() => toggleEdit("name")} className="bg-red-600 hover:bg-red-400">X</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-2/3 text-sm text-gray-700">
                                            <strong>Contractor Name:</strong> {selectedJob.name}
                                        </div>
                                        <MdOutlineEdit
                                            size={20}
                                            className="cursor-pointer text-gray-500 hover:text-blue-500 transition"
                                            onClick={() => toggleEdit("name")}
                                        />
                                    </>
                                )}
                            </div>


                            {/* Contractor Amount */}
                            <div className="flex items-center justify-between px-4 py-2 border rounded-lg shadow-sm gap-2">
                                {editFormState.contractAmount ? (
                                    <>
                                        <div className="w-2/3 flex items-center gap-2">
                                            <input
                                                type="text"
                                                name="contractAmount"
                                                value={formState.contractAmount}
                                                onChange={handleInputChange}
                                                className="w-full border rounded-md p-2 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => handleOnUpdateField("contractAmount")}>Update</Button>
                                            <Button onClick={() => toggleEdit("contractAmount")} className="bg-red-600 hover:bg-red-400">X</Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2/3 text-sm text-gray-700">
                                            <strong>Contractor Amount:</strong>{" "}
                                            <span className="text-blue-600 font-semibold">
                                                Rs. {(selectedJob.contractAmount as number).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                        <MdOutlineEdit
                                            size={20}
                                            className="cursor-pointer text-gray-500 hover:text-blue-500 transition"
                                            onClick={() => toggleEdit("contractAmount")}
                                        />
                                    </>
                                )}
                            </div>

                        </div>


                        <div className="mt-6">
                            <h3 className="text-base font-semibold mb-2 border-b pb-1">New Payments</h3>
                            <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-700 font-medium">Advance Paid</p>
                                <p className="text-sm text-gray-700 font-medium"> Rs. {(selectedJob.advanceAmount as number).toLocaleString("en-IN")} </p>
                                <p className="text-sm font-semibold text-black">   {new Date(selectedJob.createdAt as Date).toLocaleString("ne-NP")}</p>

                            </div>

                            {selectedJob?.newPayment?.length && selectedJob?.newPayment?.filter(p => p.amount as number > 0).length > 0 ? (
                                <div className="space-y-2">
                                    {selectedJob?.newPayment.map(({ subject, amount, createdAt }, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm">

                                            <p className="text-sm text-gray-700 font-medium">{subject}</p>
                                            <p className="text-sm font-semibold text-green-600">Rs. {(amount as number).toLocaleString("en-IN")}</p>
                                            <p className="text-sm font-semibold text-black">   {new Date(createdAt as Date).toLocaleString("ne-NP")}</p>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No additional payments added yet.</p>
                            )}
                        </div>

                        <div className="border-t-2 m-2 flex justify-between">
                            <p>Remaining</p>
                            <p className="text-green-600 font-bold">
                                Rs.{" "} {((Number(selectedJob.advanceAmount) || 0) +
                                    (selectedJob?.newPayment?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0)).toLocaleString("en-IN")}
                            </p>
                            <p className="text-red-600 font-bold">
                                Rs.{" "}
                                {((Number(selectedJob.contractAmount) || 0) -
                                    (Number(selectedJob.advanceAmount) || 0) -
                                    (selectedJob?.newPayment?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0)).toLocaleString("en-IN")}
                            </p>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={handleSubjectChange}
                                placeholder="e.g., Site Material"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="manualAmount" className="block text-sm font-medium mb-1">Add Amount (Rs.)</label>
                            <input
                                type="number"
                                id="manualAmount"
                                value={additionalAmount}
                                onChange={handleAmountChange}
                                placeholder="Enter amount"
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mt-6 space-y-2">
                            <Button
                                type="button"
                                onClick={handleUpdate}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                Update Payment
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="w-full border border-gray-300"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>

    );
};

export default AllJobs;
