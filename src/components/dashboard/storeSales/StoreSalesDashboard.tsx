import { allStoreSales, dailyStoreSales } from "@/axios/storeSale/storeSale";
import Layout from "@/components/layout/Layout"
import { useAppSelector } from "@/hooks";
import { IStoreSale } from "@/pages/store/types";
import { useQuery } from "@tanstack/react-query";
import {
    CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip,
    Legend, Rectangle, ResponsiveContainer
} from 'recharts';
import { DailyMonthlyAndItemProfit } from "./StoreProfit";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { addDays, subDays } from "date-fns";


const StoreSalesDashboard = () => {
    const [date, setDate] = useState<Date>(new Date())
    const newDate = date.toISOString().split("T")[0]
    const { user } = useAppSelector(s => s.userInfo)

    const { data: dailySales = [] as IStoreSale[], isLoading } = useQuery<IStoreSale[]>({
        queryKey: ['dailyStoreSales', date],
        queryFn: async () => await dailyStoreSales(newDate)
    });

    const { data: totalStoreSales = [] as IStoreSale[] } = useQuery<IStoreSale[]>({
        queryKey: ['allStoreSales'],
        queryFn: async () => await allStoreSales(),
        enabled: user.role === "SUPERADMIN"
    });

    const totalSales = dailySales?.reduce((acc, { amount }) => acc + amount, 0);
    const allTotalStoreSales = totalStoreSales?.reduce((acc, { amount }) => acc + amount, 0);

    const { dailyProfitArray, itemProfitArray, monthlyProfitArray } = DailyMonthlyAndItemProfit(totalStoreSales)
    // const monthlyProfit = monthlyProfitArray?.reduce((acc, { profit }) => acc + profit, 0);
    const changeDate = async (newDate: Date) => {
        setDate(newDate);
    };

    console.log(dailyProfitArray, itemProfitArray, monthlyProfitArray)

    if (isLoading) return <Layout title="">Loading...</Layout>
    return (
        <Layout title="" >
            {(!dailySales?.length && !totalStoreSales?.length) && <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold">Not Sales Yet</h2>
                <p className="text-gray-500 mt-2">Sales data will appear here once available.</p>
            </div>}
            {dailySales?.length > 0 && <div className="overflow-auto text-center">
                <hr />
                <h2 className="font-bold mt-4">Daily Sales</h2>
                <div className="flex flex-col justify-center">
                    <h2>{date.toISOString().split("T")[0]} </h2>
                    <p>Total Sales: Rs. {totalSales} </p>
                    <p>Total Customers: {dailySales?.length}</p>

                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={dailySales} // Use aggregated sales by month
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis dataKey="amount" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>}

            {dailyProfitArray?.length > 0 && <div className="overflow-auto text-center">
                <hr />
                <h2 className="font-bold mt-4">Daily Profits</h2>
                <div className="flex flex-col justify-center">
                    <p>Daily Profits: Rs. {totalSales} </p>
                    <p>Total Customers: {dailySales?.length}</p>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={dailyProfitArray}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>

            </div>}

            {totalStoreSales?.length > 0 && <div className="overflow-auto text-center">
                <hr />
                <h2 className="font-bold mt-4">All Sales</h2>
                <div className="flex flex-col justify-center">
                    <p>Total Sales: Rs. {allTotalStoreSales} </p>
                    <p>Total Customers: {totalStoreSales?.length}</p>

                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={totalStoreSales} // Use aggregated sales by month
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis dataKey="amount" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>}

            {monthlyProfitArray?.length > 0 && <div className="overflow-auto text-center">
                <hr />
                <h2 className="font-bold mt-4">Monthly Profits</h2>
                <div className="flex flex-col justify-center">
                    {/* <p>Monthly Profits: Rs. {monthlyProfit} </p> */}
                    <p>Total Customers: {monthlyProfitArray?.length}</p>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={monthlyProfitArray}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="green" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>}

            {itemProfitArray?.length > 0 && <div className="overflow-auto text-center">
                <hr />
                <h2 className="font-bold mt-4">Every Sales Profits</h2>
                <div className="flex flex-col justify-center">
                    <p>Profits on Every Sales: Rs. {totalSales} </p>
                    <p>Total Customers: {itemProfitArray?.length}</p>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={itemProfitArray}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#ff7300" activeBar={<Rectangle fill="gold" stroke="red" />} />
                    </BarChart>
                </ResponsiveContainer>

            </div>}

            <div className="flex justify-center gap-2 mb-4">
                <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-200"
                    onClick={() => changeDate(subDays(date as Date, 1))}
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Date Input */}
                <div className="relative">
                    <input
                        type="date"
                        className="border rounded-md px-3 py-2"
                        value={date.toISOString().slice(0, 10)}  // Properly formatted for input
                        onChange={(e) => changeDate(new Date(e.target.value))}
                    />
                </div>

                {/* Next Day Button */}
                <button
                    type="button"
                    className="p-2 border rounded-md hover:bg-gray-200"
                    onClick={() => changeDate(addDays(date as Date, 1))}
                >
                    <ChevronRight size={16} />
                </button>
                {/* </div> */}
            </div>
        </Layout>
    )
}
export default StoreSalesDashboard