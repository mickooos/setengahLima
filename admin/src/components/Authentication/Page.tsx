import React from "react";
import Background from "./Background";
import Form from "./Form";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Background />
      <Form />
    </div>
  );
};

export default Page;
