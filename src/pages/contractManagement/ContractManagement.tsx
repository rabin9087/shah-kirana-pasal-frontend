import { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Jobs from "../jobs/Jobs";
import { Button } from "@/components/ui/button";

const paymentOptions = ["Cash", "Card", "Bank Transfer", "Other"];

const ContractManagement = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        jobId: "",
        contractRate: 0,
        advance: 0,
        paymentMethod: "Cash",
        paymentDate: new Date().toISOString().split("T")[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === "contractRate" || name === "advance" ? +value : value }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post("/api/job-payments", form);
            alert("Payment saved!");
        } catch (err) {
            console.error(err);
            alert("Error saving payment");
        }
    };

    return (
        <div>
            <div className="p-6 max-w-md bg-white rounded-xl shadow-md space-y-4">
                <div>
                    <Button onClick={() => setIsOpen(true)}>Create Job</Button>
                </div>
                <h2 className="text-xl font-bold">Job Payment Info</h2>

                <input name="jobId" placeholder="Job ID" value={form.jobId} onChange={handleChange} className="border p-2 w-full" />

                <input name="contractRate" type="number" placeholder="Contract Rate" value={form.contractRate} onChange={handleChange} className="border p-2 w-full" />

                <input name="advance" type="number" placeholder="Advance" value={form.advance} onChange={handleChange} className="border p-2 w-full" />

                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="border p-2 w-full">
                    {paymentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <input name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} className="border p-2 w-full" />

                <p><strong>Remaining Amount:</strong> {form.contractRate - form.advance}</p>

                <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
            >
                <Jobs />
                <div>

                </div>
                <Button type="button" onClick={() => setIsOpen(false)} className="mt-4 w-full">
                    Close
                </Button>
            </Modal>

        </div>
    );
};

export default ContractManagement;
