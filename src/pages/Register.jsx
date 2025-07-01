import { useContext, useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLink,
  FaLock,
  FaEyeSlash,
  FaRegEye,
  FaGoogle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/FirebaseContext";
import Swal from "sweetalert2";
import axios from "axios";
import registerImage from "../assets/SignUp.png"

const Register = () => {
  const [passShow, setPassShow] = useState(false);
  const [confirmPassShow, setConfirmPassShow] = useState(false);
  const navigate = useNavigate();
  const {
    registerWithEmailPass,
    updateUser,
    setUser,
    googleLogin,
    setLoading,
    logOutUser,
  } = useContext(AuthContext);

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const photoURL = formData.get("photoURL");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).+$/;

    if (!passwordRegex.test(password)) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must contain at least one lowercase and one uppercase letter.",
        footer: "Try again",
      });
    }

    if (password.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
        footer: "Try again",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match",
        footer: "Please try again",
      });
    }

    //Create user
    registerWithEmailPass(email, password)
      .then((userCredential) => {
        const newUser = userCredential.user;
        if (newUser) {
          updateUser({
            displayName: name,
            photoURL: photoURL,
          })
            .then(() => {
              const userData = { name, photoURL, email: newUser.email };
              axios
                .post(`${import.meta.env.VITE_baseURL}/users`, userData)
                .then((res) => {
                  if (res.data.insertedId) {
                    setUser({
                      ...newUser,
                      displayName: name,
                      photoURL: photoURL,
                    });
                  }
                });
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong ! please try again",
                footer: err.message,
              });
              setUser(newUser);
              setLoading(false);
            });

          Swal.fire({
            icon: "success",
            title: "Registration successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          logOutUser().then(() => {
            navigate("/login");
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong ! Please try again",
          footer: err.message,
        });
        setLoading(false);
        e.target.reset();
      });
  };

  //Handle google Login
  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
        const userData = {
          name: result?.user?.displayName,
          photoURL: result?.user?.photoURL,
          email: result?.user?.email,
        };
        axios
          .get(
            `${import.meta.env.VITE_baseURL}/users/all?email=${userData.email}`
          )
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

  useEffect(() => {
    document.title = "LitShelf || Register";
  }, []);

  return (
     <div className="min-h-screen pt-16 w-11/12 mx-auto px-4 mb-16 rounded-2xl md:px-8 bg-base-secondary dark:bg-darkBase-secondary flex items-center justify-center">
      <div className=" rounded-xl w-full max-w-6xl p-6 md:p-10">

        {/* Heading center */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Register Account
        </h2>

        {/* Grid content (image + form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Image */}
          <div className="hidden lg:block">
            <img src={registerImage} alt="Register" className="w-full h-auto object-contain" />
          </div>

          {/* Right: Form */}
          <div>
            <form onSubmit={handleRegister} className="space-y-4">

              {/* Full Name */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Email */}
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

              {/* Photo URL */}
              <div className="relative">
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <input
                  type="url"
                  name="photoURL"
                  placeholder="Photo URL"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <button type="button" onClick={() => setPassShow(!passShow)}>
                  {passShow ? (
                    <FaRegEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  ) : (
                    <FaEyeSlash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  )}
                </button>
                <input
                  type={passShow ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-IconText" />
                <button type="button" onClick={() => setConfirmPassShow(!confirmPassShow)}>
                  {confirmPassShow ? (
                    <FaRegEye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  ) : (
                    <FaEyeSlash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-IconText cursor-pointer" />
                  )}
                </button>
                <input
                  type={confirmPassShow ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-InputRing"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-bgBtn text-white py-2 rounded-lg hover:bg-hoverBtn transition duration-200">
                Sign Up
              </button>
            </form>

            {/* Divider + Google Login */}
            <div className="flex items-center justify-center mt-4">
              <hr className="w-full border-gray-300" />
              <span className="px-3 text-gray-500">or</span>
              <hr className="w-full border-gray-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center gap-2 mt-4">
              <FaGoogle />
              Sign in with Google
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
