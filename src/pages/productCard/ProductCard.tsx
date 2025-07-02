import { IProductTypes } from "@/types/index"
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
import { IAddToCartTypes } from "../addToCart"

const ProductCard: React.FC<{ item: IProductTypes | IAddToCartTypes, addClass?: string }> = ({ item, addClass }) => {
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const { language } = useAppSelector((state) => state.settings)
  const orderQty = getOrderNumberQuantity(item._id, cart)

  return (
    <>
      <Card className={`w-full h-full sm:w-[190px] md:w-[250px] bg-white shadow-lg rounded-lg overflow-hidden ${addClass}`}>
        {/* Sale Price*/}
        {
          item.salesPrice && (
            <div className="border-2 h-24 rounded-md bg-yellow-300 flex items-center">
              <div className="ml-4 w-16 h-16 flex items-center justify-center rounded-full border-8 border-primary bg-white">
                <p className="font-bold text-sm">SALE</p>
              </div>
            </div>
          )
        }
        {/* Product Image */}
        <Link to={`/product/${item.qrCodeNumber}`} >
          <div className="flex justify-center items-center pt-2 bg-gray-200">
            <img
              src={item.thumbnail}
              alt={item.name}
              className="p-2 w-full h-44 object-fill transition-transform duration-300 ease-in-out"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Product Details */}
        <CardHeader className="p-4 pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-gray-800 h-20 overflow-hidden text-ellipsis line-clamp-3">
            <Link to={`/product/${item.qrCodeNumber}`} className="hover:underline">
              {language === "en" ? item.name : item.alternateName ? item.alternateName : item.name}
            </Link>
          </CardTitle>
          {item.salesPrice && (
            <div className="w-fit mt-2 bg-yellow-300 text-sm font-bold px-2 py-1 inline-block rounded">
              {language === "en" ? "SAVE $" : "बचत रु."}{(item.price - item.salesPrice).toFixed(2)}
            </div>
          )}
        </CardHeader>

        {/* Pricing Information */}

        <div className="">
          <CardContent className="px-4 pb-4">
            {item.salesPrice ? (
              <div className="flex justify-between items-start font-bold">
                <div className="flex justify-start items-start">
                  <span className="font-medium">
                    {language === "en" ? "$" : "रु."}{Math.floor(item.salesPrice)}
                  </span>
                  <span className="text-sm">
                    {((item.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm text-gray-500 line-through ms-2 my-auto">
                  {language === "en" ? "$" : "रु."}{item.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-start items-start font-bold">
                {/* <span className={`text-xl mt-1 text-gray-600 ${item.salesPrice > 0 ? "mb-1" : "mb-4"}`}>
                    $
                  </span> */}
                <span className="font-medium">
                  {language === "en" ? "$" : "रु."}{Math.floor(item.salesPrice > 0 ? item.salesPrice : item.price)}
                </span>
                <span className="text-sm">
                  {((item.salesPrice > 0 ? item.salesPrice : item.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                </span>
              </div>
            )}
            <span className="block min-h-5">
              {item.quantity <= 5 && (
                <p className="text-sm text-red-500">
                  {language === "en" ? (
                    item.quantity > 0
                      ? `Only ${item.quantity} left in stock!`
                      : "Out of stock!"
                  ) : (
                    item.quantity > 0
                      ? `स्टकमा केवल ${item.quantity} ओटा मात्र बाँकी छ!`
                      : "स्टक सकिएको छ!"
                  )}

                </p>
              )}
            </span>

          </CardContent>
          {/* Action Buttons */}
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            {itemExist(item._id, cart).length ? (
              <ChangeItemQty item={{ ...item, orderQuantity: orderQty || 0 }} />
            ) : (
              <AddToCartButton item={{ ...item, orderQuantity: orderQty || 0 }} />
            )}
          </CardFooter>
        </div>
      </Card>
    </>

  )
}
export default ProductCard