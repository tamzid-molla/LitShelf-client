import React, { useState, useEffect } from "react";
import { 
  FaUsers, 
  FaBook, 
  FaStar, 
  FaChartLine, 
  FaUserShield,
  FaTachometerAlt,
  FaPlus,
  FaBookOpen,
  FaUserCircle
} from "react-icons/fa";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
    { id: "users", label: "Manage Users", icon: FaUsers },
    { id: "books", label: "All Books", icon: FaBook },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
  ];

  const quickActions = [
    { to: "/addBook", label: "Add Book", icon: FaPlus },
    { to: "/myBooks", label: "My Books", icon: FaBookOpen },
    { to: "/profile", label: "Profile", icon: FaUserCircle },
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
        <main className="flex-1 overflow-y-auto px-4 lg:px-8">
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
