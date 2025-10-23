import React from "react";
import { FaUsers, FaBook, FaStar } from "react-icons/fa";
import StatsCard from "../StatsCard";
import ChartCard from "../ChartCard";
import BookCard from "../BookCard";

const AdminOverviewTab = ({ stats, categoryChartData, userRoleData, allBooks }) => {
  return (
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
  );
};

export default AdminOverviewTab;