import { motion } from 'framer-motion';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/FirebaseContext';

const CallToAction = () => {
  const { user } = useContext(AuthContext);

  return (
    <section className="w-11/12 mx-auto my-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-bgBtn to-hoverBtn rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

        {/* Content */}
        <div className="relative z-10 py-20 px-8 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-full">
              <FaBookOpen className="text-5xl text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6"
          >
            Ready to Start Your Reading Journey?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-10 max-w-3xl mx-auto px-4"
          >
            {user
              ? 'Discover thousands of books, connect with readers, and track your reading progress all in one place.'
              : 'Join thousands of book lovers and unlock access to our entire collection of amazing books.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {!user ? (
              <>
                <Link to="/login">
                  <button className="group bg-white text-bgBtn font-bold px-8 py-4 cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:scale-105">
                    Get Started Now
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/bookshelf">
                  <button className="group bg-white/10 cursor-pointer backdrop-blur-sm border-2 border-white text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3 hover:scale-105">
                    Browse Books
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/bookshelf">
                  <button className="group bg-white text-bgBtn cursor-pointer font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 hover:scale-105">
                    Explore Books
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/dashboard">
                  <button className="group bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold px-8 py-4 rounded-xl cursor-pointer shadow-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3 hover:scale-105">
                    My Dashboard
                  </button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-black text-white mb-1">10K+</p>
              <p className="text-sm text-white/80">Books Available</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-black text-white mb-1">5K+</p>
              <p className="text-sm text-white/80">Active Readers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-black text-white mb-1">4.8★</p>
              <p className="text-sm text-white/80">Average Rating</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
