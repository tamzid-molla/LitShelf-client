import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { FaHeart, FaStar, } from "react-icons/fa";
import { Link, useLoaderData, useParams, } from "react-router";
import { AuthContext } from "../context/FirebaseContext";
import axios from "axios";
import Rating from "../components/bookDetails/Rating";
import Swal from "sweetalert2";
import { RateContext } from "../context/RatingContext";
import { useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/common/Loading";

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure(`/books/${id}`)
      .then(res => {
        setBook(res.data)
        setLoading(false)
    })
  },[id,axiosSecure])

  useEffect(() => {
      document.title = "LitShelf || BookDetails";
  }, []);
  
  const { ratings, setRatings } = useContext(RateContext);
  // State for rating functionality
  const [rating, setRating] = useState(0);
  //User data coming from AuthContext
  const { user } = useContext(AuthContext);
  // Destructure book properties for easier access
  const {
    book_author,
    book_title,
    cover_photo,
    total_page,
    book_category,
    reading_status,
    book_overview,
    upvote,
    user_name,
    user_email,
    reviewerPhoto
  } = book;

  const [upvoteCount, setUpvoteCount] = useState(0);
  const [readingStatus, setReadingStatus] = useState('');

  useEffect(() => {
    if (reading_status) {
    setReadingStatus(reading_status)
    }
    if (upvote) {
      setUpvoteCount(upvote)
    }
  },[reading_status,upvote])

  //handle upvote button
  const upvoteBtn = user_email === user.email;

  const handleUpvoteBtn = () => {
    axiosSecure
      .patch(`/books/${book._id}`)
      .then((data) => {
        if (data.data.modifiedCount) {
          setUpvoteCount(upvoteCount + 1);
        }
      });
  };
  //Handle rating
  const handleRating = (e, rating) => {
    e.preventDefault();
    const review = e.target.review.value;
    if (review.length <= 5) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Review must be at least 6 characters long",
        footer: "Please try again",
      });
    }
    if (rating === 0) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least 1 Star",
        footer: "Please try again",
      });
    }
    const data = {
      review,
      rating,
      book_id: book._id,
      reviewer_email: user.email,
      reviewer_name: user.displayName,
      reviewer_photo: user.photoURL,
      created_at: new Date().toLocaleString(),
    };

    axiosSecure.post(`/ratings`, data).then((res) => {
      const newRating = res.data;
      if (newRating && newRating._id) {
        Swal.fire({
          icon: "success",
          title: "Review successful",
          showConfirmButton: false,
          timer: 1500,
        });
        setRatings((prev) => [...prev, newRating]);
        e.target.reset();
        setRating(0);
      }
    });
  };
  //Handle Textarea
  const handleTextarea = ratings.find(
    (rate) => rate.reviewer_email === user.email
  );

  //handle ReadingStatus
  const handleReadingStatus = (email) => {
    if (user.email !== email) {
      return Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: "Only the owner of this book can update the reading status.",
      });
    }
    
    let nextStatus;
  if (readingStatus === "Want-to-Read") nextStatus = "Reading";
  else if (readingStatus === "Reading") nextStatus = "Read";
     else return Swal.fire({
      icon: "info",
      title: "Already Read",
      text: "You have already marked this book as 'Read'.", 
          });
    
    setReadingStatus(nextStatus);
      axiosSecure
    .patch(`/books/status/${book._id}`, {
      reading_status: nextStatus,
    })
    .then((res) => {
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Reading Status Updated",
          text: `Now: ${nextStatus}`,
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        // Backend didn't update, revert UI
        setReadingStatus(readingStatus); 
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Please try again later",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      // On error, revert status
      setReadingStatus(readingStatus);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Status not updated",
      });
    });


  }

  if (loading) {
    return <Loading></Loading>
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} 
      className="container mx-auto p-6 max-w-5xl pt-36 mb-28 min-h-screen">
      <div className="bg-base-secondary dark:bg-darkBase-secondary shadow-2xl rounded-lg overflow-hidden">
        {/* Book Header */}
        <div className="bg-gradient-to-r from-hoverBtn to-bgBtn p-6 text-white">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={cover_photo}
              onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.ibb.co/99RttPHG/books-stack-realistic-1284-4735.jpg";
            }}
              alt="Book Cover"
              className="w-48 h-72 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{book_title}</h1>
              <p className="text-lg">By {book_author}</p>
              <div className="mt-4 flex gap-4">
                <span className="bg-base text-hoverBtn px-3 py-1 rounded-full text-sm">
                  {book_category}
                </span>
                <span className="bg-base text-hoverBtn px-3 py-1 rounded-full text-sm">
                  {total_page}
                </span>
                <span className="bg-base text-hoverBtn px-3 py-1 rounded-full text-sm">
                  {readingStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="">{book_overview}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Added By</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-base rounded-full flex items-center justify-center text-bgBtn font-bold">
                <img src={reviewerPhoto}
                  onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.ibb.co/9kW3szMD/vector-flat-illustration-grayscale-avatar-600nw-2264922221.webp";
            }}
                  alt="Reviewer photo" className="w-full h-full rounded-full" />
              </div>
              <div>
                <p className="font-medium">{user_name}</p>
                <p className=" text-sm">{user_email}</p>
              </div>
            </div>
          </div>

          {/* Upvote Section */}
          <div className="mb-6 flex justify-between">
            <span className=" flex w-20 items-center gap-2 bg-bgBtn text-white px-4 py-2 rounded-lg hover:bg-hoverBtn transition-colors">
              <FaHeart className="text-red-400" /> {upvoteCount}
            </span>
            <button onClick={()=>handleReadingStatus(user_email)} className=" btn text-lg text-textBtn bg-bgBtn hover:bg-hoverBtn border-none">{ readingStatus}</button>
          </div>

          {/* Reviews Section */}
          <div>
            <Rating book_id={book._id}></Rating>
            {/* Review Form */}
            <form onSubmit={(e) => handleRating(e, rating)} className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
              <div className="mb-4">
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer inline-block text-xl ${
                        rating >= star ? "text-orange-300" : "text-gray-400"
                      }`}
                      onClick={() => setRating(star)}>
                      <FaStar />
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-InputRing focus:border-InputRing"
                  rows="4"
                  name="review"
                  disabled={handleTextarea ? true : false}
                  placeholder="Write your review..."></textarea>
              </div>
              {/* Book details footer  */}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-bgBtn cursor-pointer text-textBtn px-4 py-2 rounded-lg hover:bg-hoverBtn">
                    Post Review
                  </motion.button>
                  <Link to="/bookShelf">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
                      Cancel
                    </motion.button>
                  </Link>
                </div>
                <div className="">
                  <motion.button
                    onClick={handleUpvoteBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    disabled={upvoteBtn ? true : false}
                    className={`bg-bgBtn text-textBtn px-4 py-2 rounded-lg hover:bg-hoverBtn ${
                      upvoteBtn ? "cursor-not-allowed" : "cursor-pointer"
                    }`}>
                    Upvote
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;
