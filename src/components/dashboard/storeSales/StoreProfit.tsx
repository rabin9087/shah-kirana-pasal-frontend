
import { useAppSelector } from "@/hooks";
import { IStoreSale } from "@/pages/store/types";

export const DailyMonthlyAndItemProfit = (storeSales: IStoreSale[]) => {
    const {products} = useAppSelector(s => s.productInfo)
    const dailyProfit: { [date: string]: number } = {};
    const monthlyProfit: { [month: string]: number } = {};
    const itemProfit: { [productId: string]: number } = {};

    storeSales
        .filter((sale) => sale.paymentStatus === "Paid")
        .forEach((sale) => {
            const date = new Date(sale.createdAt!).toISOString().split("T")[0];
            const month = date.slice(0, 7);

            let orderProfit = 0;

            sale.items.forEach((item) => {
                if (item.costPrice != null) {
                    const profit = (item.price - item.costPrice) * item.orderQuantity;
                    orderProfit += profit;
                    itemProfit[item?.productId as string] = (itemProfit[item?.productId as string] || 0) + profit;
                }
            });

            dailyProfit[date] = (dailyProfit[date] || 0) + orderProfit;
            monthlyProfit[month] = (monthlyProfit[month] || 0) + orderProfit;
        });

    const dailyProfitArray = Object.entries(dailyProfit).map(([date, profit]) => ({
        date,
        profit: profit.toFixed(2),
    }));

    const monthlyProfitArray = Object.entries(monthlyProfit).map(([month, profit]) => ({
        month,
        profit: profit.toFixed(2),
    }));

    const itemProfitArray = Object.entries(itemProfit).map(([productId, profit]) => {
        const product = products.find((p) => p._id === productId);
        return {
            productName: product?.name ?? "Unknown Product",
            profit: profit.toFixed(2),
        };
    });

    return { dailyProfitArray, monthlyProfitArray, itemProfitArray };
};
