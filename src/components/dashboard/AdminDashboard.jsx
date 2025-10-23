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

// Import new admin components
import AdminOverviewTab from "./admin/AdminOverviewTab";
import AdminAddBookTab from "./admin/AdminAddBookTab";
import AdminUsersTab from "./admin/AdminUsersTab";
import AdminBooksTab from "./admin/AdminBooksTab";
import AdminAnalyticsTab from "./admin/AdminAnalyticsTab";
import AdminProfileTab from "./admin/AdminProfileTab";

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
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-darkBase-secondary shadow-2xl transition-transform duration-300 ease-in-out top-20 transform ${
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
            <AdminOverviewTab 
              stats={stats}
              categoryChartData={categoryChartData}
              userRoleData={userRoleData}
              allBooks={allBooks}
            />
          )}

          {/* Add Book Tab */}
          {activeTab === "addBook" && (
            <AdminAddBookTab 
              handleBookSubmit={handleBookSubmit}
              uploading={uploading}
              bookImagePreview={bookImagePreview}
              setBookImagePreview={setBookImagePreview}
            />
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <AdminUsersTab 
              allUsers={allUsers}
              userData={userData}
              handleRoleChange={handleRoleChange}
            />
          )}

          {/* Books Tab */}
          {activeTab === "books" && (
            <AdminBooksTab allBooks={allBooks} />
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <AdminAnalyticsTab 
              categoryChartData={categoryChartData}
              stats={stats}
            />
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <AdminProfileTab 
              userData={userData}
              stats={stats}
              showUpdateModal={showUpdateModal}
              setShowUpdateModal={setShowUpdateModal}
              profileData={profileData}
              setProfileData={setProfileData}
              handleProfileUpdate={handleProfileUpdate}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              handleImageChange={handleImageChange}
              updating={updating}
              uploadingImage={uploadingImage}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
