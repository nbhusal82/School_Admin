import React, { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";
import {
  useCreatevacancyMutation,
  useDeletevacancyMutation,
  useGetvacancyQuery,
} from "../../redux/feature/content";
import { useGet_vacancy_categoryQuery } from "../../redux/feature/category";

const VacancyManagement = () => {
  const { data: vacancyRes, isLoading } = useGetvacancyQuery();
  const { data: catRes } = useGet_vacancy_categoryQuery();

  const vacancyItems = vacancyRes?.data || [];
  const categories = catRes?.data || catRes || [];

  const [createVacancy, { isLoading: isCreating }] = useCreatevacancyMutation();
  const [deleteVacancy] = useDeletevacancyMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "", // Added because API requires it
    deadline: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API le khojey ko format ma data pathaune
    const payload = {
      title: form.title,
      category_id: form.category_id,
      description: form.description, // API needs this
      deadline: form.deadline,
      posted_date: new Date().toISOString().split("T")[0], // API needs posted_date
    };

    try {
      await createVacancy(payload).unwrap();
      setIsModalOpen(false);
      setForm({ title: "", category_id: "", description: "", deadline: "" });
    } catch (err) {
      console.error("Error details:", err);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center text-gray-400 animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Vacancy Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add Vacancy
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-[10px] uppercase font-black text-gray-400">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vacancyItems.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/20 transition">
                <td className="px-6 py-4 font-bold text-gray-700 text-sm">
                  {item.title}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteVacancy(item.id)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-gray-800 text-lg uppercase tracking-tight">
                Post New Vacancy
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">
                  Vacancy Title
                </label>
                <div className="relative">
                  <Briefcase
                    size={14}
                    className="absolute left-3 top-3.5 text-gray-300"
                  />
                  <input
                    name="title"
                    required
                    value={form.title}
                    onChange={handleInput}
                    className="w-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all"
                    placeholder="e.g. Senior Teacher"
                  />
                </div>
              </div>

              {/* Description Input (Required by API) */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">
                  Job Description
                </label>
                <div className="relative">
                  <FileText
                    size={14}
                    className="absolute left-3 top-3.5 text-gray-300"
                  />
                  <textarea
                    name="description"
                    required
                    value={form.description}
                    onChange={handleInput}
                    className="w-full border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all h-24 resize-none"
                    placeholder="Write job details here..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category Select */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    required
                    value={form.category_id}
                    onChange={handleInput}
                    className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-2xl text-sm font-semibold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline Input */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1 block mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    value={form.deadline}
                    onChange={handleInput}
                    className="w-full border border-gray-100 bg-gray-50/50 px-4 py-3 rounded-2xl text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-xs font-black text-gray-400 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-2 bg-blue-600 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 transition-all"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Publish Vacancy"
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
