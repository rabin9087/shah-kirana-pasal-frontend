import { useAppSelector } from "@/hooks";

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
    const { language } = useAppSelector((state) => state.settings)
    const length = 7
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nepaliDays = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"]
    const dates = Array.from({ length }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            label: i === 0 ? language === "en" ? "Today" : "आज" : language === "en" ? days[date.getDay()] : nepaliDays[date.getDay()], // "Today" for the current day, day name for others
            value: date.toISOString().split("T")[0],       // ISO date string (YYYY-MM-DD)
        };
    })

    return (
        <div className='shadow-md bg-slate-100 rounded-md ps-2 my-2 py-2'>
            <div  >
                <h3 className='p-2 font-bold text-xl'>{language === "en" ? `Select a ${orderType === "delivery" ? "Delivery" : "Pickup"} Date` :
                    ` ${orderType === "delivery" ? "डिलीवरी" : "पसलबाट उठाउनुहोस्"} मिति चयन गर्नुहोस्`}
                </h3>
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
        </div>
    );
};

export default DeliveryDateSelector;


interface PickupTimeSelectorProps {
    pickupTime: string;
    setPickupTime: React.Dispatch<React.SetStateAction<string>>;
}

const generateTimeSlots = (startHour = 10, endHour = 20, intervalHours = 2) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour += intervalHours) {
        const start = new Date();
        start.setHours(hour, 0, 0, 0);
        const end = new Date();
        end.setHours(hour + intervalHours, 0, 0, 0);

        const formatTime = (date: Date) => {
            let h = date.getHours();
            const m = date.getMinutes();
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
        };

        slots.push({
            label: `${formatTime(start)} to ${formatTime(end)}`,
            value: `${formatTime(start)} - ${formatTime(end)}`,
        });
    }
    return slots;
};

export const PickupTimeSelector: React.FC<PickupTimeSelectorProps> = ({
    pickupTime,
    setPickupTime,
}) => {
    const timeSlots = generateTimeSlots();

    return (
        <div className="my-4 p-4 bg-slate-100 rounded-md shadow-md">
            <label htmlFor="pickupTime" className="block mb-2 font-bold text-lg">
                Select Pickup Time
            </label>
            <select
                id="pickupTime"
                className="w-full p-2 border rounded"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
            >
                <option value="" disabled>
                    -- Select a time slot --
                </option>
                {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                        {slot.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
