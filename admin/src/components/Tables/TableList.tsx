import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";

interface Table {
  id: string;
  nomorMeja: string;
  statusMeja: string;
  jumlahBangku: string;
  tableCode: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const TableList: React.FC = () => {
  const { data, error, mutate } = useSWR<{ tables: Table[] }>("meja", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tableForm, setTableForm] = useState<Table>({
    id: "",
    nomorMeja: "",
    statusMeja: "",
    jumlahBangku: "",
    tableCode: "",
  });

  const statusList = [
    { id: 1, name: "UNRESERVED" },
    { id: 2, name: "RESERVED" },
  ];

  if (error) return <div>Error loading data.</div>;
  if (!data) return <div>Loading...</div>;

  const handleAddTable = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setTableForm({
      id: "",
      nomorMeja: "",
      statusMeja: "",
      jumlahBangku: "",
      tableCode: "",
    });
  };

  const handleSaveTable = async () => {
    try {
      if (isEditing) {
        await axios.put(`meja/${tableForm.id}`, {
          nomorMeja: parseInt(tableForm.nomorMeja),
          jumlahBangku: parseInt(tableForm.jumlahBangku),
          statusMeja: tableForm.statusMeja,
        });
      } else {
        await axios.post("meja", {
          nomorMeja: parseInt(tableForm.nomorMeja),
          jumlahBangku: parseInt(tableForm.jumlahBangku),
        });
      }
      mutate();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const handleEditTable = (table: Table) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setTableForm(table);
  };

  const handleDeleteTable = async (id: string) => {
    try {
      await axios.delete(`meja/${id}`);
      mutate();
    } catch (err) {
      console.error("Failed to delete table", err);
    }
  };

  const isFormValid = tableForm.nomorMeja && tableForm.jumlahBangku;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tables</h1>
      <button
        className="mb-4 px-4 py-2 bg-[#3868a6] text-white font-medium rounded-lg hover:bg-blue-600"
        onClick={handleAddTable}
      >
        Add Table
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Table" : "Add New Table"}
            </h2>
            <input
              type="text"
              placeholder="Nomor Meja"
              value={tableForm.nomorMeja}
              onChange={(e) =>
                setTableForm({ ...tableForm, nomorMeja: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            {isEditing ? (
              <select
                value={tableForm.statusMeja}
                onChange={(e) =>
                  setTableForm({ ...tableForm, statusMeja: e.target.value })
                }
                className="border p-2 w-full mb-4"
              >
                <option disabled value="">
                  Select Status
                </option>
                {statusList.map((s) => {
                  return <option key={s.id}>{s.name}</option>;
                })}
              </select>
            ) : null}

            <input
              type="text"
              placeholder="Jumlah Bangku"
              value={tableForm.jumlahBangku}
              onChange={(e) =>
                setTableForm({ ...tableForm, jumlahBangku: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSaveTable}
                className="px-4 py-2 bg-[#40b33e] text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid}
              >
                {isEditing ? "Save Changes" : "Add Table"}
              </button>
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-[#c4352d] text-white rounded-lg font-medium hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 text-left">Table number</th>
              <th className="px-4 py-2 border-b-2 text-left">Status</th>
              <th className="px-4 py-2 border-b-2 text-left">
                Number of benches
              </th>
              <th className="px-4 py-2 border-b-2 text-left">QR Code</th>
              <th className="px-4 py-2 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tables.map((table) => (
              <tr key={table.id}>
                <td className="px-4 py-2 border-b">{table.nomorMeja}</td>
                <td className="px-4 py-2 border-b">{table.statusMeja}</td>
                <td className="px-4 py-2 border-b">
                  {table.jumlahBangku} benches
                </td>
                <td className="px-4 py-2 border-b">
                  <img
                    src={table.tableCode}
                    alt="Table Barcode"
                    className="w-20 h-20 object-cover"
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      className="px-3 py-1 bg-[#e3c21e] text-white font-medium rounded-lg hover:bg-yellow-400"
                      onClick={() => handleEditTable(table)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                      onClick={() => handleDeleteTable(table.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableList;
