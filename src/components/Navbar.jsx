import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Admin email check
  const ADMIN_EMAIL = "sahrabashir228@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Account';
    if (user.displayName) return user.displayName;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-4 py-3 text-white shadow-2xl sticky top-0 z-50 border-b border-emerald-800/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 shadow-lg group-hover:scale-105 transition duration-300">
            <img 
              src="/logo.png" 
              alt="Green Farm Export Logo" 
              className="h-10 w-10 object-cover rounded-xl bg-emerald-900" 
            />
          </div>
          <span className="text-xl font-extrabold tracking-wide hidden sm:inline-block bg-gradient-to-r from-white via-emerald-100 to-amber-300 bg-clip-text text-transparent">
            Green Farm <span className="text-amber-400">Export</span>
          </span>
        </Link>
        
        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-6 hidden md:block max-w-md">
          <div className="relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search', 'Search export products (e.g., Potato, Mango)...')} 
              className="w-full px-4 py-2.5 pl-11 rounded-2xl text-gray-900 bg-emerald-50/90 border border-emerald-600/50 focus:outline-none focus:ring-4 focus:ring-amber-400/30 focus:bg-white text-sm shadow-inner transition duration-300"
            />
            <span className="absolute left-3.5 top-3 text-emerald-700">🔍</span>
          </div>
        </form>

        {/* Desktop Navigation & Controls */}
        <div className="hidden lg:flex items-center gap-3 font-medium text-sm">
          <Link to="/" className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}>
            {t('home', 'Home')}
          </Link>
          <Link to="/products" className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/products') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}>
            {t('products', 'Products')}
          </Link>
          <Link to="/about" className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/about') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}>
            About
          </Link>
          <Link to="/contact" className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/contact') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}>
            {t('contact', 'Contact')}
          </Link>
          <Link to="/my-orders" className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/my-orders') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}>
            My Orders
          </Link>
        </div>

        {/* Right Controls (Account & Mobile Toggle) */}
        <div className="flex items-center gap-2">
          
          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 px-3 py-1.5 rounded-2xl transition duration-300 shadow-md border border-emerald-600/70 focus:outline-none group text-xs sm:text-sm"
            >
              <span className="text-amber-400 group-hover:scale-110 transition">👤</span>
              <span className="hidden sm:inline max-w-[90px] truncate capitalize font-semibold tracking-wide text-emerald-100">
                {getUserDisplayName()}
              </span>
              <span className="text-[10px] text-amber-400">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-emerald-50/50 text-xs text-gray-500 truncate">
                      Signed in as <br />
                      <strong className="text-emerald-900 font-semibold">{user.email}</strong>
                    </div>

                    {/* Admin Dashboard Link only for Admin */}
                    {user.email === ADMIN_EMAIL && (
                      <Link 
                        to="/admin-dashboard" 
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-sm hover:bg-emerald-50 text-emerald-900 font-bold transition flex items-center gap-2 border-b border-gray-100"
                      >
                        <span>⚙️</span> Admin Dashboard
                      </Link>
                    )}

                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold transition flex items-center gap-2.5"
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-emerald-50 text-emerald-950 font-bold transition flex items-center gap-2"
                  >
                    <span>🔑</span> Login / Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-600/60 focus:outline-none transition"
            aria-label="Toggle Menu"
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>

        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-emerald-800/80 pb-2 px-2 flex flex-col space-y-2 bg-emerald-950/95 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="block md:hidden mb-2">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search', 'Search export products...')} 
                className="w-full px-4 py-2 pl-10 rounded-xl text-gray-900 bg-emerald-50 border border-emerald-600/50 focus:outline-none text-sm"
              />
              <span className="absolute left-3 top-2.5 text-emerald-700">🔍</span>
            </div>
          </form>

          <Link to="/" className={`px-4 py-2.5 rounded-xl font-medium transition ${isActive('/') ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-900/60 text-gray-200'}`}>
            {t('home', 'Home')}
          </Link>
          <Link to="/products" className={`px-4 py-2.5 rounded-xl font-medium transition ${isActive('/products') ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-900/60 text-gray-200'}`}>
            {t('products', 'Products')}
          </Link>
          <Link to="/about" className={`px-4 py-2.5 rounded-xl font-medium transition ${isActive('/about') ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-900/60 text-gray-200'}`}>
            About
          </Link>
          <Link to="/contact" className={`px-4 py-2.5 rounded-xl font-medium transition ${isActive('/contact') ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-900/60 text-gray-200'}`}>
            {t('contact', 'Contact')}
          </Link>
          <Link to="/my-orders" className={`px-4 py-2.5 rounded-xl font-medium transition ${isActive('/my-orders') ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-900/60 text-gray-200'}`}>
            My Orders
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;