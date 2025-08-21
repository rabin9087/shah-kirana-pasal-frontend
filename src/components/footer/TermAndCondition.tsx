import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Layout from "../layout/Layout";

const TermsAndConditions: React.FC = () => {
    return (
        <Layout title="">
        <Card className="max-w-3xl mx-auto shadow-sm my-4">
            <CardHeader>
                <CardTitle className="text-xl">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        1. Introduction
                    </h3>
                    <p>
                        Welcome to <span className="font-medium">Shah Kirana Pasal</span>. By accessing or purchasing
                        from our store, you agree to the following Terms & Conditions. Please
                        read them carefully before using our services.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        2. Products & Pricing
                    </h3>
                    <p>
                        We strive to ensure that all product information, including prices,
                        descriptions, and images, are accurate and up to date. However, errors
                        may occasionally occur. Prices are subject to change without prior notice.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        3. Orders & Payments
                    </h3>
                    <p>
                        All orders are subject to availability and confirmation of payment.
                        Payments must be made through the methods available at checkout. We
                        reserve the right to cancel any order if payment is not received.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        4. Shipping & Delivery
                    </h3>
                    <p>
                        Delivery times are estimates only and may vary due to external factors.
                        We are not liable for delays beyond our control. Free shipping may apply
                        to orders above a certain value as advertised.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        5. Returns & Refunds
                    </h3>
                    <p>
                        If you receive a faulty or incorrect item, please contact us within 7 days
                        of delivery. Products must be returned unused and in original packaging.
                        Refunds will be processed according to our return policy.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        6. Privacy Policy
                    </h3>
                    <p>
                        Your personal information will be handled securely and only used to process
                        your order or improve our services. We do not share customer data with third
                        parties except as required by law.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        7. Changes to Terms
                    </h3>
                    <p>
                        Shah Kirana Pasal reserves the right to update these Terms & Conditions at
                        any time. Customers will be bound by the latest version available on our website.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        8. Contact Us
                    </h3>
                    <p>
                        For any questions regarding these Terms & Conditions, please contact us at{" "}
                        <a href="mailto:support@shahkiranapasal.com" className="text-primary underline">
                            support@shahkiranapasal.com
                        </a>.
                    </p>
                </section>
            </CardContent>
            </Card>
        </Layout>

    );
};

export default TermsAndConditions;
