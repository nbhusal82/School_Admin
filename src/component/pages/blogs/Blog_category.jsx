import React, { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useCreate_blogs_categoryMutation,
  useGetblog_categoryQuery,
  useUpdate_blogs_categoryMutation,
  useDelete_blogs_categoryMutation,
} from "../../redux/feature/category";

const BlogCategory = () => {
  const navigate = useNavigate();

  const { data: res } = useGetblog_categoryQuery();
  const categories = res?.data || [];

  const [createCategory] = useCreate_blogs_categoryMutation();
  const [updateCategory] = useUpdate_blogs_categoryMutation();
  const [deleteCategory] = useDelete_blogs_categoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingCat, setEditingCat] = useState(null);

  // 👉 open add
  const openAdd = () => {
    setEditingCat(null);
    setName("");
    setIsModalOpen(true);
  };

  // 👉 open edit
  const openEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.category_name);
    setIsModalOpen(true);
  };

  // 👉 submit (add/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCat) {
        await updateCategory({
          id: editingCat.category_id,
          data: { category_name: name },
        }).unwrap();
      } else {
        await createCategory({ category_name: name }).unwrap();
      }

      setName("");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 👉 delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) {
      await deleteCategory(id).unwrap();
    }
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Categories</h1>
          <p className="text-gray-500 text-sm">
            Add, edit and manage categories
          </p>
        </div>

        <div className="flex gap-3">
          {/* Back */}
          <button
            onClick={() => navigate("/admin/blog")}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            ← Back
          </button>

          {/* Add Category */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Category Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr
                  key={cat.category_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{cat.category_id}</td>

                  <td className="p-4 font-medium">{cat.category_name}</td>

                  <td className="p-4 flex justify-center gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => openEdit(cat)}
                      className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(cat.category_id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (Add/Edit same page) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">
                {editingCat ? "Edit Category" : "Add Category"}
              </h2>

              <button onClick={() => setIsModalOpen(false)}>
                <X className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full border px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingCat ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategory;
