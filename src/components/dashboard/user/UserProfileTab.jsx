import React from "react";
import { FaUser, FaBook, FaCheckCircle, FaEdit, FaTimes, FaCamera } from "react-icons/fa";

const UserProfileTab = ({ 
  user, 
  userData, 
  readingStats, 
  myReviews, 
  showUpdateModal, 
  setShowUpdateModal, 
  profileData, 
  setProfileData, 
  handleProfileUpdate, 
  selectedImage, 
  setSelectedImage, 
  imagePreview, 
  setImagePreview, 
  handleImageChange, 
  updating, 
  uploadingImage 
}) => {
  return (
    <>
      <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-lg p-8 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          <button
            onClick={() => {
              setProfileData({
                name: user?.displayName || '',
                email: user?.email || '',
                photoURL: user?.photoURL || '',
                phone: userData?.phone || '',
                location: userData?.location || '',
                bio: userData?.bio || '',
                website: userData?.website || '',
                favoriteGenre: userData?.favoriteGenre || '',
                readingGoal: userData?.readingGoal || '',
              });
              setSelectedImage(null);
              setImagePreview(null);
              setShowUpdateModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-bgBtn to-hoverBtn text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <FaEdit /> Update Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative group">
              <img
                src={user?.photoURL || "https://via.placeholder.com/150"}
                alt={user?.displayName}
                className="w-40 h-40 rounded-full object-cover ring-4 ring-bgBtn shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3 ring-4 ring-white dark:ring-darkBase-secondary">
                <FaCheckCircle className="text-white text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 text-center">
              {user?.displayName}
            </h3>
            <p className="text-bgBtn font-semibold text-sm uppercase tracking-wider mt-2">
              Book Enthusiast
            </p>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaUser className="text-bgBtn" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.displayName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaBook className="text-bgBtn" />
                Reading Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-bgBtn">{readingStats.total}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Books</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-green-600">{readingStats.finished}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Finished</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-purple-600">{readingStats.currentlyReading}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reading</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-orange-600">{myReviews.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reviews</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                  <span className="font-semibold text-bgBtn capitalize">
                    {userData?.role || 'User'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-darkBase-secondary rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-bgBtn to-hoverBtn text-white p-6 rounded-t-2xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">Update Profile</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative group">
                  <img
                    src={imagePreview || profileData.photoURL || "https://via.placeholder.com/150"}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-bgBtn shadow-lg"
                  />
                  <div 
                    onClick={() => document.getElementById('profileImageInput').click()}
                    className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <div className="text-center">
                      <FaCamera className="text-white text-2xl mx-auto mb-1" />
                      <p className="text-white text-xs">Change Photo</p>
                    </div>
                  </div>
                </div>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  {selectedImage ? selectedImage.name : 'Click on image to upload new photo'}
                </p>
                {uploadingImage && (
                  <div className="flex items-center gap-2 mt-2 text-bgBtn">
                    <div className="w-4 h-4 border-2 border-bgBtn border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Uploading image...</span>
                  </div>
                )}
              </div>

              {/* Two Column Layout for Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="City, Country"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Website / Social Link
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Favorite Genre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Favorite Genre
                  </label>
                  <select
                    value={profileData.favoriteGenre}
                    onChange={(e) => setProfileData({ ...profileData, favoriteGenre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a genre</option>
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
              </div>

              {/* Reading Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Annual Reading Goal
                </label>
                <input
                  type="number"
                  value={profileData.readingGoal}
                  onChange={(e) => setProfileData({ ...profileData, readingGoal: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Number of books per year"
                  min="0"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-bgBtn bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us about yourself and your reading preferences..."
                  rows="4"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {profileData.bio?.length || 0}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-bgBtn to-hoverBtn text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileTab;