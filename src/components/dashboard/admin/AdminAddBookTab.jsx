import React from "react";
import { FaPlus } from "react-icons/fa";
import AddBooksForm from "../../addBooks/AddBooksForm";

const AdminAddBookTab = ({ handleBookSubmit, uploading, bookImagePreview, setBookImagePreview }) => {
  return (
    <div className="animate-fadeIn">
      <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-bgBtn to-hoverBtn p-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaPlus className="text-3xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Add New Book</h2>
              <p className="text-white/90 mt-1">Share your favorite books with the community</p>
            </div>
          </div>
        </div>
        <AddBooksForm 
          handleBookSubmit={handleBookSubmit} 
          uploading={uploading}
          imagePreview={bookImagePreview}
          setImagePreview={setBookImagePreview}
        />
      </div>
    </div>
  );
};

export default AdminAddBookTab;