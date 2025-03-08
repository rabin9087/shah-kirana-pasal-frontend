import { Mail, Phone, MapPin, Globe } from "lucide-react";

const ContactUs = () => {

  const googleAPI = import.meta.env.GOOGLE_API
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
            Schoolchaun, Gauradaha-5, Jhapa, Nepal
          </span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3">
          <Phone className="text-green-600" />
          <a href="tel:+9779806047265" className="text-gray-700 hover:text-blue-600">
            +977 9806047265
          </a>
          <span>/</span>
          <a href="tel:+9779701844268" className="text-gray-700 hover:text-blue-600">
            +977 9701844268
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3">
          <Mail className="text-red-600" />
          <a
            href="mailto:rabin9087@gmail.com"
            className="text-gray-700 hover:text-blue-600"
          >
            rabin9087@gmail.com
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
      </div>

      {/* Map or Additional Info */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Visit Our Store</h3>
        <p className="text-gray-600">
          We offer a variety of quality products at the best prices. Visit our online store or our physical location for great deals!
        </p>
        <iframe
          className="w-full h-64 mt-4 rounded-lg"
          src={`https://www.google.com/maps/embed/v1/place?key=${googleAPI}&q=26.568254015988057,87.68418811261654`}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
