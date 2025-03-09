import { getAllSales, getTotalSales } from "@/axios/sales/sales";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, Legend, Rectangle, AreaChart, Area, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { getProductSalesData, mapProductNames } from "./MostSoldProduct";
import { useAppSelector } from "@/hooks";

export type ISalesProps = {
    _id: string;
    requestDeliveryDate: string;
    amount: number;
    items: {
        productId: string;
        quantity: number;
        price: number;
        supplied: number;
        note: string;
        _id: string
    }[];
}[];

interface AggregatedSales {
    requestDeliveryDate: string;
    totalAmount: number;
}

const Sales = () => {

    const { products } = useAppSelector(s => s.productInfo)
    const { data = [] } = useQuery({
        queryKey: ['amounts'],
        queryFn: () =>
            getTotalSales()
    });

    const { data: sales = [] } = useQuery({
        queryKey: ['sales'],
        queryFn: () =>
            getAllSales()
    });

    const { allProducts} = getProductSalesData(sales)

    const nameOfProduct = mapProductNames(allProducts, products)

    const aggregateSalesByDate = (salesData: ISalesProps): AggregatedSales[] => {
        const aggregated = salesData.reduce((acc: Record<string, number>, sale) => {
            const { requestDeliveryDate, amount } = sale;
            if (!acc[requestDeliveryDate]) {
                acc[requestDeliveryDate] = 0;
            }
            acc[requestDeliveryDate] += amount;
            return acc;
        }, {}); // Initialize with an empty object

        return Object.entries(aggregated).map(([date, totalAmount]) => ({
            requestDeliveryDate: date,
            totalAmount: totalAmount.toFixed(2) as unknown as number, // Convert to string and then back to number
        }));
    };

    const aggregatedSales = aggregateSalesByDate(sales);
    const paidOrders = data.filter(({paymentStatus}) => (paymentStatus === "Paid")).reduce((acc, { amount }) => {
        return acc + amount
    }, 0)
    const totalAmount = data.reduce((acc, { amount }) => {
        return acc + amount
    }, 0)

    return (
        <>
            <div className="overflow-auto text-center">
                <div className="flex flex-col text-center mb-8">
                    <div className="font-bold ">Total sales: {totalAmount.toFixed(2)}</div>
                    <div className="font-bold ">Total Paid: {paidOrders.toFixed(2)}</div>
                    <div className="font-bold ">Not Paid: {(totalAmount -paidOrders).toFixed(2)}</div>
                </div>
                
                <LineChart height={500} width={500}
                    data={sales}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="requestDeliveryDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
                <hr />
                <BarChart
                    className="mt-4"
                    width={500}
                    height={400}
                    data={aggregatedSales}
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
                    {/* <Bar dataKey="items.length" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                </BarChart>

                <AreaChart
                    width={500}
                    height={200}
                    data={aggregatedSales}
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
                <div className="mt-6 flex flex-col items-center justify-center">
                    <h2>Most Sold Product</h2>
                    <ResponsiveContainer width="100%" height="100%" aspect={300 / 300}>
                        <PieChart width={300} height={300}>
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

                </div>

                <div className="mt-6 flex flex-col items-center justify-center">
                    <h2>Most Sold Product</h2>
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
        </>
    )
}
export default Sales