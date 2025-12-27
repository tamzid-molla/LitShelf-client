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
  const [userSubscriptionData, setUserSubscriptionData] = useState(null);

  useEffect(() => {
    document.title = "LitShelf || AddBook";
  }, []);

  // Fetch user subscription data
  useEffect(() => {
    if (user?.email) {
      axiosSecure(`/users/${user.email}`)
        .then((response) => {
          setUserSubscriptionData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [user, axiosSecure]);

  // Check if user has already added a book
  useEffect(() => {
    if (user?.email) {
      axiosSecure(`/books/email?email=${user.email}`)
        .then((response) => {
          setUserBooks(response.data);
          // Check if user has reached the book limit based on their subscription
          if (userSubscriptionData) {
            checkBookLimit(response.data.length, userSubscriptionData);
          }
        })
        .catch((error) => {
          console.error("Error fetching user books:", error);
        });
    }
  }, [user, axiosSecure, userSubscriptionData]);

  // Function to check if user has reached the book limit
  const checkBookLimit = (currentBookCount, userData) => {
    if (userData?.books_added === "Unlimited") {
      setHasReachedLimit(false); // User has unlimited books
    } else {
      const limit = typeof userData?.books_added === "number" ? userData.books_added : 1;
      setHasReachedLimit(currentBookCount >= limit);
    }
  };

  //Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();

    // Check if user has reached the limit based on their subscription
    if (userSubscriptionData) {
      if (userSubscriptionData.books_added === "Unlimited") {
        // User has unlimited books, proceed with submission
      } else {
        const limit = typeof userSubscriptionData.books_added === "number" ? userSubscriptionData.books_added : 1;
        if (userBooks.length >= limit) {
          Swal.fire({
            icon: "error",
            title: "Limit Reached!",
            text: `You can only add ${limit} book(s). Upgrade to a subscription plan to add more books.`,
          });
          return;
        }
      }
    } else {
      // If no subscription data, default to 1 book limit
      if (userBooks.length >= 1) {
        Swal.fire({
          icon: "error",
          title: "Limit Reached!",
          text: "You can only add 1 free book. Upgrade to a subscription plan to add more books.",
        });
        return;
      }
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

        // Update the limit status after adding a book
        if (userSubscriptionData) {
          checkBookLimit(userBooks.length + 1, userSubscriptionData);
        }

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
    const limit =
      userSubscriptionData?.books_added === "Unlimited"
        ? "Unlimited"
        : typeof userSubscriptionData?.books_added === "number"
        ? userSubscriptionData.books_added
        : 1;

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
              You've already added your {limit} book(s) to your library
            </p>
          </div>

          {/* Limit Reached Card */}
          <div className="bg-white dark:bg-darkBase-secondary rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-5xl text-amber-500 mb-6">⚠️</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                You've Reached Your Book Limit
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {userSubscriptionData?.books_added === "Unlimited"
                  ? "You have unlimited books but there seems to be an issue."
                  : `As a ${
                      userSubscriptionData?.role || "free"
                    } user, you can only add ${limit} book(s) to your library. To add more books, please upgrade to a subscription plan.`}
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
