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

  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    notice_date: "",
    attachment: null,
  });

  const filteredNotices =
    filter === "All"
      ? notices?.data || []
      : (notices?.data || []).filter(
          (n) => String(n.category_id) === String(filter),
        );

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

    if (form.attachment) {
      formData.append("attachment", form.attachment);
    }

    try {
      await createNotice(formData).unwrap();

      setForm({
        title: "",
        category_id: "",
        notice_date: "",
        attachment: null,
      });

      setShowAddForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Notice Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Create and manage school notices
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin/notice/category")}
            className="flex items-center gap-2 bg-white border px-3 py-2 rounded-xl font-semibold hover:bg-gray-100 text-xs sm:text-sm min-h-[44px]"
          >
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">View Category</span>
            <span className="sm:hidden">Category</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm min-h-[44px] ${
              showAddForm ? "bg-red-500 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            <span className="hidden sm:inline">{showAddForm ? "Cancel" : "Add Notice"}</span>
            <span className="sm:hidden">{showAddForm ? "Cancel" : "Add"}</span>
          </button>
        </div>
      </div>

      {/* ADD NOTICE FORM */}
      {showAddForm && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow border mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-bold mb-4">Add Notice</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-bold block mb-1">Notice Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                required
                className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
                placeholder="Enter notice title"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleInputChange}
                required
                className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Date</label>
              <input
                type="date"
                name="notice_date"
                value={form.notice_date}
                onChange={handleInputChange}
                className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">File</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="w-full border p-3 rounded-lg text-sm min-h-[44px]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 min-h-[44px] flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {isCreating ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER */}
      <div className="flex gap-2 mb-4 sm:mb-6 flex-wrap">
        <button
          onClick={() => setFilter("All")}
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold min-h-[44px] ${
            filter === "All" ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-50"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => setFilter(cat.category_id)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold min-h-[44px] ${
              String(filter) === String(cat.category_id)
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-50"
            }`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* DESKTOP TABLE - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Notice</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">File</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotices.map((notice) => {
              const category = categories.find(
                (c) => String(c.category_id) === String(notice.category_id),
              );

              return (
                <tr key={notice.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {category?.category_name}
                    </span>
                    <p className="font-semibold mt-1">{notice.title}</p>
                  </td>

                  <td className="p-4 text-gray-600">{notice.notice_date?.split("T")[0]}</td>

                  <td className="p-4">
                    {notice.attachment_url ? (
                      <a
                        href={`${imageurl}/${notice.attachment_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 flex items-center gap-1 hover:text-blue-700"
                      >
                        <FileText size={16} />
                        View
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No File</span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        window.confirm("Delete notice?") &&
                        deleteNotice(notice.id)
                      }
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS - Visible only on mobile/tablet */}
      <div className="lg:hidden space-y-3">
        {filteredNotices.map((notice) => {
          const category = categories.find(
            (c) => String(c.category_id) === String(notice.category_id),
          );

          return (
            <div key={notice.id} className="bg-white rounded-xl shadow border p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {category?.category_name}
                </span>
                <button
                  onClick={() =>
                    window.confirm("Delete notice?") &&
                    deleteNotice(notice.id)
                  }
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2">{notice.title}</h3>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  {notice.notice_date?.split("T")[0]}
                </div>
                
                {notice.attachment_url ? (
                  <a
                    href={`${imageurl}/${notice.attachment_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 flex items-center gap-1 hover:text-blue-700 text-sm font-semibold min-h-[44px]"
                  >
                    <FileText size={16} />
                    View File
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">No File</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoticeManagement;
