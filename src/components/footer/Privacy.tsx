import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Layout from "../layout/Layout";

const PrivacyPolicy: React.FC = () => {
    return (
        <Layout title="">
        <Card className="max-w-3xl mx-auto shadow-sm my-4">
            <CardHeader>
                <CardTitle className="text-xl">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        1. Introduction
                    </h3>
                    <p>
                        At <span className="font-medium">Shah Kirana Pasal</span>, we value and
                        respect your privacy. This Privacy Policy explains how we collect, use,
                        and protect your personal information when you interact with our store.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        2. Information We Collect
                    </h3>
                    <p>
                        We may collect personal details such as your name, email address, phone
                        number, billing/shipping address, and payment information. We may also
                        collect non-personal data like browser type and website usage statistics.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        3. How We Use Your Information
                    </h3>
                    <p>
                        Your information is used to process orders, improve customer service, send
                        updates about your purchase, and provide special offers if you opt in.
                        We do not sell or rent your data to third parties.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        4. Sharing of Information
                    </h3>
                    <p>
                        We may share your details with trusted service providers (e.g., payment
                        processors, delivery partners) strictly to complete your orders. We may
                        also disclose information if required by law or government authorities.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        5. Security
                    </h3>
                    <p>
                        We take appropriate security measures to protect your personal data from
                        unauthorized access, disclosure, alteration, or destruction. However, no
                        method of online transmission is 100% secure.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        6. Cookies & Tracking
                    </h3>
                    <p>
                        Our website may use cookies to enhance your browsing experience and gather
                        usage data. You can disable cookies through your browser settings, but some
                        features of the site may not function properly without them.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        7. Your Rights
                    </h3>
                    <p>
                        You have the right to access, correct, or request deletion of your personal
                        data. If you wish to opt out of marketing emails, you can unsubscribe at
                        any time using the link provided in our emails.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        8. Updates to This Policy
                    </h3>
                    <p>
                        We may update this Privacy Policy periodically to reflect changes in our
                        practices. The latest version will always be available on our website.
                    </p>
                </section>

                <section>
                    <h3 className="font-semibold text-base text-foreground mb-2">
                        9. Contact Us
                    </h3>
                    <p>
                        If you have any questions about our Privacy Policy, please contact us at{" "}
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

export default PrivacyPolicy;
