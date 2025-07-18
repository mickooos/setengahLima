import React from "react";
import useSWR from "swr";
import axios from "axios";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const SalesReport: React.FC = () => {
  const { data, error } = useSWR("sales", fetcher); // fetch all salses reports  data

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading data...</div>;

  // Export to excel
  const exportToExcel = () => {
    // formatted data for excel column
    const formattedData = data.salesMenu.map((item: any, index: number) => ({
      No: index + 1,
      Name: item.nama,
      Sales: item.terjual,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report Data");
    XLSX.writeFile(workbook, "setengahLima - Sales Report.xlsx");
  };

  // export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Set font and header
    doc.setFontSize(16);
    doc.text("setengahLima - Sales Report", 14, 20);

    // Add total sales and best selling product
    doc.setFontSize(12);
    doc.text(`Total Sales: ${data.totalSales}`, 14, 30);
    doc.text(`Best Selling Product: ${data.bestSellingName}`, 14, 40);

    // Add table
    (doc as any).autoTable({
      startY: 50,
      head: [["No", "Name", "Sales"]],
      body: data.salesMenu.map((item: any, index: number) => [
        index + 1,
        item.nama,
        item.terjual,
      ]),
      theme: "grid",
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(
      "Generated by SetengahLima | Contact: hello@setengahlima.com",
      14,
      pageHeight - 10
    );

    doc.save("setengahLima - Sales Report.pdf");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Product Sales Reports</h1>

      <div className="text-lg font-semibold mb-2">
        Total Sales : {data.totalSales}
      </div>

      <div className="text-lg font-semibold mb-4">
        Best Selling Product : {data.bestSellingName}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 text-left">#</th>
              <th className="px-4 py-2 border-b-2 text-left">Name</th>
              <th className="px-4 py-2 border-b-2 text-left">Sales</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data.salesMenu) &&
              data.salesMenu.map((item: any, index: number) => (
                <tr key={index + 1}>
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{item.nama}</td>
                  <td className="px-4 py-2 border-b">{item.terjual}</td>
                </tr>
              ))) ??
              null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;
