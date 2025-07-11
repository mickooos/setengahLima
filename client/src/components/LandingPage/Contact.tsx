import React from "react";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="p-10 bg-black text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">Contact Us</h2>
      <form className="flex flex-col items-center w-full md:w-1/2 mx-auto bg-white p-8 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Your Name"
          className="mb-4 w-full p-4 text-black bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all duration-300"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="mb-4 w-full p-4 text-black bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all duration-300"
        />
        <textarea
          placeholder="Your Message"
          className="mb-4 w-full p-4 text-black bg-gray-100 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all duration-300 h-32"
        ></textarea>
        <button
          type="submit"
          className="w-full p-4 bg-amber-950 text-white font-bold rounded-lg hover:bg-[#6f4e37] shadow-lg transition-all duration-300"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
