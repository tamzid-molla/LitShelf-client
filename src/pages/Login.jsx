import React, { useContext, useEffect, useState } from "react";
import {FaEnvelope,FaLock,FaGoogle,FaEyeSlash,FaRegEye} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../context/FirebaseContext";
import axios from "axios";
import loginImg from "../assets/Login.png"

const Login = () => {
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { loginWithEmailPass, googleLogin, setUser, setLoading } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    //Login User
    loginWithEmailPass(email, password)
      .then((userCredential) => {
        const newUser = userCredential.user;

        if (newUser) {
          setUser(newUser);
          Swal.fire({
            icon: "success",
            title: "Login successful",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate(location.state || "/");
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Incorrect email or password. Please try again",
          footer: err.message,
        });
        setLoading(false);
        e.target.reset();
      });
  };

  useEffect(() => {
    document.title = "LitShelf || Login";
  }, []);

  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
         const userData = {
          name: result?.user?.displayName,
          photoURL: result?.user?.photoURL,
          email: result?.user?.email,
        };
        axios
          .get(`${import.meta.env.VITE_baseURL}/users/all?email=${userData.email}`)
          .then((response) => {
            if (response.data?.exists) {
              // User already exists, just login
              setUser(result.user);
              Swal.fire({
                icon: "success",
                title: "Login successful",
                showConfirmButton: false,
                timer: 1500,
              });
              navigate(location.state || "/");
            } else {
              // If new user, save to DB
              axios
                .post(`${import.meta.env.VITE_baseURL}/users`, userData)
                .then((res) => {
                  if (res.data.insertedId) {
                    setUser(result.user);
                    Swal.fire({
                      icon: "success",
                      title: "Login successful",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    navigate(location.state || "/");
                  }
                });
            }
          });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something Wrong ! Try again",
          footer: err.message,
        });
      });
  };

  return (
     <div className="min-h-screen pt-16 mb-16 rounded-2xl px-4 md:px-8 bg-base-secondary w-11/12 mx-auto dark:bg-darkBase-secondary flex items-center justify-center">
      <div className=" rounded-xl w-full max-w-5xl p-6 md:p-10">

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Login Your Account
        </h2>

        {/* Grid layout: image + form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Image Side */}
          <div className="hidden md:block">
            <img src={loginImg} alt="Login Illustration" className="w-full h-auto object-contain" />
          </div>

          {/* Form Side */}
          <div>
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email Field */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <FaRegEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  ) : (
                    <FaEyeSlash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  )}
                </button>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-bgBtn text-white py-2 rounded-lg hover:bg-hoverBtn transition duration-200">
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center justify-center mt-4">
              <hr className="w-full border-gray-300" />
              <span className="px-3 text-gray-500">or</span>
              <hr className="w-full border-gray-300" />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2 mt-4">
              <FaGoogle />
              Sign in with Google
            </button>

            {/* Register Link */}
            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
