import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/FirebaseContext";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/common/Loading";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "LitShelf || Dashboard";
  }, []);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then((res) => {
          setUserData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setLoading(false);
        });
    }
  }, [user, axiosSecure]);

  if (loading) {
    return <Loading />;
  }

  // Render dashboard based on user role
  if (userData?.role === "admin") {
    return <AdminDashboard userData={userData} />;
  }

  return <UserDashboard userData={userData} />;
};

export default Dashboard;
