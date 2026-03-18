import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  ListTree,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCreate_team_categoryMutation,
  useDelete_team_categoryMutation,
  useGet_team_categoryQuery,
  useUpdate_team_categoryMutation,
} from "../../redux/feature/category";

const TeamCategory = () => {
  const navigate = useNavigate();
  const { data: response = [], isLoading: isFetching } =
    useGet_team_categoryQuery();
  const categories = response?.data || response;

  // Mutations with Loading States
  const [createCat, { isLoading: isCreating }] =
    useCreate_team_categoryMutation();
  const [updateCat, { isLoading: isUpdating }] =
    useUpdate_team_categoryMutation();
  const [deleteCat] = useDelete_team_categoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const openAddModal = () => {
    setEditingCat(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setCategoryName(cat.category_name || cat.name || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        // UPDATE: Check garnus 'id' pathaune format (tapaiko API le 'id' ki 'category_id' khojcha)
        await updateCat({
          id: editingCat.category_id, // Path मा जाने ID
          category_name: categoryName, // Body मा जाने Data
        }).unwrap();
      } else {
        // CREATE
        await createCat({ category_name: categoryName }).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Operation failed:", err);
      alert("Error bhayo: " + (err?.data?.message || "Check network"));
    }
  };

  if (isFetching)
    return (
      <div className="p-10 text-center text-gray-400">Loading List...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/team")}
            className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Team Categories</h1>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Table */}
      <div className="max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-500 font-semibold">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4">Category Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr
                key={cat.category_id || cat.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-4 text-gray-400">#{cat.category_id}</td>
                <td className="p-4 font-semibold text-gray-700">
                  {cat.category_name || cat.name}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() =>
                        window.confirm("Delete?") && deleteCat(cat.category_id)
                      }
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL with Loading Buttons */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => !isCreating && !isUpdating && setModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 border animate-in zoom-in-95 duration-200">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
              {editingCat ? "Update Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                disabled={isCreating || isUpdating}
                type="text"
                required
                autoFocus
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {editingCat ? "Updating..." : "Adding..."}
                    </>
                  ) : editingCat ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCategory;
