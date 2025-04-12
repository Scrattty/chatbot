import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';

interface FeedbackData {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    setIsAuthenticated(!!user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const feedback: FeedbackData = {
      id: crypto.randomUUID(),
      userId: currentUser.email || 'anonymous',
      userName: currentUser.fullname || 'Anonymous User',
      rating,
      comment,
      date: new Date().toISOString()
    };

    // Save feedback to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    // Show success message
    setShowSuccess(true);
    setRating(0);
    setComment('');

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-[#7CC5E3] rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">Your Feedback Matters</h1>
        <p className="text-white/90 mb-8">
          Help us improve SAMI by sharing your experience. Your feedback is valuable in making our service better for everyone.
          {!isAuthenticated && " You can provide feedback without signing in."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">How would you rate your experience?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-white'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Share your thoughts</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-lg resize-none h-32"
              placeholder="Tell us about your experience..."
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-white text-[#7CC5E3] py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Submit Feedback
            <Send className="w-4 h-4" />
          </button>
        </form>

        {showSuccess && (
          <div className="mt-4 bg-green-500 text-white p-4 rounded-lg text-center">
            Thank you for your feedback!
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;