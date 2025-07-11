import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";

interface Category {
  id: number;
  nama: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const CategoryList: React.FC = () => {
  const { data, error } = useSWR<{ categories: Category[] }>(
    "kategori-menu",
    fetcher
  );
  const [newCategory, setNewCategory] = useState<string>("");
  const [editCategory, setEditCategory] = useState<{
    id: number;
    nama: string;
  } | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  if (error) return <div>Error loading categories.</div>;
  if (!data) return <div>Loading...</div>;

  // Add new category
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") return;

    try {
      await axios.post("kategori-menu", { nama: newCategory });
      mutate("kategori-menu");
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category : ", error);
    }
  };

  // Edit existing category
  const handleEditCategorySubmit = async () => {
    if (!editCategory || editCategory.nama.trim() === "") return;

    try {
      await axios.put(`kategori-menu/${editCategory.id}`, {
        nama: editCategory.nama,
      });
      mutate("kategori-menu");
      setEditCategory(null); // Close modal
    } catch (error) {
      console.error("Error editing category : ", error);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (deleteCategoryId === null) return;

    try {
      await axios.delete(`kategori-menu/${deleteCategoryId}`);
      mutate("kategori-menu");
      setDeleteCategoryId(null); // Close modal
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="flex items-center mb-4 space-x-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="px-4 py-2 border rounded w-full max-w-xl"
        />
        <button
          className="px-4 py-2 bg-[#3868a6] text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleAddCategory}
          disabled={newCategory.trim() === ""}
        >
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 text-left">#</th>
              <th className="px-4 py-2 border-b-2 text-left">Category Name</th>
              <th className="px-4 py-2 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((category, index) => (
              <tr key={category.id}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{category.nama}</td>
                <td className="px-4 py-2 border-b flex space-x-2">
                  <button
                    className="px-3 py-1 bg-[#e3c21e] text-white font-medium rounded-lg hover:bg-yellow-400"
                    onClick={() =>
                      setEditCategory({ id: category.id, nama: category.nama })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                    onClick={() => setDeleteCategoryId(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Modal for Edit Category */}
      {editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              value={editCategory.nama}
              onChange={(e) =>
                setEditCategory({ ...editCategory, nama: e.target.value })
              }
              className="px-4 py-2 border rounded w-full mb-4"
              placeholder="Category name"
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
                onClick={handleEditCategorySubmit}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 font-medium rounded-lg hover:bg-gray-400"
                onClick={() => setEditCategory(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modal for Delete Confirmation */}
      {deleteCategoryId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-[#c4352d] text-white font-medium rounded-lg hover:bg-red-500"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 font-medium rounded-lg hover:bg-gray-400"
                onClick={() => setDeleteCategoryId(null)}
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

export default CategoryList;
