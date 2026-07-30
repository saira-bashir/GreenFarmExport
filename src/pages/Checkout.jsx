import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedPackingParam = queryParams.get('packing') || '';

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+92',
    phone: '',
    quantity: '1',
    destination: '',
    shippingAddress: '',
    packing: '',
    paymentGateway: 'PayPal Secure Checkout'
  });

  const countryCodes = [
    { name: "Pakistan", code: "+92", flag: "🇵🇰" },
    { name: "United States", code: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
    { name: "Germany", code: "+49", flag: "🇩🇪" }
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
        }
      } catch (error) {
        console.error("Error loading product for checkout:", error);
      } finally {
        setLoadingProduct(false);
      }
    };
    if (id) fetchProduct();
  }, [id, selectedPackingParam]);

  const handleCompleteCheckout = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      // 1. Save Order to Firebase Database
      await addDoc(collection(db, 'orders'), {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        quantity: `${formData.quantity} ${formData.packing}`,
        destination: formData.destination,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentGateway,
        productName: product.name,
        grade: product.grade || 'Standard',
        status: 'Pending Payment',
        createdAt: serverTimestamp()
      });

      // 2. Direct Gateway Redirection
      const selectedMethod = formData.paymentGateway.toLowerCase();

      if (selectedMethod.includes('stripe') || selectedMethod.includes('card')) {
        window.location.href = "https://checkout.stripe.com";
      } else if (selectedMethod.includes('paypal')) {
        window.location.href = "https://www.paypal.com/checkoutnow";
      } else if (selectedMethod.includes('payfast') || selectedMethod.includes('local') || selectedMethod.includes('jazzcash') || selectedMethod.includes('easypaisa')) {
        window.location.href = "https://www.gopayfast.com/";
      } else {
        navigate('/products');
      }

    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return <div className="text-center py-20 font-semibold text-emerald-800">Loading Secure Checkout...</div>;
  }

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white border border-emerald-100 p-8 rounded-3xl shadow-xl">
        
        <h2 className="text-3xl font-extrabold text-emerald-950 mb-2 text-center">Secure Express Checkout</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Complete your export order details and choose your preferred payment processor.</p>

        <form onSubmit={handleCompleteCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Customer & Shipping Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-900 border-b pb-2">1. Shipping & Contact Info</h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name / Company *</label>
              <input type="text" required className="w-full p-3 bg-gray-50 border rounded-xl text-sm" placeholder="John Traders"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
              <input type="email" required className="w-full p-3 bg-gray-50 border rounded-xl text-sm" placeholder="name@company.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
              <div className="flex gap-2">
                <select className="w-24 p-3 bg-gray-50 border rounded-xl text-xs" value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})}>
                  {countryCodes.map((c, i) => <option key={i} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
                <input type="tel" required className="flex-1 p-3 bg-gray-50 border rounded-xl text-sm" placeholder="300 1234567"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Destination Country & Address *</label>
              <input type="text" required className="w-full p-3 bg-gray-50 border rounded-xl text-sm mb-2" placeholder="Country (e.g. UK, UAE)"
                value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
              <textarea rows="2" required className="w-full p-3 bg-gray-50 border rounded-xl text-sm resize-none" placeholder="Port or warehouse delivery address..."
                value={formData.shippingAddress} onChange={e => setFormData({...formData, shippingAddress: e.target.value})} />
            </div>
          </div>

          {/* Right Column: Order Summary & Payment Method Selection */}
          <div className="space-y-6 flex flex-col justify-between bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100">
            <div>
              <h3 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-4">2. Order & Payment Summary</h3>
              
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm mb-4 space-y-2 text-sm">
                <p className="flex justify-between"><span className="text-gray-500">Product:</span> <strong className="text-emerald-950">{product.name}</strong></p>
                <p className="flex justify-between"><span className="text-gray-500">Grade:</span> <strong className="text-emerald-950">{product.grade}</strong></p>
                <p className="flex justify-between"><span className="text-gray-500">Packing:</span> <strong className="text-emerald-950">{formData.packing}</strong></p>
                <p className="flex justify-between border-t pt-2"><span className="text-gray-500">Quantity:</span> <strong className="text-emerald-800">{formData.quantity} Unit(s)</strong></p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">Preferred Payment Method & Gateway *</label>
                
                <select
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 cursor-pointer font-medium text-sm"
                  value={formData.paymentGateway}
                  onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
                >
                  <optgroup label="🌐 International Secure Gateways">
                    <option value="Stripe (Visa/Mastercard)">💳 International Card (Stripe - Visa / Mastercard)</option>
                    <option value="PayPal Secure Checkout">🅿️ PayPal Secure Checkout</option>
                  </optgroup>
                  <optgroup label="🇵🇰 Local Pakistani Gateways">
                    <option value="PayFast / JazzCash / EasyPaisa">🇵🇰 Local Bank / PayFast (JazzCash / EasyPaisa / Cards)</option>
                    <option value="Direct Bank Transfer (T.T)">🏦 Direct Bank Transfer / T.T</option>
                    <option value="Cash on Delivery">📦 Cash on Delivery / Warehouse Pickup</option>
                  </optgroup>
                </select>

                {/* Supported Payment Processors Badges */}
                <div className="pt-2">
                  <p className="text-[11px] text-gray-500 mb-1 font-medium text-center">Supported Payment Processors:</p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] font-bold text-blue-700">Stripe</span>
                    <span className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] font-bold text-blue-500">PayPal</span>
                    <span className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] font-bold text-red-600">PayFast</span>
                    <span className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] font-bold text-blue-800">VISA / Master</span>
                    <span className="px-2 py-0.5 bg-gray-50 border rounded text-[10px] font-bold text-emerald-800">JazzCash / EasyPaisa</span>
                  </div>
                </div>

              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold py-4 rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 text-center">
              {loading ? 'Processing...' : 'Proceed to Secure Payment 🔒'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Checkout;