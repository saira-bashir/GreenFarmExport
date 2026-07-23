import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const productsData = {
    1: { name: "Premium Mango", grade: "A-Grade", packing: "5kg Box", img: "/Mango.png" },
    2: { name: "Juicy Malta", grade: "A-Grade", packing: "10kg Box", img: "/orange.png" },
    3: { name: "Fresh Cherry", grade: "Premium", packing: "2kg Box", img: "/cherry.jpg" },
    4: { name: "Export Potato", grade: "Class-1", packing: "20kg Bag", img: "/potatoo.png" }
  };

  const product = productsData[Number(id)];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quantity: '',
    destination: '',
    shippingAddress: '',
    paymentMethod: 'Bank Transfer (T.T)'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        name: formData.name,
        email: formData.email,
        quantity: formData.quantity,
        destination: formData.destination,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        productName: product.name,
        grade: product.grade,
        packing: product.packing,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      alert(`Direct Order for ${product.name} placed successfully!`);
      navigate('/products');
    } catch (error) {
      console.error('Error placing order: ', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="text-center py-24 bg-white border border-emerald-100 rounded-3xl shadow-md max-w-xl mx-auto my-16 p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-3">Product not found!</h2>
        <p className="text-gray-500 mb-6">The requested product could not be found for order placement.</p>
        <Link to="/products" className="inline-block bg-gradient-to-r from-emerald-700 to-emerald-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        
        {/* Container Box */}
        <div className="bg-white border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-2 tracking-tight">Complete Direct Order</h2>
          <p className="text-gray-600 mb-8 text-sm bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            Selected Product: <strong className="text-emerald-900">{product.name}</strong> ({product.grade} | {product.packing})
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">{t('yourName', 'Your Name / Company Name')} *</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  placeholder="e.g. John Traders"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Order Quantity *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 50 Tons / Boxes"
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Destination Country *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Canada, Germany"
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Complete Port / Shipping Address *</label>
              <textarea 
                rows="2"
                required
                placeholder="Enter full port or warehouse delivery address..."
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 resize-none"
                value={formData.shippingAddress}
                onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">Preferred Payment Term *</label>
              <select 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 cursor-pointer"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              >
                <option value="Bank Transfer (T.T)">Direct Bank Transfer / T.T</option>
                <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                <option value="Advance Payment">Advance Payment</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <Link 
                to={`/product/${id}`} 
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition text-center shadow-sm"
              >
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-emerald-900/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Confirm & Place Order 🚀'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default OrderForm;