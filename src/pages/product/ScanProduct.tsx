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
    const navigate = useNavigate()

    const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setSearch(value)
    }

    const handelOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return navigate(`/product/update/${search}`)
    }

    useEffect(() => {
        if (barcode !== "") {
            navigate(`/product/update/${barcode}`)
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
            </div>
        </Layout>

    )
}
export default ScanProduct