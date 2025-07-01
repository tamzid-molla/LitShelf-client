import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const PopularSingleBook = ({ book }) => {
  const {
    cover_photo,
    book_author,
    book_category,
    book_overview,
    book_title,
    upvote,
    total_page,
  } = book;
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0, scale: 1.01 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className="bg-base-secondary dark:bg-darkBase-secondary flex flex-col p-5 rounded-lg shadow-2xs hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-7">
        <img
          src={cover_photo}
          alt={book_title}
          className="w-auto h-[185px] object-cover"
        />
        <div className="">
          <h3 className="text-xl font-semibold truncate">{book_title}</h3>
          <p className="text-sm mb-2">by {book_author}</p>
          <p className="font-bold mb-2">
            Category : <span className="text-sm"> {book_category}</span>{" "}
          </p>
          <p className="text-sm mb-2">{total_page} pages</p>
          <p className="text-sm font-medium text-bgBtn">{upvote} Upvotes</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm line-clamp-2">{book_overview}</p>
      </div>
      <div className="">
        <Link to={`/books/${book._id}`} className="flex flex-grow items-end">
          <button className="btn bg-bgBtn text-lg hover:bg-hoverBtn text-textBtn w-full">
            Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default PopularSingleBook;
