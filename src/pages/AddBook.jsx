import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { FaBook, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/FirebaseContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AddBooksForm from "../components/addBooks/AddBooksForm";

const AddBook = () => {
  //userInfo coming from firebaseAuth context
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  useEffect(() => {
    document.title = "LitShelf || AddBook";
  }, []);

  // Check if user has already added a book
  useEffect(() => {
    if (user?.email) {
      axiosSecure(`/books/email?email=${user.email}`)
        .then((response) => {
          setUserBooks(response.data);
          // If user already has 1 or more books, set the limit reached flag
          if (response.data.length >= 1) {
            setHasReachedLimit(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching user books:", error);
        });
    }
  }, [user, axiosSecure]);

  //Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();

    // Check if user has reached the limit
    if (userBooks.length >= 1) {
      Swal.fire({
        icon: "error",
        title: "Limit Reached!",
        text: "You can only add 1 free book. Upgrade to a subscription plan to add more books.",
      });
      return;
    }

    setUploading(true);
    const form = e.target;
    const formData = new FormData(form);
    // Extract and remove cover_photo from allData to avoid conflicts with the file
    const allData = Object.fromEntries(formData.entries());
    delete allData.cover_photo;
    allData.upvote = 0;
    allData.reviewerPhoto = user?.photoURL;

    try {
      const image = form.cover_photo.files[0];
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        imageFormData
      );
      allData.cover_photo = data?.data?.display_url;

      const response = await axiosSecure.post(`/books`, allData);

      if (response.data.insertedId) {
        // Update the user books count
        setUserBooks((prev) => [...prev, response.data.insertedId]);
        setHasReachedLimit(true);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Book added to your library successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        e.target.reset();
        setImagePreview(null);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to add book. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Show limit reached message if user has already added a book
  if (hasReachedLimit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base via-base-secondary to-base dark:from-darkBase dark:via-darkBase-secondary dark:to-darkBase pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-bgBtn to-hoverBtn rounded-2xl shadow-lg mb-6">
              <FaBook className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Book Limit Reached</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              You've already added your free book to your library
            </p>
          </div>

          {/* Limit Reached Card */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-5xl text-amber-500 mb-6">⚠️</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                You've Reached Your Free Book Limit
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                As a free user, you can only add 1 book to your library. To add more books, please upgrade to a
                subscription plan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/subscribe"
                  className="px-8 py-4 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Upgrade to Subscribe
                </a>
                <a
                  href="/myBooks"
                  className="px-8 py-4 border-2 border-bgBtn text-bgBtn dark:text-bgBtn hover:bg-bgBtn/10 dark:hover:bg-bgBtn/10 rounded-xl font-bold text-lg transition-all duration-300">
                  View My Books
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base via-base-secondary to-base dark:from-darkBase dark:via-darkBase-secondary dark:to-darkBase pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-bgBtn to-hoverBtn rounded-2xl shadow-lg mb-6">
            <FaPlus className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Add New Book</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your favorite books with the community and build your personal library
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden">
          <AddBooksForm
            handleBookSubmit={handleBookSubmit}
            uploading={uploading}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBook;
