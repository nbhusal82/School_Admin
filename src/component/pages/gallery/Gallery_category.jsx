import React, { useState } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";

import {
  useCreatecategory_galleryMutation,
  useDeletecategory_galleryMutation,
  useGetcategory_galleryQuery,
  useUpdatecategory_galleryMutation,
} from "../../redux/feature/category";

const GalleryCategory = () => {
  const { data: categories = [] } = useGetcategory_galleryQuery();
  const [createCategory] = useCreatecategory_galleryMutation();
  const [deleteCategory] = useDeletecategory_galleryMutation();
  const [updateCategory] = useUpdatecategory_galleryMutation();

  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  const openAdd = () => { setEditingCat(null); setName(""); setIsModalOpen(true); };
  const openEdit = (cat) => { setEditingCat(cat); setName(cat.category_name); setIsModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      if (editingCat) {
        await updateCategory({ id: editingCat.id, data: { category_name: name } }).unwrap();
      } else {
        await createCategory({ category_name: name }).unwrap();
      }
      setName("");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) {
      await deleteCategory(id).unwrap();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Categories</h1>

        {/* Add Button jasle modal kholcha */}
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editingCat ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                autoFocus
                placeholder="Enter category name"
                className="border w-full px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setName("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingCat ? "Update" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY LIST */}
      <div className="grid gap-3">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
            >
              <p className="font-medium text-gray-700">{cat.category_name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryCategory;
