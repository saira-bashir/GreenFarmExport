import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
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

  // Helper to check active link styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 px-4 py-3 text-white shadow-2xl sticky top-0 z-50 border-b border-emerald-800/80 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo Brand with Gradient Accents */}
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
        
        {/* Modern Glowing Search Bar */}
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

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-3 lg:gap-4 font-medium text-sm">
          
          <Link 
            to="/" 
            className={`px-3 py-1.5 rounded-xl transition duration-300 hidden lg:inline-block ${isActive('/') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}
          >
            {t('home', 'Home')}
          </Link>

          <Link 
            to="/products" 
            className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/products') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}
          >
            {t('products', 'Products')}
          </Link>

          <Link 
            to="/about" 
            className={`px-3 py-1.5 rounded-xl transition duration-300 hidden lg:inline-block ${isActive('/about') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}
          >
            About
          </Link>

          <Link 
            to="/contact" 
            className={`px-3 py-1.5 rounded-xl transition duration-300 hidden lg:inline-block ${isActive('/contact') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}
          >
            {t('contact', 'Contact')}
          </Link>

          <Link 
            to="/my-orders" 
            className={`px-3 py-1.5 rounded-xl transition duration-300 ${isActive('/my-orders') ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700' : 'hover:text-amber-300 hover:bg-emerald-900/50'}`}
          >
            My Orders
          </Link>
          
          {/* Styled Language Selector */}
          <select 
            value={i18n.language ? i18n.language.toUpperCase() : 'EN'} 
            onChange={handleLanguageChange}
            className="bg-emerald-900/80 hover:bg-emerald-800 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer text-amber-300 font-bold border border-emerald-600/60 focus:outline-none transition shadow-sm"
          >
            <option value="EN" className="bg-emerald-900 text-white">EN</option>
            <option value="AR" className="bg-emerald-900 text-white">AR</option>
            <option value="ZH" className="bg-emerald-900 text-white">ZH</option>
          </select>

          {/* Account Dropdown with Gradient Glow */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 px-4 py-2 rounded-2xl transition duration-300 shadow-md border border-emerald-600/70 focus:outline-none group"
            >
              <span className="text-base text-amber-400 group-hover:scale-110 transition">👤</span>
              <span className="hidden sm:inline max-w-[110px] truncate capitalize font-semibold tracking-wide text-emerald-100">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-amber-400">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-emerald-50/50 text-xs text-gray-500 truncate">
                      Signed in as <br />
                      <strong className="text-emerald-900 font-semibold">{user.email}</strong>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold transition flex items-center gap-2.5"
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/auth" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-emerald-50 text-emerald-950 font-bold transition flex items-center gap-2"
                    >
                      <span>🔑</span> Login / Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;