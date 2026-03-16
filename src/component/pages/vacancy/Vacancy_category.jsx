import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderPlus, Trash2, Search, Tag } from "lucide-react";
import {
  useCreatecategory_vacancyMutation,
  useDeletecategory_vacancyMutation,
  useGet_vacancy_categoryQuery,
} from "../../redux/feature/category";

const Vacancy_Category = () => {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useGet_vacancy_categoryQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreatecategory_vacancyMutation();
  const [deleteCategory] = useDeletecategory_vacancyMutation();

  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ category_name: name }).unwrap();
      setName("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-7 h-7 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading categories...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <button
          onClick={() => navigate("/admin/vacancy")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={16} />
          Back to Vacancy
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Vacancy Categories
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage job category classifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5 items-start">
          {/* ADD FORM CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <FolderPlus size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  New Category
                </p>
                <p className="text-xs text-slate-400">
                  Add a job classification
                </p>
              </div>
            </div>

            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div className="relative">
                <Tag
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder=""
                  className="w-full border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-800 bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder-slate-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating || !name.trim()}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {isCreating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FolderPlus size={15} />
                    Save Category
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              <span className="text-2xl font-bold text-blue-600 leading-none">
                {categories.length}
              </span>
              <span className="text-xs text-slate-500">Total Categories</span>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">
                All Categories
              </span>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-slate-200 rounded-lg py-1.5 pl-7 pr-3 text-xs text-slate-700 bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition w-44 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="py-2.5 px-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="py-2.5 px-4 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      {search
                        ? "No categories match your search."
                        : "No categories added yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((cat, idx) => (
                    <tr
                      key={cat.category_id}
                      className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-xs text-slate-300 font-medium tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-200 border-2 border-blue-300 shrink-0" />
                          <span className="font-medium text-slate-700">
                            {cat.category_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(cat.category_id)}
                          disabled={deletingId === cat.category_id}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
                          title="Delete category"
                        >
                          {deletingId === cat.category_id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-right">
                Showing {filtered.length} of {categories.length} categories
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vacancy_Category;
