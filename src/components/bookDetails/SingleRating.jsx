import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
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
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
        });
    }
});
};
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b py-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 ">
          <div className="flex items-center gap-2">
            <div className="">
              <img
                src={reviewer_photo}
                onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.ibb.co/9kW3szMD/vector-flat-illustration-grayscale-avatar-600nw-2264922221.webp";
            }}
                className="w-11 h-11 rounded-full"
                alt=""
              />
            </div>
            <div className="gap-2">
              <p>{reviewer_name}</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg ${
                      i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="">{review}</p>
          <p className="text-sm text-gray-400">{created_at}</p>
        </div>
        {myRating && (
          <div className="flex gap-2">
            <div className="flex items-center justify-center">
              {/* Open Modal Button */}
              <button
                onClick={() => setIsOpen(true)}
                className=" text-bgBtn rounded hover:text-hoverBtn cursor-pointer">
                <FaEdit size={25} />
              </button>

              {/* Modal */}
              {isOpen && (
                <div className="fixed inset-0 bg-opacity-0 flex items-center justify-center z-0">
                  <form onSubmit={handleReviewUpdate}>
                    <div className="bg-base-secondary dark:bg-darkBase-secondary p-6 rounded-2xl shadow-xl w-96">
                      {/* Textarea */}
                      <textarea
                        className="w-full h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
                        placeholder="Write something..."
                        name="textarea"
                        defaultValue={myReview}
                      />

                      {/* Update Button */}
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-bgBtn text-textBtn rounded hover:bg-hoverBtn">
                          Update
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleReviewDelete}
              className="text-red-600 hover:text-red-800">
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SingleRating;
