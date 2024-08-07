import { getAProductAction } from "@/action/product.action"
import CustomModal, { OpenNotFoundModal } from "@/components/CustomModal"
import Layout from "@/components/layout/Layout"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const ScanProduct = () => {

    const [barcode, setBarcode] = useState<string>('');
    const navigate = useNavigate()
    console.log(barcode)
    const dispatch = useAppDispatch()
    const { productFoundStatus } = useAppSelector(state => state.productInfo)

    useEffect(() => {
        console.log(barcode)
        if (!barcode) return
        dispatch(getAProductAction({ qrCodeNumber: barcode })).then((res) => {

            if (res) {
                return navigate(`/product/update/${barcode}`)
            }

        })
    }, [barcode, dispatch])

    return (
        <Layout title="Scan Product">
            <div className='flex  justify-center items-center gap-4 mt-2'>
                <Label
                    htmlFor="image"
                    className="block  text-md font-medium leading-6 text-gray-900"
                >
                    Scan Product's Barcode
                </Label>
                <div className='flex justify-center items-center gap-2'>
                    <CustomModal scanCode={setBarcode} scan={true} />
                    <OpenNotFoundModal />
                </div>
            </div>

        </Layout>

    )
}
export default ScanProduct