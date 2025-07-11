import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { numberToRupiah } from "../../utils/number-to-rupiah";

interface Category {
  id: number;
  nama: string;
}

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  gambar: string;
  kategori: Category;
  status: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const ProductList: React.FC = () => {
  const { data, error, mutate } = useSWR<{ menu: Product[] }>("menu", fetcher);
  const { data: categoryData, error: categoryError } = useSWR<{
    categories: Category[];
  }>("kategori-menu", fetcher);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState<Product>({
    id: 0,
    nama: "",
    deskripsi: "",
    harga: 0,
    gambar: "",
    kategori: { id: 0, nama: "" },
    status: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file

  if (error || categoryError) return <div>Failed to load data.</div>;
  if (!data || !categoryData) return <div>Loading data...</div>;

  const handleAddProduct = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setProductForm({
      id: 0,
      nama: "",
      deskripsi: "",
      harga: 0,
      gambar: "",
      kategori: { id: 0, nama: "" },
      status: "",
    });
    setSelectedFile(null);
  };

  const statusList = [
    { id: 1, name: "AVAILABLE" },
    { id: 2, name: "UNAVAILABLE" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSaveProduct = async () => {
    const formData = new FormData();
    formData.append("nama", productForm.nama);
    formData.append("deskripsi", productForm.deskripsi);
    formData.append("harga", productForm.harga.toString());
    formData.append("kategori_id", productForm.kategori.id.toString());
    formData.append("status", productForm.status);

    if (selectedFile) {
      formData.append("gambar", selectedFile); // Attach the file
    }

    try {
      if (isEditing) {
        await axios.put(`menu/${productForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      mutate();
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleEditProduct = (product: Product) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setProductForm(product);
    setSelectedFile(null);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`menu/${id}`);
      mutate();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const isFormValid =
    productForm.nama &&
    productForm.deskripsi &&
    productForm.harga > 0 &&
    (selectedFile || productForm.gambar) &&
    productForm.kategori.id !== 0;

  const isEditValid =
    productForm.nama &&
    productForm.deskripsi &&
    productForm.harga > 0 &&
    (selectedFile || productForm.gambar) &&
    productForm.kategori.id !== 0 &&
    productForm.status;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-[#3868a6] text-white font-medium rounded-lg hover:bg-blue-600"
        onClick={handleAddProduct}
      >
        Add Product
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={productForm.nama}
              onChange={(e) =>
                setProductForm({ ...productForm, nama: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={productForm.deskripsi}
              onChange={(e) =>
                setProductForm({ ...productForm, deskripsi: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={productForm.harga}
              onChange={(e) =>
                setProductForm({ ...productForm, harga: +e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 w-full mb-2"
            />
            {isEditing ? (
              <select
                value={productForm.status}
                onChange={(e) =>
                  setProductForm({ ...productForm, status: e.target.value })
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
            <select
              value={!productForm.kategori.id ? "" : productForm.kategori.id}
              onChange={(e) => {
                const selectedCategory = categoryData.categories.find(
                  (category) => category.id === parseInt(e.target.value)
                );
                if (selectedCategory) {
                  setProductForm({
                    ...productForm,
                    kategori: selectedCategory,
                  });
                }
              }}
              className="border p-2 w-full mb-4"
            >
              <option disabled value="">
                Select Category
              </option>
              {categoryData.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleSaveProduct}
                className="px-4 py-2 bg-[#40b33e] text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isEditing ? !isEditValid : !isFormValid}
              >
                {isEditing ? "Save Changes" : "Add Product"}
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
              <th className="px-4 py-2 border-b-2 text-left">Price (Rp)</th>
              <th className="px-4 py-2 border-b-2 text-left">Status</th>
              <th className="px-4 py-2 border-b-2 text-left">Categories</th>
              <th className="px-4 py-2 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.menu.map((product, index) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{product.nama}</td>
                <td className="px-4 py-2 border-b">
                  {numberToRupiah(product.harga)}
                </td>
                <td className="px-4 py-2 border-b">{product.status}</td>
                <td className="px-4 py-2 border-b">{product.kategori.nama}</td>
                <td className="px-4 py-2 border-b">
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      className="px-3 py-1 bg-[#e3c21e] text-white font-medium rounded-lg hover:bg-yellow-400"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                      onClick={() => handleDeleteProduct(product.id)}
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

export default ProductList;
