import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Calendar,
  FileText,
  Type,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useDelete_blogsMutation,
  useGetblogsQuery,
  useCreate_blogsMutation,
  useUpdate_blogsMutation,
} from "../../redux/feature/content";
import { useGetblog_categoryQuery } from "../../redux/feature/category";

const BlogManagement = () => {
  const navigate = useNavigate();
  const imgurl = import.meta.env.VITE_BASE_URL;

  // Data fetching
  const { data: blogRes } = useGetblogsQuery();
  const { data: catRes } = useGetblog_categoryQuery();
  const blogs = blogRes?.data || [];
  const categories = catRes?.data || [];

  // Mutations
  const [deleteBlog] = useDelete_blogsMutation();
  const [createBlog] = useCreate_blogsMutation();
  const [updateBlog] = useUpdate_blogsMutation();

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form Fields (Database schema anusar)
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const openAdd = () => {
    setEditingBlog(null);
    setTitle("");
    setCategoryId("");
    setDescription("");
    setPublishedDate(new Date().toISOString().split("T")[0]); // Default aajako date
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategoryId(blog.category_id || "");
    setDescription(blog.description || "");
    setPublishedDate(blog.published_date || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", categoryId);
      formData.append("description", description);
      formData.append("published_date", publishedDate);
      if (imageFile) formData.append("image", imageFile);

      if (editingBlog) {
        await updateBlog({ id: editingBlog.id, data: formData }).unwrap();
      } else {
        await createBlog(formData).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-500 text-xs">
            Manage your content and categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/blog/category")}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-white transition"
          >
            Categories
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} /> Add Blog
          </button>
        </div>
      </div>

      {/* BLOG LIST TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50 transition">
                <td className="p-3">
                  <img
                    src={
                      blog.image_url
                        ? `${imgurl}/${blog.image_url}`
                        : "/placeholder.png"
                    }
                    className="w-12 h-9 object-cover rounded shadow-sm"
                    alt=""
                  />
                </td>
                <td className="p-3 font-medium text-gray-700">{blog.title}</td>
                <td className="p-3 text-gray-500">
                  {categories.find(
                    (c) => String(c.category_id) === String(blog.category_id),
                  )?.category_name || "N/A"}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(blog)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
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

      {/* COMPACT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Form Box - Optimized Size */}
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Title */}
              <div>
                <label className="text-[12px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                  Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Blog title..."
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                    Category
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-200 px-2 py-1.5 rounded-lg text-sm outline-none"
                  >
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full border border-gray-200 px-2 py-1.5 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[12px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg h-24 text-sm outline-none resize-none"
                  placeholder="Content details..."
                />
              </div>

              {/* Image */}
              <div>
                <label className="text-[12px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">
                  Featured Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  {editingBlog ? "Update Blog" : "Save Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
