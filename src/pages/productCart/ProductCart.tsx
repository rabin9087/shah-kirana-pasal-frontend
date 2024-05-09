import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCart = ({ title = "Title", price = 3.55, productName = "product" }) => {
  return (
    <Card className="h-96 p-4">
      <img src="https://assets.woolworths.com.au/images/1005/105919.jpg?impolicy=wowsmkqiema&w=260&h=260" alt="apple" height={"148px"} width={"148px"} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <CardContent>
          {price}
        </CardContent>
        <p>{productName}</p>
      </CardContent>
      <CardFooter className="w-full border-2 border-red-500">
        <Button className="w-full border-2 border-red-500">Add to cart</Button> <br />

      </CardFooter>
    </Card>
  )
}

export default ProductCart
