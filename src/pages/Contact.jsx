import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';

function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '',
    message: '' 
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      setSuccessMsg('Your message has been sent successfully! Our export team will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mt-3 mb-2 tracking-tight">
            Contact Our Export Desk
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto text-base">
            Have questions regarding our bulk export services, cold-chain logistics, or pricing? Drop us a message below.
          </p>
        </div>

        {/* Form Container with Gradient Border & Shadow */}
        <div className="bg-white border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl text-center font-medium shadow-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800" 
                  required
                  placeholder="e.g. Johnathan Smith"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800" 
                  required
                  placeholder="name@company.com"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                Subject
              </label>
              <input 
                type="text" 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800" 
                placeholder="e.g. Bulk Mango Order, Port Logistics"
                value={formData.subject} 
                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-sm">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea 
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition text-gray-800 resize-none" 
                rows="5"
                required
                placeholder="Write your trade inquiry or requirements here..."
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white py-4 rounded-xl transition font-bold shadow-lg hover:shadow-emerald-900/30 text-base cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Sending Message...' : 'Send Message 🚀'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Contact;