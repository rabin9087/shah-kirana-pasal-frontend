import CustomModal from "@/components/CustomModal"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const ScanProduct = () => {

    const [barcode, setBarcode] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [sku, setSKU] = useState<string>('');
    const navigate = useNavigate()

    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setSearch(value)
    }

    const handelOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search !== "") {
            return navigate(`/product/update/${search}`)
        }
        if (sku !== "") {
            return navigate(`/search/product/sku_value/${sku}`)
        }
    }

    useEffect(() => {
        if (barcode !== "") {
            navigate(`/search/product/sku_value/${barcode}`)
        }
    }, [barcode])

    return (
        <Layout title="Scan Product">
            <div className="border-2 w-fit flex flex-col mx-auto p-2 shadow-md rounded-md mb-2">
                <div className='flex justify-start items-center gap-4 mt-2 ps-2'>
                    <Label
                        htmlFor="image"
                        className="block  text-md font-medium leading-6 text-gray-900"
                    >
                        Scan Product's Barcode
                    </Label>
                    <div className='flex justify-center items-center gap-2'>
                        <CustomModal scanCode={setBarcode} scan={true} />
                    </div>
                </div>

                <div className='flex justify-start items-center gap-4 mt-2 mb-6 ps-2'>
                    <Label
                        htmlFor="image"
                        className="block  text-md font-medium leading-6 text-gray-900"
                    >
                        Enter Product Barcode
                    </Label>
                    <form onSubmit={handelOnSubmit}>
                        <div className='flex justify-center items-center gap-2'>
                            <Input onChange={handelOnChange} />
                            <Button type="submit" >Search</Button>
                        </div>
                    </form>

                </div>

                <div className='flex justify-start items-center gap-4 mt-2 mb-6 ps-2'>
                    <Label
                        htmlFor="image"
                        className="block  text-md font-medium leading-6 text-gray-900"
                    >
                        Enter Product SKU Value
                    </Label>
                    <form onSubmit={handelOnSubmit}>
                        <div className='flex justify-center items-center gap-2'>
                            <Input onChange={(e) => setSKU(e.target.value)} />
                            <Button type="submit" >Search</Button>
                        </div>
                    </form>
                </div>

                <div className='flex justify-start items-center gap-4 mt-2 mb-6 ps-2'>
                    <Label
                        htmlFor="productsQRCodeNameSku"
                        className="block  text-md font-medium leading-6 text-gray-900"
                    >
                        Products QRCode NameS ku
                    </Label>
                    <Button type="submit" onClick={() => navigate("/printProductsQRCodeNameSku")}>Products QRCode Name Sku</Button>
                </div>

            </div>
        </Layout>

    )
}
export default ScanProduct