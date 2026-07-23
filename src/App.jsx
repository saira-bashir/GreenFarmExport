import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import QuoteForm from './pages/QuoteForm';
import OrderForm from './pages/OrderForm';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import MyOrders from './pages/MyOrders'; // MyOrders page import kar liya

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/quote/:id" element={<QuoteForm />} />
            <Route path="/order/:id" element={<OrderForm />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-orders" element={<MyOrders />} /> {/* MyOrders route add kar diya */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;