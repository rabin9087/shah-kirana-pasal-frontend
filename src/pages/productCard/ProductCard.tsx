import { IProductTypes } from "@/types"
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
  const orderQty = getOrderNumberQuantity(item._id, cart)
  
  return (
    <>

      <Card className={`w-full h-full sm:w-[190px] md:w-[250px] bg-white shadow-lg rounded-lg overflow-hidden ${addClass}`}>
      {/* Sale Price*/}
      {
        item.salesPrice && (
          <div className="border-2 h-32 rounded-md bg-yellow-300 flex items-center">
            <div className="ml-4 w-24 h-24 flex items-center justify-center rounded-full border-8 border-primary bg-white">
              <p className="font-bold text-xl">SALE</p>
            </div>
          </div>
        )
      }
      {/* Product Image */}
      <Link to={`/product/${item.qrCodeNumber}`} className="block overflow-hidden group">
        <img
          src={item.thumbnail}
          alt={item.name}
            className="p-4 w-full h-48 object-cover transition-transform duration-300 ease-in-out"
            // w-full h-32 max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-cover transition-transform duration-300 ease-in-out group-hover:scale-105
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <CardHeader className="p-4 pb-2 pt-4">
          <CardTitle className="text-lg font-semibold text-gray-800 h-24 overflow-hidden text-ellipsis line-clamp-3">
          <Link to={`/product/${item.qrCodeNumber}`} className="hover:underline">
            {item.name}
          </Link>
        </CardTitle>
        {item.salesPrice && (
          <div className="w-fit mt-2 bg-yellow-300 text-sm font-bold px-2 py-1 inline-block rounded">
            SAVE ${(item.price - item.salesPrice).toFixed(2)}
          </div>
        )}
      </CardHeader>

      {/* Pricing Information */}
      <CardContent className="px-4 pb-4">
        {item.salesPrice ? (
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">
              ${item.salesPrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-800">
            ${item.price.toFixed(2)}
          </span>
        )}
        {item.quantity <= 5 && (
          <p className="mt-2 text-sm text-red-500">
            Only {item.quantity} left in stock!
          </p>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {itemExist(item._id, cart).length ? (
          <ChangeItemQty item={{ ...item, orderQuantity: orderQty || 0 }} />
        ) : (
          <AddToCartButton item={{ ...item, orderQuantity: orderQty || 0 }} />
        )}
      </CardFooter>
    </Card>
    </>
    
  )}
export default ProductCard