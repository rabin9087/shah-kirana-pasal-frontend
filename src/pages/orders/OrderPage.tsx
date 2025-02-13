import Layout from "@/components/layout/Layout";
import OrdersList from "./OrderList";

export default function OrdersPage() {
    
    return (
        <Layout title="All Orders">
            <OrdersList/>
        </Layout>
    );
}