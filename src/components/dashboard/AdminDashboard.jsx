import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaBook, 
  FaStar, 
  FaChartLine, 
  FaUserShield,
  FaBookOpen,
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import CountUp from "react-countup";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

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
                    src={userData?.photoURL || "https://via.placeholder.com/150"}
                    alt={userData?.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-bgBtn"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-darkBase-secondary"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{userData?.name}</h3>
                  <p className="text-xs text-bgBtn font-semibold uppercase flex items-center gap-1">
                    <FaUserShield /> Admin
                  </p>
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your LitShelf platform
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                      <h3 className="text-4xl font-black">
                        <CountUp end={stats.totalUsers} duration={2} />
                      </h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-xl">
                      <FaUsers className="text-4xl" />
                    </div>
                  </div>
                </div>

                {/* Total Books */}
                <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-1">Total Books</p>
                      <h3 className="text-4xl font-black">
                        <CountUp end={stats.totalBooks} duration={2} />
                      </h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-xl">
                      <FaBook className="text-4xl" />
                    </div>
                  </div>
                </div>

                {/* Total Reviews */}
                <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium mb-1">Total Reviews</p>
                      <h3 className="text-4xl font-black">
                        <CountUp end={stats.totalReviews} duration={2} />
                      </h3>
                    </div>
                    <div className="bg-white/20 p-4 rounded-xl">
                      <FaStar className="text-4xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Books by Category
                  </h3>
                  <div className="h-64">
                    <Pie data={categoryChartData} options={{ maintainAspectRatio: false, responsive: true }} />
                  </div>
                </div>

                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Users by Role
                  </h3>
                  <div className="h-64">
                    <Bar 
                      data={userRoleData} 
                      options={{ 
                        maintainAspectRatio: false, 
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
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
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user roles and permissions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {allUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.photoURL || "https://via.placeholder.com/40"}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.email !== userData.email && (
                            <select
                              value={user.role || 'user'}
                              onChange={(e) => handleRoleChange(user.email, e.target.value)}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bgBtn"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                          {user.email === userData.email && (
                            <span className="text-gray-500 dark:text-gray-400 italic">You</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Books Tab */}
          {activeTab === "books" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allBooks.map((book) => (
                    <div
                      key={book._id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <img
                        src={book.cover_photo}
                        alt={book.book_title}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {book.book_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.book_author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-bgBtn/10 text-bgBtn px-2 py-1 rounded-full font-semibold">
                          {book.book_category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{book.upvote || 0} ⬆</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-darkBase-secondary rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Category Distribution</h3>
                  <div className="h-80">
                    <Bar 
                      data={categoryChartData} 
                      options={{ 
                        maintainAspectRatio: false, 
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

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
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
