"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter/AnimatedCounter";
import { 
  HiEye, 
  HiTag, 
  HiCog,
  HiUserGroup,
  HiGlobeAlt,
  HiLightningBolt
} from "react-icons/hi";
import { FaFacebook, FaTwitter, FaDribbble } from "react-icons/fa";
import Image from "next/image";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Neil Sims",
      role: "Co-Founder Themesberg",
      image: "/team-1.jpg", // You can replace with actual images
      social: {
        facebook: "#",
        twitter: "#",
        dribbble: "#"
      }
    },
    {
      name: "Bonnie Green",
      role: "Marketing Specialist",
      image: "/team-2.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        dribbble: "#"
      }
    },
    {
      name: "Christopher Wood",
      role: "Web Designer",
      image: "/team-3.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        dribbble: "#"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#e6e7ee]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            We are Themesberg
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10">
            Themesberg is an independent branding & experience design company working at the intersection of culture, design, and technology.
          </p>
          <button className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#e6e7ee] border border-[#d1d9e6] rounded-xl shadow-soft text-gray-900 font-semibold hover:shadow-lg transition-all duration-200">
            <HiLightningBolt className="w-5 h-5" />
            <span>Our works</span>
          </button>
        </div>

        {/* Feature Section - Three Columns */}
        <div className="border border-[#d1d9e6] rounded-2xl bg-[#e6e7ee] shadow-soft p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Audience */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-6">
                <HiEye className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Audience</h3>
              <p className="text-base sm:text-lg text-gray-700">
                We understand your audience and create designs that resonate with them, ensuring your brand connects meaningfully with your target market.
              </p>
            </div>

            {/* Branding */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-6">
                <HiTag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Branding</h3>
              <p className="text-base sm:text-lg text-gray-700">
                We craft compelling brand identities that tell your story and differentiate you in the marketplace, building lasting connections with your customers.
              </p>
            </div>

            {/* Production */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center mb-6">
                <HiCog className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Production</h3>
              <p className="text-base sm:text-lg text-gray-700">
                We bring your vision to life with high-quality production services, ensuring every detail is executed flawlessly from concept to completion.
              </p>
            </div>
          </div>
        </div>

        {/* Design with us Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div 
              className="w-full h-[400px] sm:h-[500px] md:h-[600px] border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft overflow-hidden"
              style={{ borderRadius: '63% 37% 30% 70% / 50% 45% 55% 50%' }}
            >
              <Image
                src={require("@/assets/images/about-us-1.jpg")}
                alt="Workspace"
                className="w-full h-full object-cover"
                style={{ borderRadius: '63% 37% 30% 70% / 50% 45% 55% 50%' }}
                height={400}
                width={500}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              Design with us, Develop Anything.
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 mb-8">
              <p>
                Themesberg is an experienced and passionate group of designers, developers, project managers, writers and artists. Every client we work with becomes a part of the team. Together we face the challenges and celebrate the victories.
              </p>
              <p>
                Our small team is active in the creative community, endlessly interested in what next, and generally pleasant to be around.
              </p>
            </div>
            <div className="mt-8">
              <Image
                src={require("@/assets/images/signature.svg")}
                alt="Signature"
                className="h-12 sm:h-16 w-auto"
                height={48}
                width={100}
              />
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20">
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

        {/* Our Team Section */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-6 sm:p-8 text-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-inset overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-600">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={member.social.facebook}
                    className="w-8 h-8 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    <FaFacebook className="w-4 h-4 text-gray-700" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="w-8 h-8 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    <FaTwitter className="w-4 h-4 text-gray-700" />
                  </a>
                  <a
                    href={member.social.dribbble}
                    className="w-8 h-8 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    <FaDribbble className="w-4 h-4 text-gray-700" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
