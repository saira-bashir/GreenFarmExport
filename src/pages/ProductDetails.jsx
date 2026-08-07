import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedPacking, setSelectedPacking] = useState('');

  const getPackingOptions = (productName) => {
    if (!productName) return ["Export Standard Box"];
    const name = productName.toLowerCase();
    if (name.includes('potato')) {
      return ["3kg Bag", "5kg Bag", "10kg Bag", "25kg Bag"];
    } else if (name.includes('malta') || name.includes('orange')) {
      return ["5kg Export Box", "10kg Export Box", "5kg Basket", "10kg Basket"];
    } else if (name.includes('mango')) {
      return ["5kg Carton Box", "10kg Carton Box"];
    } else if (name.includes('cherry')) {
      return ["1kg Box", "5kg Box", "10kg Basket"];
    }
    return ["Standard Export Box", "Bulk Packing"];
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() };
          setProduct(prodData);
          
          const initialImg = prodData.img || "/placeholder.png";
          setActiveImage(initialImg);

          const options = getPackingOptions(prodData.name);
          setSelectedPacking(options[0]);
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

  const galleryImages = product.extraImages && product.extraImages.length > 0 
    ? product.extraImages 
    : [product.img, product.img, product.img, product.img];

  const isOutOfSeason = product.seasonStatus === 'Out of Season';
  const packingOptions = getPackingOptions(product.name);

  const handleDirectOrder = () => {
    navigate(`/order/${id}?packing=${encodeURIComponent(selectedPacking)}`);
  };

  const handleRequestQuote = () => {
    navigate(`/quote/${id}?packing=${encodeURIComponent(selectedPacking)}`);
  };

  return (
    <div className="p-6 md:p-12 bg-gradient-to-b from-gray-50 to-emerald-50/30 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="bg-white border border-emerald-100 p-8 md:p-10 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-700"></div>

          {/* LEFT SIDE: Images Gallery */}
          <div className="space-y-4">
            <div className="h-96 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50/50 to-amber-50/30 p-6 border border-emerald-100 shadow-inner group relative">
              
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md ${
                  isOutOfSeason 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                }`}>
                  {product.seasonStatus || 'In Season'}
                </span>
              </div>

              <img 
                src={activeImage || product.img} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-105 transition duration-500" 
              />
            </div>

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

          {/* RIGHT SIDE: Product Info & Actions */}
          <div className="flex flex-col h-full justify-between space-y-6">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                Verified Export Item
              </span>
              <h2 className="text-4xl font-extrabold text-emerald-950 mt-3 mb-3 tracking-tight">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {product.desc || "Premium agricultural produce cultivated and packaged for global export standards."}
              </p>
              
              <div className="mb-4 bg-gradient-to-br from-emerald-50/60 to-gray-50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex justify-between items-center">
                <div>
                  <span className="block text-gray-400 text-xs uppercase font-semibold">{t('gradeLabel', 'Quality Grade')}</span>
                  <strong className="text-lg text-emerald-900 font-bold">{product.grade || "Standard"}</strong>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Select Packing Weight / Type *
                </label>
                <select
                  value={selectedPacking}
                  onChange={(e) => setSelectedPacking(e.target.value)}
                  className="w-full p-3.5 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-emerald-950 text-sm shadow-sm cursor-pointer"
                >
                  {packingOptions.map((packOption, idx) => (
                    <option key={idx} value={packOption}>
                      {packOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isOutOfSeason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>This item is currently <strong>Out of Season / Sold Out</strong>. Direct orders and quotes are temporarily paused.</span>
              </div>
            )}

            {/* Action Buttons: Direct Order on top, Quote on bottom with proper spacing */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {isOutOfSeason ? (
                <div className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 rounded-xl text-center text-base cursor-not-allowed">
                  Currently Unavailable (Out of Season)
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleDirectOrder}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-emerald-900/30 hover:shadow-lg text-center text-base cursor-pointer"
                  >
                    Place Direct Order 🚀
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-amber-500/30 hover:shadow-lg text-center text-base cursor-pointer"
                  >
                    Request Official Quote 📋
                  </button>
                </div>
              )}
              
              <Link 
                to="/products"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-center text-sm shadow-sm mt-2"
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