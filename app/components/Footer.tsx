// components/Footer.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  MessageCircle,
} from "lucide-react";
import GradientText from "./GradientText";

const Footer = () => {
  const socialIcons = [
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Youtube className="w-5 h-5" />, href: "#" },
    { icon: <Twitch className="w-5 h-5" />, href: "#" },
    { icon: <MessageCircle className="w-5 h-5" />, href: "#" },
    { icon: <Github className="w-5 h-5" />, href: "#" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.footer
      className="bg-gray-900/50 backdrop-blur-sm text-gray-300 py-12 border-t border-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              <GradientText text="StreamHub" />
            </h3>
            <p className="text-sm leading-relaxed">
              Your go-to platform for live streaming and entertainment.
              Discover, watch, and connect with your favorite creators.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {" "}
              <GradientText text="Explore" />
            </h4>
            <ul className="space-y-2 text-sm">
              {["Home", "Live Channels", "Categories", "Trending"].map(
                (item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <a
                      href="#"
                      className="hover:text-purple-400 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {" "}
              <GradientText text="Support" />
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Help Center",
                "Contact Us",
                "Terms of Service",
                "Privacy Policy",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors duration-300"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              <GradientText text="Connect" />
            </h4>

            <div className="flex flex-wrap gap-4 mb-4">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-800 hover:bg-purple-500/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <motion.p
              className="text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              contact@streamhub.com
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-800 text-center text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <p>
            &copy; {new Date().getFullYear()} StreamHub. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
