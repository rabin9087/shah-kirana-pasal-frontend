import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { IoReload } from "react-icons/io5";
const Unauthorized = () => {
    const navigate = useNavigate();

    const handleOnRefresh = () => {
        window.location.reload()
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
            <p className="text-lg text-gray-600 mb-6">You do not have permission to view this page.</p>
            <div className="">
                <Button
                onClick={handleOnRefresh}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80"
            >
                    <IoReload/>
            </Button></div>
            <div className="">
                <Button
                    onClick={() => navigate("/")}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80"
                >
                    Go to Home
                </Button>
            </div>
            
            
        </div>
    );
};

export default Unauthorized;
