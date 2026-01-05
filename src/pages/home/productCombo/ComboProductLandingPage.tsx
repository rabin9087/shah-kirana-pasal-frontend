import { useAppDispatch, useAppSelector } from "@/hooks";
import { useLocation, useParams } from "react-router";
import ComboProductItem from "./ComboProductItem";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IProductComboOffer } from "@/axios/productComboOffer/types";
import { getAProductComboOffer } from "@/axios/productComboOffer/productComboOffer";
import { setSelectedCombo } from "@/redux/product.slice";
import { SkeletonCard } from "@/components/ui/Loading";

const ComboProductLandingPage = () => {
    const { _id } = useParams<{ _id: string }>(); // ✅ use correct param key
    const location = useLocation();
    const { selectedCombo } = useAppSelector((s) => s.productInfo);
    const dispatch = useAppDispatch();

    // Fetch the combo product offer
    const {
        data,
        isLoading,
        isError,
    } = useQuery<IProductComboOffer>({
        queryKey: ["comboProductId", _id],
        queryFn: async () => getAProductComboOffer(_id as string),
        enabled: !!_id, // ✅ only run if id exists
    });

    useEffect(() => {
        if (data) {
            dispatch(setSelectedCombo(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    if (isLoading) {
        return (<> 
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </>
        );
    }

    if (isError || !selectedCombo) {
        return (
            <Layout title="Error">
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500">Failed to load combo offer.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={selectedCombo.offerName || "Combo Offer"}>
            <div className="rounded-2xl overflow-y-auto max-h-[calc(100vh-2rem)]">
                <ComboProductItem
                    comboOffer={selectedCombo as IProductComboOffer}
                    onBack={() => window.history.back()}
                />
            </div>
        </Layout>
    );
};

export default ComboProductLandingPage;
