import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // Fetch product dynamically from Firebase based on ID
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() };
          setProduct(prodData);
          
          // Set initial main image (fallback to product.img if extraImages not defined)
          const initialImg = prodData.img || "/placeholder.png";
          setActiveImage(initialImg);
        } else {
          console.error("No such product in Firebase!");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600"></div>
        <p className="text-lg font-semibold text-emerald-800 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 bg-white border border-emerald-100 rounded-3xl shadow-md max-w-2xl mx-auto my-16 p-8">
        <h2 className="text-3xl font-bold text-red-600 mb-3">{t('productNotFound', 'Product not found!')}</h2>
        <p className="text-gray-500 mb-6">The product you are looking for might have been removed or does not exist in the database.</p>
        <Link to="/products" className="inline-block bg-gradient-to-r from-emerald-700 to-emerald-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition">
          Back to Products Catalog
        </Link>
      </div>
    );
  }

  // Fallback extra images array if not stored in Firebase yet
  const galleryImages = product.extraImages && product.extraImages.length > 0 
    ? product.extraImages 
    : [product.img, product.img, product.img, product.img];

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-white border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative overflow-hidden">
          
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

          {/* LEFT SIDE: Images Gallery with Smooth Switching */}
          <div className="space-y-4">
            {/* Main Preview Image with Fixed Frame */}
            <div className="h-96 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/50 to-amber-50/30 p-6 border border-emerald-100 shadow-inner group">
              <img 
                src={activeImage || product.img} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition duration-500" 
              />
            </div>

            {/* Thumbnails Selection with Click State Update */}
            <div className="flex gap-3 justify-center flex-wrap">
              {galleryImages.map((imgSrc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-gray-50 p-1.5 shadow-sm hover:scale-105 flex items-center justify-center ${activeImage === imgSrc ? 'border-emerald-600 ring-4 ring-emerald-500/20 shadow-md' : 'border-gray-200 hover:border-emerald-400'}`}
                >
                  <img src={imgSrc} alt={`thumb-${index}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Product Info & Action Buttons */}
          <div className="flex flex-col h-full justify-between space-y-6">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                Verified Export Item
              </span>
              <h2 className="text-4xl font-extrabold text-emerald-950 mt-3 mb-4 tracking-tight">{product.name}</h2>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {product.desc || "Premium agricultural produce cultivated and packaged for global export standards."}
              </p>
              
              {/* Quality & Packing Badges Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gradient-to-br from-emerald-50/60 to-gray-50 p-5 rounded-2xl border border-emerald-100 shadow-sm">
                <div className="border-r border-emerald-200/60 pr-4">
                  <span className="block text-gray-400 text-xs uppercase font-semibold">{t('gradeLabel', 'Quality Grade')}</span>
                  <strong className="text-xl text-emerald-900 font-bold">{product.grade || "Standard"}</strong>
                </div>
                <div className="pl-2">
                  <span className="block text-gray-400 text-xs uppercase font-semibold">{t('packingLabel', 'Packing Type')}</span>
                  <strong className="text-xl text-emerald-900 font-bold">{product.packing || "Export Box"}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons with Gradients & Neon Shadows */}
            <div className="space-y-3.5 pt-4 border-t border-gray-100">
              <Link
                to={`/quote/${id}`}
                className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-amber-500/30 hover:shadow-lg text-center text-base"
              >
                Request Official Quote 📋
              </Link>
              <Link
                to={`/order/${id}`}
                className="block w-full bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-emerald-900/30 hover:shadow-lg text-center text-base"
              >
                Place Direct Order 🚀
              </Link>
              <Link
                to="/products"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-center text-sm shadow-sm"
              >
                ← Back to Catalog
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;