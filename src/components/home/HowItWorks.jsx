import React from 'react';
import reviewImg from "../../assets/howItWork images/Review.png";
import addBookImg from "../../assets/howItWork images/Added book.png";
import loginImg from "../../assets/howItWork images/login.png";

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 dark:bg-darkBase-secondary w-11/12 mx-auto rounded-2xl py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Step 1 */}
          <div className="bg-white dark:bg-darkBase-secondary p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <img
              src={loginImg}
              alt="Login"
              className="mx-auto w-24 h-24 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Sign Up / Log In
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create your account or log in to start adding and managing your favorite books.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-darkBase-secondary p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <img
              src={addBookImg}
              alt="Add Book"
              className="mx-auto w-24 h-24 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Add Your Book
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Submit details like title, author, cover photo, and track your reading progress.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-darkBase-secondary p-6 rounded-xl shadow hover:shadow-lg transition-all">
            <img
              src={reviewImg}
              alt="Review Book"
              className="mx-auto w-24 h-24 object-contain mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Track & Review
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Update reading status, write reviews, and view your reading journey.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
