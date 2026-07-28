import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function QuoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedPackingParam = queryParams.get('packing') || '';

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+92',
    phone: '',
    quantity: '1', // Default 1 selected
    destination: '',
    packing: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // Complete World Country Calling Codes list with Flags
  const countryCodes = [
    { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
    { name: "Albania", code: "+355", flag: "🇦🇱" },
    { name: "Algeria", code: "+213", flag: "🇩🇿" },
    { name: "Argentina", code: "+54", flag: "🇦🇷" },
    { name: "Australia", code: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "+43", flag: "🇦🇹" },
    { name: "Bahrain", code: "+973", flag: "🇧🇭" },
    { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
    { name: "Belgium", code: "+32", flag: "🇧🇪" },
    { name: "Brazil", code: "+55", flag: "🇧🇷" },
    { name: "Canada", code: "+1", flag: "🇨🇦" },
    { name: "China", code: "+86", flag: "🇨🇳" },
    { name: "Denmark", code: "+45", flag: "🇩🇰" },
    { name: "Egypt", code: "+20", flag: "🇪🇬" },
    { name: "France", code: "+33", flag: "🇫🇷" },
    { name: "Germany", code: "+49", flag: "🇩🇪" },
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "Indonesia", code: "+62", flag: "🇮🇩" },
    { name: "Iran", code: "+98", flag: "🇮🇷" },
    { name: "Iraq", code: "+964", flag: "🇮🇶" },
    { name: "Ireland", code: "+353", flag: "🇮🇪" },
    { name: "Italy", code: "+39", flag: "🇮🇹" },
    { name: "Japan", code: "+81", flag: "🇯🇵" },
    { name: "Jordan", code: "+962", flag: "🇯🇴" },
    { name: "Kuwait", code: "+965", flag: "🇰🇼" },
    { name: "Malaysia", code: "+60", flag: "🇲🇾" },
    { name: "Netherlands", code: "+31", flag: "🇳🇱" },
    { name: "New Zealand", code: "+64", flag: "🇳🇿" },
    { name: "Norway", code: "+47", flag: "🇳🇴" },
    { name: "Oman", code: "+968", flag: "🇴🇲" },
    { name: "Pakistan", code: "+92", flag: "🇵🇰" },
    { name: "Philippines", code: "+63", flag: "🇵🇭" },
    { name: "Poland", code: "+48", flag: "🇵🇱" },
    { name: "Portugal", code: "+351", flag: "🇵🇹" },
    { name: "Qatar", code: "+974", flag: "🇶🇦" },
    { name: "Russia", code: "+7", flag: "🇷🇺" },
    { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "South Africa", code: "+27", flag: "🇿🇦" },
    { name: "South Korea", code: "+82", flag: "🇰🇷" },
    { name: "Spain", code: "+34", flag: "🇪🇸" },
    { name: "Sweden", code: "+46", flag: "🇸🇪" },
    { name: "Switzerland", code: "+41", flag: "🇨🇭" },
    { name: "Syria", code: "+963", flag: "🇸🇾" },
    { name: "Thailand", code: "+66", flag: "🇹🇭" },
    { name: "Turkey", code: "+90", flag: "🇹🇷" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "Yemen", code: "+967", flag: "🇾🇪" }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() };
          setProduct(prodData);

          setFormData(prev => ({
            ...prev,
            packing: selectedPackingParam || prodData.packing || 'Export Standard Box'
          }));
        } else {
          console.error("Product not found in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching product for quote:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, selectedPackingParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    const fullPhoneNumber = `${formData.countryCode} ${formData.phone}`;
    const formattedQuantity = `${formData.quantity} ${formData.packing}${formData.quantity > 1 ? 's' : ''}`;

    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        phone: fullPhoneNumber,
        quantity: formattedQuantity,
        destination: formData.destination,
        message: `Quote Inquiry for ${product.name} (Grade: ${product.grade || 'Standard'}, Packing: ${formData.packing}). Quantity: ${formattedQuantity}. Phone: ${fullPhoneNumber}. Note: ${formData.message || 'None'}`,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      alert(`Official quote request for ${product.name} (${formData.packing}) submitted successfully!`);
      navigate('/products');
    } catch (error) {
      console.error('Error submitting quote: ', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <p className="text-lg font-semibold text-emerald-800 animate-pulse">Loading quote form...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 bg-white border border-emerald-100 rounded-3xl shadow-md max-w-xl mx-auto my-16 p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-3">Product not found!</h2>
        <p className="text-gray-500 mb-6">The requested product could not be found for quote submission.</p>
        <Link to="/products" className="inline-block bg-gradient-to-r from-emerald-700 to-emerald-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        
        {/* Form Box Container */}
        <div className="bg-white border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-2 tracking-tight">Request Official Quote</h2>
          <p className="text-gray-600 mb-8 text-sm bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex flex-col gap-1">
            <span>Selected Product: <strong className="text-emerald-900">{product.name}</strong> ({product.grade || 'Standard'})</span>
            <span>Selected Packing: <strong className="text-emerald-800">{formData.packing}</strong></span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">{t('yourName', 'Your Name')} *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">{t('emailLabel', 'Email Address')} *</label>
                <input 
                  type="email" 
                  required 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Phone Number with Flag Dropdown & Responsive Width */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Phone Number *</label>
              <div className="flex gap-2">
                <select
                  className="w-28 sm:w-32 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 cursor-pointer font-medium text-xs sm:text-sm font-sans"
                  value={formData.countryCode}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                >
                  {countryCodes.map((c, index) => (
                    <option key={index} value={c.code} style={{ fontFamily: 'sans-serif' }}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                
                <input
                  type="tel"
                  required
                  className="flex-1 min-w-0 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 text-sm"
                  placeholder="300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Quantity Dropdown (1 to 100 with Dynamic Packing Unit) */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Required Quantity ({formData.packing || 'Units'}) *
                </label>
                <select
                  required
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 cursor-pointer"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                >
                  {[...Array(100)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {formData.packing ? `${formData.packing}${i > 0 ? 's' : ''}` : (i === 0 ? 'Unit' : 'Units')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Destination Country *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. UAE, UK, Germany"
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Additional Specifications / Message (Optional)</label>
              <textarea 
                rows="3"
                placeholder="Any specific delivery timeline or packaging notes..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Link 
                to={`/product/${id}`} 
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition text-center shadow-sm flex items-center justify-center"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting Quote...' : 'Submit Quote Request 📋'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default QuoteForm;