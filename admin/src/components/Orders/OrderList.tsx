import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { numberToRupiah } from "../../utils/number-to-rupiah";
import { formatDate } from "../../utils/format-date";

interface Order {
  id: string;
  jumlahBayar: number;
  noMeja: number;
  metodePembayaran: string;
  statusPesanan:
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED";
  statusPembayaran: "PAID" | "PENDING_PAYMENT";
  tanggalBuat: string;
  pesananMenu: {
    id: string;
    pesanan_id: string;
    menu: Product;
    kuantiti: number;
    catatan: string;
  }[];
}

interface Product {
  id: number;
  nama: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const OrderList: React.FC = () => {
  const { data, error, mutate } = useSWR<{ orders: Order[] }>("order", fetcher);
  const { data: productData, error: productError } = useSWR<{
    menu: Product[];
  }>("menu", fetcher);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [itemForm, setItemForm] = useState<Order["pesananMenu"][0]>({
    id: "",
    pesanan_id: "",
    menu: { id: 0, nama: "" },
    kuantiti: 1,
    catatan: "",
  });

  if (error || productError) return <div>Failed to load data.</div>;
  if (!data || !productData) return <div>Loading data...</div>;

  const handleEditClick = (order: Order) => {
    setEditOrder(order); // set the order to be edited in state
  };

  const handleUpdateOrder = async () => {
    if (editOrder) {
      await axios.put(`order/${editOrder.id}`, editOrder);
      mutate(); // revalidate SWR data after updating
      setEditOrder(null); // close the edit modal
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editOrder) {
      const { name, value } = e.target;
      setEditOrder({ ...editOrder, [name]: value }); // update the editOrder state with the new value
    }
  };

  const handleOrderItemClick = (order: Order, order_id: string) => {
    setSelectedOrder(order); // set the selected order for the modal
    setOrderId(order_id);
  };

  const closeOrderItemModal = () => {
    setSelectedOrder(null); // close the modal
  };

  const handleAddItem = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setItemForm({
      id: "",
      pesanan_id: orderId,
      menu: { id: 0, nama: "" },
      kuantiti: 1,
      catatan: "",
    });
  };

  const handleSaveItem = async () => {
    try {
      if (isEditing) {
        await axios.put(`order-items/${itemForm.id}`, {
          menu_id: itemForm.menu.id,
          kuantiti: itemForm.kuantiti,
          catatan: itemForm.catatan,
        });
      } else {
        await axios.post(`order-items`, {
          pesanan_id: itemForm.pesanan_id,
          menu_id: itemForm.menu.id,
          kuantiti: itemForm.kuantiti,
          catatan: itemForm.catatan,
        });
      }
      mutate();
      setIsFormOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to save item", error);
    }
  };

