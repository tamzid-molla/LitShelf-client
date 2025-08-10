import { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import BooksNotFound from "../components/common/BooksNotFound";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import { Link } from "react-router";

const Bookshelf = () => {
  const [bookShelfLoading, setBookShelfLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "LitShelf || BookShelf";
  }, []);

  useEffect(() => {
    axios(`${import.meta.env.VITE_baseURL}/books`).then((res) => {
      setAllBooks(res.data);
      setFilteredBooks(res.data);
      setBookShelfLoading(false);
    });
  }, []);

  const updatedBooks = filteredBooks.filter(
    (book) =>
      book.book_title?.toLowerCase().includes(query.toLowerCase()) ||
      book.book_author?.toLowerCase().includes(query.toLowerCase())
  );

  const handleFilter = (status) => {
    if (status === "") {
      setFilteredBooks(allBooks);
    } else {
      const filter = allBooks.filter((book) => book.reading_status === status);
      setFilteredBooks(filter);
    }
  };

  if (bookShelfLoading) {
    return <Loading />;
  }

  return (
    <div className="w-11/12 mx-auto min-h-screen pt-36 mb-28">
      {allBooks?.length === 0 ? (
        <BooksNotFound />
      ) : (
        <>
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Bookshelf</h1>
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={(e) => setQuery(e.target.value.toLowerCase())}
              className="w-full md:w-[300px] px-4 py-2 rounded-full bg-base-secondary dark:bg-darkBase-secondary text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-InputRing transition"
            />
            <select
              defaultValue=""
              onChange={(e) => handleFilter(e.target.value)}
              className="w-[180px] px-3 py-2 rounded-md bg-base-secondary dark:bg-darkBase-secondary text-gray-700 dark:text-gray-200 border">
              <option value="" disabled>
                Filter by Status
              </option>
              <option value="Read">Read</option>
              <option value="Reading">Reading</option>
              <option value="Want-to-Read">Want to Read</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#1e1e2e]">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Upvotes
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {updatedBooks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  updatedBooks.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-gray-50 dark:hover:bg-[#2a2a3b] transition">
                      <td className="px-6 py-4">
                        <img
                          src={book.cover_photo}
                          alt={book.book_title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                        {book.book_title}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {book.book_author}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {book.book_category}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {book.reading_status}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {book.total_page}
                      </td>
                      <td className="px-6 py-4 text-bgBtn font-semibold">
                        {book.upvote}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/books/${book._id}`}
                          className="px-4 py-2 bg-bgBtn text-textBtn rounded hover:bg-hoverBtn transition-all text-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookshelf;
