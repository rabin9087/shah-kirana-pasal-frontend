import { useState } from "react";
import Modal from "react-modal";
import Jobs from "../jobs/Jobs";
import { Button } from "@/components/ui/button";
import AllJobs from "./AllJobs";


const ContractManagement = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end items-center me-4">
                <Button onClick={() => setIsOpen(true)}>Create Job</Button>
            </div>
            <AllJobs />

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
