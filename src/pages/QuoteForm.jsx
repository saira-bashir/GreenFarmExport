import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function QuoteForm() {
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
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        quantity: formData.quantity,
        destination: formData.destination,
        message: `Quote Inquiry for ${product.name} (Grade: ${product.grade}, Packing: ${product.packing}). Note: ${formData.message || 'None'}`,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      alert(`Official quote request for ${product.name} submitted successfully!`);
      navigate('/products');
    } catch (error) {
      console.error('Error submitting quote: ', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-600 mb-8 text-sm bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
            Selected Product: <strong className="text-emerald-900">{product.name}</strong> ({product.grade} | {product.packing})
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">Required Quantity *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 100 Boxes / Tons"
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
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition text-center shadow-sm"
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