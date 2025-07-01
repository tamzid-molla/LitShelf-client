import React from "react";
import Banner from "../components/home/Banner";
import PopularBook from "../components/home/PopularBook";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../components/common/Loading";
import NewReleases from "../components/home/NewReleases";
import TotalStates from "../components/home/TotalStates";
import FeaturedCategories from "../components/home/FeaturedCategories";
import useAxiosSecure from "../hooks/useAxiosSecure";
import axios from "axios";
import HowItWorks from "../components/home/HowItWorks";

const Home = () => {
  const [allUser, setAllUser] = useState(0);
  const [allReview, setAllReview] = useState(0);
  const [allBook, setAllBook] = useState(0);
    // State to track loading status for the home page
  const [homeLoading, setHomeLoading] = useState(true);
  const [categories, setCategories] = useState([]);
    // State to store the list of popular books
    const [popularBook, setPopularBook] = useState([]);
    //New Release book fetching 
  const [books, setBooks] = useState([]);
  
    // Fetch all required data (popular books, new releases, users, books, reviews) when the component mounts
  useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [topBooksRes,totalCategory, newReleasesRes, usersRes, booksRes, ratingsRes] = await Promise.all([
        axios(`${import.meta.env.VITE_baseURL}/books/top`),
        axios(`${import.meta.env.VITE_baseURL}/books/total/category`),
        axios(`${import.meta.env.VITE_baseURL}/books/recent/top`),
        axios(`${import.meta.env.VITE_baseURL}/users`),
        axios(`${import.meta.env.VITE_baseURL}/books`),
        axios(`${import.meta.env.VITE_baseURL}/ratings`)
      ]);

      setPopularBook(topBooksRes.data);
      setCategories(totalCategory.data);
      setBooks(newReleasesRes.data);
      setAllUser(usersRes.data.length);
      setAllBook(booksRes.data.length);
      setAllReview(ratingsRes.data.length);

      setHomeLoading(false);
    } catch (error) {
      console.error("Error fetching home page data:", error);
      setHomeLoading(false);
    }
  };

  fetchAllData();
}, []);

  useEffect(() => {
      document.title = "LitShelf || Home";
    }, []);

  if (homeLoading) {
    return <Loading></Loading>
  }
  return (
        <div className="min-h-screen pt-40">
      <Banner></Banner>
      <HowItWorks></HowItWorks>
            <FeaturedCategories categories={categories}></FeaturedCategories>
            <PopularBook popularBook={popularBook}></PopularBook>
            <NewReleases books={books}></NewReleases>
            <TotalStates allBook={allBook} allReview={allReview} allUser={allUser} ></TotalStates>
        </div>
  );
};

export default Home;
