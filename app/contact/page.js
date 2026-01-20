"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter/AnimatedCounter";
import { 
  HiLocationMarker, 
  HiPhone, 
  HiMail,
  HiUser,
  HiOutlineMail,
  HiChatAlt2,
  HiUserGroup,
  HiEye,
  HiGlobeAlt
} from "react-icons/hi";
import { FiSend } from "react-icons/fi";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-[#e6e7ee]">
      <Navbar />
      
      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Neumorphic Card Container */}
        <div className="border border-[#d1d9e6] rounded-2xl bg-[#e6e7ee] shadow-soft p-6 sm:p-8 md:p-10 lg:p-12">
          
          {/* Google Maps Section */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-[#d1d9e6] shadow-inset">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509037!2d-122.4194155846814!3d37.774929279759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
              
              {/* Map Info Overlay */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-[200px] sm:max-w-[250px]">
                <h3 className="font-bold text-gray-900 mb-1">San Francisco</h3>
                <p className="text-sm text-gray-600 mb-2">California, USA</p>
                <a href="#" className="text-xs text-blue-600 hover:underline mb-2 block">
                  View larger map
                </a>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#3c59fc] text-white rounded-lg text-xs font-medium hover:bg-[#2d47d4] transition-colors">
                  <span>Directions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Get in touch Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Get in touch today
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Have a new project in mind? Need help with an ongoing one? Drop us a line about your project needs, we answer same day.
            </p>
          </div>

          {/* Contact Information Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 md:mb-16">
            {/* Visit Us */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-4">
                <HiLocationMarker className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">Visit us</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-1">27 Silicon Valley</p>
              <p className="text-sm sm:text-base text-gray-700">USA, California</p>
            </div>

            {/* Call */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-4">
                <HiPhone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">Call</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-1">+3912345678</p>
              <p className="text-sm sm:text-base text-gray-700">Mon - Fri, 8am - 4pm</p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-4">
                <HiMail className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-2">Email</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-1">example@company.com</p>
              <p className="text-sm sm:text-base text-gray-700">name@company.com</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <HiUser className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Bonnie Green"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3c59fc] focus:border-transparent"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <HiOutlineMail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3c59fc] focus:border-transparent"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="relative">
                <div className="absolute left-4 top-4">
                  <HiChatAlt2 className="w-5 h-5 text-gray-500" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message...."
                  rows={6}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-inset text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3c59fc] focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#e6e7ee] border border-[#d1d9e6] rounded-xl shadow-soft text-gray-900 font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>Send message</span>
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Statistics Section */}
          <div className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-12 border-t border-[#d1d9e6]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
              {/* Team Members */}
              <AnimatedCounter
                end={245}
                duration={2000}
                icon={HiUserGroup}
                label="Team Members"
              />

              {/* Projects Published */}
              <AnimatedCounter
                end={816}
                duration={2000}
                icon={HiEye}
                label="Projects Published"
              />

              {/* Countries */}
              <AnimatedCounter
                end={80}
                duration={2000}
                icon={HiGlobeAlt}
                label="Countries"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
