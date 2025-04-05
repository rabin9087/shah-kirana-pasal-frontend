import { getAllSales, getTotalSales } from "@/axios/sales/sales";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip,
    Legend, Rectangle, ResponsiveContainer, PieChart, Pie
} from 'recharts';
import { getProductSalesData, mapProductNames } from "./MostSoldProduct";
import { useAppSelector } from "@/hooks";
import ProfitChart, { CalculateDailyAndMonthlyProfit, CurrentMonthDailyProfit } from "./Profit";

export type ISalesProps = {
    _id: string;
    requestDeliveryDate: string;
    amount: number;
    paymentStatus: string,
    items: {
        productId: string;
        quantity: number;
        price: number;
        costPrice?: number,
        supplied: number;
        note: string;
        _id: string
    }[];
}[];

interface AggregatedSales {
    requestDeliveryDate: string; // "Month YYYY"
    totalAmount: number;
}

const Sales = () => {
    const { user } = useAppSelector((state) => state.userInfo);

    const { products } = useAppSelector(s => s.productInfo)
    const { data = [] } = useQuery({
        queryKey: ['amounts'],
        queryFn: () =>
            getTotalSales()
    });

    const { data: sales = [] } = useQuery({
        queryKey: ['sales', 'online'],
        queryFn: () =>
            getAllSales()
    });

    const { allProducts } = getProductSalesData(sales);
    const nameOfProduct = mapProductNames(allProducts, products);

    // Function to format date to "Month YYYY" (e.g., "March 2025")
    const formatMonthYear = (date: string): string => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(date);
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${month} ${year}`;
    };



    const getFormattedDate = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    const aggregateSalesByMonth = (salesData: ISalesProps): AggregatedSales[] => {
        const aggregated = salesData.reduce((acc: Record<string, number>, sale) => {
            // Extract year and month (Month YYYY) from requestDeliveryDate
            const monthYear = formatMonthYear(sale.requestDeliveryDate);
            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }
            acc[monthYear] += sale.amount;
            return acc;
        }, {}); // Initialize with an empty object

        return Object.entries(aggregated).map(([monthYear, totalAmount]) => ({
            requestDeliveryDate: monthYear, // Store as "Month YYYY"
            totalAmount: totalAmount.toFixed(2) as unknown as number, // Convert to string and then back to number
        }));
    };

    const aggregateSalesByDay = (salesData: ISalesProps) => {
        const aggregated = salesData.reduce((acc: Record<string, number>, sale) => {
            const key = getFormattedDate(sale.requestDeliveryDate);

            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += sale.amount;
            return acc;
        }, {});

        return Object.entries(aggregated).map(([date, totalAmount]) => ({
            date,
            totalAmount: totalAmount.toFixed(2) as unknown as number,
        }));
    };

    const aggregatedSales = aggregateSalesByMonth(sales);

    const paidOrders = data.filter(({ paymentStatus }) => (paymentStatus === "Paid")).reduce((acc, { amount }) => {
        return acc + amount;
    }, 0);

    const totalAmount = data.reduce((acc, { amount }) => {
        return acc + amount;
    }, 0);
    // const monthlySales = aggregateSalesByMonth(sales);
    const dailySales = aggregateSalesByDay(sales);
    const { dailyProfit, monthlyProfit } = CalculateDailyAndMonthlyProfit(sales);
    const { currentMonthDailyProfit } = CurrentMonthDailyProfit(sales)

    console.log(dailyProfit, monthlyProfit, currentMonthDailyProfit)

    return (
        <>
            <div className="overflow-auto text-center">
                <div className="flex flex-col text-center mb-8">
                    <div className="font-bold ">Total sales: {totalAmount.toFixed(2)}</div>
                    <div className="font-bold ">Total Paid: {paidOrders.toFixed(2)}</div>
                    <div className="font-bold ">Not Paid: {(totalAmount - paidOrders).toFixed(2)}</div>
                </div>
                {/* <h2 className="font-bold mt-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={aggregatedSales} // Use aggregated sales by month
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}>
                        <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="requestDeliveryDate" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer> */}

                <hr />
                <h2 className="font-bold mt-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        className="mt-4"
                        data={aggregatedSales} // Use aggregated sales by month
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="requestDeliveryDate" />
                        <YAxis dataKey="totalAmount" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalAmount" fill="#8884d8" activeBar={<Rectangle fill="gold" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>

                <hr />
                {/* <h2 className="font-bold mt-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                        data={aggregatedSales} // Use aggregated sales by month
                        syncId="anyId"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="requestDeliveryDate" />
                        <YAxis dataKey="totalAmount" />
                        <Tooltip />
                        <Area type="monotone" dataKey="totalAmount" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ResponsiveContainer> */}

                <hr />
                <h2 className="font-bold mt-4">Most Sale Product</h2>
                <ResponsiveContainer width="100%" height={"75%"}>
                    <PieChart
                        className="mt-4">
                        <Pie
                            data={nameOfProduct}
                            dataKey="quantity"
                            nameKey="name"
                            cx="50%"
                            cy="40%"
                            outerRadius={150}
                            fill="#82ca9d"
                            label

                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>


                {/* <div className="mt-6 flex flex-col items-center justify-center">
                    <h2>Most Sold Product</h2>
                    <ResponsiveContainer width="100%" height="100%" aspect={300 / 300}>
                       
                    </ResponsiveContainer>

                </div> */}
                <hr />
                <div className="mt-6 flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%" aspect={500 / 300}>
                        <BarChart
                            className="mt-4"
                            width={500}
                            height={300}
                            data={nameOfProduct}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="quantity"
                                fill="#8884d8"
                                activeBar={<Rectangle fill="pink" stroke="blue" />}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <hr />
            <div className="overflow-auto text-center">
                {/* <h2 className="font-bold mt-4">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlySales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthYear" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalAmount" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer> */}

                {/* <h2 className="font-bold mt-4">Daily Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={dailySales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="totalAmount" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer> */}
                <hr />
                <h2 className="font-bold mt-4">Daily Sales</h2>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        className="mt-4"

                        data={dailySales}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis dataKey="date" />
                        <YAxis dataKey="totalAmount" />
                        <Tooltip />
                        <Bar
                            dataKey="totalAmount"
                            fill="#8884d8"
                            activeBar={<Rectangle fill="pink" stroke="blue" />}
                        />
                    </BarChart>
                </ResponsiveContainer>

                <hr />
                {user?.role === "SUPERADMIN" && <div className="p-6 space-y-6">
                    <ProfitChart data={currentMonthDailyProfit} title="Current Month Daily Profit" />
                    <ProfitChart data={dailyProfit} title="Daily Profit" />
                    <ProfitChart data={monthlyProfit} title="Monthly Profit" />
                </div>}
            </div>
        </>
    )
}

export default Sales;
