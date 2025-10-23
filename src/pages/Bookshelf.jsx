import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "../components/common/Loading";
import BooksNotFound from "../components/common/BooksNotFound";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import { Link } from "react-router";
import { FaSearch, FaFilter, FaHeart, FaBook, FaThLarge, FaList } from "react-icons/fa";

const Bookshelf = () => {
  const [bookShelfLoading, setBookShelfLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    document.title = "LitShelf || BookShelf";
  }, []);

  useEffect(() => {
    axios(`${import.meta.env.VITE_baseURL}/books`).then((res) => {
      setAllBooks(res.data);
      setFilteredBooks(res.data);
      setBookShelfLoading(false);
    });
  }, []);

  // Get unique categories
  const categories = [...new Set(allBooks.map(book => book.book_category))].filter(Boolean);

  const updatedBooks = filteredBooks.filter(
    (book) =>
      (book.book_title?.toLowerCase().includes(query.toLowerCase()) ||
      book.book_author?.toLowerCase().includes(query.toLowerCase())) &&
      (selectedCategory === "" || book.book_category === selectedCategory) &&
      (selectedStatus === "" || book.reading_status === selectedStatus)
  );

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedStatus("");
    setQuery("");
  };

  if (bookShelfLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base via-base-secondary to-base dark:from-darkBase dark:via-darkBase-secondary dark:to-darkBase pt-32 pb-20">
      <div className="w-11/12 max-w-7xl mx-auto">
        {allBooks?.length === 0 ? (
          <BooksNotFound />
        ) : (
          <>
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl font-black mb-4">
                  <span className="bg-gradient-to-r from-bgBtn via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Explore Books
                  </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                  Discover your next favorite read from our curated collection of {allBooks.length} books
                </p>
              </motion.div>
            </div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 bg-white dark:bg-darkBase-secondary rounded-2xl shadow-xl p-6"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-bgBtn transition-all"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-bgBtn transition-all cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-bgBtn transition-all cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="Finished">Finished</option>
                  <option value="Currently Reading">Currently Reading</option>
                  <option value="Want to Read">Want to Read</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-bgBtn text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaThLarge size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-bgBtn text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaList size={18} />
                  </button>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || selectedStatus || query) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Active Filters Display */}
              {(selectedCategory || selectedStatus) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-bgBtn/10 text-bgBtn rounded-full text-sm font-semibold">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {selectedStatus && (
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                      Status: {selectedStatus}
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Results Count */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-bold text-bgBtn">{updatedBooks.length}</span> books found
              </p>
            </div>

            {/* Books Display */}
            {updatedBooks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <FaBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-500 dark:text-gray-400">No books found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-bgBtn hover:bg-hoverBtn text-white rounded-xl transition-all font-semibold"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {updatedBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Book Cover */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={book.cover_photo}
                        alt={book.book_title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x400?text=No+Cover";
                        }}
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-bgBtn/90 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg">
                          {book.book_category}
                        </span>
                      </div>

                      {/* Upvotes */}
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                          <FaHeart className="text-red-500 text-sm" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{book.upvote || 0}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className={`block text-center px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
                          book.reading_status === 'Finished' ? 'bg-green-500/90 text-white' :
                          book.reading_status === 'Currently Reading' ? 'bg-purple-500/90 text-white' :
                          'bg-orange-500/90 text-white'
                        }`}>
                          {book.reading_status || 'Not Started'}
                        </span>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-bgBtn transition-colors">
                        {book.book_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                        by {book.book_author}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <FaBook className="text-bgBtn" />
                          {book.total_page} pages
                        </span>
                      </div>

                      <Link to={`/books/${book._id}`}>
                        <button className="w-full py-2.5 bg-gradient-to-r from-bgBtn to-bgBtn/80 hover:from-hoverBtn hover:to-hoverBtn text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {updatedBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="group bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex gap-6 p-6">
                      {/* Book Cover */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-44 rounded-xl overflow-hidden shadow-md">
                          <img
                            src={book.cover_photo}
                            alt={book.book_title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/128x176?text=No+Cover";
                            }}
                          />
                        </div>
                      </div>

                      {/* Book Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-bgBtn transition-colors">
                              {book.book_title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              by <span className="font-semibold">{book.book_author}</span>
                            </p>
                          </div>
                          
                          {/* Upvotes */}
                          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <FaHeart className="text-red-500" />
                            <span className="font-bold text-gray-900 dark:text-white">{book.upvote || 0}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className="px-3 py-1 bg-bgBtn/10 text-bgBtn font-semibold text-sm rounded-full">
                            {book.book_category}
                          </span>
                          <span className={`px-3 py-1 font-semibold text-sm rounded-full ${
                            book.reading_status === 'Finished' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            book.reading_status === 'Currently Reading' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {book.reading_status || 'Not Started'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-full flex items-center gap-1">
                            <FaBook className="text-bgBtn" />
                            {book.total_page} pages
                          </span>
                        </div>

                        {book.book_overview && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                            {book.book_overview}
                          </p>
                        )}

                        <Link to={`/books/${book._id}`}>
                          <button className="px-6 py-2.5 bg-gradient-to-r from-bgBtn to-bgBtn/80 hover:from-hoverBtn hover:to-hoverBtn text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                            View Full Details →
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookshelf;
