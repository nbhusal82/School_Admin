import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Modal from "../../shared/Modal";
import Button, { ActionButtons, AddButton } from "../../shared/Button";
import Table from "../../shared/Table";

import {
  useDelete_blogsMutation,
  useGetblogsQuery,
  useCreate_blogsMutation,
  useUpdate_blogsMutation,
} from "../../redux/feature/content";

import { useGetblog_categoryQuery } from "../../redux/feature/category";
import { FolderOpen } from "lucide-react";

const BlogManagement = () => {
  const navigate = useNavigate();
  const imgurl = import.meta.env.VITE_BASE_URL;

  // Fetch Data
  const { data: blogRes, isLoading } = useGetblogsQuery();
  const { data: catRes } = useGetblog_categoryQuery();

  const blogs = blogRes?.data || [];
  const categories = catRes?.data || [];

  // Mutations
  const [deleteBlog] = useDelete_blogsMutation();
  const [createBlog, { isLoading: creating }] = useCreate_blogsMutation();
  const [updateBlog, { isLoading: updating }] = useUpdate_blogsMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Open Add
  const openAdd = () => {
    setEditingBlog(null);
    setTitle("");
    setCategoryId("");
    setDescription("");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Open Edit
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategoryId(blog.category_id || "");
    setDescription(blog.description || "");
    setPublishedDate(blog.published_date || "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Submit
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

  // Delete
  const handleDeleteClick = (id) => {
    if (window.confirm("Delete this blog?")) {
      deleteBlog(id);
    }
  };

  // Columns (Vacancy style)
  const columns = [
    {
      header: "Image",
      accessor: "image",
      render: (row) => (
        <img
          src={
            row.image_url ? `${imgurl}/${row.image_url}` : "/placeholder.png"
          }
          className="w-14 h-10 object-cover rounded"
          alt=""
        />
      ),
    },
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) =>
        categories.find(
          (c) => String(c.category_id) === String(row.category_id),
        )?.category_name || "N/A",
    },
  ];

  // Loading
  if (isLoading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <TableSkeleton rows={5} columns={4} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-500 text-xs">
            Manage your content and categories
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
          >
            <FolderOpen size={16} /> Manage Categories
          </button>

          <AddButton onClick={openAdd} label="Add Blog" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          data={blogs}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDeleteClick(row.id)}
            />
          )}
        />
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? "Edit Blog" : "Add Blog"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="w-full border p-2 rounded-lg"
          />

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-2 rounded-lg"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="border p-2 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            className="w-full border p-2 rounded-lg h-24"
            required
          />

          {/* Image */}
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1"
              isLoading={creating || updating}
            >
              {editingBlog ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
