import React, { useState, useEffect, useContext } from "react";
import { 
  FaUsers, 
  FaBook, 
  FaStar, 
  FaChartLine, 
  FaUserShield,
  FaTachometerAlt,
  FaPlus,
  FaBookOpen,
  FaUser,
  FaEdit,
  FaTimes,
  FaCamera,
  FaCheckCircle,
  FaImage,
} from "react-icons/fa";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/FirebaseContext";
import Swal from "sweetalert2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AddBooksForm from "../addBooks/AddBooksForm";

// Import small components
import StatsCard from "./StatsCard";
import DashboardSidebar from "./DashboardSidebar";
import MobileMenuButton from "./MobileMenuButton";
import DashboardHeader from "./DashboardHeader";
import ChartCard from "./ChartCard";
import BookCard from "./BookCard";
import UserTable from "./UserTable";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = ({ userData }) => {
  const { user, updateUser, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalReviews: 0,
    categories: []
  });
  const [allUsers, setAllUsers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    photoURL: userData?.photoURL || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    bio: userData?.bio || '',
    website: userData?.website || '',
    favoriteGenre: userData?.favoriteGenre || '',
    readingGoal: userData?.readingGoal || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, booksRes, ratingsRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_baseURL}/users`),
          axios.get(`${import.meta.env.VITE_baseURL}/books`),
          axios.get(`${import.meta.env.VITE_baseURL}/ratings`),
          axios.get(`${import.meta.env.VITE_baseURL}/books/total/category`)
        ]);

        setStats({
          totalUsers: usersRes.data.length,
          totalBooks: booksRes.data.length,
          totalReviews: ratingsRes.data.length,
          categories: categoriesRes.data
        });
        setAllUsers(usersRes.data);
        setAllBooks(booksRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (email, newRole) => {
    try {
      await axiosSecure.patch(`/users/role/${email}`, { role: newRole });
      setAllUsers(allUsers.map(u => u.email === email ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Chart data
  const categoryChartData = {
    labels: stats.categories.map(c => c.category),
    datasets: [{
      label: 'Books per Category',
      data: stats.categories.map(c => c.count),
      backgroundColor: [
        'rgba(42, 157, 143, 0.8)',
        'rgba(138, 80, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(42, 157, 143, 1)',
        'rgba(138, 80, 255, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 2
    }]
  };

  const userRoleData = {
    labels: ['Admin', 'User'],
    datasets: [{
      label: 'Users by Role',
      data: [
        allUsers.filter(u => u.role === 'admin').length,
        allUsers.filter(u => u.role === 'user' || !u.role).length
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(42, 157, 143, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(42, 157, 143, 1)',
      ],
      borderWidth: 2
    }]
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: FaTachometerAlt },
    { id: "addBook", label: "Add Book", icon: FaPlus },
    { id: "users", label: "Manage Users", icon: FaUsers },
    { id: "books", label: "All Books", icon: FaBook },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
    { id: "profile", label: "Profile", icon: FaUser },
  ];

  const quickActions = [
    { to: "/myBooks", label: "My Books", icon: FaBookOpen },
  ];

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let photoURL = profileData.photoURL;

      // Upload new image if selected
      if (selectedImage) {
        setUploadingImage(true);
        photoURL = await uploadImageToImgBB(selectedImage);
        setUploadingImage(false);
      }

      // Update Firebase profile
      await updateUser({
        displayName: profileData.name,
        photoURL: photoURL,
      });

      // Update database with all profile fields
      await axios.patch(
        `${import.meta.env.VITE_baseURL}/users/${userData.email}`,
        {
          name: profileData.name,
          photoURL: photoURL,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          website: profileData.website,
          favoriteGenre: profileData.favoriteGenre,
          readingGoal: profileData.readingGoal,
        }
      );

      // Update local user state
      setUser({
        ...user,
        displayName: profileData.name,
        photoURL: photoURL,
      });

      setShowUpdateModal(false);
      setSelectedImage(null);
      setImagePreview(null);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setUpdating(false);
      setUploadingImage(false);
    }
  };

  // States for Add Book functionality
  const [uploading, setUploading] = useState(false);
  const [bookImagePreview, setBookImagePreview] = useState(null);

  // Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const form = e.target;
    const formData = new FormData(form);
    const { cover_photo, ...allData } = Object.fromEntries(formData.entries());
    allData.upvote = 0;
    allData.reviewerPhoto = user?.photoURL;
    
    try {
      const image = form.cover_photo.files[0];
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        imageFormData
      );
      allData.cover_photo = data?.data?.display_url;

      const response = await axiosSecure.post(`/books`, allData);
      
      if (response.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book added to your library successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        e.target.reset();
        setBookImagePreview(null);
        // Refresh books list
        const booksRes = await axios.get(`${import.meta.env.VITE_baseURL}/books`);
        setAllBooks(booksRes.data);
        setStats(prev => ({ ...prev, totalBooks: booksRes.data.length }));
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add book. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base dark:bg-darkBase pt-20">
      <div className="flex">
        {/* Sidebar - Completely Fixed */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-darkBase-secondary shadow-2xl transition-transform duration-300 ease-in-out pt-20 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <DashboardSidebar
            userData={userData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSidebarOpen={setSidebarOpen}
            menuItems={menuItems}
            userRole="Admin"
          >
            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
              {quickActions.map((action) => (
                <Link key={action.to} to={action.to}>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all text-left">
                    <action.icon className="text-lg" />
                    <span className="font-medium">{action.label}</span>
                  </button>
                </Link>
              ))}
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
        <main className="flex-1 lg:ml-72 px-4 lg:px-8 pb-10">
          <MobileMenuButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <DashboardHeader 
            title="Admin Dashboard" 
            subtitle="Manage your LitShelf platform" 
          />

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={FaUsers}
                  gradient="from-blue-500 to-blue-700"
                />
                <StatsCard
                  title="Total Books"
                  value={stats.totalBooks}
                  icon={FaBook}
                  gradient="from-purple-500 to-purple-700"
                />
                <StatsCard
                  title="Total Reviews"
                  value={stats.totalReviews}
                  icon={FaStar}
                  gradient="from-green-500 to-green-700"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Books by Category"
                  type="pie"
                  data={categoryChartData}
                  options={{ maintainAspectRatio: false, responsive: true }}
                />
                <ChartCard
                  title="Users by Role"
                  type="bar"
                  data={userRoleData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Recent Books Added
                </h3>
                <div className="space-y-3">
                  {allBooks.slice(0, 5).map((book) => (
                    <div
                      key={book._id}
                      className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={book.cover_photo}
                        alt={book.book_title}
                        className="w-12 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{book.book_title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">by {book.book_author}</p>
                      </div>
                      <span className="px-3 py-1 bg-bgBtn/10 text-bgBtn text-xs font-semibold rounded-full">
                        {book.book_category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Book Tab */}
          {activeTab === "addBook" && (
            <div className="animate-fadeIn">
              <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-bgBtn to-hoverBtn p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <FaPlus className="text-3xl text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">Add New Book</h2>
                      <p className="text-white/90 mt-1">Share your favorite books with the community</p>
                    </div>
                  </div>
                </div>
                <AddBooksForm 
                  handleBookSubmit={handleBookSubmit} 
                  uploading={uploading}
                  imagePreview={bookImagePreview}
                  setImagePreview={setBookImagePreview}
                />
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles and permissions</p>
              </div>
              <UserTable
                users={allUsers}
                currentUserEmail={userData.email}
                onRoleChange={handleRoleChange}
              />
            </div>
          )}

          {/* Books Tab */}
          {activeTab === "books" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allBooks.map((book) => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Category Distribution"
                  type="bar"
                  data={categoryChartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { display: false } }
                  }}
                  height="h-80"
                />

                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Platform Statistics</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Average Books per User</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {stats.totalUsers > 0 ? (stats.totalBooks / stats.totalUsers).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Average Reviews per Book</span>
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                          {stats.totalBooks > 0 ? (stats.totalReviews / stats.totalBooks).toFixed(1) : 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Categories</span>
                        <span className="text-2xl font-black text-green-600 dark:text-green-400">
                          {stats.categories.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h2>
                  <button
                    onClick={() => {
                      setProfileData({
                        name: userData?.name || '',
                        email: userData?.email || '',
                        photoURL: userData?.photoURL || '',
                        phone: userData?.phone || '',
                        location: userData?.location || '',
                        bio: userData?.bio || '',
                        website: userData?.website || '',
                        favoriteGenre: userData?.favoriteGenre || '',
                        readingGoal: userData?.readingGoal || '',
                      });
                      setSelectedImage(null);
                      setImagePreview(null);
                      setShowUpdateModal(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-bgBtn to-hoverBtn text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <FaEdit /> Update Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Picture Section */}
                  <div className="lg:col-span-1 flex flex-col items-center">
                    <div className="relative group">
                      <img
                        src={userData?.photoURL || "https://via.placeholder.com/150"}
                        alt={userData?.name}
                        className="w-40 h-40 rounded-full object-cover ring-4 ring-red-500 shadow-xl"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-3 ring-4 ring-white dark:ring-darkBase-secondary">
                        <FaUserShield className="text-white text-xl" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 text-center">
                      {userData?.name}
                    </h3>
                    <p className="text-red-500 font-semibold text-sm uppercase tracking-wider mt-2">
                      Administrator
                    </p>
                  </div>

                  {/* Profile Details Section */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaUser className="text-bgBtn" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {userData?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Platform Statistics */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaChartLine className="text-bgBtn" />
                        Platform Overview
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-blue-600">{stats.totalUsers}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Users</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-purple-600">{stats.totalBooks}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Books</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-green-600">{stats.totalReviews}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Reviews</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                          <span className="font-semibold text-red-500 capitalize">
                            {userData?.role || 'Admin'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400">Status</span>
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Profile Modal */}
              {showUpdateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                      <h3 className="text-2xl font-bold">Update Admin Profile</h3>
                      <button
                        onClick={() => setShowUpdateModal(false)}
                        className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                      >
                        <FaTimes size={24} />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative group">
                          <img
                            src={imagePreview || profileData.photoURL || "https://via.placeholder.com/150"}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-red-500 shadow-lg"
                          />
                          <div 
                            onClick={() => document.getElementById('adminProfileImageInput').click()}
                            className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <div className="text-center">
                              <FaCamera className="text-white text-2xl mx-auto mb-1" />
                              <p className="text-white text-xs">Change Photo</p>
                            </div>
                          </div>
                        </div>
                        <input
                          id="adminProfileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                          {selectedImage ? selectedImage.name : 'Click on image to upload new photo'}
                        </p>
                        {uploadingImage && (
                          <div className="flex items-center gap-2 mt-2 text-red-500">
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm">Uploading image...</span>
                          </div>
                        )}
                      </div>

                      {/* Two Column Layout for Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            disabled
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="City, Country"
                          />
                        </div>

                        {/* Website */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Website / Social Link
                          </label>
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>

                        {/* Favorite Genre */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Favorite Genre
                          </label>
                          <select
                            value={profileData.favoriteGenre}
                            onChange={(e) => setProfileData({ ...profileData, favoriteGenre: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="">Select a genre</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Thriller">Thriller</option>
                            <option value="Romance">Romance</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Biography">Biography</option>
                            <option value="History">History</option>
                            <option value="Self-Help">Self-Help</option>
                          </select>
                        </div>
                      </div>

                      {/* Reading Goal */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Annual Reading Goal
                        </label>
                        <input
                          type="number"
                          value={profileData.readingGoal}
                          onChange={(e) => setProfileData({ ...profileData, readingGoal: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Number of books per year"
                          min="0"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                          placeholder="Tell us about yourself and your reading preferences..."
                          rows="4"
                          maxLength="500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                          {profileData.bio?.length || 0}/500 characters
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowUpdateModal(false)}
                          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updating}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {updating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Updating...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
