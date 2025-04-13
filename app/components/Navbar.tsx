"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  UserCircle,
  Coins,
  Moon,
  Sun,
  LogOut,
  LogIn,
  MessageSquare,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/userSlice";
import { useTheme } from "../context/ThemeContext";
import GradientText from "./GradientText";
import UserAvatar, { User as AvatarUser } from "./UserAvatar";
import NotificationDropdown from "@/components/Notifications/NotificationDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Optional: Add any additional cleanup like clearing localStorage
    localStorage.removeItem("token");
    // Optional: Redirect to home page
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <GradientText text="StreamHub" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/browse"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/categories"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/live"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Live
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative flex-1 mx-8 max-w-md">
            <input
              type="text"
              placeholder="Search streams, channels, categories..."
              className="bg-gray-800 text-white rounded-full py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <div className="flex items-center text-yellow-500 space-x-1">
                <Coins size={20} />
                <span>{(user as AvatarUser).coins || 0}</span>
              </div>
            )}
            {isAuthenticated && <NotificationDropdown />}
            {isAuthenticated && user && (
              <Link
                href={`/user-profile/${user.id}?tab=messages`}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <MessageSquare size={20} />
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex flex-col items-center">
                  <UserAvatar
                    user={user}
                    size="sm"
                    showUsername={true}
                    showStatus={true}
                    textPosition="below"
                    textColor="text-gray-300"
                    textWeight="medium"
                  />
                </div>
                <div className="sm:hidden">
                  <UserAvatar user={user} size="sm" showStatus={true} />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <motion.a
                href="/auth"
                className="p-2 text-gray-300 hover:text-purple-500 transition-colors flex items-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <LogIn className="w-5 h-5" />
              </motion.a>
            )}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/live"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Live
              </Link>
              <button
                onClick={toggleTheme}
                className="text-gray-300 hover:text-white transition py-2 flex items-center"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={18} className="mr-2" />
                    <span>Light mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} className="mr-2" />
                    <span>Dark mode</span>
                  </>
                )}
              </button>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition py-2 flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="text-gray-300 hover:text-white transition py-2"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
