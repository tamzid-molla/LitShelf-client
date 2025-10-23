import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/FirebaseContext";
import { FaUser, FaEnvelope, FaBook, FaImage, FaListAlt, FaFileAlt, FaCheckCircle, FaTimes } from "react-icons/fa";

const AddBooksForm = ({ handleBookSubmit, uploading, imagePreview, setImagePreview }) => {
  const { user } = useContext(AuthContext);
  const [charCount, setCharCount] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    document.getElementById('cover_photo').value = '';
  };
  return (
    <form onSubmit={handleBookSubmit} className="p-8 md:p-10">
      {/* Book Cover Upload Section */}
      <div className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaImage className="text-bgBtn" />
          Book Cover
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Image Preview */}
          <div className="w-full md:w-48">
            <div className="relative aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Book Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <FaImage className="text-5xl mb-3" />
                  <p className="text-sm font-medium">No image selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Input */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Upload Cover Image *
            </label>
            <div className="relative">
              <input
                type="file"
                name="cover_photo"
                id="cover_photo"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-bgBtn file:text-white hover:file:bg-hoverBtn file:cursor-pointer cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: JPG, PNG, WEBP (Max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Book Information Section */}
      <div className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaBook className="text-bgBtn" />
          Book Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Book Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Book Title *
            </label>
            <input
              type="text"
              name="book_title"
              placeholder="Enter the book title"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Book Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Author Name *
            </label>
            <input
              type="text"
              name="book_author"
              placeholder="e.g., J.K. Rowling"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Total Pages */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Pages *
            </label>
            <input
              type="number"
              name="total_page"
              placeholder="e.g., 350"
              min="1"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Book Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="book_category"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">Select a category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

          {/* Reading Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Reading Status *
            </label>
            <select
              name="reading_status"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="">Select status</option>
              <option value="Want to Read">Want to Read</option>
              <option value="Currently Reading">Currently Reading</option>
              <option value="Finished">Finished</option>
            </select>
          </div>

          {/* Book Overview */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Book Overview *
            </label>
            <textarea
              name="book_overview"
              placeholder="Write a brief description of the book, its themes, and why you recommend it..."
              required
              onChange={(e) => setCharCount(e.target.value.length)}
              maxLength="1000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
              rows="6"></textarea>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {charCount}/1000 characters
            </p>
          </div>
        </div>
      </div>

      {/* User Information Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaUser className="text-bgBtn" />
          Added By
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="user_name"
                value={user.displayName}
                readOnly
                className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* User Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="user_email"
                value={user.email}
                readOnly
                className="w-full px-4 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {uploading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding Book...
            </>
          ) : (
            <>
              <FaCheckCircle className="text-xl" />
              Add Book to Library
            </>
          )}
        </button>
        <button
          type="reset"
          onClick={() => { setImagePreview(null); setCharCount(0); }}
          disabled={uploading}
          className="flex-1 sm:flex-none px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          Reset Form
        </button>
      </div>
    </form>
  );
};

export default AddBooksForm;
