
import { motion } from "framer-motion";
import { FaBook } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router";
import BooksNotFound from "../common/BooksNotFound";


const NewReleases = ({books}) => {

  return (
    <section
      className="py-16 mb-28 px-10 w-11/12 mx-auto bg-base-secondary dark:bg-darkBase-secondary rounded-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold flex items-center justify-center">
          <FaBook className="mr-2 text-bgBtn" /> New Releases
        </h2>
        <p className="mt-2 text-lg">
          Discover the latest books added to our collection
        </p>
      </div>
      {
        books?.length === 0 ? <BooksNotFound></BooksNotFound>
          :
      <div className="">
        <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="mySwiper"
      >
              
                  {books.map((book) => (
          <SwiperSlide key={book._id}>
            <div
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
                        <div className="flex justify-center py-3">
                          <img
                src={book.cover_photo}
                alt={book.book_title}
                className="w-auto h-64 object-cover"
              />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {book.book_title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  by {book.book_author}
                </p>
                <Link
                  to={`/books/${book._id}`}
                  className="mt-2 inline-block text-blue-500 dark:text-blue-400 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
      </Swiper>
      </div>
}
    </section>
  );
};

export default NewReleases;