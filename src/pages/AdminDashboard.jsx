import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' ya 'orders'
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const navigate = useNavigate();

  // Admin authentication check (Case-insensitive fix included)
  const ADMIN_EMAIL = "sahrabashir228@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth');
      } else if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        alert('Access Denied! You are not authorized to view the Admin Panel.');
        navigate('/');
      } else {
        setIsAdmin(true);
        fetchAdminData();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Firebase se Inquiries aur Orders fetch karna
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const inqSnapshot = await getDocs(collection(db, 'contacts'));
      setInquiries(inqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const ordSnapshot = await getDocs(collection(db, 'orders'));
      setOrders(ordSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching admin data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Status Update for Inquiries
  const handleInquiryStatusChange = async (id, newStatus) => {
    try {
      const ref = doc(db, 'contacts', id);
      await updateDoc(ref, { status: newStatus });
      setInquiries(inquiries.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (error) {
      console.error("Error updating inquiry status: ", error);
    }
  };

  // Status Update for Orders
  const handleOrderStatusChange = async (id, newStatus) => {
    try {
      const ref = doc(db, 'orders', id);
      await updateDoc(ref, { status: newStatus });
      setOrders(orders.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  if (!isAdmin) {
    return <div className="text-center py-20 font-bold text-gray-600">Verifying Admin Access...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-green-800">Admin Management Dashboard</h2>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-2.5 rounded-lg font-bold transition ${activeTab === 'inquiries' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Quote Inquiries & Messages ({inquiries.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-lg font-bold transition ${activeTab === 'orders' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Confirmed Export Orders ({orders.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 font-semibold text-gray-600">Loading Admin Data...</div>
        ) : (
          <div>
            {/* TAB 1: QUOTE INQUIRIES & MESSAGES */}
            {activeTab === 'inquiries' && (
              <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 text-green-800">Client Inquiries & Quote Requests</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-700 text-white text-sm">
                      <th className="p-3">Buyer Name & Email</th>
                      <th className="p-3">Subject / Message</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">No inquiries found.</td>
                      </tr>
                    ) : (
                      inquiries.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-bold">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.email}</div>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-semibold text-gray-800">{item.subject}</div>
                            <div className="text-xs text-gray-600 line-clamp-2">{item.message}</div>
                          </td>
                          <td className="p-3">{item.quantity || 'N/A'}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                              item.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {item.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select 
                              value={item.status || 'Pending'}
                              onChange={(e) => handleInquiryStatusChange(item.id, e.target.value)}
                              className="p-1 border rounded text-xs bg-white font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: CONFIRMED ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 text-green-800">Confirmed Export Orders</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-700 text-white text-sm">
                      <th className="p-3">Buyer & Email</th>
                      <th className="p-3">Product Info</th>
                      <th className="p-3">Destination & Payment</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">No confirmed orders placed yet.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-bold">{order.name}</div>
                            <div className="text-xs text-gray-500">{order.email}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-green-800">{order.productName}</div>
                            <div className="text-xs text-gray-500">Grade: {order.grade} | Packing: {order.packing}</div>
                          </td>
                          <td className="p-3">
                            <div>Country: <span className="font-medium">{order.destination}</span></div>
                            <div className="text-xs text-gray-500">Payment: {order.paymentMethod}</div>
                          </td>
                          <td className="p-3 font-semibold">{order.quantity}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select 
                              value={order.status || 'Pending'}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className="p-1 border rounded text-xs bg-white font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;