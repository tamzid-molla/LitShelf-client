import React, { useContext } from "react";
import NavBar from "../components/layout/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/FirebaseContext";
import Loading from "../components/common/Loading";

const Root = () => {
  const { loading } = useContext(AuthContext);
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : (
        // Root component: main entry point for the application layout
        <div className="bg-base text-black dark:bg-darkBase dark:text-darkContent">
          <header className=" bg-navbar  dark:bg-darkNavbar py-4 w-full z-30 fixed border-b-2 border-gray-300 dark:border-gray-500">
            <NavBar></NavBar>
          </header>
          <main className="max-w-[1500px] mx-auto">
            <Outlet></Outlet>
          </main>
          <footer className="bg-gray-900 text-white py-12">
            <Footer></Footer>
          </footer>
        </div>
      )}
    </>
  );
};

export default Root;
