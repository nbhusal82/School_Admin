import React, { useState } from "react";
import { Plus, Trash2, X, Loader2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useCreatevacancyMutation,
  useDeletevacancyMutation,
  useGetvacancyQuery,
  useUpdatevacancyMutation,
} from "../../redux/feature/content";

import { useGet_vacancy_categoryQuery } from "../../redux/feature/category";

const VacancyManagement = () => {
  const navigate = useNavigate();

  const { data: vacancyRes, isLoading, refetch } = useGetvacancyQuery();
  const { data: catRes } = useGet_vacancy_categoryQuery();

  const vacancyItems = vacancyRes?.data || [];
  const categories = catRes?.data || catRes || [];

  const [createVacancy, { isLoading: isCreating }] = useCreatevacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdatevacancyMutation();
  const [deleteVacancy] = useDeletevacancyMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "",
    deadline: "",
    status: "open",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✏️ Edit handler
  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      category_id: item.category_id,
      description: item.description,
      deadline: item.application_deadline,
      status: item.status || "open",
    });
    setIsModalOpen(true);
  };

  // 🔄 Add or Update handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      category_id: form.category_id,
      description: form.description,
      application_deadline: form.deadline,
      status: form.status,
      posted_date: new Date().toISOString().split("T")[0],
    };

    try {
      if (editId) {
        // FIXED: Tapaiko mutation le ({ id, data }) format khojchha
        await updateVacancy({ id: editId, data: payload }).unwrap();
      } else {
        await createVacancy(payload).unwrap();
      }
      refetch();
      setIsModalOpen(false);
      setEditId(null);
      setForm({
        title: "",
        category_id: "",
        description: "",
        deadline: "",
        status: "open",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ⚡ FIXED: Quick Status change from Table
  const handleStatusChange = async (item, newStatus) => {
    try {
      // FIXED: Mutation requirement ({ id, data }) anusar wrap gareko
      await updateVacancy({
        id: item.id,
        data: {
          title: item.title,
          category_id: item.category_id,
          description: item.description,
          application_deadline: item.application_deadline,
          status: newStatus, // New value from select
        },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 🗑 Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this vacancy?")) {
      try {
        await deleteVacancy(id).unwrap();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* 🔝 Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Vacancy Management</h1>
          <p className="text-xs text-gray-500">Manage job vacancies</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin/vacancy/category")}
            className="border px-3 py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm font-semibold min-h-[44px] flex items-center gap-2"
          >
            <span className="hidden sm:inline">View Category</span>
            <span className="sm:hidden">Category</span>
          </button>

          <button
            onClick={() => {
              setEditId(null);
              setForm({
                title: "",
                category_id: "",
                description: "",
                deadline: "",
                status: "open",
              });
              setIsModalOpen(true);
            }}
            className="bg-[#211636] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-semibold hover:opacity-90 min-h-[44px]"
          >
            <Plus size={18} /> 
            <span className="hidden sm:inline">Add Vacancy</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* 📋 DESKTOP TABLE - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Deadline</th>
              <th className="p-3 text-center">Posted</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {vacancyItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.title}</td>

                <td className="p-3">
                  {categories.find(
                    (c) => String(c.category_id) === String(item.category_id),
                  )?.category_name || "N/A"}
                </td>

                <td className="p-3 text-center">{item.application_deadline}</td>
                <td className="p-3 text-center">{item.posted_date}</td>

                <td className="p-3 text-center">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                    className={`border rounded px-2 py-1 text-sm font-semibold ${
                      item.status === "open"
                        ? "text-green-600"
                        : item.status === "closed"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>

                <td className="p-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE CARDS - Visible only on mobile/tablet */}
      <div className="lg:hidden space-y-3">
        {vacancyItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {categories.find(
                    (c) => String(c.category_id) === String(item.category_id),
                  )?.category_name || "N/A"}
                </span>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-medium">{item.application_deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Posted:</span>
                <span className="font-medium">{item.posted_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item, e.target.value)}
                  className={`border rounded px-2 py-1 text-sm font-semibold min-h-[44px] ${
                    item.status === "open"
                      ? "text-green-600"
                      : item.status === "closed"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ➕ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl p-4 sm:p-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>

            <h2 className="text-base sm:text-lg font-semibold mb-4 pr-8">
              {editId ? "Update Vacancy" : "Add Vacancy"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="Vacancy title"
                  className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Job description"
                  className="w-full border p-3 rounded-lg text-sm min-h-[80px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1">Category</label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleInput}
                    className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInput}
                    className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleInput}
                  className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-[#211636] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 text-sm font-semibold min-h-[44px]"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : editId ? (
                    "Update Vacancy"
                  ) : (
                    "Save Vacancy"
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

export default VacancyManagement;
