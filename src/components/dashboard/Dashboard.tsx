import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
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

    const userChartData = {
        labels: ["User1", "User2", "User3"],
        datasets: [
            {
                label: "Number of Users",
                data: [10, 20, 30],
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <Layout title="DASHBOARD">
            <DashboardLayout />

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <Card className="shadow-lg">
                    <CardContent>
                        <h2 className="text-lg font-bold mb-4">User Analysis</h2>
                        <Bar data={userChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
