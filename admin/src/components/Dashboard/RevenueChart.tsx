import React, { useState } from "react";
import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const RevenueChart: React.FC = () => {
  const [filter, setFilter] = useState("day");
  const { data, isLoading, error } = useSWR(
    `revenue/period?filter=${filter}`,
    fetcher
  );

  const chartData = data
    ? {
        labels: data.labels,
        datasets: [
          {
            label: "Revenue",
            data: data.values,
            backgroundColor: "#13202b",
            borderColor: "#13202b",
            borderWidth: 1,
          },
        ],
      }
    : null;

  if (isLoading) {
    return (
      <div className="p-4 max-w-full lg:max-w-3xl bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Revenue Chart</h1>
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-full lg:max-w-3xl bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Revenue Chart</h1>
        <p className="text-red-500">
          Error fetching data. Please try again later.
        </p>
      </div>
    );
  }

  if (data.empty) {
    return (
      <div className="p-4 max-w-full lg:max-w-3xl bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Revenue Chart</h1>
        <p className="text-gray-500">
          No data available for the selected period.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-full lg:max-w-3xl bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Revenue Chart</h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            filter === "day" ? "bg-gray-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("day")}
        >
          Day
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "week" ? "bg-gray-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("week")}
        >
          Week
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "month" ? "bg-gray-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("month")}
        >
          Month
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "year" ? "bg-gray-900 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("year")}
        >
          Year
        </button>
      </div>

      <div className="h-[400px]">
        <Bar
          data={chartData!}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Filtered Data",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
