import axios from "axios";
import React from "react";
import { useContext } from "react";
import { FaBook, FaUser, FaEnvelope, FaHeart } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../context/FirebaseContext";
import { useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import AddBooksForm from "../components/addBooks/AddBooksForm";

const AddBook = () => {
  //userInfo coming from firebaseAuth context
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    document.title = "LitShelf || AddBook";
  }, []);

  //Handle book submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { cover_photo, ...allData } = Object.fromEntries(formData.entries());
    allData.upvote = 0;
    allData.reviewerPhoto = user?.photoURL;
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

    axiosSecure
      .post(`/books`, allData)
      .then((response) => {
        if (response.data.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Book Added successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          e.target.reset();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container mx-auto min-h-screen p-6 pt-36 mb-28 max-w-7xl">
      <div className="bg-base-secondary dark:bg-darkBase-secondary shadow-lg rounded-lg overflow-hidden ">
        {/* Header */}
        <div className="bg-navy-blue p-6">
          <div className="flex items-center gap-3">
            <FaBook className="text-2xl text-bgBtn" />
            <h1 className="text-2xl font-bold">Add a New Book</h1>
          </div>
          <p className="mt-2 text-md">
            Share your favorite book with the community!
          </p>
        </div>
        <AddBooksForm handleBookSubmit={handleBookSubmit}></AddBooksForm>
      </div>
    </div>
  );
};

export default AddBook;
