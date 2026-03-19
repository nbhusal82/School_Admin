import React, { useState } from "react";
import { Plus, Trash2, Pencil, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCreate_blogs_categoryMutation,
  useGetblog_categoryQuery,
  useUpdate_blogs_categoryMutation,
  useDelete_blogs_categoryMutation,
} from "../../redux/feature/category";

const BlogCategory = () => {
  const navigate = useNavigate();
  const { data: res, isLoading } = useGetblog_categoryQuery();
  const categories = res?.data || [];

  const [createCategory, { isLoading: isCreating }] = useCreate_blogs_categoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdate_blogs_categoryMutation();
  const [deleteCategory] = useDelete_blogs_categoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState("");

  const openAdd = () => { setEditingCat(null); setName(""); setModalOpen(true); };
  const openEdit = (cat) => { setEditingCat(cat); setName(cat.category_name); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (editingCat) {
        await updateCategory({ id: editingCat.category_id, data: { category_name: name } }).unwrap();
      } else {
        await createCategory({ category_name: name }).unwrap();
      }
      setModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) await deleteCategory(id).unwrap();
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/blog")} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Blog Categories</h1>
            <p className="text-xs text-gray-500 italic">Manage blog categories</p>
          </div>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Category Name</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat, index) => (
              <tr key={cat.category_id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3 font-medium text-gray-700">{cat.category_name}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(cat.category_id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xs rounded-xl shadow-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">{editingCat ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                autoFocus required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-1.5 text-sm text-gray-500 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isCreating || isUpdating} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                  {isCreating || isUpdating ? "Saving..." : editingCat ? "Update" : "Save"}
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
