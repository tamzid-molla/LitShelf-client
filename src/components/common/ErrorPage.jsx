import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const ErrorPage = () => {
  useEffect(() => {
      document.title = "LitShelf || ERROR ";
    }, []);
  return (
      <section className='pt-36 mb-28'>
          <div className="min-h-[75vh] rounded-2xl py-10 w-11/12 mx-auto  bg-base-secondary dark:bg-darkBase-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-md"
      >
        <motion.div
          className="mb-8"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <svg
            className="w-32 h-32 mx-auto "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>
        <h1 className="text-4xl font-extrabold text-bgBtn mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-bgBtn mb-8">
          Looks like you’ve wandered into the cosmic void. Let’s get you back to safety!
        </p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-bgBtn text-white font-semibold rounded-full shadow-lg hover:bg-hoverBtn cursor-pointer transition-colors duration-300"
          >
            Return to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
    </section>
  );
};

export default ErrorPage;