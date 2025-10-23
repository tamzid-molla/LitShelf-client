import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { FaHeart, FaStar, FaBookmark, FaShareAlt, FaUser, FaCalendarAlt, FaBook } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/FirebaseContext";
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
      className="mx-auto px-4 py-8 pt-30 mb-16 min-h-screen">
      
      {/* Professional Book Header */}
      <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-bgBtn to-hoverBtn p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={cover_photo}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.ibb.co/99RttPHG/books-stack-realistic-1284-4735.jpg";
                  }}
                  alt={`${book_title} Cover`}
                  className="w-48 md:w-56 h-72 md:h-80 object-cover rounded-2xl shadow-xl border-4 border-white/20"
                />
                <div className="absolute -bottom-3 -right-3 bg-white dark:bg-darkBase-secondary rounded-full p-3 shadow-lg">
                  <FaBookmark className="text-bgBtn text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Book Information */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {book_category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {total_page} pages
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {readingStatus}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black mb-3">{book_title}</h1>
              <p className="text-xl md:text-2xl mb-6">by {book_author}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FaHeart className="text-red-300" />
                  <span className="font-semibold">{upvoteCount} likes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FaStar className="text-yellow-300" />
                  <span className="font-semibold">
                    {ratings.length > 0 
                      ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                      : "No ratings"}
                  </span>
                  <span className="text-sm opacity-80">({ratings.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleUpvoteBtn}
                disabled={upvoteBtn}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  upvoteBtn 
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                    : "bg-bgBtn hover:bg-hoverBtn text-white shadow-lg hover:shadow-xl"
                }`}
              >
                <FaHeart className={upvoteBtn ? "text-gray-400" : "text-red-400"} /> 
                <span>Like</span>
              </button>
              
              <button 
                onClick={() => handleReadingStatus(user_email)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <FaBookmark /> 
                <span>{readingStatus === "Read" ? "Completed" : `Mark as ${readingStatus === "Want-to-Read" ? "Reading" : "Read"}`}</span>
              </button>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-semibold transition-all">
                <FaShareAlt /> 
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Section */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaBook className="text-bgBtn" />
              Book Overview
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {book_overview}
              </p>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Reader Reviews
              </h2>
              <span className="bg-bgBtn/10 text-bgBtn px-3 py-1 rounded-full font-semibold">
                {ratings.length} reviews
              </span>
            </div>
            
            <Rating book_id={book._id} />
            
            {/* Review Form */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Write Your Review</h3>
              <form onSubmit={(e) => handleRating(e, rating)}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} hover:text-yellow-400 transition-colors`}
                        onClick={() => setRating(star)}
                        disabled={handleTextarea}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none ${
                      handleTextarea ? 'cursor-not-allowed opacity-70' : ''
                    }`}
                    rows="5"
                    name="review"
                    disabled={handleTextarea}
                    placeholder="Share your thoughts about this book..."
                  ></textarea>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={handleTextarea}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                      handleTextarea 
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed" 
                        : "bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white hover:shadow-xl"
                    }`}
                  >
                    {handleTextarea ? "Review Submitted" : "Post Review"}
                  </motion.button>
                  
                  <Link to="/bookShelf">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-semibold transition-all"
                    >
                      Browse More Books
                    </motion.button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Added By Section */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaUser className="text-bgBtn" />
              Added By
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-bgBtn">
                <img 
                  src={reviewerPhoto}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.ibb.co/9kW3szMD/vector-flat-illustration-grayscale-avatar-600nw-2264922221.webp";
                  }}
                  alt={user_name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{user_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user_email}</p>
              </div>
            </div>
          </div>
          
          {/* Book Details */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Book Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Title</span>
                <span className="font-medium text-gray-900 dark:text-white">{book_title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Author</span>
                <span className="font-medium text-gray-900 dark:text-white">{book_author}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Pages</span>
                <span className="font-medium text-gray-900 dark:text-white">{total_page}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Category</span>
                <span className="font-medium text-bgBtn">{book_category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                  readingStatus === 'Read' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : readingStatus === 'Reading' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {readingStatus}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-black text-bgBtn">{upvoteCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Likes</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center">
                <div className="text-2xl font-black text-yellow-500">
                  {ratings.length > 0 
                    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center col-span-2">
                <div className="text-2xl font-black text-purple-500">{ratings.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;