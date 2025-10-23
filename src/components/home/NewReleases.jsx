import { motion } from "framer-motion";
import { FaBook, FaClock, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import BooksNotFound from "../common/BooksNotFound";

const NewReleases = ({books}) => {

  return (
    <section className="py-16 mb-28 w-11/12 mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <div className="bg-bgBtn p-2 sm:p-3 rounded-full">
            <FaBook className="text-xl sm:text-2xl text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-bgBtn">
            New Releases
          </h2>
        </div>
        <p className="text-sm sm:text-[16px] md:text-lg text-gray-600 dark:text-gray-300">
          Discover the latest books added to our collection
        </p>
      </div>
      
      {books?.length === 0 ? (
        <BooksNotFound></BooksNotFound>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-bgBtn/10 to-hoverBtn/10">
                {/* NEW Badge with Animation */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-bgBtn rounded-lg blur-sm animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-bgBtn to-hoverBtn text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                      <FaClock className="animate-spin" style={{animationDuration: '3s'}} />
                      NEW
                    </div>
                  </div>
                </div>

                <img
                  src={book.cover_photo}
                  alt={book.book_title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 line-clamp-2 min-h-[56px] text-gray-900 dark:text-gray-100">
                  {book.book_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  by {book.book_author}
                </p>

                {/* View Details Button */}
                <Link to={`/books/${book._id}`}>
                  <button className="w-full bg-bgBtn hover:bg-hoverBtn text-textBtn cursor-pointer font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn">
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

export default NewReleases;