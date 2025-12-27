import React, { useState, useContext, useEffect } from "react";
import {
  FaBook,
  FaStar,
  FaChartLine,
  FaBookReader,
  FaUser,
  FaCheckCircle,
  FaPlus,
  FaBookOpen,
  FaEdit,
  FaTimes,
  FaCamera,
  FaImage,
  FaArrowRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/FirebaseContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddBooksForm from "../addBooks/AddBooksForm";

// Import small components
import StatsCard from "./StatsCard";
import DashboardSidebar from "./DashboardSidebar";
import MobileMenuButton from "./MobileMenuButton";
import DashboardHeader from "./DashboardHeader";
import ChartCard from "./ChartCard";
import BookCard from "./BookCard";

// Import new user components
import UserOverviewTab from "./user/UserOverviewTab";
import UserAddBookTab from "./user/UserAddBookTab";
import UserMyBooksTab from "./user/UserMyBooksTab";
import UserReviewsTab from "./user/UserReviewsTab";
import UserProfileTab from "./user/UserProfileTab";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UserDashboard = ({ userData }) => {
  const { user, updateUser, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    phone: userData?.phone || "",
    location: userData?.location || "",
    bio: userData?.bio || "",
    website: userData?.website || "",
    favoriteGenre: userData?.favoriteGenre || "",
    readingGoal: userData?.readingGoal || "",
  });
  const [userSubscriptionData, setUserSubscriptionData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data to get books_added field
        const userRes = await axiosSecure.get(`/users/${user?.email}`);
        setUserSubscriptionData(userRes.data);

        const [booksRes, reviewsRes] = await Promise.all([
          axiosSecure.get(`/books/email?email=${user?.email}`),
          axios.get(`${import.meta.env.VITE_baseURL}/ratings`),
        ]);

        setMyBooks(booksRes.data);
        const userReviews = reviewsRes.data.filter((r) => r.reviewer_email === user?.email);
        setMyReviews(userReviews);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user?.email) {
      fetchUserData();
    }
  }, [user, axiosSecure]);

  // Calculate reading statistics
  const readingStats = {
    currentlyReading: myBooks.filter((b) => b.reading_status === "Reading").length,
    wantToRead: myBooks.filter((b) => b.reading_status === "Want-to-Read").length,
    finished: myBooks.filter((b) => b.reading_status === "Read").length,
    total: myBooks.length,
  };

  // Chart data for reading status
  const readingStatusData = {
    labels: ["Currently Reading", "Want to Read", "Finished"],
    datasets: [
      {
        data: [readingStats.currentlyReading, readingStats.wantToRead, readingStats.finished],
        backgroundColor: ["rgba(42, 157, 143, 0.8)", "rgba(255, 206, 86, 0.8)", "rgba(75, 192, 192, 0.8)"],
        borderColor: ["rgba(42, 157, 143, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 2,
      },
    ],
  };

  // Category distribution data
  const categoryData = myBooks.reduce((acc, book) => {
    acc[book.book_category] = (acc[book.book_category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Books by Category",
        data: Object.values(categoryData),
        backgroundColor: "rgba(42, 157, 143, 0.6)",
        borderColor: "rgba(42, 157, 143, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "addBook", label: "Add Book", icon: FaPlus },
    { id: "myBooks", label: "My Books", icon: FaBook },
    { id: "reviews", label: "My Reviews", icon: FaStar },
    { id: "profile", label: "Profile", icon: FaUser },
  ];

  const quickActions = [{ to: "/myBooks", label: "My Books", icon: FaBookOpen }];

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
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
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
      await axios.patch(`${import.meta.env.VITE_baseURL}/users/${user.email}`, {
        name: profileData.name,
        photoURL: photoURL,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        website: profileData.website,
        favoriteGenre: profileData.favoriteGenre,
        readingGoal: profileData.readingGoal,
      });

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
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setUpdating(false);
      setUploadingImage(false);
    }
  };

  // States for Add Book functionality
  const [uploading, setUploading] = useState(false);
  const [bookImagePreview, setBookImagePreview] = useState(null);

  // Function to check if user has reached the book limit
  const checkBookLimit = (currentBookCount, userData) => {
    if (userData?.books_added === "Unlimited") {
      return false; // User has unlimited books
    } else {
      const limit = typeof userData?.books_added === "number" ? userData.books_added : 1;
      return currentBookCount >= limit;
    }
  };

  // Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();

    // Check if user has reached the limit based on their subscription
    if (userSubscriptionData) {
      if (userSubscriptionData.books_added === "Unlimited") {
        // User has unlimited books, proceed with submission
      } else {
        const limit = typeof userSubscriptionData.books_added === "number" ? userSubscriptionData.books_added : 1;
        if (myBooks.length >= limit) {
          Swal.fire({
            icon: "error",
            title: "Limit Reached!",
            text: `You can only add ${limit} book(s). Upgrade to a subscription plan to add more books.`,
          });
          return;
        }
      }
    } else {
      // If no subscription data, default to 1 book limit
      if (myBooks.length >= 1) {
        Swal.fire({
          icon: "error",
          title: "Limit Reached!",
          text: "You can only add 1 free book. Upgrade to a subscription plan to add more books.",
        });
        return;
      }
    }

    setUploading(true);
    const form = e.target;
    const formData = new FormData(form);
    const { cover_photo: _cover_photo, ...allData } = Object.fromEntries(formData.entries()); // Use _ prefix to indicate unused var
    allData.upvote = 0;
    allData.reviewerPhoto = user?.photoURL;

    try {
      const image = form.cover_photo.files[0];
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
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
        const booksRes = await axiosSecure.get(`/books/email?email=${user?.email}`);
        setMyBooks(booksRes.data);
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

  // Render the Add Book tab with limit check
  const renderAddBookTab = () => {
    if (userSubscriptionData) {
      const hasReachedLimit = checkBookLimit(myBooks.length, userSubscriptionData);
      const limit =
        userSubscriptionData?.books_added === "Unlimited"
          ? "Unlimited"
          : typeof userSubscriptionData?.books_added === "number"
          ? userSubscriptionData.books_added
          : 1;

      if (hasReachedLimit) {
        return (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-bgBtn to-hoverBtn p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FaBook className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Book Limit Reached</h2>
                    <p className="text-white/90 mt-1">You've already added your {limit} book(s) to your library</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="text-5xl text-amber-500 mb-6">⚠️</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    You've Reached Your Book Limit
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    {userSubscriptionData?.books_added === "Unlimited"
                      ? "You have unlimited books but there seems to be an issue."
                      : `As a ${
                          userSubscriptionData?.role || "free"
                        } user, you can only add ${limit} book(s) to your library. To add more books, please upgrade to a subscription plan.`}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/subscribe")}
                      className="px-8 py-4 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Upgrade to Subscribe</span>
                      <FaArrowRight />
                    </button>
                    <Link
                      to="/myBooks"
                      className="px-8 py-4 border-2 border-bgBtn text-bgBtn dark:text-bgBtn hover:bg-bgBtn/10 dark:hover:bg-bgBtn/10 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <span>View My Books</span>
                      <FaBookOpen />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <UserAddBookTab
            handleBookSubmit={handleBookSubmit}
            uploading={uploading}
            bookImagePreview={bookImagePreview}
            setBookImagePreview={setBookImagePreview}
          />
        );
      }
    } else {
      // Default to old behavior if user subscription data is not loaded yet
      if (myBooks.length >= 1) {
        return (
          <div className="animate-fadeIn">
            <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-bgBtn to-hoverBtn p-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FaBook className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Book Limit Reached</h2>
                    <p className="text-white/90 mt-1">You've already added your free book to your library</p>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="text-5xl text-amber-500 mb-6">⚠️</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    You've Reached Your Free Book Limit
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    As a free user, you can only add 1 book to your library. To add more books, please upgrade to a
                    subscription plan.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/subscribe")}
                      className="px-8 py-4 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Upgrade to Subscribe</span>
                      <FaArrowRight />
                    </button>
                    <Link
                      to="/myBooks"
                      className="px-8 py-4 border-2 border-bgBtn text-bgBtn dark:text-bgBtn hover:bg-bgBtn/10 dark:hover:bg-bgBtn/10 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2">
                      <span>View My Books</span>
                      <FaBookOpen />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <UserAddBookTab
            handleBookSubmit={handleBookSubmit}
            uploading={uploading}
            bookImagePreview={bookImagePreview}
            setBookImagePreview={setBookImagePreview}
          />
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-base dark:bg-darkBase pt-20">
      <div className="flex">
        {/* Sidebar - Completely Fixed */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-darkBase-secondary shadow-2xl transition-transform duration-300 ease-in-out top-20 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}>
          <DashboardSidebar
            userData={{ ...userData, name: user?.displayName, photoURL: user?.photoURL }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSidebarOpen={setSidebarOpen}
            menuItems={menuItems}
            userRole="Book Enthusiast">
            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </p>
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
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 px-4 lg:px-8 pb-10">
          <MobileMenuButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <DashboardHeader
            title={`Welcome back, ${user?.displayName?.split(" ")[0]}!`}
            subtitle="Track your reading journey and discover new books"
          />

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <UserOverviewTab
              readingStats={readingStats}
              readingStatusData={readingStatusData}
              categoryChartData={categoryChartData}
              myBooks={myBooks}
              myReviews={myReviews}
            />
          )}

          {/* Add Book Tab */}
          {activeTab === "addBook" && renderAddBookTab()}

          {/* My Books Tab */}
          {activeTab === "myBooks" && <UserMyBooksTab myBooks={myBooks} />}

          {/* Reviews Tab */}
          {activeTab === "reviews" && <UserReviewsTab myReviews={myReviews} />}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <UserProfileTab
              user={user}
              userData={userData}
              readingStats={readingStats}
              myReviews={myReviews}
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

export default UserDashboard;
