import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries', 'orders', ya 'products'
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State for Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const navigate = useNavigate();

  // Admin authentication check (Multiple admins allowed)
  const ADMIN_EMAILS = ["sahrabashir228@gmail.com", "greenfarmexport0@gmail.com"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth');
      } else if (!ADMIN_EMAILS.map(e => e.toLowerCase()).includes(user.email?.toLowerCase())) {
        alert('Access Denied! You are not authorized to view the Admin Panel.');
        navigate('/');
      } else {
        setIsAdmin(true);
        fetchAdminData();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Firebase se Inquiries, Orders aur Products fetch karna
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const inqSnapshot = await getDocs(collection(db, 'contacts'));
      setInquiries(inqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const ordSnapshot = await getDocs(collection(db, 'orders'));
      setOrders(ordSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const prodSnapshot = await getDocs(collection(db, 'products'));
      setProducts(prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

  // Delete Order Function
  const handleDeleteOrder = async (id) => {
    if (window.confirm("Kya aap waqai is order ko delete karna chahte hain? Yeh wapas nahi aa sakega!")) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        setOrders(orders.filter(order => order.id !== id));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(null); // Agar modal khula hai aur wohi order delete ho gaya toh modal band kar dein
        }
      } catch (error) {
        console.error("Error deleting order: ", error);
        alert("Order delete karne mein masla pesh aaya.");
      }
    }
  };

  // Status/Season Update for Products
  const handleProductStatusChange = async (id, newSeasonStatus) => {
    try {
      const ref = doc(db, 'products', id);
      await updateDoc(ref, { seasonStatus: newSeasonStatus });
      setProducts(products.map(item => item.id === id ? { ...item, seasonStatus: newSeasonStatus } : item));
    } catch (error) {
      console.error("Error updating product season status: ", error);
    }
  };

  if (!isAdmin) {
    return <div className="text-center py-20 font-bold text-gray-600">Verifying Admin Access...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-green-800">Admin Management Dashboard</h2>
        </div>
        
        {/* Navigation Tabs with Red Number Highlights */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-2.5 rounded-lg font-bold transition ${activeTab === 'inquiries' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Quote Inquiries (<span className="text-red-600">{inquiries.length}</span>)
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-lg font-bold transition ${activeTab === 'orders' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Export Orders (<span className="text-red-600">{orders.length}</span>)
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2.5 rounded-lg font-bold transition ${activeTab === 'products' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Products Season Control (<span className="text-red-600">{products.length}</span>)
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
                            <select 
                              value={item.status || 'Pending'}
                              onChange={(e) => handleInquiryStatusChange(item.id, e.target.value)}
                              className="p-1.5 border rounded-xl text-xs bg-white font-medium shadow-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-gray-400">N/A</span>
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
                      <th className="p-3">Product</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-500">No confirmed orders placed yet.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-bold text-gray-900">{order.name}</div>
                            <div className="text-xs text-gray-500">{order.email}</div>
                          </td>
                          <td className="p-3 font-semibold text-green-800">
                            {order.productName}
                          </td>
                          <td className="p-3 font-semibold text-gray-700">
                            {order.quantity}
                          </td>
                          {/* Status Dropdown inside Status Column */}
                          <td className="p-3">
                            <select 
                              value={order.status || 'Pending'}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                              className={`p-2 border rounded-xl text-xs font-bold shadow-sm ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-300' : 
                                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300'
                              }`}
                            >
                              <option value="Pending" className="bg-white text-gray-800">Pending</option>
                              <option value="Processing" className="bg-white text-gray-800">Processing</option>
                              <option value="Delivered" className="bg-white text-gray-800">Delivered</option>
                            </select>
                          </td>
                          {/* Actions Column: Only View Details & Delete Buttons */}
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3 rounded-xl shadow transition flex items-center gap-1"
                              >
                                👁️ View
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-2.5 rounded-xl shadow transition flex items-center gap-1"
                                title="Delete Order"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: PRODUCTS SEASON STATUS CONTROL */}
            {activeTab === 'products' && (
              <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 text-green-800">Seasonal Availability Control</h3>
                <p className="text-xs text-gray-500 mb-4">Manage whether a product is currently in season or sold out/out of season.</p>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-700 text-white text-sm">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Season Status</th>
                      <th className="p-3">Action / Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-gray-500">No products found in Firestore.</td>
                      </tr>
                    ) : (
                      products.map((prod) => (
                        <tr key={prod.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-bold text-green-900">{prod.name || prod.title}</td>
                          <td className="p-3 text-gray-600">{prod.category || 'Fruit / Vegetable'}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              prod.seasonStatus === 'Out of Season' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {prod.seasonStatus || 'In Season'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select 
                              value={prod.seasonStatus || 'In Season'}
                              onChange={(e) => handleProductStatusChange(prod.id, e.target.value)}
                              className="p-1.5 border rounded text-xs bg-white font-medium"
                            >
                              <option value="In Season">In Season (Available)</option>
                              <option value="Out of Season">Out of Season / Sold Out</option>
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

      {/* ORDER DETAILS POPUP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-green-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">📦 Order Complete Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-white hover:text-gray-200 text-xl font-bold px-2 py-0.5 rounded-lg hover:bg-green-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-gray-500 block text-xs">Buyer Name</span>
                  <strong className="text-gray-800 text-base">{selectedOrder.name}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Email Address</span>
                  <strong className="text-gray-800 truncate block">{selectedOrder.email}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-gray-500 block text-xs">Phone Number / WhatsApp</span>
                  <strong className="text-green-700 text-base">{selectedOrder.phone || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Destination Country</span>
                  <strong className="text-gray-800">{selectedOrder.destination}</strong>
                </div>
              </div>

              <div className="border-b pb-3">
                <span className="text-gray-500 block text-xs">Complete Shipping Address</span>
                <p className="text-gray-900 font-medium bg-gray-50 p-2.5 rounded-xl border mt-1">
                  {selectedOrder.shippingAddress || 'No shipping address provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-gray-500 block text-xs">Product Name</span>
                  <strong className="text-green-800 text-base">{selectedOrder.productName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Quantity</span>
                  <strong className="text-gray-800">{selectedOrder.quantity}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div>
                  <span className="text-gray-500 block text-xs">Grade & Packing</span>
                  <span className="text-gray-700 font-medium">{selectedOrder.grade} | {selectedOrder.packing}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Payment Method</span>
                  <span className="text-gray-700 font-medium">{selectedOrder.paymentMethod}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 text-xs">Order Current Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                  selectedOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedOrder.status || 'Pending'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
              >
                🗑️ Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;