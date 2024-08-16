import { IProductTypes } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom"
import { AddToCartButton, ChangeItemQty, getOrderNumberQuantity, itemExist } from "@/utils/QuantityChange"
import { useAppSelector } from "@/hooks"
import { IAddToCartTypes } from "../addToCart"

const ProductCard: React.FC<{ item: IProductTypes | IAddToCartTypes }> = ({ item }) => {
  const { cart } = useAppSelector((state) => state.addToCartInfo)
  const orderQty = getOrderNumberQuantity(item._id, cart)

  return (
    <Card className="w-[180px] md:w-[250px] h-[280px] md:h-full">
      <CardHeader>
        <CardDescription> <Link to={`/product/${item.qrCodeNumber}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        </CardDescription>
        <CardTitle className="text-md hover:underline font-thin"><Link to={`/product/${item.qrCodeNumber}`}>
          {item.name}
        </Link></CardTitle>

      </CardHeader>
      <CardContent className="text-2xl mt-0 ">
        ${item.price}
      </CardContent>
      <CardFooter className="flex-col justify-between items-end">
        {(cart.find((cart) => item._id === cart._id)?.orderQuantity || 0) >= item.quantity && (
          <span className="block text-sm h-[20px] my-2">
            {item.quantity} item(s) left
          </span>
        )
        }
        {!itemExist(item._id, cart).length ?
          <AddToCartButton item={{ ...item, orderQuantity: orderQty || 0 }} />
          :
          <ChangeItemQty item={{ ...item, orderQuantity: orderQty || 0 }} />}

      </CardFooter>
    </Card>)
}
export default ProductCard

