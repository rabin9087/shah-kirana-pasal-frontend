import { useAppSelector } from "@/hooks";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import Layout from "../layout/Layout";
import DashboardLayout from "./DashboardLayout";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Dashboard = () => {
   const  { users, products, categories } = useAppSelector((state) => state.dashboardData);

    // Prepare data for charts
    const userChartData = {
        labels: users.map((user) => user.fName),
        datasets: [
            {
                label: "Number of Users",
                data: users.length,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const productChartData = {
        labels: products.map((product) => product.name),
        datasets: [
            {
                label: "Stock Count",
                data: products.map((product) => product.quantity),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
        ],
    };

    const categoryChartData = {
        labels: categories.map((category) => category.name),
        datasets: [
            {
                label: "Number of Products",
                data: categories.length,
                backgroundColor: categories.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`),
                borderColor: categories.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`),
                borderWidth: 1,
            },
        ],
    };

    return (
        <Layout title="DASHBOARD">
            <DashboardLayout/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* User Data */}
            <Card className="shadow-lg">
                <CardContent>
                    <h2 className="text-lg font-bold mb-4">User Analysis</h2>
                    <Bar data={userChartData} options={{ responsive: true }} />
                </CardContent>
            </Card>

            {/* Product Data */}
            <Card className="shadow-lg">
                <CardContent>
                    <h2 className="text-lg font-bold mb-4">Product Stock Analysis</h2>
                    <Line data={productChartData} options={{ responsive: true }} />
                </CardContent>
            </Card>

            {/* Category Data */}
            <Card className="shadow-lg">
                <CardContent>
                    <h2 className="text-lg font-bold mb-4">Category Distribution</h2>
                    <Pie data={categoryChartData} options={{ responsive: true }} />
                </CardContent>
            </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
