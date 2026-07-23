import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';

function DynamicReviews() {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviewsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      try {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        const reviewsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReviews(reviewsList);
      } catch (err) {
        console.error("Fallback error:", err);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login to your account to submit a review!");
      return;
    }

    if (!comment.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'reviews'), {
        name: currentUser.displayName || currentUser.email.split('@')[0],
        email: currentUser.email,
        comment: comment,
        rating: rating,
        createdAt: serverTimestamp()
      });

      setComment('');
      setSuccessMsg('Review added successfully!');
      fetchReviews();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          Global Partner Reviews
        </h2>
        <p className="text-center text-gray-600 mb-10">
          See what our verified buyers say or share your own experience.
        </p>

        {/* Display Reviews Grid with Scrollable Text Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">No reviews yet. Be the first to add one!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-gray-50 border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-lg mb-2">
                    {"⭐".repeat(Number(rev.rating) || 5)}
                  </div>
                  {/* Yahan max-height aur overflow-y-auto add kar diya hai taake lamba text scroll ho sakay */}
                  <div className="max-h-40 overflow-y-auto pr-2 mb-4 scrollbar-thin">
                    <p className="text-gray-700 italic">"{rev.comment}"</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h4 className="font-bold text-gray-900 capitalize">{rev.name}</h4>
                  <p className="text-xs text-green-700 font-medium">Verified Client</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Review Form */}
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-green-900 mb-4 text-center">Leave Your Feedback</h3>
          
          {successMsg && (
            <div className="mb-4 p-3 bg-green-200 text-green-800 rounded-lg text-center font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
                <option value="2">⭐⭐ (2/5)</option>
                <option value="1">⭐ (1/5)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review / Comment</label>
              <textarea 
                rows="3" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write about product quality, packaging, or delivery..."
                className="w-full p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default DynamicReviews;