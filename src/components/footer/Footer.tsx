import { storeName, storeSlogan } from "@/axios";
import logo from "/assets/shahKiranaPasal.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Store Info */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/">
            <img
              src={logo}
              alt={`${storeName} Logo`}
              className="w-20 h-20 rounded-full shadow-lg"
            />
          </Link>
          <h2 className="text-2xl font-bold mt-3">{storeName}</h2>
          <p className="text-gray-200 mt-1 text-center md:text-left max-w-sm">
            {storeSlogan}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Policies & Info</h3>
          <ul className="space-y-2 text-gray-200">
            <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/refund" className="hover:text-white">Refund Policy</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping Information</Link></li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-xl font-semibold mb-3">We Accept</h3>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              className="w-12 h-8 bg-white rounded p-1 shadow"
            />
            <img
              src="https://mma.prnewswire.com/media/1224081/Afterpay_Mint_Logo.jpg?p=facebook"
              alt="Afterpay"
              className="w-12 h-8 bg-white rounded p-1 shadow"
            />
            <img
              src="https://zip.co/nz/wp-content/uploads/2021/08/Badge_300-x-135_Reverse.svg"
              alt="Zip Pay"
              className="w-12 h-8 bg-white rounded p-1 shadow"
            />
            <img
              src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
              alt="Googlepay"
              className="w-12 h-8 bg-white rounded p-1 shadow"
            />
            <img
              src="https://developer.apple.com/news/images/og/apple-pay-og.jpg"
              alt="Zip Pay"
              className="w-12 h-8 bg-white rounded p-1 shadow"
            />
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="https://www.facebook.com/profile.php?id=100075818236496" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png" alt="Facebook" className="w-8 h-8 hover:scale-110 transition" />
            </a>
            <a href="https://www.tiktok.com/@shah.kirana.pasal" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/303260/tiktok-logo-logo.svg" alt="TikTok" className="w-8 h-8 hover:scale-110 transition" />
            </a>
            <a href="https://www.instagram.com/rabinshah9087" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Instagram" className="w-8 h-8 hover:scale-110 transition" />
            </a>
            <a href="https://wa.me/+61481452920" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/382712/whatsapp-whats-app.svg" alt="WhatsApp" className="w-8 h-8 hover:scale-110 transition" />
            </a>
            <a href="https://www.linkedin.com/in/rabin-shah/" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" alt="LinkedIn" className="w-8 h-8 hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 text-center text-gray-300 text-sm border-t border-gray-500 pt-4">
        © {new Date().getFullYear()} {storeName}. All rights reserved. |{" "}
        <Link to="/terms" className="hover:text-white">Terms</Link> |{" "}
        <Link to="/privacy" className="hover:text-white">Privacy</Link>
      </div>
    </footer>
  );
};

export default Footer;
