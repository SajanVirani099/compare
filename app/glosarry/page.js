// pages/glossary.js

"use client";
import Link from "next/link";
import "./style.css";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTitleWise } from "../redux/slice/glosarrySlice";

const Glossary = () => {
  const alphabet =
    "0-9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");

  const dispatch = useDispatch();
  const { glosarry } = useSelector((state) => state.glosarry);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    dispatch(getTitleWise());
    
    const handleScroll = () => {
      const alphabetContainer = document.querySelector('.alphabetContainer');
      if (alphabetContainer) {
        const scrollPosition = window.scrollY;
    
        // Adjust this value based on when you want the sticky effect to trigger
        const stickyPoint = 250; // Same as your initial top position
        
        setIsSticky(scrollPosition > stickyPoint);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const scrollToSection = (letter) => {
    const element = document.getElementById(letter);
    if (element) {
      // Account for sticky navbar offset
      const offset = isSticky ? 50 : 350 + 50; // 50 is alphabetContainer height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="mb-5 navigationContainer">
        <Navbar />
        <div className="bg-gradient-to-r from-[#1c1c1c] via-[#2e2e2e] to-[#434343] pt-[75px]">
          <div className="max-w-[1280px] w-[90%] mx-auto pb-[100px]">
            <p className="text-white text-sm">
              <Link href="/">Home</Link> &gt; Glossary
            </p>
            <h1 className="text-white text-5xl font-extrabold mt-[30px]">
              Glossary
            </h1>
          </div>
        </div>
      </div>
      <div className="width-all">
        <div className={`alphabetContainer ${isSticky ? 'sticky' : ''}`}>
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="letter"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(letter);
              }}
            >
              {letter}
            </a>
          ))}
        </div>
        <div className="sticky-placeholder"></div>
        <div className="alpha-main" style={{ marginTop: isSticky ? '50px' : '0' }}>
          {Object.keys(glosarry).map((letter) => (
            <div key={letter} id={letter}>
              <p className="alphaTitle my-5">{letter}</p>
              {glosarry[letter].map((article) => (
                <a
                  href={`#`}
                  className="mt-12"
                  key={article.title}
                  style={{
                    color: "#3c59fc",
                    fontSize: "16px",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  {article.title}&nbsp;&nbsp; | &nbsp;&nbsp;
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Glossary;