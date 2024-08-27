import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ProductDetails: React.FC<{ product: { description: string } }> = ({ product }) => {

    return (
        <Tabs defaultValue="description" className="w-full shadow-lg rounded-md p-2">
            <TabsList className="flex justify-center w-full">
                <TabsTrigger className="w-full" value="description">Description</TabsTrigger>
                <TabsTrigger className="w-full" value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-2 text-justify"> <p>{product.description}</p></TabsContent>
            <TabsContent value="reviews" className="text-start ms-2"><p>Reviews section is not implemented yet.</p></TabsContent>
        </Tabs>
    );
};

export default ProductDetails;
