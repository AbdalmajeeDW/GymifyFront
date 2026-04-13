"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FaDumbbell } from "react-icons/fa";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import SpinnerCustom from "../components/Loader/page";

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setAlertMessage("Email is required");
      setShowAlert(true);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlertMessage("Please enter a valid email address");
      setShowAlert(true);
      return false;
    }
    if (!password.trim()) {
      setAlertMessage("Password is required");
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);

    if (!validateForm()) return;

    try {
      await login(email, password);
    } catch (err) {
      setAlertMessage(
        err instanceof Error ? err.message : "Invalid email or password",
      );
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Left Section - Branding */}
          <div className="lg:w-1/2 bg-linear-to-br from-purple-500/10 to-blue-500/10 p-8 lg:p-12 flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-30"></div>
              <div className="relative w-24 h-24 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <FaDumbbell className="text-white text-4xl" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              GYMIFY
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              Begin your journey towards a better version of yourself.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500 italic"
            >
              "Strength does not come from physical capacity, but from an
              indomitable will"
            </motion.p>

            {/* Decorative Elements */}
            <div className="mt-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-300"></div>
              <div className="w-2 h-2 rounded-full bg-blue-300"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500">Login to your account</p>
            </div>

            {/* Alert Message */}
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200"
              >
                <p className="text-red-600 text-sm text-center">
                  {alertMessage}
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setShowAlert(false);
                    }}
                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setShowAlert(false);
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                titleAfterLoading="Login"
                titleIsLoading="Logging in..."
                iconAfterLoading={<FaEye className="w-4 h-4" />}
                iconIsLoading={<SpinnerCustom className="text-white size-4" />}
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="bg-purple-600 p-5 w-full hover:bg-purple-700 text-white rounded-xl shadow-md transition-all duration-300"
              ></Button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              {/* Footer */}
              <div className="text-center pt-2">
                <p className="text-gray-400 text-xs">
                  © 2025 GYMIFY. All rights reserved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
