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
        <div className="bg-base max-w-[2500px] mx-auto text-black dark:bg-darkBase dark:text-darkContent">
          <header>
            <NavBar></NavBar>
          </header>
          <main>
            <Outlet></Outlet>
          </main>
          <footer>
            <Footer></Footer>
          </footer>
        </div>
      )}
    </>
  );
};

export default Root;
