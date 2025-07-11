import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/LandingPage/Hero";
import About from "../components/LandingPage/About";
import Contact from "../components/LandingPage/Contact";
import Address from "../components/LandingPage/Address";
import Footer from "../components/Footer/Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-black min-h-[100vh]">
      <Navbar />
      <Hero />
      <About />
      <Contact />
      <Address />
      <Footer />
    </div>
  );
};

export default LandingPage;
