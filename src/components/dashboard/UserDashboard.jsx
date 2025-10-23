import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaBook, 
  FaStar, 
  FaChartLine, 
  FaBookReader,
  FaUser,
  FaBars,
  FaTimes,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaHeart
} from "react-icons/fa";
import { AuthContext } from "../../context/FirebaseContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import CountUp from "react-countup";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Link } from "react-router";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UserDashboard = ({ userData }) => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [booksRes, reviewsRes] = await Promise.all([
          axiosSecure.get(`/books/email?email=${user?.email}`),
          axios.get(`${import.meta.env.VITE_baseURL}/ratings`)
        ]);

        setMyBooks(booksRes.data);
        const userReviews = reviewsRes.data.filter(r => r.user_email === user?.email);
        setMyReviews(userReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user, axiosSecure]);

  // Calculate reading statistics
  const readingStats = {
    currentlyReading: myBooks.filter(b => b.reading_status === "Currently Reading").length,
    wantToRead: myBooks.filter(b => b.reading_status === "Want to Read").length,
    finished: myBooks.filter(b => b.reading_status === "Finished").length,
    total: myBooks.length
  };

  // Chart data for reading status
  const readingStatusData = {
    labels: ['Currently Reading', 'Want to Read', 'Finished'],
    datasets: [{
      data: [readingStats.currentlyReading, readingStats.wantToRead, readingStats.finished],
      backgroundColor: [
        'rgba(42, 157, 143, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(42, 157, 143, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 2
    }]
  };

  // Category distribution data
  const categoryData = myBooks.reduce((acc, book) => {
    acc[book.book_category] = (acc[book.book_category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Books by Category',
      data: Object.values(categoryData),
      backgroundColor: 'rgba(42, 157, 143, 0.6)',
      borderColor: 'rgba(42, 157, 143, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "myBooks", label: "My Books", icon: FaBookOpen },
    { id: "reviews", label: "My Reviews", icon: FaStar },
    { id: "profile", label: "Profile", icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-base dark:bg-darkBase pt-24 pb-10">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-darkBase-secondary shadow-2xl transform transition-transform duration-300 ease-in-out pt-24 lg:pt-24`}
        >
          <div className="flex flex-col h-full">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt={user?.displayName}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-bgBtn"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-darkBase-secondary"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user?.displayName}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Book Enthusiast</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-bgBtn to-bgBtn/80 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="text-xl" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/addBook">
                <button className="w-full bg-gradient-to-r from-bgBtn to-bgBtn/80 hover:from-hoverBtn hover:to-hoverBtn text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  + Add New Book
                </button>
              </Link>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 lg:px-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-bgBtn text-white p-4 rounded-full shadow-2xl hover:bg-hoverBtn transition-all"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.displayName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your reading journey and discover new books
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <FaBook className="text-3xl mb-3 opacity-80" />
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Books</p>
                    <h3 className="text-3xl font-black">
                      <CountUp end={readingStats.total} duration={2} />
                    </h3>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <FaCheckCircle className="text-3xl mb-3 opacity-80" />
                    <p className="text-green-100 text-sm font-medium mb-1">Finished</p>
                    <h3 className="text-3xl font-black">
                      <CountUp end={readingStats.finished} duration={2} />
                    </h3>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <FaBookReader className="text-3xl mb-3 opacity-80" />
                    <p className="text-purple-100 text-sm font-medium mb-1">Currently Reading</p>
                    <h3 className="text-3xl font-black">
                      <CountUp end={readingStats.currentlyReading} duration={2} />
                    </h3>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <FaStar className="text-3xl mb-3 opacity-80" />
                    <p className="text-orange-100 text-sm font-medium mb-1">Reviews</p>
                    <h3 className="text-3xl font-black">
                      <CountUp end={myReviews.length} duration={2} />
                    </h3>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Reading Status
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    {readingStats.total > 0 ? (
                      <Doughnut 
                        data={readingStatusData} 
                        options={{ 
                          maintainAspectRatio: false, 
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }} 
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No books added yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Reading Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Books Finished</span>
                        <span className="text-sm font-bold text-bgBtn">
                          {readingStats.total > 0 ? Math.round((readingStats.finished / readingStats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-bgBtn to-green-500 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${readingStats.total > 0 ? (readingStats.finished / readingStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Currently Reading</span>
                        <span className="text-sm font-bold text-purple-600">
                          {readingStats.total > 0 ? Math.round((readingStats.currentlyReading / readingStats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${readingStats.total > 0 ? (readingStats.currentlyReading / readingStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Want to Read</span>
                        <span className="text-sm font-bold text-orange-600">
                          {readingStats.total > 0 ? Math.round((readingStats.wantToRead / readingStats.total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${readingStats.total > 0 ? (readingStats.wantToRead / readingStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Books */}
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recently Added</h3>
                  <Link to="/myBooks" className="text-bgBtn hover:text-hoverBtn font-semibold text-sm">
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myBooks.slice(0, 3).map((book) => (
                    <div
                      key={book._id}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={book.cover_photo}
                        alt={book.book_title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-sm">
                          {book.book_title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{book.book_author}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          book.reading_status === 'Finished' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          book.reading_status === 'Currently Reading' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {book.reading_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* My Books Tab */}
          {activeTab === "myBooks" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Books Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myBooks.map((book) => (
                    <Link to={`/books/${book._id}`} key={book._id}>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <img
                          src={book.cover_photo}
                          alt={book.book_title}
                          className="w-full h-56 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                          {book.book_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.book_author}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-bgBtn/10 text-bgBtn px-2 py-1 rounded-full font-semibold">
                            {book.book_category}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{book.total_page} pages</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6"
            >
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
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-10">No reviews yet. Start reviewing your books!</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profile Information</h2>
              <div className="flex flex-col items-center">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/150"}
                  alt={user?.displayName}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-bgBtn mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{user?.displayName}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{user?.email}</p>
                
                <div className="w-full max-w-md space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Type</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {userData?.role || 'User'}
                    </p>
                  </div>

                  <Link to="/profile">
                    <button className="w-full mt-6 bg-gradient-to-r from-bgBtn to-bgBtn/80 hover:from-hoverBtn hover:to-hoverBtn text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
