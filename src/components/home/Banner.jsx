import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";
import "swiper/css/navigation";

const Banner = () => {
  // Banner JSON data: Array of books with details for the slider
  const banner = [
    {
      id: 1,
      name: "A People's History of the United States",
      writer: "Howard Zinn",
      summary:
        "This book offers a new perspective on U.S. history by focusing on the voices of ordinary people rather than political elites. Zinn highlights the struggles and resistance of marginalized groups throughout American history.",
      image:
        "https://i.ibb.co/x8GNqBpp/A-People-s-History-of-the-United-States.png",
      learn: "https://en.wikipedia.org/wiki/A_People%27s_History_of_the_United_States"
    },
    {
      id: 2,
      name: "The Muqaddimah",
      writer: "Ibn Khaldun",
      summary:
        "Considered one of the earliest works of social science, this book analyzes the rise and fall of civilizations. Ibn Khaldun explores history through economics, politics, and sociology in a groundbreaking way.",
      image: "https://i.ibb.co/ZzgrQy9y/the-muqaddamah.png",
      learn: "https://en.wikipedia.org/wiki/Muqaddimah"
    },

    {
      id: 3,
      name: "The Philosophy of Money",
      writer: "Georg Simmel",
      summary:
        "Simmel explores the complex relationship between money and society. He examines how money shapes human behavior, personal values, and social relationships in modern life.",
      image: "https://i.ibb.co/S4ZzFwxc/the-philochopy-of-money.png",
      learn: "https://en.wikipedia.org/wiki/The_Philosophy_of_Money"
    },
  ];

  return (
      <Swiper
      speed={600}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-11/12 h-auto md:h-[70vh] mx-auto md:mt-0 mb-20 rounded-2xl bg-base dark:bg-darkBase">
      {banner.map((single) => (
        <SwiperSlide key={single.id} className="w-full px-10 bg-base-secondary dark:bg-darkBase-secondary">
            <div className="flex py-10 flex-col-reverse md:flex-row w-11/12 mx-auto justify-around items-center h-full">
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl lg:text-6xl font-bold">{single.name}</h2>
                <h5 className="mb-3 -mt-2"> <em>{single.writer}</em> </h5>
                      <p className="text-lg font-medium">{single.summary}</p>
    
              <Link to={single.learn} target="_blank">
              <button className="btn mt-4 bg-bgBtn hover:bg-hoverBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">Learn more</button>
              </Link>
                      
                  </div>
                   <div className="w-full md:w-1/2">
                <img src={single.image} alt=""  className="max-w-[300px] md:max-w-[400px] object-contain hover:scale-105 transition-transform duration-500"/>
              </div>
            </div>
         
        </SwiperSlide>
      ))}
    </Swiper>
  
  );
};

export default Banner;
