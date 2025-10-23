import axios from "axios";
import { useContext, useState } from "react";
import { FaBook, FaPlus, FaImage, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/FirebaseContext";
import { useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AddBooksForm from "../components/addBooks/AddBooksForm";

const AddBook = () => {
  //userInfo coming from firebaseAuth context
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    document.title = "LitShelf || AddBook";
  }, []);

  //Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const form = e.target;
    const formData = new FormData(form);
    const { cover_photo, ...allData } = Object.fromEntries(formData.entries());
    allData.upvote = 0;
    allData.reviewerPhoto = user?.photoURL;
    
    try {
      const image = form.cover_photo.files[0];
      const imageFormData = new FormData();
      imageFormData.append("image", image);

      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        imageFormData
      );
      allData.cover_photo = data?.data?.display_url;

      const response = await axiosSecure.post(`/books`, allData);
      
      if (response.data.insertedId) {
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
        text: "Failed to add book. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-base via-base-secondary to-base dark:from-darkBase dark:via-darkBase-secondary dark:to-darkBase pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-bgBtn to-hoverBtn rounded-2xl shadow-lg mb-6">
            <FaPlus className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Add New Book
          </h1>
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
