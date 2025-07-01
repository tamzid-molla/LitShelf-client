import React from 'react';
import { FaPlus, FaBookOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const NoBook = () => {
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate('/addBook');
  };

  return (
    <div className="flex w-11/12 mx-auto flex-col items-center justify-center min-h-screen">
      <div className="max-w-md p-8  bg-base-secondary dark:bg-darkBase-secondary rounded-2xl shadow-lg text-center transform transition duration-300 hover:shadow-2xl">
        <div className="mb-4">
          <FaBookOpen className="w-16 h-16 mx-auto text-bgBtn" />
        </div>
        <h2 className="text-2xl font-bold  mb-2">No Books Found</h2>
        <p className="text-gray-500 mb-6">It looks like you haven't added any books yet. Start your collection now!</p>
        <button
          onClick={handleAddBook}
          className="flex items-center mx-auto cursor-pointer bg-bgBtn text-white px-6 py-3 rounded-lg hover:bg-hoverBtn transition duration-200"
        >
          <FaPlus className="mr-2" /> Add Your First Book
        </button>
      </div>
    </div>
  );
};

export default NoBook;