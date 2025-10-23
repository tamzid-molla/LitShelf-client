import axios from "axios";
import { FaEdit, FaTrash, FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyBook = ({myBook,setMyBooks}) => {
  const {
    cover_photo,
    book_title,
    book_category,
    book_author,
    book_overview,
    total_page,
    reading_status,
    user_email,
    user_name,
  } = myBook;
  // handle Delete book
  const handleDeleteBook = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_baseURL}/books/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setMyBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          });
      }
    });
  };

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden p-2 shadow-lg bg-base-secondary dark:bg-darkBase-secondary m-4 hover:shadow-2xl">
      <div className="relative flex justify-center">
        <img
          className="w-auto h-64 p-2 object-cover rounded-lg"
          src={cover_photo}
          alt={book_title}
        />
        <div className="absolute top-0 right-0 bg-bgBtn text-textBtn px-3 py-1 rounded-bl-lg text-sm font-semibold">
          {book_category}
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="flex items-center mb-2">
          <FaBook className="text-bgBtn mr-2" />
          <h2 className="font-bold text-xl">{book_title}</h2>
        </div>
        <p className="text-sm mb-2">by {book_author}</p>
        <p className=" line-clamp-3">{book_overview}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Pages: {total_page}</span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              reading_status === "Read"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
            {reading_status}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Added by: {user_name} ({user_email})
        </div>
      </div>
      <div className="px-6 pt-2 pb-4 flex h-full items-end justify-between">
        <Link to={`/updateBook/${myBook._id}`}>
          <button className="flex items-center cursor-pointer bg-bgBtn text-textBtn px-4 py-2 rounded-lg hover:bg-hoverBtn transition duration-200">
            <FaEdit className="mr-2" /> Update
          </button>
        </Link>
        <button
          onClick={() => handleDeleteBook(myBook._id)}
          className="flex items-center cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default MyBook;