  const handleEditItem = (order: Order["pesananMenu"][0]) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setItemForm(order);
  };

  const handleDeleteItem = async (orderId: string, itemId: string) => {
    try {
      await axios.delete(`order/${orderId}/order-items/${itemId}`);
      mutate();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to delete order item", error);
    }
  };

  const handleDeleteOrder = (id: string) => {
    setConfirmDeleteId(id);
    setDeleteModalOpen(true); // open the modal
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await axios.delete(`order/${confirmDeleteId}`); // delete the order by ID
      mutate(); // revalidate SWR data after deletion
      setDeleteModalOpen(false); // close the modal
      setConfirmDeleteId(null); // reset delete confirmation
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false); // close the modal without deleting
    setConfirmDeleteId(null); // reset delete confirmation
  };

  const handleCloseEdit = () => {
    setEditOrder(null); // set editOrder to null to close the modal
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {/* Edit Order Status */}
      {editOrder && (
        <div className="mb-4 p-4 border rounded shadow bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Update Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="statusPesanan"
              value={editOrder.statusPesanan}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select
              name="statusPembayaran"
              value={editOrder.statusPembayaran}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="PAID">Paid</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleUpdateOrder}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-900"
            >
              Update
            </button>
            <button
              onClick={handleCloseEdit}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Order List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg sm:table-fixed">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 text-left">#</th>
              <th className="px-4 py-2 border-b-2 text-left">Date</th>
              <th className="px-4 py-2 border-b-2 text-left">Table</th>
              <th className="px-4 py-2 border-b-2 text-left">Order Status</th>
              <th className="px-4 py-2 border-b-2 text-left">Payment Status</th>
              <th className="px-4 py-2 border-b-2 text-left">Total Amount</th>
              <th className="px-4 py-2 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.orders
              .sort((a, b) => a.noMeja - b.noMeja)
              .map((order, index) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    <td className="px-4 py-2 border-b">
                      {formatDate(order.tanggalBuat)}
                    </td>
                    <td className="px-4 py-2 border-b">{order.noMeja}</td>
                    <td className="px-4 py-2 border-b">
                      {order.statusPesanan}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {order.statusPembayaran}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {numberToRupiah(order.jumlahBayar)}
                    </td>
                    <td className="px-4 py-2 border-b flex gap-2">
                      <button
                        aria-label="Edit Order"
                        onClick={() => handleEditClick(order)}
                        className="px-3 py-1 bg-yellow-500 font-medium text-white rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOrderItemClick(order, order.id)}
                        className="px-3 py-1 bg-green-500 font-medium text-white rounded-lg hover:bg-green-600"
                      >
                        Order Item
                      </button>
                      <button
                        aria-label="Delete Order"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-3 py-1 bg-red-600 font-medium text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      {/* Floating Order Item Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <button
              className="mb-4 px-4 py-2 bg-[#3868a6] text-white font-medium rounded-lg hover:bg-blue-600"
              onClick={handleAddItem}
            >
              Add Item
            </button>

            {/* Create and Update Order Item */}
            {isFormOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-2xl font-semibold mb-4">
                    {isEditing ? "Edit Item" : "Add New Item"}
                  </h2>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="ID Item"
                      value={itemForm.id}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, id: e.target.value })
                      }
                      className="border p-2 w-full mb-2"
                      disabled
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="ID Pesanan"
                      value={itemForm.pesanan_id}
                      className="border p-2 w-full mb-2"
                      disabled
                    />
                  )}
                  <input
                    type="number"
                    placeholder="Kuantiti"
                    value={itemForm.kuantiti}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, kuantiti: +e.target.value })
                    }
                    className="border p-2 w-full mb-2"
                  />
                  <textarea
                    placeholder="Catatan"
                    value={itemForm.catatan}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, catatan: e.target.value })
                    }
                    className="border p-2 w-full mb-2"
                  />
                  <select
                    value={!itemForm.menu.id ? "" : itemForm.menu.id}
                    onChange={(e) => {
                      const selectedProduct = productData.menu.find(
                        (menu) => menu.id === parseInt(e.target.value)
                      );
                      if (selectedProduct) {
                        setItemForm({
                          ...itemForm,
                          menu: selectedProduct,
                        });
                      }
                    }}
                    className="border p-2 w-full mb-4"
                  >
                    <option disabled value="">
                      Select Product
                    </option>
                    {productData.menu.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.nama}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleSaveItem}
                      className="px-4 py-2 bg-[#40b33e] text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isEditing ? "Save Changes" : "Add Item"}
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

            {/* Order Item List */}
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Menu ID</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Note</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedOrder.pesananMenu) &&
                  selectedOrder.pesananMenu.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 border">{item.menu.id}</td>
                      <td className="px-4 py-2 border">{item.kuantiti}</td>
                      <td className="px-4 py-2 border">
                        {item.catatan || " - "}
                      </td>
                      <td className="px-4 py-2 border">
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            className="px-3 py-1 bg-[#e3c21e] text-white font-medium rounded-lg hover:bg-yellow-400"
                            onClick={() => handleEditItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                            onClick={() =>
                              handleDeleteItem(item.pesanan_id, item.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeOrderItemModal}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
