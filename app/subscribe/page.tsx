"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, Zap } from "lucide-react";

interface Plan {
  name: string;
  price: number;
  features: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  buttonText: string;
  buttonBaseBg: string;
  buttonHoverBg: string;
  buttonDarkBg: string;
  buttonDarkHoverBg: string;
}

const plans: Plan[] = [
  {
    name: "Supporter",
    price: 5,
    features: [
      "Access subscriber-only posts",
      "Basic community badge",
      "Support the creator",
    ],
    icon: <Star className="h-6 w-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    buttonText: "Select Plan",
    buttonBaseBg: 'bg-purple-500',
    buttonHoverBg: 'hover:bg-purple-600',
    buttonDarkBg: 'dark:bg-purple-600',
    buttonDarkHoverBg: 'dark:hover:bg-purple-700',
  },
  {
    name: "Fan",
    price: 10,
    features: [
      "All Supporter benefits",
      "Exclusive Q&A sessions",
      "Early access to content",
      "Enhanced community badge",
    ],
    icon: <Zap className="h-6 w-6" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    buttonText: "Select Plan",
    buttonBaseBg: 'bg-indigo-500',
    buttonHoverBg: 'hover:bg-indigo-600',
    buttonDarkBg: 'dark:bg-indigo-600',
    buttonDarkHoverBg: 'dark:hover:bg-indigo-700',
  },
  {
    name: "Super Fan",
    price: 15,
    features: [
      "All Fan benefits",
      "Direct messaging priority",
      "Behind-the-scenes content",
      "Premium community badge",
      "Monthly shout-out",
    ],
    icon: <CheckCircle className="h-6 w-6" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    buttonText: "Select Plan",
    buttonBaseBg: 'bg-pink-500',
    buttonHoverBg: 'hover:bg-pink-600',
    buttonDarkBg: 'dark:bg-pink-600',
    buttonDarkHoverBg: 'dark:hover:bg-pink-700',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const planVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SubscribePage: React.FC = () => {
  const handleSubscribe = (plan: Plan) => {
    // TODO: Implement actual subscription logic (e.g., redirect to payment)
    alert(
      `Subscribing to ${plan.name} for $${plan.price}/month... (Not implemented)`
    );
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
        Choose Your Subscription Plan
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Support your favorite creators and unlock exclusive content.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            variants={planVariants}
            className={`${plan.bgColor} rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col hover:shadow-xl transition-shadow duration-300`}
          >
            <div className={`flex items-center mb-4 ${plan.color}`}>
              {plan.icon}
              <h2 className="ml-3 text-2xl font-semibold">{plan.name}</h2>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              ${plan.price}
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                /month
              </span>
            </p>
            <ul className="space-y-3 mb-8 text-gray-700 dark:text-gray-300 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle
                    className={`h-5 w-5 mr-2 flex-shrink-0 ${plan.color}`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <motion.button
              onClick={() => handleSubscribe(plan)}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-300 ${plan.buttonBaseBg} ${plan.buttonHoverBg} ${plan.buttonDarkBg} ${plan.buttonDarkHoverBg}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.buttonText}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SubscribePage;
