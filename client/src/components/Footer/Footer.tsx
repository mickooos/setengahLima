import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="shadow-lg text-white p-10 text-center relative"
      style={{
        background:
          "linear-gradient(0deg, rgba(69,26,3,1) 0%, rgba(0,0,0,1) 95%)",
      }}
    >
      <div className="flex justify-center space-x-6 mt-4 mb-4">
        <a
          href="https://wa.me/123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-green-500"
        >
          <i className="bi bi-whatsapp"></i>
        </a>
        <a
          href="https://instagram.com/your-coffee-shop"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl hover:text-purple-700"
        >
          <i className="bi bi-instagram"></i>
        </a>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Opening Hours</h4>
        <p>Mon - Fri : 7:00 AM - 9:00 PM</p>
        <p>Sat - Sun : 8:00 AM - 10:00 PM</p>
      </div>
      <p className="text-sm">© 2024 setengahLima. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
