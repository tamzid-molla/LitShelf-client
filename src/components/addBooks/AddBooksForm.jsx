import React, { useContext } from "react";
import { AuthContext } from "../../context/FirebaseContext";
import { FaUser, FaEnvelope } from "react-icons/fa";

const AddBooksForm = ({ handleBookSubmit }) => {
  const { user } = useContext(AuthContext);
  return (
    <form onSubmit={handleBookSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Book Title</label>
          <input
            type="text"
            name="book_title"
            placeholder="Enter book title"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
          />
        </div>

        {/* Cover Photo URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Photo</label>
          <div className="relative">
            <input
              type="file"
              name="cover_photo"
              id="cover_photo"
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
            />
          </div>
        </div>

        {/* Total Pages */}
        <div>
          <label className="block text-sm font-medium mb-1">Total Pages</label>
          <input
            type="number"
            name="total_page"
            placeholder="Enter total pages"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
          />
        </div>

        {/* Book Author */}
        <div>
          <label className="block text-sm font-medium mb-1">Book Author</label>
          <input
            type="text"
            name="book_author"
            placeholder="Enter author name"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
          />
        </div>

        {/* User Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Your Email</label>
          <div className="relative">
            <input
              type="email"
              name="user_email"
              value={user.email}
              readOnly
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <FaEnvelope className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* User Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <div className="relative">
            <input
              type="text"
              name="user_name"
              value={user.displayName}
              readOnly
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Book Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Book Category</label>
          <select
            name="book_category"
            required
            className="w-full dark:bg-darkBase-secondary p-3 border rounded-md focus:ring-2 focus:ring-bgBtn">
            <option value="">Select a category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Fantasy">Fantasy</option>
          </select>
        </div>

        {/* Reading Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Reading Status</label>
          <select
            name="reading_status"
            required
            className="w-full dark:bg-darkBase-secondary p-3 border rounded-md focus:ring-2 focus:ring-bgBtn">
            <option value="">Select status</option>
            <option value="Read">Read</option>
            <option value="Reading">Reading</option>
            <option value="Want-to-Read">Want-to-Read</option>
          </select>
        </div>

        {/* Book Overview */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Book Overview</label>
          <textarea
            name="book_overview"
            placeholder="Enter book overview"
            required
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
            rows="5"></textarea>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-4 mt-2">
          <button
            type="submit"
            className="bg-bgBtn hover:bg-hoverBtn text-white px-6 py-3 rounded-md transition-colors">
            Add Book
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddBooksForm;
