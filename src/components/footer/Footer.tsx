const Footer = () => {
  return (
    <footer className="bg-[#0D66E4] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* Store Logo & Info */}
        <div className="flex flex-col items-center md:items-start">
          <img src="/public/assets/shahKiranaPasal.png" alt="Shah Kirana Pasal Logo" className="w-24 h-24 rounded-full" />
          <h2 className="text-2xl font-bold mt-2">Shah Kirana Pasal</h2>
          <p className="text-gray-200 mt-1 text-center md:text-left">
            Your one-stop shop for groceries and essentials.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="text-gray-200 hover:text-white">Home</a></li>
            <li><a href="/" className="text-gray-200 hover:text-white">Products</a></li>
            <li><a href="/about" className="text-gray-200 hover:text-white">About Us</a></li>
            <li><a href="/contact" className="text-gray-200 hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex justify-center md:justify-start mt-3 space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100075818236496" target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000" alt="Facebook" className="w-8 h-8 hover:opacity-80" />
            </a>
            <a href="https://www.tiktok.com/@rabinshah1998" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/303260/tiktok-logo-logo.svg" alt="TikTok" className="w-8 h-8 hover:opacity-80" />
            </a>
            <a href="https://www.instagram.com/rabinshah9087" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/452229/instagram-1.svg" alt="Instagram" className="w-8 h-8 hover:opacity-80" />
            </a>
            <a href="https://wa.me/+61481452920" target="_blank" rel="noopener noreferrer">
              <img src="https://www.svgrepo.com/show/382712/whatsapp-whats-app.svg" alt="WhatsApp" className="w-8 h-8 hover:opacity-80" />
            </a>
            {/* <a href="https://www.google.com/search?q=Shah+Kirana+Pasal" target="_blank" rel="noopener noreferrer">
              <img src="/icons/google.svg" alt="Google" className="w-8 h-8 hover:opacity-80" />
            </a> */}
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} Shah Kirana Pasal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
