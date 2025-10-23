import React from "react";
import { Link } from "react-router";

const BookCard = ({ book, showCategory = true, showUpvotes = true }) => {
  return (
    <Link to={`/books/${book._id}`}>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
        <img
          src={book.cover_photo}
          alt={book.book_title}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {book.book_title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          by {book.book_author}
        </p>
        <div className="flex items-center justify-between">
          {showCategory && (
            <span className="text-xs bg-bgBtn/10 text-bgBtn px-2 py-1 rounded-full font-semibold">
              {book.book_category}
            </span>
          )}
          {showUpvotes && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {book.upvote || 0} ⬆
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
