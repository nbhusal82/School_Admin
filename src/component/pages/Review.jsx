import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import TableSkeleton from "../redux/feature/../../shared/Skeleton_table";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetreviewQuery,
  useUpdateReviewMutation,
} from "../redux/feature/siteslice";

const Review = () => {
  const { data: reviews = [], isLoading } = useGetreviewQuery();
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const imgurl = import.meta.env.VITE_IMAGE_URL;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    review_text: "",
    image: null,
  });

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({ name: "", position: "", review_text: "", image: null });
    setModalOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      position: review.position,
      review_text: review.review_text,
      image: null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review?")) await deleteReview(id).unwrap();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("review_text", formData.review_text);
    if (formData.image) data.append("image", formData.image);
    try {
      if (editingReview) {
        await updateReview({ id: editingReview.id, data }).unwrap();
      } else {
        await createReview(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Review Management</h1>
          <p className="text-xs text-gray-500 italic">Manage customer reviews</p>
        </div>
      </div>
      <TableSkeleton rows={5} columns={6} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Review Management</h1>
          <p className="text-xs text-gray-500 italic">
            Manage customer reviews
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Position</th>
              <th className="p-3">Review</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((review, index) => (
              <tr key={review.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={`${imgurl}/${review.image}`}
                    className="w-10 h-10 rounded-full object-cover border"
                    alt={review.name}
                  />
                </td>
                <td className="p-3 font-medium text-black-900">
                  {review.name}
                </td>
                <td className="p-3 text-black-900 font-medium">
                  {review.position}
                </td>
                <td className="p-3 text-black-900 max-w-xs  font-medium truncate">
                  {review.review_text}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">
                {editingReview ? "Edit Review" : "Add Review"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Reviewer name"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Position
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  placeholder="e.g. Parent, Student"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Review
                </label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) =>
                    setFormData({ ...formData, review_text: e.target.value })
                  }
                  placeholder="Review text..."
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Photo
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-1.5 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  {isCreating || isUpdating
                    ? editingReview
                      ? "Updating..."
                      : "Adding..."
                    : editingReview
                      ? "Update Review"
                      : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
