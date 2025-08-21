import React from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange"
import { useAppSelector } from "@/hooks"
import { IProductComboOffer } from "@/axios/productComboOffer/types"

const ProductComboOfferCard: React.FC<{ item: IProductComboOffer, addClass?: string, onClick?: () => void }> = ({ item, addClass, onClick }) => {

    const { cart } = useAppSelector((state) => state.addToCartInfo)
    const { language } = useAppSelector((state) => state.settings)
    const orderQty = getOrderNumberQuantity(item?._id as string, cart)

    // Calculate savings percentage
    const savingsPercentage = ((item.discountAmount / item.totalAmount) * 100).toFixed(0)

    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <>
            <Card className={`w-full h-full sm:w-[190px] md:w-[250px] bg-white shadow-lg rounded-lg overflow-hidden ${addClass}`}>
                {/* Combo Offer Badge */}
                <div className="border-2 h-24 rounded-md bg-gradient-to-r from-red-400 to-orange-400 flex items-center">
                    <div className="ml-4 w-20 h-20 flex items-center justify-center rounded-full border-8 border-primary bg-white">
                        <p className="font-bold text-base p-2">COMBO</p>
                    </div>
                    <div className="ml-2 text-white">
                        <p className="text-xs font-semibold">Save {savingsPercentage}%</p>
                        <p className="text-xs">{item.items.length} Items</p>
                    </div>
                </div>

                {/* Combo Offer Image */}
                <Link to={`/`}>
                    <div className="flex justify-center items-center pt-2 bg-gray-200"
                        onClick={onClick}>
                        <img
                            src={item.thumbnail}
                            alt={item.offerName}
                            className="p-2 w-full h-44 object-fill transition-transform duration-300 ease-in-out"
                            loading="lazy"
                        />
                    </div>
                </Link>

                {/* Combo Offer Details */}
                <CardHeader className="p-4 pb-2 pt-4" onClick={onClick}>
                    <CardTitle className="text-lg font-semibold text-gray-800 h-20 overflow-hidden text-ellipsis line-clamp-3">
                        <Link to={`/`} className="hover:underline">
                            {item.offerName}
                        </Link>
                    </CardTitle>

                    {/* Savings Badge */}
                    <div className="w-fit mt-2 bg-green-400 text-sm font-bold px-2 py-1 inline-block rounded text-white">
                        {language === "en" ? "SAVE $" : "बचत रु."}{item.discountAmount.toFixed(2)}
                    </div>
                </CardHeader>

                {/* Pricing Information */}
                <div className="">
                    <CardContent
                        onClick={onClick}
                        className="px-4 pb-4">
                        <div className="flex justify-between items-start font-bold">
                            <div className="flex justify-start items-start">
                                <span className="font-medium text-green-600">
                                    {language === "en" ? "$" : "रु."}{Math.floor(item.price)}
                                </span>
                                <span className="text-sm text-green-600">
                                    {((item.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500 line-through ms-2 my-auto">
                                {language === "en" ? "$" : "रु."}{item.totalAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Offer Validity */}
                        <div className="mt-2">
                            <p className="text-xs text-gray-600">
                                {language === "en" ? "Valid till: " : "मान्य मिति: "}
                                {formatDate(item?.offerEndDate?.toString() ?? "")}
                            </p>
                        </div>

                        {/* Items Count */}
                        <div className="mt-1">
                            <p className="text-xs text-blue-600 font-medium">
                                {language === "en"
                                    ? `${item.items.length} products included`
                                    : `${item.items.length} उत्पादनहरू समावेश`
                                }
                            </p>
                        </div>
                    </CardContent>

                    {/* Action Buttons */}
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        {

                            (itemExist(item._id as string, cart) ? (

                                <ChangeItemQty item={{
                                    ...item,
                                    orderQuantity: orderQty,
                                    offerName: item.offerName,
                                    price: item.price,
                                }} />
                            ) : (
                                <AddToCartButton item={{
                                    ...item,
                                    orderQuantity: orderQty
                                    // offerName: item.offerName,
                                    // price: item.price,
                                }} />
                            )
                            )

                        }

                    </CardFooter>
                </div>
            </Card>
        </>
    )
}

export default ProductComboOfferCard