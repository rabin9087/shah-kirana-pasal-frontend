import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ProductCart = ({title= "Title", price= 3.55, productName= "product"}) => {
  return (
    <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <Button>Add to cart</Button> <br />
     
    </CardFooter>
  </Card>
  )
}

export default ProductCart
