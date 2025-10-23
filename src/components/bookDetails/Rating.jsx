import axios from "axios";
import React, { useContext, useEffect } from "react";
import { RateContext } from "../../context/RatingContext";
import SingleRating from "./SingleRating";
import { AuthContext } from "../../context/FirebaseContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Rating = ({ book_id }) => {
  const { user } = useContext(AuthContext);
  const { setMyReview } = useContext(RateContext);
  const { ratings, setRatings } = useContext(RateContext);
  const axiosSecure = useAxiosSecure();
  
  useEffect(() => {
    axiosSecure(`/rating/${book_id}`).then((data) => {
      setRatings(data.data);
    });
  }, [book_id, setRatings,axiosSecure]);

  useEffect(() => {
    setMyReview(
      ratings.find((r) => r.reviewer_email === user.email)?.review || ""
    );
  }, [ratings, user.email, setMyReview]);

  return (
    <div>
      {ratings.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share your thoughts about this book!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {ratings.map((rating) => (
            <SingleRating
              key={rating._id}
              SingleRating={rating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rating;