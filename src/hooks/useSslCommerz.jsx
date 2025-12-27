import { useContext } from "react";
import { AuthContext } from "../context/FirebaseContext";
import axios from "axios";
import { redirect } from "react-router";

const useSslCommerz = () => {
  const { user } = useContext(AuthContext);

  // Function to initiate SSLCommerz payment
  const initiatePayment = async (plan) => {
    const amount = parseFloat(plan?.price);

    if (!user) {
      redirect("/login");
      return;
    }

    try {
      // Prepare payment data
      const paymentData = {
        amount: amount,
        currency: "BDT",
        tran_id: "",
        product_name: `${plan.name} Subscription`,
        product_category: "Subscription",
        cus_name: user.displayName || "Customer",
        cus_email: user.email,
        cus_phone: user.phoneNumber || "N/A",
        status: "Pending",
        date: new Date().toISOString(),
      };

      //   Send request to backend to initiate payment
      const response = await axios.post(`${import.meta.env.VITE_baseURL}/ssl/init-payment`, paymentData);

      if (response.data && response.data.GatewayPageURL) {
        // Redirect to SSLCommerz payment gateway
        window.location.replace(response.data.GatewayPageURL);
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Error initiating SSLCommerz payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  return { initiatePayment };
};

export default useSslCommerz;
