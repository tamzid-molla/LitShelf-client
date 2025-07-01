
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router";
import BooksNotFound from "../common/BooksNotFound";
import axios from "axios";

const FeaturedCategories = ({categories}) => {
  
  return (
    <section className="py-16 rounded-2xl w-11/12 my-28 mx-auto px-6 bg-base-secondary dark:bg-darkBase-secondary flex items-center justify-center">
  <div className="pb-20">
    <h2 className="text-3xl font-extrabold text-center mb-12 tracking-tight">
      Explore Our Featured Categories
        </h2>
        {
          categories?.length === 0 ? <BooksNotFound></BooksNotFound>
            :
        
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {categories.map((cat) => (
          <motion.div
              initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0,scale:1.01 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
          key={cat.category}
          className="relative bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="p-6 relative z-10">
            <h3 className="text-xl font-semibold mb-2">{cat.category}</h3>
            <p className="text-sm  mb-4">{cat.count} books available</p>
            <Link to={`/books/categories/${encodeURIComponent(cat.category)}`}>
              <button className="w-full px-4 py-2 bg-bgBtn cursor-pointer text-textBtn font-medium rounded-lg hover:bg-hoverBtn transition-colors duration-200">
                Discover Books
              </button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>}
  </div>
</section>
  );
};

export default FeaturedCategories;
