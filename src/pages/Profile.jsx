import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaBook, FaUser } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AuthContext } from "../context/FirebaseContext";
import Loading from "../components/common/Loading";
import { IoMailOpenSharp } from "react-icons/io5";
import useAxiosSecure from "../hooks/useAxiosSecure";


ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
      document.title = "LitShelf || Profile";
    }, []);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/books/email?email=${user.email}`)
        .then((response) => {
          setBooks(response.data);
          const counts = response.data.reduce((acc, book) => {
            const category = book.book_category || "Unknown";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
          setCategoryCounts(counts);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          setLoading(false);
        });
    }
  }, [user]);

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Books by Category",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#FF6384", 
          "#36A2EB", 
          "#FFCE56", 
          "#4BC0C0", 
          "#9966FF", 
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#4B5563", 
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "Books by Category",
        color: "#1F2937",
        font: { size: 18 },
      },
    },
  };

  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-8 mb-28 w-11/12 mx-auto bg-base-secondary dark:bg-darkBase-secondary">
      <div className="max-w-4xl mx-auto bg-base-secondary dark:bg-darkBase-secondary rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.ibb.co/9kW3szMD/vector-flat-illustration-grayscale-avatar-600nw-2264922221.webp";
            }}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <FaUser className="mr-2 text-bgBtn" /> {user?.displayName || "User"}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 flex items-center"> <IoMailOpenSharp size={23} className="text-bgBtn mr-3"/>    {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold  mb-4 flex items-center">
          <FaBook className="mr-2 text-bgBtn" /> Bookshelf Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Total Books:</span> {books.length}
            </p>
            <div className="mt-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Books by Category:
              </p>
              {Object.entries(categoryCounts).length > 0 ? (
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <li key={category}>
                      {category}: {count} {count === 1 ? "book" : "books"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No books found.</p>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            {Object.keys(categoryCounts).length > 0 ? (
              <div className="w-full max-w-xs">
                <Pie data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No data to display in chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;