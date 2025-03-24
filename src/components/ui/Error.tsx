import ProductNotFound from "@/pages/product/components/ProductNotFound"
import Layout from "../layout/Layout"

const Error = () => {
    return (
        <Layout title=""><ProductNotFound open={true} onClose={() => { }} /></Layout>
    )
}
export default Error