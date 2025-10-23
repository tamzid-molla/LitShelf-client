import React from 'react';
import { AuthContext } from '../../context/FirebaseContext';
import { useContext } from 'react';
import { FaBook, FaUser, FaEnvelope, FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { Navigate, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useState } from 'react';
import { useEffect } from 'react';

const UpdateBook = () => {
  const { user } = useContext(AuthContext);
  const [readingStatus, setReadingStatus] = useState('');
const [bookCategory, setBookCategory] = useState('');
  const { id } = useParams();
  const [updatedData, setUpdatedData] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure(`/books/${id}`)
      .then(res => {
      setUpdatedData(res.data)
    })
},[axiosSecure,id])

  const {cover_photo,
    book_title,
    book_author,
    book_overview,
    total_page,
  } = updatedData;

  useEffect(() => {
  if (updatedData) {
    setReadingStatus(updatedData.reading_status || '');
    setBookCategory(updatedData.book_category || '');
  }
}, [updatedData]);

    const navigate = useNavigate()
    //Handle book submit
    const handleBookSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
      const { upvote, ...allData } = Object.fromEntries(formData.entries());

        axiosSecure.put(`/books/${updatedData._id}`, allData)
            .then(data => {
        if (data.data.modifiedCount) {
          Swal.fire({
            icon: "success",
            title: "Update successful",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(-1);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Update canceled | Please Try again",
          footer: err.message,
        });
      });
        
    }
    return (
        <div className="container mx-auto min-h-screen p-6 pt-36 mb-28 max-w-3xl">
              <div className="bg-base-secondary dark:bg-darkBase-secondary shadow-lg rounded-lg overflow-hidden ">
                {/* Header */}
                <div className="bg-navy-blue p-6">
                  <div className="flex items-center gap-3">
                    <FaBook className="text-2xl text-bgBtn" />
                    <h1 className="text-2xl font-bold">Update this Book</h1>
                  </div>
                  <p className="mt-2 text-md">
                    Update your {book_title} book
                  </p>
                </div>
        
                {/* Form */}
                 <form onSubmit={handleBookSubmit} className="p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Book Title */}
    <div>
      <label className="block text-sm font-medium mb-1">Book Title</label>
      <input
        defaultValue={book_title}
        required
        type="text"
        name="book_title"
        placeholder="Enter book title"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
      />
    </div>

    {/* Cover Photo URL */}
    <div>
      <label className="block text-sm font-medium mb-1">Cover Photo URL</label>
      <input
        required
        defaultValue={cover_photo}
        type="url"
        name="cover_photo"
        placeholder="Enter cover photo URL"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
      />
    </div>

    {/* Total Pages */}
    <div>
      <label className="block text-sm font-medium mb-1">Total Pages</label>
      <input
        defaultValue={total_page}
        required
        type="number"
        name="total_page"
        placeholder="Enter total pages"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
      />
    </div>

    {/* Book Author */}
    <div>
      <label className="block text-sm font-medium mb-1">Book Author</label>
      <input
        defaultValue={book_author}
        required
        type="text"
        name="book_author"
        placeholder="Enter author name"
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
        value={bookCategory}
        onChange={(e) => setBookCategory(e.target.value)}
        required
        name="book_category"
        className="w-full dark:bg-darkBase-secondary p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
      >
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
        value={readingStatus}
        onChange={(e) => setReadingStatus(e.target.value)}
        required
        name="reading_status"
        className="w-full dark:bg-darkBase-secondary p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
      >
        <option value="">Select status</option>
        <option value="Read">Read</option>
        <option value="Reading">Reading</option>
        <option value="Want-to-Read">Want-to-Read</option>
      </select>
    </div>

    {/* Book Overview - full width (span 2 columns) */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">Book Overview</label>
      <textarea
        defaultValue={book_overview}
        required
        name="book_overview"
        placeholder="Enter book overview"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-bgBtn"
        rows="5"
      ></textarea>
    </div>

    {/* Submit & Cancel Buttons - full width */}
    <div className="md:col-span-2 flex gap-4">
      <button
        type="submit"
        className="bg-bgBtn cursor-pointer hover:bg-hoverBtn text-white px-6 py-3 rounded-md transition-colors"
      >
        Update Book
      </button>
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition-colors"
      >
        Cancel
      </button>
    </div>
  </div>
</form>

              </div>
            </div>
    );
};

export default UpdateBook;