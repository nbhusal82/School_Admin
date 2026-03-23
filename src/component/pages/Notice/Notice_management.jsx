import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  FileText,
  LayoutGrid,
  Calendar,
  ExternalLink,
  X,
  Save,
  Upload,
  Loader2,
} from "lucide-react";

import {
  useDeleteNoticeMutation,
  useGetNoticeQuery,
  useCreateNoticeMutation,
} from "../../redux/feature/content";

import { useGetcategory_noticeQuery } from "../../redux/feature/category";

const NoticeManagement = () => {
  const navigate = useNavigate();
  const { data: notices, isLoading } = useGetNoticeQuery();
  const { data: categories = [] } = useGetcategory_noticeQuery();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    notice_date: "",
    attachment: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category_id", form.category_id);
    formData.append("notice_date", form.notice_date);
    if (form.attachment) formData.append("attachment", form.attachment);

    try {
      await createNotice(formData).unwrap();
      setForm({
        title: "",
        category_id: "",
        notice_date: "",
        attachment: null,
      });
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notices</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">School Dashboard</p>
          </div>
        </div>
        <div className="grid gap-4 max-w-5xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm animate-pulse">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 bg-gray-300 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const filteredNotices =
    filter === "All"
      ? notices?.data || []
      : (notices?.data || []).filter(
          (n) => String(n.category_id) === String(filter),
        );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Notices
          </h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            School Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/notice/category")}
            className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
            title="Manage Categories"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Notice</span>
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setFilter("All")}
          className={`px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${filter === "All" ? "bg-gray-900 text-white border-gray-900 shadow-md" : "bg-white text-gray-500 border-gray-100 hover:border-blue-300"}`}
        >
          All Notices
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => setFilter(cat.category_id)}
            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap ${String(filter) === String(cat.category_id) ? "bg-gray-900 text-white border-gray-900 shadow-md" : "bg-white text-gray-500 border-gray-100 hover:border-blue-300"}`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* COMPACT ADD FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-extrabold text-gray-800">Add New Notice</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Title of the notice..."
                  className="w-full bg-gray-50 border-none p-3.5 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleInputChange}
                    required
                    className="w-full border-none p-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="notice_date"
                    value={form.notice_date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none p-3.5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                  Attachment
                </label>
                <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-4 text-center hover:bg-blue-50/50 transition-all group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload
                    size={18}
                    className="mx-auto text-gray-300 mb-1 group-hover:text-blue-500 transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 font-medium truncate">
                    {form.attachment
                      ? form.attachment.name
                      : "Tap to upload file"}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 flex justify-center items-center gap-2 mt-2 disabled:bg-gray-300 transition-all"
              >
                {isCreating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {isCreating ? "Saving..." : "Publish Notice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NOTICE LISTING */}
      <div className="grid gap-4 max-w-5xl">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            const category = categories.find(
              (c) => String(c.category_id) === String(notice.category_id),
            );
            return (
              <div
                key={notice.id}
                className="group bg-white p-5 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-12 w-12 bg-blue-50 rounded-2xl items-center justify-center text-blue-600 shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {category?.category_name || "Notice"}
                      </span>
                      <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                        <Calendar size={12} strokeWidth={3} />{" "}
                        {notice.notice_date?.split("T")[0]}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                      {notice.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-2 sm:bg-transparent sm:p-0 rounded-2xl justify-end">
                  {notice.attachment_url && (
                    <a
                      href={`${imageurl}/${notice.attachment_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 bg-white sm:bg-blue-50 text-blue-600 rounded-xl text-sm font-bold border border-blue-100 sm:border-transparent hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink size={16} /> View
                    </a>
                  )}
                  <button
                    onClick={() =>
                      window.confirm("Delete this notice?") &&
                      deleteNotice(notice.id)
                    }
                    className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold italic">
              No notices found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeManagement;
