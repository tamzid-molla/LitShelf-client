import React from "react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import bookshelf images
import bookshelf1 from "../../assets/bannerIMG/bookshelf-1.png";
import bookshelf2 from "../../assets/bannerIMG/bookshelf-2.png";
import bookshelf3 from "../../assets/bannerIMG/bookshelf-3.png";
import bookshelf4 from "../../assets/bannerIMG/bookshelf-4.png";
import bookshelf5 from "../../assets/bannerIMG/bookshelf-5.png";

const Banner = () => {
  // Array of bookshelf images with meaningful captions
  const bannerImages = [
    { 
      id: 1, 
      image: bookshelf1, 
      alt: "Bookshelf collection 1",
      title: "Discover Your Next Adventure",
      subtitle: "Explore thousands of books across all genres"
    },
    { 
      id: 2, 
      image: bookshelf2, 
      alt: "Bookshelf collection 2",
      title: "Build Your Personal Library",
      subtitle: "Organize, track, and manage your reading journey"
    },
    { 
      id: 3, 
      image: bookshelf3, 
      alt: "Bookshelf collection 3",
      title: "Join Our Reading Community",
      subtitle: "Share reviews and connect with fellow book lovers"
    },
    { 
      id: 4, 
      image: bookshelf4, 
      alt: "Bookshelf collection 4",
      title: "Track Your Reading Goals",
      subtitle: "Monitor progress and celebrate your achievements"
    },
    { 
      id: 5, 
      image: bookshelf5, 
      alt: "Bookshelf collection 5",
      title: "Find Your Perfect Read",
      subtitle: "Curated collections tailored to your interests"
    },
  ];

  return (
    <div className="w-11/12 mx-auto mb-28 relative overflow-hidden rounded-3xl shadow-2xl">
      <Swiper
        speed={1000}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] banner-swiper"
      >
        {bannerImages.map((banner) => (
          <SwiperSlide key={banner.id} className="w-full h-full">
            <div className="relative w-full h-full group">
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full object-cover object-center"
                loading={banner.id === 1 ? "eager" : "lazy"}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-6 md:px-12 max-w-4xl transform transition-all duration-700">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-2xl animate-fadeIn">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl font-medium opacity-90 drop-shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Styles */}
      <style jsx>{`
        .banner-swiper .swiper-button-next,
        .banner-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .banner-swiper .swiper-button-next:hover,
        .banner-swiper .swiper-button-prev:hover {
          background: rgba(42, 157, 143, 0.9);
          transform: scale(1.1);
        }

        .banner-swiper .swiper-button-next::after,
        .banner-swiper .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }

        .banner-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: white;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .banner-swiper .swiper-pagination-bullet-active {
          background: #2a9d8f;
          opacity: 1;
          width: 28px;
          border-radius: 5px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @media (max-width: 768px) {
          .banner-swiper .swiper-button-next,
          .banner-swiper .swiper-button-prev {
            width: 35px;
            height: 35px;
          }

          .banner-swiper .swiper-button-next::after,
          .banner-swiper .swiper-button-prev::after {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
