import React from "react";

const Background: React.FC = () => {
  return (
    <div className="w-full lg:w-1/2 h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">setengahLima.</h1>
        <p>Tenangkan pikiran dan santai!</p>
      </div>
    </div>
  );
};

export default Background;
