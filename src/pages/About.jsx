import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
            Global Trade Excellence
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mt-3 mb-4">
            About Green Farm Export
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Bridging the gap between fertile orchards and international markets with certified, farm-fresh quality produce.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-emerald-100 relative overflow-hidden group hover:shadow-xl transition">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-4">Who We Are</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Green Farm Export is a premier agricultural export enterprise dedicated to supplying premium-grade fruits and vegetables worldwide. We work directly with expert local farmers, ensuring strict quality control from harvest to global delivery.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our advanced cold-chain logistics and eco-friendly export packaging guarantee that every shipment retains its natural freshness, nutritional value, and farm-harvested taste.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4 hover:-translate-y-1 transition">
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl text-xl font-bold">🌍</div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">Global Reach</h4>
                <p className="text-gray-500 text-sm mt-1">Delivering bulk shipments seamlessly across international trade corridors with reliable transit times.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4 hover:-translate-y-1 transition">
              <div className="bg-amber-100 text-amber-700 p-3 rounded-xl text-xl font-bold">⭐</div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">Certified Standards</h4>
                <p className="text-gray-500 text-sm mt-1">Fully compliant with international food safety and quality benchmarks including ISO 9001, HACCP, and GLOBAL G.A.P.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-start gap-4 hover:-translate-y-1 transition">
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-xl text-xl font-bold">🌱</div>
              <div>
                <h4 className="text-lg font-bold text-emerald-950">100% Farm Fresh</h4>
                <p className="text-gray-500 text-sm mt-1">Handpicked produce sorted meticulously through rigorous grading processes for global buyers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-10 rounded-3xl shadow-xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          <h3 className="text-3xl font-bold mb-3 relative z-10">Ready to Place a Bulk Order?</h3>
          <p className="text-emerald-200 mb-8 max-w-xl mx-auto relative z-10">
            Partner with us for reliable, seasonal, and year-round agricultural supply contracts tailored to your business needs.
          </p>
          <div className="flex justify-center gap-4 relative z-10">
            <Link to="/products" className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-8 py-3 rounded-xl shadow-lg transition">
              Explore Products
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-emerald-950 text-white font-semibold px-8 py-3 rounded-xl transition">
              Contact Sales
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default About;