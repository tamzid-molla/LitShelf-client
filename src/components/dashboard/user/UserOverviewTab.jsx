import React from "react";
import { FaBook, FaCheckCircle, FaBookReader, FaStar } from "react-icons/fa";
import StatsCard from "../StatsCard";
import ChartCard from "../ChartCard";
import { Link } from "react-router-dom";

const UserOverviewTab = ({ readingStats, readingStatusData, categoryChartData, myBooks, myReviews }) => {
  return (
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
  );
};

export default UserOverviewTab;