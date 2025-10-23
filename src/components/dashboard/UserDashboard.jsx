import React, { useState, useContext, useEffect } from "react";
import { 
  FaBook, 
  FaStar, 
  FaChartLine, 
  FaBookReader,
  FaUser,
  FaCheckCircle
} from "react-icons/fa";
import { AuthContext } from "../../context/FirebaseContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from "react-router";

// Import small components
import StatsCard from "./StatsCard";
import DashboardSidebar from "./DashboardSidebar";
import MobileMenuButton from "./MobileMenuButton";
import DashboardHeader from "./DashboardHeader";
import ChartCard from "./ChartCard";
import BookCard from "./BookCard";

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
    { id: "myBooks", label: "My Books", icon: FaBook },
    { id: "reviews", label: "My Reviews", icon: FaStar },
    { id: "profile", label: "Profile", icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-base dark:bg-darkBase pt-20 pb-10">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-darkBase-secondary shadow-2xl transition-transform duration-300 ease-in-out pt-20 lg:pt-20 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <DashboardSidebar
            userData={{ ...userData, name: user?.displayName, photoURL: user?.photoURL }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSidebarOpen={setSidebarOpen}
            menuItems={menuItems}
            userRole="Book Enthusiast"
          >
            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/addBook">
                <button className="w-full bg-gradient-to-r from-bgBtn to-bgBtn/80 hover:from-hoverBtn hover:to-hoverBtn text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                  + Add New Book
                </button>
              </Link>
            </div>
          </DashboardSidebar>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8">
          <MobileMenuButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <DashboardHeader 
            title={`Welcome back, ${user?.displayName?.split(' ')[0]}! 👋`}
            subtitle="Track your reading journey and discover new books" 
          />

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Books"
                  value={readingStats.total}
                  icon={FaBook}
                  gradient="from-blue-500 to-blue-700"
                />
                <StatsCard
                  title="Finished"
                  value={readingStats.finished}
                  icon={FaCheckCircle}
                  gradient="from-green-500 to-green-700"
                />
                <StatsCard
                  title="Currently Reading"
                  value={readingStats.currentlyReading}
                  icon={FaBookReader}
                  gradient="from-purple-500 to-purple-700"
                />
                <StatsCard
                  title="Reviews"
                  value={myReviews.length}
                  icon={FaStar}
                  gradient="from-orange-500 to-orange-700"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Reading Status"
                  type="doughnut"
                  data={readingStatusData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />

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
            </div>
          )}

          {/* My Books Tab */}
          {activeTab === "myBooks" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Books Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myBooks.map((book) => (
                    <BookCard key={book._id} book={book} showUpvotes={false} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
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
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-10">No reviews yet. Start reviewing your books!</p>
                )}              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-8 animate-fadeIn">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
