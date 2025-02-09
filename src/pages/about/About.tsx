const About = () => {
    return (
        <section className="bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                {/* Heading */}
                <h2 className="text-4xl font-bold text-gray-900">About Us</h2>
                <p className="text-gray-600 mt-4 text-lg">
                    Welcome to Shah Kirana Pasal, your trusted partner for high-quality groceries and essentials.
                </p>

                {/* Our Mission Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        At Shah Kirana Pasal, our mission is to provide affordable, fresh, and high-quality grocery items to families
                        and businesses in our community. We strive to deliver excellence in customer service while ensuring a smooth
                        shopping experience both in-store and online.
                    </p>
                </div>

                {/* Our Vision Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-800">Our Vision</h3>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        We aim to become the leading grocery store in our region, known for our commitment to sustainability,
                        community engagement, and exceptional product offerings. Our goal is to be the first choice for all your grocery
                        needs, both locally and online.
                    </p>
                </div>

                {/* Our Team Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-800">Meet Our Team</h3>
                    <div className="mt-8 flex flex-wrap justify-center gap-8">
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                            <img src="/team/member1.jpg" alt="Team Member 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                            <img src="/team/member2.jpg" alt="Team Member 2" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                            <img src="/team/member3.jpg" alt="Team Member 3" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-800">Our Core Values</h3>
                    <ul className="mt-4 text-left max-w-2xl mx-auto space-y-3">
                        <li className="text-gray-600">
                            <strong>Customer Satisfaction:</strong> We are committed to exceeding customer expectations with every interaction.
                        </li>
                        <li className="text-gray-600">
                            <strong>Integrity:</strong> We operate with transparency, honesty, and the highest ethical standards.
                        </li>
                        <li className="text-gray-600">
                            <strong>Sustainability:</strong> We strive to reduce our environmental impact through sustainable practices.
                        </li>
                        <li className="text-gray-600">
                            <strong>Community:</strong> We believe in giving back to the community that has supported us for years.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;
