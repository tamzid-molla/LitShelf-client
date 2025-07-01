import { Link, NavLink, useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { useContext, useState } from "react";
import { ThemContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/FirebaseContext";
import Swal from "sweetalert2";

const NavBar = () => {
  //User Information from firebase Context
    const { user, logOutUser } = useContext(AuthContext);
    //Hamburger menu for mobile device 
    const [menuOpen, setMenuOpen] = useState(false);
    //Dark mode state from ThemContext
    const { darkMode, setDarkMode,toggleDarkMode  } = useContext(ThemContext);
    //Navigate variable 
    const navigate = useNavigate();
    
    //Log out function
    const handleLogout = () => {
    logOutUser().then(() => {
      Swal.fire({
                      icon: "success",
                      title: "LogOut successful",
                      showConfirmButton: false,
                      timer: 1500
                            });
                               navigate('/')
    })
  }

  const links = (
    <>
      <NavLink to="/" className="underline-offset-4">Home</NavLink>
      <NavLink to="/bookShelf" className="underline-offset-4">Bookshelf</NavLink>
      <NavLink to="/addBook" className="underline-offset-4">Add Book</NavLink>
      <NavLink to="/myBooks" className="underline-offset-4">My Books</NavLink>
      <NavLink to="/profile" className="underline-offset-4">Profile</NavLink>
    </>
  );
  return (
    <>
      <nav className="bg-navbar dark:bg-darkNavbar py-4 w-full z-30 fixed border-b-2 border-gray-300 dark:border-gray-500">
        {/* Navbar section */}
        <section className="flex justify-between items-center w-11/12 mx-auto">
          {/* Logo and name  */}
          <div className="flex justify-center items-center gap-2">
            <img src={logo} alt="Logo" className="w-14 h-14 rounded-full" />
            <h2 className="text-3xl font-bold">LitShelf</h2>
          </div>
          {/* Links  */}
          <div className="hidden text-lg lg:flex gap-5 xl:gap-8 items-center">
            {links}
          </div>
          {/* Login , Register and Toggle theme*/}
          <div className="flex gap-7 items-center">
            <button
              onClick={toggleDarkMode}
              className="cursor-pointer">
              {darkMode ? (
                <MdDarkMode size={30}></MdDarkMode>
              ) : (
                <MdLightMode size={30}></MdLightMode>
              )}
            </button>
            <div className="hidden lg:flex gap-7">
              {user ? (
                <button onClick={handleLogout} className="bg-bgBtn hover:bg-hoverBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
                  Logout
                </button>
              ) : (
                <Link to="/login">
                  <button className="bg-bgBtn hover:bg-hoverBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
                    Login
                  </button>
                </Link>
              )}
              {!user && (
                <Link to="/register">
                  <button className="bg-bgBtn hover:bg-hoverBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
                    Register
                  </button>
                </Link>
              )}
            </div>
            {/* Hamburger menu  */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="cursor-pointer">
                {menuOpen ? (
                  <IoMdClose className="dark:text-white" size={30}></IoMdClose>
                ) : (
                  <GiHamburgerMenu
                    className="dark:text-white"
                    size={30}></GiHamburgerMenu>
                )}
              </button>
            </div>
          </div>
        </section>
      </nav>

      {/* Responsive section  */}
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-[#11111121] bg-opacity-30 z-10 lg:hidden transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}></div>
      )}

      <section
        className={`fixed  h-full w-1/2  px-5 py-10 space-y-5 bg-navbar dark:bg-darkNavbar lg:hidden overflow-hidden top-0 left-0 z-50 transition-all duration-300 ease-in-out transform ${
          menuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}>
        {/* NavLinks  */}
        <div className="flex flex-col gap-3">{links}</div>
        {/* Login and Register */}
        <div className="flex flex-col gap-3">
          {user ? (
            <button onClick={handleLogout} className="bg-bgBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-bgBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
                Login
              </button>
            </Link>
          )}
          {!user && (
            <Link to="/register">
              <button className="bg-bgBtn text-textBtn cursor-pointer px-5 py-1 text-lg font-semibold rounded-md">
                Register
              </button>
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default NavBar;
