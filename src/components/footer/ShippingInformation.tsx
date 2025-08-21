import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Truck, Package, Clock } from "lucide-react";
import Layout from "../layout/Layout";

interface ShippingInfoProps {
  freeShippingThreshold?: number; // e.g. 99 for "Free over $99"
  standardETA?: string; // e.g. "2–6 business days"
  expressETA?: string; // e.g. "1–2 business days"
  expressCost?: string; // e.g. "$9.95"
  localPickup?: boolean; // show pickup info
}

const ShippingInformation: React.FC<ShippingInfoProps> = ({
  freeShippingThreshold = 99,
  standardETA = "2–6 business days",
  expressETA = "1–2 business days",
  expressCost = "$9.95",
  localPickup = true,
}) => {
  return ( <Layout title=""> 
    <Card className="max-w-2xl mx-auto shadow-sm my-4">
      <CardHeader>
        <CardTitle className="text-xl">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold">Standard Delivery</h3>
            <p>
              Estimated delivery: <span className="font-medium">{standardETA}</span>
            </p>
            <p className="text-muted-foreground">
              Free on orders over ${freeShippingThreshold}, otherwise calculated at checkout.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold">Express Delivery</h3>
            <p>
              Estimated delivery: <span className="font-medium">{expressETA}</span>
            </p>
            <p className="text-muted-foreground">Cost: {expressCost}</p>
          </div>
        </div>

        {localPickup && (
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Local Pickup</h3>
              <p>
                Collect your order from our warehouse.{" "}
                <span className="font-medium">Ready within 2–4 hours.</span>
              </p>
              <p className="text-muted-foreground">Free of charge.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </Layout>
  );
};

export default ShippingInformation;
