import Layout from "../layout/Layout";
import DashboardLayout from "./DashboardLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// ✅ Register the required scales
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    return (
        <Layout title="DASHBOARD">
            <DashboardLayout />
        </Layout>
    );
};

export default Dashboard;
