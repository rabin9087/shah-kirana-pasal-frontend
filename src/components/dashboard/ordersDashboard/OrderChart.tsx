import { IOrder } from "@/axios/order/types";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface IOrderChart {
    data: IOrder[]
}
const OrderChart = ({ data }: IOrderChart) => {
    const totalArticles = data.map((items) => items.items.length).reduce((acc, item) => { return acc + item }, 0)
    const articlePacked = data.filter(({ deliveryStatus }) => (deliveryStatus === "Packed") || (deliveryStatus === "Collected")).reduce((acc, { items }) => { return acc + items.length }, 0);
    const completedPacked = data.filter(({ deliveryStatus }) => (deliveryStatus === "Completed")).reduce((acc, { items }) => { return acc + items.length }, 0);
    const picking = data.filter(({ deliveryStatus }) => (deliveryStatus === "Picking")).reduce((acc, { items }) => { return acc + items.length }, 0);
    const awaitingPicking = data.filter(({ deliveryStatus }) => (deliveryStatus === "Order placed")).reduce((acc, { items }) => { return acc + items.length }, 0);

    const total = [{
        name: "Order Status",
        "Total Articles": totalArticles,
        "Picking": picking,
        "Packed": articlePacked,
        "Awaiting Pick": awaitingPicking,
        "Completed": completedPacked,
    }];

    // const chartData = data.map((order) => ({
    //     name: `Order Status`,
    //     "Total Articles": order.items.length,
    //     "Picking": order.deliveryStatus === "Picking" ? order.items.length : 0,
    //     "Completed": order.deliveryStatus === "Packed" ? order.items.length : 0,
    //     "Article Remaining": order.deliveryStatus !== "Packed" && order.deliveryStatus !== "Picking" ? order.items.length : 0,
    // }));

    // const getColorByValue = (value, key) => {
    //     if (key === "Awaiting Pick") {
    //         if (value > 50) return "#FF0000";  // bright red for large values
    //         if (value > 20) return "#FFA500";  // orange for medium
    //         return "#FFFF00";                  // yellow for small
    //     }
    //     // other keys can have other rules
    //     if (key === "Completed") {
    //         return value > 100 ? "#008000" : "#00FF00";
    //     }
    //     // fallback color
    //     return "#0000FF";
    // };

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
                    <Bar
                        dataKey="Packed"
                        fill="#1aff1a"
                        stackId="b"  // Stack both bars together
                        barSize={70}  // Make this bar thinner so it sits inside the first one
                    // activeBar={<Rectangle fill="red" stroke="red" />}

                    >
                        <LabelList
                            dataKey="Packed"
                            position="outside"
                            angle={0}
                            offset={25}

                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
export default OrderChart