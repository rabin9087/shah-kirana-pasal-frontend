interface DeliveryDateSelectorProps {
    requestDeliveryDate: string;
    setRequestDeliveryDate: React.Dispatch<React.SetStateAction<string>>;
    orderType: "pickup" | "delivery";
}

const DeliveryDateSelector: React.FC<DeliveryDateSelectorProps> = ({
    requestDeliveryDate,
    setRequestDeliveryDate,
    orderType
}) => {
    const length = 7
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dates = Array.from({ length }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            label: i === 0 ? "Today" : days[date.getDay()], // "Today" for the current day, day name for others
            value: date.toISOString().split("T")[0],       // ISO date string (YYYY-MM-DD)
        };
    })

    // const dates = [
    //     { label: "Today", value: new Date().toISOString().split("T")[0] },
    //     {
    //         label: "Tomorrow",
    //         value: new Date(new Date().setDate(new Date().getDate() + 1))
    //             .toISOString()
    //             .split("T")[0],
    //     },
    //     {
    //         label: "Monday",
    //         value: new Date(new Date().setDate(new Date().getDate() + ((1 - new Date().getDay() + 7) % 7)))
    //             .toISOString()
    //             .split("T")[0],
    //     },
    // ];

    return (
        <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2 py-2'>
            <div  >
                <h3 className='p-2 font-bold text-xl'>Select a {orderType === "delivery" ? "Delivery" : "Pickup"}  Date</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                {dates.map((date) => (
                    <label key={date.value} className="cursor-pointer">
                        <input
                            type="radio"
                            name="deliveryDate"
                            value={date.value}
                            onChange={(e) => setRequestDeliveryDate(e.target.value)}
                            className="hidden"
                        />
                        <div
                            className={`p-4 border rounded ${requestDeliveryDate === date.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100"
                                }`}
                        >
                            <p>{date.label}</p>
                            <p>{date.value}</p>
                        </div>
                    </label>
                ))}

            </div>
            <div>
            </div>
            {/* <label className="cursor-pointer">
                <input
                    type="date"
                    name="deliveryDate"

                    onChange={(e) => setRequestDeliveryDate(e.target.value)}
                    className=""
                />
            </label> */}
        </div>
    );
};

export default DeliveryDateSelector;
