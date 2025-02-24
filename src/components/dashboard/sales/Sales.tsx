import { getAllSales, getTotalSales } from "@/axios/sales/sales";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, Legend, Rectangle, AreaChart, Area } from 'recharts';

export type ISalesProps = {
    _id: string;
    requestDeliveryDate: string;
    amount: number;
    items: [];
}[];

interface AggregatedSales {
    requestDeliveryDate: string;
    totalAmount: number;
}

const Sales = () => {
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

    const totalAmount = data.reduce((acc, { amount }) => {
        return acc + amount
    }, 0)

    return (
        <>
            <div className="mb-8 font-bold">Total sales: {totalAmount}</div>
            <LineChart height={300} width={500}
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
                height={300}
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

        </>

    )
}
export default Sales