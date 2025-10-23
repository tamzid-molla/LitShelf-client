import React from "react";
import BookCard from "../BookCard";

const UserMyBooksTab = ({ myBooks }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Books Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myBooks.map((book) => (
            <BookCard key={book._id} book={book} showUpvotes={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserMyBooksTab;