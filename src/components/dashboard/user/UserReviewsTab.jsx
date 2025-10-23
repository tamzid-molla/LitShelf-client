import React from "react";
import { FaStar } from "react-icons/fa";

const UserReviewsTab = ({ myReviews }) => {
  return (
    <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Reviews</h2>
      <div className="space-y-4">
        {myReviews.length > 0 ? (
          myReviews.map((review) => (
            <div
              key={review._id}
              className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.review}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">No reviews yet. Start reviewing your books!</p>
        )}              
      </div>
    </div>
  );
};

export default UserReviewsTab;