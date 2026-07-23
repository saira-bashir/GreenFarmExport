import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DynamicReviews from '../components/DynamicReviews';
import FAQs from '../components/FAQs';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background Video */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Video Settings */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 scale-105 animate-pulse duration-1000"
        >
          <source src="/Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-black/70 to-emerald-950/90 z-10"></div>
        
        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md mb-4 inline-block shadow-lg">
            {t('welcome', 'Welcome to Green Farm Export')}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-md">
            {t('heroTitle', 'Premium Quality Export')}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-emerald-100 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtitle', 'Farm-Fresh Fruits & Vegetables - Delivered Globally with Advanced Cold-Chain Logistics')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30 text-base">
              {t('viewProducts', 'View Products')} 🚀
            </Link>
            
            <Link to="/contact" className="bg-emerald-900/40 backdrop-blur-md border-2 border-emerald-400/60 hover:bg-emerald-800 hover:border-emerald-400 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg text-base">
              {t('contactUs', 'Contact Us')} 📞
            </Link>
          </div>
        </div>
      </section>
      
      {/* Certified Quality Standards (Enhanced Badges Section) */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50/40 text-center border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4">
          <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Global Compliance
          </span>
          <h3 className="text-3xl font-extrabold mb-3 text-emerald-950 mt-3">
            {t('certifiedStandards', 'Certified Quality Standards')}
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-10">
            Our packing facilities and supply chains meet rigorous international food safety and quality benchmarks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* ISO 9001 Card */}
            <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700"></div>
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="text-xl font-bold text-emerald-950 mb-1 group-hover:text-emerald-700 transition">ISO 9001</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Certified Quality Management Systems ensuring consistent export excellence.</p>
            </div>

            {/* HACCP Card */}
            <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              <div className="text-3xl mb-3">✅</div>
              <h4 className="text-xl font-bold text-emerald-950 mb-1 group-hover:text-amber-600 transition">HACCP</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Hazard Analysis Critical Control Point compliant for ultimate food safety.</p>
            </div>

            {/* GLOBAL G.A.P Card */}
            <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-amber-500"></div>
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="text-xl font-bold text-emerald-950 mb-1 group-hover:text-emerald-700 transition">GLOBAL G.A.P</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Good Agricultural Practices certified from farm to international ports.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Local Sourcing & Commission Hub Section (New Card for pic.png) */}
      <section className="py-16 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white border border-emerald-100 p-6 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group">
            
            {/* Top Gradient Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-amber-200">
                Direct Supply Network
              </span>
              <h3 className="text-3xl font-extrabold text-emerald-950 mt-3 mb-2">
                Our Sourcing & Mandi Hub Operations
              </h3>
              <p className="text-gray-600 text-sm">
                Connecting local agricultural wholesale markets directly with international trade corridors.
              </p>
            </div>

            {/* Image Preview Container */}
            <div className="overflow-hidden rounded-2xl border border-emerald-100 shadow-md bg-gray-50 p-2">
              <img 
                src="/pic.png" 
                alt="Green Farm Sourcing & Logistics Hub" 
                className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.02] transition duration-500" 
              />
            </div>

            <div className="mt-6 text-center text-xs text-gray-400 font-medium">
              Verified Wholesale Commission & Purchasing Hub | Arifwala Operations
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Reviews Section */}
      <DynamicReviews />

      {/* FAQs Section */}
      <FAQs />
    </div>
  );
}

export default Home;