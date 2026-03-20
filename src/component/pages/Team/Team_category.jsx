import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
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

  // Data Fetching
  const {
    data: response = [],
    isLoading: isFetching,
    refetch,
  } = useGet_team_categoryQuery();
  const categories = response?.data || response;

  // Mutations
  const [createCat, { isLoading: isCreating }] =
    useCreate_team_categoryMutation();
  const [updateCat, { isLoading: isUpdating }] =
    useUpdate_team_categoryMutation();
  const [deleteCat] = useDelete_team_categoryMutation();

  // Local States
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

  // --- FIXED DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!id) return alert("Category ID not found!");

    if (
      window.confirm(
        "Are you sure? Members linked to this category might be affected.",
      )
    ) {
      try {
        // .unwrap() use garnu parcha error catch garna
        await deleteCat(id).unwrap();
        // Successful delete pachi refetch garne (yadi tags set chaina vane)
        refetch();
      } catch (err) {
        console.error("Delete Error:", err);
        // Error message handling
        const errorMsg =
          err?.data?.message ||
          "Cannot delete. This category might be in use by team members.";
        alert("Delete Failed: " + errorMsg);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCat) {
        // UPDATE Logic
        await updateCat({
          id: editingCat.category_id || editingCat.id, // Try both ID fields
          category_name: categoryName,
        }).unwrap();
      } else {
        // CREATE Logic
        await createCat({ category_name: categoryName }).unwrap();
      }
      setModalOpen(false);
      setCategoryName("");
    } catch (err) {
      console.error("Operation failed:", err);
      alert("Error: " + (err?.data?.message || "Something went wrong"));
    }
  };

  if (isFetching)
    return (
      <div className="flex flex-col items-center justify-center p-20 text-blue-500">
        <Loader2 className="animate-spin mb-2" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Loading Categories...
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/team")}
            className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition active:scale-90"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Team Categories
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Organize your staff departments
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl hover:bg-blue-700 transition text-sm font-bold shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={18} /> New Category
        </button>
      </div>

      {/* Table Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-4xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-[0.15em]">
            <tr>
              <th className="px-8 py-5">ID</th>
              <th className="px-8 py-5">Department Name</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr
                  key={cat.category_id || cat.id}
                  className="hover:bg-blue-50/20 transition group"
                >
                  <td className="px-8 py-5 text-gray-400 font-mono text-xs">
                    #{cat.category_id || cat.id}
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-700 tracking-tight">
                    {cat.category_name || cat.name}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id || cat.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-20 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <AlertCircle size={48} />
                    <p className="mt-2 font-bold italic tracking-tighter">
                      No Categories Found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SECTION */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white w-full max-w-sm rounded-4xl shadow-2xl p-8 border border-white animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-gray-900 text-lg uppercase tracking-tight">
                {editingCat ? "Update Dept." : "New Dept."}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Category Name
                </label>
                <input
                  disabled={isCreating || isUpdating}
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Administration"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border border-gray-100 bg-gray-50/50 px-5 py-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-2 bg-blue-600 text-white py-4 rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : editingCat ? (
                    "Update Now"
                  ) : (
                    "Create Dept"
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
