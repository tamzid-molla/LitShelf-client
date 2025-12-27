import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { FaTimesCircle, FaRedo, FaHome } from "react-icons/fa";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const reason = searchParams.get("reason") || "Payment failed";
  const tran_id = searchParams.get("tran_id");

  useEffect(() => {
    // Simulate loading for a short time to show the failure message
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-36 pb-16 bg-base dark:bg-darkBase flex items-center">
      <div className="w-11/12 mx-auto max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-5xl text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">Payment Failed</h1>

          <p className="text-xl text-red-600 dark:text-red-400 mb-2">{reason}</p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">{tran_id || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="font-medium text-red-600 dark:text-red-400">Failed</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your payment was not processed successfully. Please try again or contact support if the issue persists.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/subscribe")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-bgBtn to-hoverBtn hover:from-hoverBtn hover:to-bgBtn text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <FaRedo /> Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-bgBtn text-bgBtn dark:text-bgBtn hover:bg-bgBtn/10 dark:hover:bg-bgBtn/10 rounded-xl font-bold text-lg transition-all duration-300">
              <FaHome /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
