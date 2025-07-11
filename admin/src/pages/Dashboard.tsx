import React from "react";
import Content from "../components/Dashboard/Content";
import SalesChart from "../components/Dashboard/SalesChart";
import RevenueChart from "../components/Dashboard/RevenueChart";

const Dashboard: React.FC = () => {
  return (
    <>
      <Content />
      <div className="mx-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SalesChart />
        <RevenueChart />
      </div>
    </>
  );
};

export default Dashboard;
