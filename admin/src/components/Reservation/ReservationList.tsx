import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { formatDate } from "../../utils/format-date";

interface Reservation {
  id: string;
  noMeja: string;
  nama: string;
  kontak: string;
  jumlahTamu: string;
  tanggalReservasi: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const ReservationList: React.FC = () => {
  const { data, error, mutate } = useSWR<{ reservations: Reservation[] }>(
    "reservation",
    fetcher
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bookForm, setBookForm] = useState<Reservation>({
    id: "",
    noMeja: "",
    nama: "",
    kontak: "",
    jumlahTamu: "",
    tanggalReservasi: "",
  });

  if (error) return <div>Error loading data.</div>;
  if (!data) return <div>Loading...</div>;

  const handleAddReservation = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setBookForm({
      id: "",
      noMeja: "",
      nama: "",
      kontak: "",
      jumlahTamu: "",
      tanggalReservasi: "",
    });
  };

  const handleSaveReservation = async () => {
    try {
      if (isEditing) {
        await axios.put(`reservation/${bookForm.id}`, {
          noMeja: parseInt(bookForm.noMeja),
          nama: bookForm.nama,
          kontak: bookForm.kontak,
          jumlahTamu: parseInt(bookForm.jumlahTamu),
          tanggalReservasi: new Date(bookForm.tanggalReservasi),
        });
      } else {
        await axios.post("reservation", {
          noMeja: parseInt(bookForm.noMeja),
          nama: bookForm.nama,
          kontak: bookForm.kontak,
          jumlahTamu: parseInt(bookForm.jumlahTamu),
          tanggalReservasi: new Date(bookForm.tanggalReservasi),
        });
      }
      mutate();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save data", error);
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setBookForm(reservation);
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await axios.delete(`reservation/${id}`);
      mutate();
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const isFormValid =
    bookForm.noMeja &&
    bookForm.nama &&
    bookForm.kontak &&
    bookForm.jumlahTamu &&
    bookForm.tanggalReservasi;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Reservations</h1>
      <button
        className="mb-4 px-4 py-2 bg-[#3868a6] text-white font-medium rounded-lg hover:bg-blue-600"
        onClick={handleAddReservation}
      >
        Add Reservation
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Data" : "Add New Data"}
            </h2>
            <input
              type="text"
              placeholder="Nomor Meja"
              value={bookForm.noMeja}
              onChange={(e) =>
                setBookForm({ ...bookForm, noMeja: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Nama"
              value={bookForm.nama}
              onChange={(e) =>
                setBookForm({ ...bookForm, nama: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Kontak"
              value={bookForm.kontak}
              onChange={(e) =>
                setBookForm({ ...bookForm, kontak: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Jumlah Tamu"
              value={bookForm.jumlahTamu}
              onChange={(e) =>
                setBookForm({ ...bookForm, jumlahTamu: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              placeholder="Tanggal Reservasi"
              value={bookForm.tanggalReservasi}
              onChange={(e) =>
                setBookForm({ ...bookForm, tanggalReservasi: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSaveReservation}
                className="px-4 py-2 bg-[#40b33e] text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid}
              >
                {isEditing ? "Save Changes" : "Add Data"}
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
              <th className="px-4 py-2 border-b-2 text-left">#</th>
              <th className="px-4 py-2 border-b-2 text-left">Name</th>
              <th className="px-4 py-2 border-b-2 text-left">Table number</th>
              <th className="px-4 py-2 border-b-2 text-left">Contact</th>
              <th className="px-4 py-2 border-b-2 text-left">
                Number of guests
              </th>
              <th className="px-4 py-2 border-b-2 text-left">Booking Date</th>
              <th className="px-4 py-2 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.reservations) &&
              data.reservations.map((bookings, index) => (
                <tr key={bookings.id}>
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{bookings.nama}</td>
                  <td className="px-4 py-2 border-b">{bookings.noMeja}</td>
                  <td className="px-4 py-2 border-b">{bookings.kontak}</td>
                  <td className="px-4 py-2 border-b">{bookings.jumlahTamu}</td>
                  <td className="px-4 py-2 border-b">
                    {formatDate(bookings.tanggalReservasi)}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        className="px-3 py-1 bg-[#e3c21e] text-white font-medium rounded-lg hover:bg-yellow-400"
                        onClick={() => handleEditReservation(bookings)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                        onClick={() => handleDeleteReservation(bookings.id)}
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

export default ReservationList;
