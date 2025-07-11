import React from "react";
import useSWR from "swr";
import axios from "axios";
import { numberToRupiah } from "../../utils/number-to-rupiah.ts";

// function to fetch data from api
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Content: React.FC = () => {
  // fetch all the datas
  const { data: orders, error: ordersError } = useSWR(
    "order/active-order",
    fetcher
  );
  const { data: sales, error: salesError } = useSWR("sales", fetcher);
  const { data: todaySales, error: todaySalesError } = useSWR(
    "sales/today",
    fetcher
  );
  const { data: revenue, error: revenueError } = useSWR(
    "revenue/total",
    fetcher
  );
  const { data: todayRevenue, error: todayRevenueError } = useSWR(
    "revenue/today",
    fetcher
  );

  // error handling
  if (
    ordersError ||
    salesError ||
    todaySalesError ||
    revenueError ||
    todayRevenueError
  ) {
    return (
      <div className="text-center font-medium justify-center text-xl">
        Error loading data.
      </div>
    );
  }

  if (!orders || !sales || !todaySales || !revenue || !todayRevenue) {
    return (
      <div className="text-center font-medium justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">{orders.activeOrders}</h2>
          <p>Active Orders</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">{todaySales.count}</h2>
          <p>Today Sales</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">
            {numberToRupiah(todayRevenue.count)}
          </h2>
          <p>Today Revenue</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">{sales.totalSales}</h2>
          <p>Products Sold</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">
            {numberToRupiah(revenue.totalRevenue)}
          </h2>
          <p>Total Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default Content;
