import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase'; 
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const initialProducts = [
    { 
      id: "1", 
      name: "Premium Mango", 
      grade: "A-Grade", 
      packing: "5kg Box", 
      desc: "Best quality Chaunsa mangoes in wooden boxes, graded for international export.",
      img: "/Mango.png",
      extraImages: ["/Mango.png", "/mangopack.png", "/mangobox.png", "/mangoes.png"] 
    },
    { 
      id: "2", 
      name: "Juicy Malta", 
      grade: "A-Grade", 
      packing: "10kg Box", 
      desc: "Fresh Kinnow/Malta from Punjab orchards, rich in juice and vitamins.",
      img: "/Orangegarden.png",
      extraImages: ["/Orangegarden.png", "/orange.png", "/packmalta.png", "/boxorange.png"] 
    },
    { 
      id: "3", 
      name: "Fresh Cherry", 
      grade: "Premium", 
      packing: "2.5kg Box", 
      desc: "Handpicked premium cherries packed securely for long-distance transport.",
      img: "/cherrybox.png",
      extraImages: ["/cherrybox.png", "/cherries.png", "/cherrish.png", "/cherrypacks.png"] 
    },
    { 
      id: "4", 
      name: "Export Potato", 
      grade: "Class-1", 
      packing: "20kg Bag", 
      desc: "Cleaned and sorted potatoes suited for bulk storage and commercial use.",
      img: "/potatoo.png",
      extraImages: ["/potatoo.png", "/potato.png", "/sack.png", "/sacks.png"] 
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      
      if (querySnapshot.empty) {
        for (const prod of initialProducts) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
        const reloadedSnapshot = await getDocs(collection(db, 'products'));
        const productsList = reloadedSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setProducts(productsList);
      } else {
        const productsList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setProducts(productsList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery) || 
    product.desc.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <p className="text-lg font-semibold text-emerald-800 animate-pulse">Loading export catalog...</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-center text-emerald-950 tracking-tight">
          {t('productsCatalogTitle', 'Our Export Catalog')}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto text-base">
          {searchQuery ? `Showing search results for: "${searchQuery}"` : t('productsCatalogSubtitle', 'Premium farm-fresh produce cultivated and packaged for global bulk orders.')}
        </p>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-emerald-100 max-w-md mx-auto">
            <p className="text-xl text-gray-500 mb-4">No products found matching your search.</p>
            <Link to="/products" className="inline-block bg-gradient-to-r from-emerald-700 to-emerald-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-emerald-100/80 p-6 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Neon Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700 opacity-80 group-hover:opacity-150 transition"></div>

                <div>
                  <div className="mb-5 h-48 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/50 to-amber-50/30 p-4 group-hover:scale-105 transition duration-500">
                    {product.img && product.img.startsWith('/') ? (
                      <img src={product.img} alt={product.name} className="w-full h-full object-contain drop-shadow-md" />
                    ) : (
                      <span className="text-7xl">{product.img || "📦"}</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-1 text-emerald-950 group-hover:text-emerald-700 transition">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">{product.desc}</p>
                </div>
                
                <div>
                  <div className="mt-5 space-y-1.5 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                    <p className="flex justify-between px-2">
                      <span className="text-gray-400">{t('gradeLabel', 'Grade:')}</span> 
                      <strong className="text-emerald-800">{product.grade}</strong>
                    </p>
                    <p className="flex justify-between px-2">
                      <span className="text-gray-400">{t('packingLabel', 'Packing:')}</span> 
                      <strong className="text-emerald-800">{product.packing}</strong>
                    </p>
                  </div>
                  
                  <Link 
                    to={`/product/${product.id}`} 
                    className="w-full block bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-emerald-900/30 hover:shadow-lg text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;