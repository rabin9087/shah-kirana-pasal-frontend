import { IOrder } from "@/axios/order/types";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IOrderChart {
    data: IOrder[]
}
const OrderChart = ({ data }: IOrderChart) => {
    const totalArticles = data.map((items) => items.items.length).reduce((acc, item) => { return acc + item }, 0)
    const articlePacked = data.filter(({ deliveryStatus }) => (deliveryStatus === "Packed")).reduce((acc, { items }) => { return acc + items.length }, 0);
    const picking = data.filter(({ deliveryStatus }) => (deliveryStatus === "Picking")).reduce((acc, { items }) => { return acc + items.length }, 0);
   
    const total = [{
        name: "Order Status",
        "Total Articles": totalArticles,
        "Picking": picking,
        "Completed": articlePacked,
        "Awaiting Pick": totalArticles - articlePacked - picking
    }];

    // const chartData = data.map((order) => ({
    //     name: `Order Status`,
    //     "Total Articles": order.items.length,
    //     "Picking": order.deliveryStatus === "Picking" ? order.items.length : 0,
    //     "Completed": order.deliveryStatus === "Packed" ? order.items.length : 0,
    //     "Article Remaining": order.deliveryStatus !== "Packed" && order.deliveryStatus !== "Picking" ? order.items.length : 0,
    // }));

    return (
        <div className={"flex justify-start"}>
            <ResponsiveContainer width={"100%"} height={300} >
                <BarChart
                    className="mt-4 mb-8"
                    width={100}
                    height={150}
                    data={total}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" /> {/* Use a common key like 'name' */}
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="Total Articles"
                        fill="#0000FF"
                        stackId="a"  // Stack both bars together
                        barSize={70}  // Make this bar thinner so it sits inside the first one
                    // activeBar={<Rectangle fill="red" stroke="red" />}
                    >
                        <LabelList
                            dataKey="Total Articles"
                            position="insideBottom"
                            angle={0}
                            offset={25}
                            fill="#FFFFFF"
                        />

                    </Bar>
                    <Bar
                        dataKey="Completed"
                        fill="#00FF00"
                        stackId="b"  // Stack both bars together
                        barSize={70}  // Make this bar thinner so it sits inside the first one
                    // activeBar={<Rectangle fill="red" stroke="red" />}
                    >
                        <LabelList
                            dataKey="Completed"
                            position="outside"
                            angle={0}
                            offset={25}
                            fill="white"
                        />
                    </Bar>
                    <Bar
                        dataKey="Picking"
                        fill="#dcdc09"
                        stackId="b"  // Stack both bars together
                        barSize={70}  // Make this bar thinner so it sits inside the first one
                    // activeBar={<Rectangle fill="red" stroke="red" />}

                    >
                        <LabelList
                            dataKey="Picking"
                            position="outside"
                            angle={0}
                            offset={25}
                            
                        />
                    </Bar>
                    <Bar
                        dataKey="Awaiting Pick"
                        fill="#FF0000"
                        stackId="b"  // Stack both bars together
                        barSize={70}  // Adjust bar width
                    // activeBar={<Rectangle fill="pink" stroke="blue" />}
                    >
                        <LabelList
                            dataKey="Awaiting Pick"
                            position="top"
                            angle={0}
                            offset={25}
                            fill="#FF0000"
                        />

                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
export default OrderChart