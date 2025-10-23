import React from "react";
import ChartCard from "../ChartCard";

const AdminAnalyticsTab = ({ categoryChartData, stats }) => {
  return (
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
  );
};

export default AdminAnalyticsTab;