import React from 'react';
import { FaPlus, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const BooksNotFound = () => {
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate('/addBook');
  };

return (
    <div className="flex flex-col items-center justify-center">
        <div className="max-w-md p-8 bg-base-secondary dark:bg-darkBase-secondary rounded-2xl shadow-lg text-center transition-transform duration-300 hover:shadow-2xl">
            <div className="mb-4">
                <FaBookOpen className="w-16 h-16 mx-auto text-bgBtn" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Books Found</h2>
            <p className="text-gray-500 mb-6">It looks like no one has added any books yet. Start your collection now!</p>
            <button
                onClick={handleAddBook}
                className="flex items-center mx-auto bg-bgBtn text-white px-6 py-3 rounded-lg hover:bg-hoverBtn transition-colors duration-200"
            >
                <FaPlus className="mr-2" /> Add Your First Book
            </button>
        </div>
    </div>
);
};

export default BooksNotFound;