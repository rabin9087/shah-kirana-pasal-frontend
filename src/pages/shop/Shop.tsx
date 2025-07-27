import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getAllShops } from "@/axios/shop/shop";
import { IShop } from "@/axios/shop/types";
import { setAShop, setShops } from "@/redux/shop.slice";
import { useAppSelector } from "@/hooks";

const Shop = () => {
    const dispatch = useDispatch();
    const { shops, selectedShop } = useAppSelector((s) => s.shopsInfo);
    // const navigator = useNavigation()
    // Only fetch shops if shops are not already in the state
    const { data = [], isSuccess } = useQuery<IShop[]>({
        queryKey: ["shops"],
        queryFn: () => getAllShops(),
        enabled: shops.length === 0, // Only run if shops array is empty
    });

    // Set shops when fetched from API
    useEffect(() => {
        if (isSuccess && data.length > 0 && shops.length === 0) {
            dispatch(setShops(data));
        }
    }, [isSuccess, data, shops.length, dispatch]);

    // If shops are already in state, use them
    const shopList = shops.length > 0 ? shops : data;

    // Set default selectedShop if not set yet
    useEffect(() => {
        if (!selectedShop._id && shopList.length > 0) {
            dispatch(setAShop(shopList[0])); // or show prompt first
        }
    }, [selectedShop._id, shopList, dispatch]);

    const handleSelectShop = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const selected = shopList.find((shop) => shop._id === selectedId);
        if (selected) {
            dispatch(setAShop(selected));
        }
    };

    return (<>
        <select
            className="rounded-md border-2 px-3 py-2 text-sm"
            onChange={handleSelectShop}
            value={selectedShop._id || ""}
        >
            <option value="" disabled>
                Select a shop
            </option>

            {shopList.map((shop) => (
                <option key={shop._id} value={shop._id}>
                    {shop.name}
                </option>
            ))}
        </select>
    </>
    );
};

export default Shop;
