import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-b from-emerald-950 to-emerald-950 text-white pt-16 pb-8 border-t border-emerald-800/80 relative overflow-hidden">
      
      {/* Top Decorative Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        
        {/* Column 1: Brand About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-600 shadow-md">
              <img src="/logo.png" alt="Green Farm Logo" className="h-9 w-9 object-cover rounded-lg bg-emerald-900" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-amber-300 bg-clip-text text-transparent">
              Green Farm <span className="text-amber-400">Export</span>
            </h3>
          </div>
          <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm">
            {t('footerAbout', 'Providing the best quality farm-fresh fruits and vegetables to the world with premium export box packing and cold-chain logistics.')}
          </p>
          
          {/* Social Media Links with Official Icons & Real URLs */}
          <div className="pt-2">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Connect With Us</p>
            <div className="flex items-center gap-3">
              {/* Facebook Link */}
              <a 
                href="https://facebook.com/your-facebook-page" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-white hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-400 transition duration-300 shadow-md"
                title="Facebook"
              >
                <FaFacebookF size={18} />
              </a>
              {/* TikTok Link */}
              <a 
                href="https://tiktok.com/@your-tiktok-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-white hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-400 transition duration-300 shadow-md"
                title="TikTok"
              >
                <FaTiktok size={18} />
              </a>
              {/* WhatsApp Link */}
              <a 
                href="https://wa.me/923028882499?text=Hello,%20I%20want%20to%20inquire%20about%20export%20products." 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition duration-300 shadow-md"
                title="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-amber-300 tracking-wide border-b border-emerald-800/60 pb-2 inline-block">
            {t('footerQuickLinks', 'Quick Links')}
          </h3>
          <ul className="text-emerald-100/80 space-y-2.5 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-amber-400 transition flex items-center gap-2">
                <span className="text-amber-400">›</span> {t('home', 'Home')}
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-amber-400 transition flex items-center gap-2">
                <span className="text-amber-400">›</span> {t('products', 'Products Catalog')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-amber-400 transition flex items-center gap-2">
                <span className="text-amber-400">›</span> About Company
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-2">
                <span className="text-amber-400">›</span> {t('contact', 'Contact Us')}
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-amber-400 transition flex items-center gap-2">
                <span className="text-amber-400">›</span> My Orders & Quotes
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Sourcing Hub Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4 text-amber-300 tracking-wide border-b border-emerald-800/60 pb-2 inline-block">
            {t('footerContact', 'Head Office & Sourcing')}
          </h3>
          <p className="text-emerald-100/80 text-sm flex items-center gap-2.5">
            <FaEnvelope className="text-amber-400 shrink-0" /> Email: <strong className="text-white">info@greenfarmexport.com</strong>
          </p>
          <p className="text-emerald-100/80 text-sm flex items-center gap-2.5">
            <FaPhone className="text-amber-400 shrink-0" /> Phone 1: <strong className="text-white">+92 302-8882499</strong> (Ahmad Ch)
          </p>
          <p className="text-emerald-100/80 text-sm flex items-center gap-2.5">
            <FaPhone className="text-amber-400 shrink-0" /> Phone 2: <strong className="text-white">+92 302-3586354</strong> (Umer Akbar)
          </p>
          <p className="text-emerald-100/80 text-sm pt-2 leading-relaxed flex items-start gap-2.5">
            <FaMapMarkerAlt className="text-amber-400 shrink-0 mt-1" />
            <span>
              <strong>Shop No 8-A Vegetable Market ARIFWALA</strong> <br />
              New International Vegetable Market, Shop No 63-64, Trikhni Bay pass ARIFWALA.
            </span>
          </p>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="container mx-auto px-6 text-center border-t border-emerald-900 pt-6 text-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-amber-300/90 font-medium">&copy; 2026 Green Farm Export. {t('footerRights', 'All rights reserved.')}</p>
        <p className="text-amber-400 font-bold tracking-wide">Global Agricultural Export & Mandi Hub Operations</p>
      </div>

    </footer>
  );
}

export default Footer;