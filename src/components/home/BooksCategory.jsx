import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../common/Loading';

const BooksCategory = () => {
  const { id } = useParams();
  const [allData, setAllData] = useState([]);
  const axiosSecure = useAxiosSecure()
  const [loading,setLoading]=useState(true)

  useEffect(() => {
      document.title = "LitShelf || Category";
    }, []);

  useEffect(() => {
    axiosSecure(`/books/categories/${id}`)
      .then((res) => {
        setAllData(res.data);
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, [id,axiosSecure]);

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <div className="w-11/12 pt-36 mb-28 min-h-screen mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Book Collection for { id}</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-base-secondary dark:bg-darkBase-secondary border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Cover</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Overview</th>
              <th className="py-3 px-6 text-center">Pages</th>
              <th className="py-3 px-6 text-center">Upvotes</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-white text-sm font-light">
            {allData.map((book) => (
              <tr
                key={book._id}
                className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-darkBase transition-colors"
              >
                <td className="py-3 px-6">
                  <img
                    src={book.cover_photo}
                    alt={book.book_title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => (e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIEY21qcAFAMli4-I8OVcd9C-BmszpY1MqnA&s')}
                  />
                </td>
                <td className="py-3 px-6 font-medium">{book.book_title}</td>
                <td className="py-3 px-6">{book.book_author}</td>
                <td className="py-3 px-6">{book.book_category}</td>
                <td className="py-3 px-6 max-w-xs truncate">{book.book_overview}</td>
                <td className="py-3 px-6 text-center">{book.total_page}</td>
                <td className="py-3 px-6 text-center">{book.upvote}</td>
                <td className="py-3 px-6">
                  {book.user_name} <br />
                  <span className="text-xs text-gray-500 ">{book.user_email}</span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      book.reading_status === 'Reading'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {book.reading_status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                        <Link to={`/books/${book._id}`}>
                        <button
                    className="text-bgBtn hover:text-hoverBtn cursor-pointer transition-colors"
                    title="View Details"
                  >
                    <FaInfoCircle className="w-5 h-5" />
                  </button>
                        </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksCategory;