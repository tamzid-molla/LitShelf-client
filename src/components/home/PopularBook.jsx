import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaStar, FaArrowRight } from "react-icons/fa";
import BooksNotFound from "../common/BooksNotFound";

const PopularBook = ({ popularBook }) => {
  return (
    <section className="my-28 w-11/12 mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-bgBtn">
          Popular Books
        </h2>
        <p className="text-sm sm:text-[16px] md:text-lg text-gray-600 dark:text-gray-400">
          Explore the most loved books by our community
        </p>
      </div>
      
      {popularBook?.length === 0 ? (
        <BooksNotFound></BooksNotFound>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popularBook.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-base-secondary dark:bg-darkBase-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-bgBtn/10 to-hoverBtn/10">
                <img
                  src={book.cover_photo}
                  alt={book.book_title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Upvote Badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-bgBtn to-hoverBtn text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <FaStar className="text-sm" />
                  <span className="font-bold text-sm">{book.upvote}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-bgBtn">
                    {book.book_category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[56px] text-gray-900 dark:text-white">
                  {book.book_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  by {book.book_author}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>{book.total_page} pages</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 min-h-[40px]">
                  {book.book_overview}
                </p>

                {/* View Details Button */}
                <Link to={`/books/${book._id}`}>
                  <button className="w-full bg-bgBtn hover:bg-hoverBtn cursor-pointer text-textBtn font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    View Details
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularBook;
