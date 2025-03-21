import { ISalesProps } from "./Sales";

export const CalculateDailyAndMonthlyProfit = (sales: ISalesProps) => {
    const dailyProfit: { [date: string]: number } = {};
    const monthlyProfit: { [month: string]: number } = {};

    sales.filter((item) => item.paymentStatus === "Paid").forEach((sale) => {
        const date = sale.requestDeliveryDate; // format YYYY-MM-DD
        const month = date.slice(0, 7); // extract YYYY-MM

        let orderProfit = 0;

        sale.items.forEach((item) => {
            if (item.costPrice !== undefined && item.costPrice !== null) {
                orderProfit += (item.price - item.costPrice) * item.quantity;
            }
        });

        // Add profit to daily total
        dailyProfit[date] = (dailyProfit[date] || 0) + orderProfit;

        // Add profit to monthly total
        monthlyProfit[month] = (monthlyProfit[month] || 0) + orderProfit;
    });

    return { dailyProfit, monthlyProfit };
};


export const CurrentMonthDailyProfit = (sales: ISalesProps) => {
    const currentMonthDailyProfit: { [date: string]: number } = {};
    // const monthlyProfit: { [month: string]: number } = {};

    const currentMonth = new Date().toISOString().slice(0, 7); // Get YYYY-MM format for current month

    sales
        .filter((sale) => sale.paymentStatus === "Paid")
        .forEach((sale) => {
            const date = sale.requestDeliveryDate; // Format: YYYY-MM-DD
            const month = date.slice(0, 7); // Extract YYYY-MM

            let orderProfit = 0;

            sale.items.forEach((item) => {
                if (item.costPrice !== undefined && item.costPrice !== null) {
                    orderProfit += (item.price - item.costPrice) * item.quantity;
                }
            });

            // Add profit to monthly total
            // monthlyProfit[month] = (monthlyProfit[month] || 0) + orderProfit;

            // Only include daily profit for the current month
            if (month === currentMonth) {
                currentMonthDailyProfit[date] = (currentMonthDailyProfit[date] || 0) + orderProfit;
            }
        });

    return { currentMonthDailyProfit };
};



import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type ProfitChartProps = {
    data: Record<string, number>;
    title: string;
};

const ProfitChart: React.FC<ProfitChartProps> = ({ data, title }) => {
    // Convert object to array for Recharts
    const chartData = Object.entries(data).map(([key, value]) => ({
        date: key,
        profit: value,
    }));

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-bold mb-3">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="profit" fill="#0C66E4" radius={[5, 5, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfitChart;

