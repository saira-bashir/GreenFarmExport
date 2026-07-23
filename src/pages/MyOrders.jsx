import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function MyOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'quotes'

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Orders
        const ordersQuery = query(
          collection(db, 'orders'), 
          where('email', '==', currentUser.email)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const userOrders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(userOrders);

        // 2. Fetch Quotes (from contacts collection where email matches)
        const quotesQuery = query(
          collection(db, 'contacts'), 
          where('email', '==', currentUser.email)
        );
        const quotesSnapshot = await getDocs(quotesQuery);
        const userQuotes = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuotes(userQuotes);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <p className="text-lg font-semibold text-emerald-800 animate-pulse">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-emerald-200">
            Client Portal
          </span>
          <h2 className="text-4xl font-extrabold text-emerald-950 mt-3 mb-2 tracking-tight">
            {t('myOrdersTitle', 'My Orders & Quotes History')}
          </h2>
          <p className="text-gray-600 text-sm">
            Track all your active direct orders and official price quotation requests in one place.
          </p>
        </div>

        {/* Tabs Switcher */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'orders' ? 'bg-emerald-800 text-white shadow-emerald-900/20' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            📦 Direct Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'quotes' ? 'bg-amber-600 text-white shadow-amber-600/20' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            📋 Quote Requests ({quotes.length})
          </button>
        </div>

        {/* ORDERS TAB CONTENT */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl shadow-sm text-center border border-emerald-100">
                <p className="text-gray-500 text-base mb-4">You have not placed any direct orders yet.</p>
                <a href="/products" className="inline-block bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                  Explore Products
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-md hover:shadow-lg transition relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-800"></div>
                    
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                      <span className="text-xs font-semibold text-gray-400">Order ID: <strong className="text-gray-700">{order.id}</strong></span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full border border-emerald-200">
                        {order.status || 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-1.5">
                        <p><strong>Product Name:</strong> <span className="text-emerald-900 font-semibold">{order.productName || 'Export Item'}</span></p>
                        <p><strong>Quantity:</strong> {order.quantity || 'Bulk Order'}</p>
                        <p><strong>Destination:</strong> {order.destination || 'N/A'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p><strong>Shipping Address:</strong> {order.shippingAddress || 'N/A'}</p>
                        <p><strong>Payment Term:</strong> {order.paymentMethod || 'T.T'}</p>
                        <p><strong>Date:</strong> {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUOTES TAB CONTENT */}
        {activeTab === 'quotes' && (
          <div>
            {quotes.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl shadow-sm text-center border border-emerald-100">
                <p className="text-gray-500 text-base mb-4">You have not submitted any quote requests yet.</p>
                <a href="/products" className="inline-block bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                  Request a Quote
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white border border-amber-100 p-6 rounded-3xl shadow-md hover:shadow-lg transition relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                    
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                      <span className="text-xs font-semibold text-gray-400">Reference ID: <strong className="text-gray-700">{quote.id}</strong></span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-200">
                        {quote.status || 'Pending Review'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Subject / Inquiry:</strong> <span className="text-amber-900 font-medium">{quote.subject || 'Quote Request'}</span></p>
                      <p><strong>Details / Message:</strong> {quote.message}</p>
                      <p className="text-xs text-gray-400 pt-2 border-t">
                        Submitted on: {quote.createdAt?.seconds ? new Date(quote.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;