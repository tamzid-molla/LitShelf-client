import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { AuthContext } from "../../context/FirebaseContext";
import axios from "axios";
import { RateContext } from "../../context/RatingContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SingleRating = ({ SingleRating }) => {
  const { ratings, setRatings } = useContext(RateContext);
  const [isOpen, setIsOpen] = useState(false);
  const { setMyReview, myReview } = useContext(RateContext);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const { reviewer_name, review, reviewer_photo, rating, created_at, _id } =
    SingleRating;
  const myRating = SingleRating.reviewer_email === user.email;

  //handle review Update
  const handleReviewUpdate = (e) => {
    e.preventDefault();
    const data = e.target.textarea.value;
    axiosSecure
      .patch(`/rating/${_id}`, { review: data })
      .then((res) => {
        if (res.data.result.modifiedCount > 0) {
          const updatedRatings = ratings.map((r) =>
            r._id === _id ? { ...r, review: data } : r
          );
          setRatings(updatedRatings);
          setMyReview(data);
            setIsOpen(false);
            Swal.fire({
                      icon: "success",
                      title: "Review Update successful",
                      showConfirmButton: false,
                      timer: 1500,
                    });
        }
      });
  };

  //handle review Delete
  const handleReviewDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/rating/${_id}`)
          .then((res) => {
              if (res.data.deletedCount > 0) {
        const updatedRatings = ratings.filter((r) => r._id !== _id);
        setRatings(updatedRatings);
        setMyReview("");
        Swal.fire({
          title: "Deleted!",
          text: "Your review has been deleted.",
          icon: "success",
        });
      }
        });
    }
});
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-200 dark:border-gray-700 py-6 last:border-0">
      <div className="flex gap-4">
        {/* Reviewer Avatar */}
        <div className="flex-shrink-0">
          <img
            src={reviewer_photo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.ibb.co/9kW3szMD/vector-flat-illustration-grayscale-avatar-600nw-2264922221.webp";
            }}
            className="w-12 h-12 rounded-full object-cover border-2 border-bgBtn"
            alt={reviewer_name}
          />
        </div>
        
        {/* Review Content */}
        <div className="flex-1">
          <div className="flex flex-wrap justify-between gap-2 mb-2">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">{reviewer_name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {rating}/5
                </span>
              </div>
            </div>
            
            {/* Review Date */}
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <FaCalendarAlt />
              <span>{new Date(created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {/* Review Text */}
          <p className="text-gray-700 dark:text-gray-300 mb-4">{review}</p>
          
          {/* Action Buttons (Only for own reviews) */}
          {myRating && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1 text-sm bg-bgBtn/10 hover:bg-bgBtn/20 text-bgBtn px-3 py-1.5 rounded-lg transition-colors"
              >
                <FaEdit /> Edit
              </button>
              
              <button
                onClick={handleReviewDelete}
                className="flex items-center gap-1 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg transition-colors"
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Review Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Your Review</h3>
              
              <form onSubmit={handleReviewUpdate}>
                <textarea
                  className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none mb-4"
                  placeholder="Write your updated review..."
                  name="textarea"
                  defaultValue={myReview}
                />
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Update Review
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SingleRating;