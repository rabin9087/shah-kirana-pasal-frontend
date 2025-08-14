import { useAppSelector } from "@/hooks"
import { useLocation, useParams } from "react-router";
import ComboProductItem from "./ComboProductItem";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";

const ComboProductLandingPage = () => {
    const params = useParams();
    const location = useLocation();
    const { comboProducts } = useAppSelector(s => s.productInfo)

    const comboProduct = comboProducts.filter((item) => item._id === params._id)[0];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <Layout title="">
            <div className="rounded-2xl overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto">
                <ComboProductItem
                    comboOffer={comboProduct}
                    onBack={() => window.history.back()}
                />
            </div>
        </Layout>

    )
}
export default ComboProductLandingPage