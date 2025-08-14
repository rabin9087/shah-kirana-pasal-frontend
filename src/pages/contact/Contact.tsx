import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API
const ContactUs = () => {

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Contact Us
      </h2>

      <p className="text-gray-600 text-center mb-6">
        Have questions or need assistance? Reach out to us, and we’ll be happy to help!
      </p>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-center space-x-3">
          <MapPin className="text-blue-600" />
          <span className="text-gray-700">
            Kogarah, NSW 2217, Australia
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-start space-x-3">
          <Phone className="text-green-600 mt-1" />
          <div className="flex flex-col space-y-1">
            {/* <a href="tel:+9779806047265" className="text-gray-700 hover:text-blue-600">
              +977 9806047265
            </a>
            <a href="tel:+9779701844268" className="text-gray-700 hover:text-blue-600">
              +977 9701844268
            </a> */}
            <a href="tel:+61481452920" className="text-gray-700 hover:text-blue-600">
              +61 481 452 920
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3">
          <Mail className="text-red-600" />
          <a
            href="mailto:shahkiranapasal7@gmail.com"
            className="text-gray-700 hover:text-blue-600"
          >
            shahkiranapasal7@gmail.com
          </a>
        </div>

        {/* Website */}
        <div className="flex items-center space-x-3">
          <Globe className="text-purple-600" />
          <a
            href="https://www.shahkiranapasal.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600"
          >
            www.shahkiranapasal.shop
          </a>
        </div>

        <div className="flex flex-col items-center space-x-3">
          <QRCodeGenerator value="https://www.shahkiranapasal.shop" />
        </div>
      </div>

      {/* <GoogleMap/> */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Visit Our Store</h3>
        <p className="text-gray-600">
          We offer a variety of quality products at the best prices. Visit our online store or our physical location for great deals!
        </p>

        <iframe
          className="w-full h-64 mt-4 rounded-lg"
          // src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=Shah Kirana Pasal, HM9M+8JP, School Chaun Bazaar Chowk Bus Stop, Gauradaha Schoolchaun Road, Maharanijhoda 57200, Nepal`}
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=18 Paine St, Kogarah NSW 2217`}
          allowFullScreen
          loading="lazy"
        ></iframe>

      </div>
    </div>
  );
};

export default ContactUs;
