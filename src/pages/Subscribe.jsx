import React from "react";
import { useState } from "react";
import Loading from "../components/common/Loading";
import { FaCheck, FaTimes, FaBook, FaStar, FaGlobe } from "react-icons/fa";
import useSslCommerz from "../hooks/useSslCommerz";

const Subscribe = () => {
  const [loading] = useState(false);
  const { initiatePayment } = useSslCommerz();
  // Subscription plans data
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 1500,
      period: "Indefinite",
      description: "Perfect for tracking your personal library",
      features: [
        { name: "Track up to 100 books", available: true },
        { name: "Basic reading status updates", available: true },
        { name: "Reading progress tracking", available: true },
        { name: "Basic book categorization", available: true },
        { name: "Simple reading statistics", available: false },
        { name: "Advanced analytics", available: false },
        { name: "Reading goal setting", available: false },
      ],
      popular: false,
      icon: <FaBook className="text-2xl" />,
    },
    {
      id: 2,
      name: "Premium",
      price: 3000,
      period: "Indefinite",
      description: "For active book collectors",
      features: [
        { name: "Unlimited book tracking", available: true },
        { name: "Advanced reading status updates", available: true },
        { name: "Detailed progress tracking", available: true },
        { name: "Advanced book categorization", available: true },
        { name: "Reading statistics & insights", available: true },
        { name: "Priority customer support", available: true },
        { name: "Reading goal setting", available: true },
      ],
      popular: true,
      icon: <FaStar className="text-2xl" />,
    },
    {
      id: 3,
      name: "Pro",
      price: 5000,
      period: "Indefinite",
      description: "For serious book collectors",
      features: [
        { name: "Unlimited book tracking", available: true },
        { name: "Advanced reading status updates", available: true },
        { name: "Detailed progress tracking", available: true },
        { name: "Advanced book categorization", available: true },
        { name: "Comprehensive statistics & insights", available: true },
        { name: "24/7 premium support", available: true },
        { name: "Advanced goal setting & analytics", available: true },
      ],
      popular: false,
      icon: <FaGlobe className="text-2xl" />,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-36 pb-16 bg-base dark:bg-darkBase">
      <div className="w-11/12 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Choose Your Bookshelf Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Enhance your book tracking experience and organize your personal library with our premium subscription
            plans.
          </p>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? "bg-gradient-to-br from-bgBtn to-hoverBtn text-white border-2 border-bgBtn relative overflow-hidden"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              }`}>
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-6 py-1 rounded-bl-lg rounded-tr-2xl font-bold text-sm">
                  MOST POPULAR
                </div>
              )}

              {/* Plan header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className={`mb-4 p-4 rounded-full ${plan.popular ? "bg-white/20" : "bg-bgBtn/10 text-bgBtn"}`}>
                  {plan.icon}
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    plan.popular ? "text-white" : "text-gray-900 dark:text-white"
                  }`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span
                    className={`text-4xl font-black ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-2 ${plan.popular ? "text-white/80" : "text-gray-600 dark:text-gray-400"}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`${plan.popular ? "text-white/90" : "text-gray-600 dark:text-gray-400"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`mr-3 mt-1 flex-shrink-0 ${
                        feature.available
                          ? plan.popular
                            ? "text-yellow-300"
                            : "text-bgBtn"
                          : plan.popular
                          ? "text-white/50"
                          : "text-gray-400"
                      }`}>
                      {feature.available ? <FaCheck className="text-lg" /> : <FaTimes className="text-lg" />}
                    </div>
                    <span className={`${plan.popular ? "text-white/90" : "text-gray-700 dark:text-gray-300"}`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subscribe button */}
              <button
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-bgBtn hover:bg-gray-100 transform hover:-translate-y-1"
                    : "bg-bgBtn text-white hover:bg-hoverBtn transform hover:-translate-y-1"
                }`}
                onClick={() => initiatePayment(plan)}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. Your book tracking features will continue until the
                end of your current billing period.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Do I need to enter payment details for the free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No, you don't need to enter payment details for the free trial. We'll remind you before your trial ends.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Can I switch between plans?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your current
                billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
