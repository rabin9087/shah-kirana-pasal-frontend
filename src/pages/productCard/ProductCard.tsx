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
import { Star, Heart } from "lucide-react"

const ProductCard: React.FC<{ item: IProductTypes | IAddToCartTypes, addClass?: string }> = ({ item, addClass }) => {
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const { language } = useAppSelector((state) => state.settings)
  const orderQty = getOrderNumberQuantity(item._id, cart)

  return (
    <>
      <Card className={`group relative w-full h-full sm:w-[190px] md:w-[250px] bg-white shadow-lg hover:shadow-2xl rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:transform hover:scale-[1.02] ${addClass}`}>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 group-hover:scale-110">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Sale Price Badge */}
        {item.salesPrice && (
          <div className="relative border-2 h-24 rounded-t-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 flex items-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent animate-pulse"></div>
            <div className="relative ml-4 w-16 h-16 flex items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary/80 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
              <p className="font-bold text-sm text-white drop-shadow-sm">SALE</p>
            </div>
            <div className="ml-3 text-primary">
              <p className="font-bold text-lg leading-tight">
                {Math.round(((item.price - item.salesPrice) / item.price) * 100)}% OFF
              </p>
              <p className="text-xs font-medium opacity-80">Limited Time</p>
            </div>
          </div>
        )}

        {/* Product Image */}
        <Link to={`/product/${item.qrCodeNumber}`}>
          <div className="relative flex justify-center items-center pt-2 bg-gradient-to-b from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300">
            <img
              src={item.thumbnail}
              alt={item.name}
              className="p-2 w-full h-44 object-fill transition-all duration-500 ease-in-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Image overlay on hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg m-2"></div>
          </div>
        </Link>

        {/* Product Details */}
        <CardHeader className="p-4 pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-gray-800 h-20 overflow-hidden text-ellipsis line-clamp-3 group-hover:text-primary transition-colors duration-300">
            <Link to={`/product/${item.qrCodeNumber}`} className="hover:underline">
              {language === "en" ? item.name : item.alternateName ? item.alternateName : item.name}
            </Link>
          </CardTitle>

          {/* Rating Stars */}
          {item.aggrateRating && (
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < (item?.aggrateRating ?? 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                    }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({item.aggrateRating})</span>
            </div>
          )}

          {/* Sales Badge */}
          {item.salesPrice && (
            <div className="w-fit mt-2 bg-gradient-to-r from-green-500 to-green-400 text-white text-sm font-bold px-3 py-1 inline-block rounded-full shadow-md">
              <span className="drop-shadow-sm">
                {language === "en" ? "SAVE $" : "बचत रु."}{(item.price - item.salesPrice).toFixed(2)}
              </span>
            </div>
          )}
        </CardHeader>

        {/* Pricing Information */}
        <div className="flex-1">
          <CardContent className="px-4 pb-4">
            {item.salesPrice ? (
              <div className="flex justify-between items-start font-bold">
                <div className="flex justify-start items-baseline space-x-1">
                  <span className="text-2xl font-bold text-green-600">
                    {language === "en" ? "$" : "रु."}{Math.floor(item.salesPrice)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {((item.salesPrice) % 1 * 100).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm text-gray-500 line-through ms-2 my-auto bg-gray-100 px-2 py-1 rounded">
                  {language === "en" ? "$" : "रु."}{item.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex justify-start items-baseline space-x-1 font-bold">
                <span className="text-2xl font-bold text-primary">
                  {language === "en" ? "$" : "रु."}{Math.floor(item.price)}
                </span>
                <span className="text-sm text-primary font-medium">
                  {((item.price) % 1 * 100).toFixed(0).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Stock Information */}
            <div className="mt-3">
              {item.quantity <= 5 && item.quantity > 0 ? (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-red-600 font-medium">
                    {language === "en"
                      ? `Only ${item.quantity} left in stock!`
                      : `स्टकमा केवल ${item.quantity} ओटा मात्र बाँकी छ!`
                    }
                  </p>
                </div>
              ) : item.quantity === 0 ? (
                <div className="flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-lg p-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <p className="text-sm text-gray-600 font-medium">
                    {language === "en" ? "Out of stock!" : "स्टक सकिएको छ!"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-green-600 font-medium">
                    {language === "en" ? "In Stock" : "स्टकमा उपलब्ध"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="p-4 pt-0">
            <div className="w-full">
              {itemExist(item._id, cart).length ? (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <ChangeItemQty item={{ ...item, orderQuantity: orderQty || 0 }} />
                </div>
              ) : (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <AddToCartButton item={{ ...item, orderQuantity: orderQty || 0 }} />
                </div>
              )}
            </div>
          </CardFooter>
        </div>

        {/* Hover Gradient Border Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </Card>
    </>
  )
}

export default ProductCard