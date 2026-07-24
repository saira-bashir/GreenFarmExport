import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function DynamicReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Review Form State (No login required)
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Newest reviews first
      setReviews(fetchedReviews.reverse());
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle Image Selection and Convert to Base64 for Firestore Storage
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Review without requiring login
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      alert('Please fill in your name and review message.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name: reviewerName,
        comment: reviewComment,
        rating: Number(rating),
        image: reviewImage || null,
        createdAt: serverTimestamp()
      });

      setReviewerName('');
      setReviewComment('');
      setRating(5);
      setReviewImage(null);
      setSuccessMsg('Thank you! Your review has been submitted successfully.');
      
      // Refresh reviews list
      fetchReviews();

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white border-t border-emerald-100">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Global Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-emerald-950 tracking-wide">
            What Our International Buyers Say
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Read experiences from our valued partners worldwide or share your own feedback.
          </p>
        </div>

        {/* Reviews Grid & Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Display Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-emerald-50/30 border border-emerald-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-emerald-950 text-base">{rev.name}</h4>
                      <div className="text-amber-500 text-sm mt-0.5">
                        {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">Verified Client</span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {rev.comment}
                  </p>

                  {/* Attached Image if uploaded */}
                  {rev.image && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200 w-32 h-32 bg-white shadow-sm">
                      <img 
                        src={rev.image} 
                        alt="Review attachment" 
                        className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right Column: Submit Review Form (No Login Required) */}
          <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-xl h-fit sticky top-24">
            <h3 className="text-xl font-bold text-emerald-950 mb-2">Review</h3>
            <p className="text-xs text-gray-500 mb-6"> Share your feedback here.</p>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g., John Smith" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rating *</label>
                <select 
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50/50"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Good)</option>
                  <option value="2">⭐⭐ (2/5 - Fair)</option>
                  <option value="1">⭐ (1/5 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Review *</label>
                <textarea 
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your feedback about product quality or delivery..." 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50/50 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Attach Photo (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-bezier"
                />
                {reviewImage && (
                  <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span>✓ Image attached successfully</span>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white font-bold rounded-xl shadow-md transition duration-300 text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DynamicReviews;