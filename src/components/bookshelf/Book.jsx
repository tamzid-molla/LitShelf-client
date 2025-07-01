
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router';

const Book = ({ book }) => {
  const { cover_photo, book_author, book_category, book_title, upvote } = book;
  
  
    return (
        <motion.div
        initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0,scale:1.01 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            className=" w-full bg-base-secondary dark:bg-darkBase-secondary rounded-2xl shadow-xl overflow-hidden">
     
      <div className="relative h-64 w-full">
        <img
          src={cover_photo}
            alt={book_title}
             onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://i.ibb.co/99RttPHG/books-stack-realistic-1284-4735.jpg";
  }}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-InputRing text-white text-xs font-semibold px-2 py-1 rounded-full">
          {book_category}
                </span>
                <button
            className="flex items-center gap-1 absolute top-4 right-4 bg-gradient-to-r from-bgBtn to-hoverBtn text-white px-2 py-1 rounded-full hover:from-hoverBtn hover:to-bgBtn transition-all duration-300"
          >
            <FaHeart className={`text-sm text-red-400`} />
            <span>{upvote}</span>
          </button>
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold  truncate">{book_title}</h2>
        <p className="text-sm mt-1">by {book_author}</p>

        <div className="">
              <Link to={`/books/${book._id}`} className='flex flex-grow items-end'><button className="btn bg-bgBtn rounded-lg mt-4 text-lg hover:bg-hoverBtn text-textBtn w-full">Details</button></Link>
          </div>
      </div>
    </motion.div>
    );
};

export default Book;