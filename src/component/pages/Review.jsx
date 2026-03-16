import React, { useState } from "react";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetreviewQuery,
  useUpdateReviewMutation,
} from "../redux/feature/siteslice";

const Review = () => {
  const { data: reviews = [], isLoading } = useGetreviewQuery();

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
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
    setFormData({
      name: "",
      position: "",
      review_text: "",
      image: null,
    });
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
    if (window.confirm("Delete this review?")) {
      await deleteReview(id).unwrap();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("review_text", formData.review_text);

    if (formData.image) {
      data.append("image", formData.image);
    }

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

  if (isLoading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Review Management</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Review
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Position</th>
              <th className="p-3">Review</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id} className="border-b">
                <td className="p-3">{index + 1}</td>

                <td className="p-3">
                  <img
                    src={`${imgurl}/${review.image}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>

                <td className="p-3">{review.name}</td>
                <td className="p-3">{review.position}</td>
                <td className="p-3 max-w-xs truncate">{review.review_text}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              {editingReview ? "Edit Review" : "Add Review"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Position"
                className="w-full border p-2 rounded"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Review"
                className="w-full border p-2 rounded"
                value={formData.review_text}
                onChange={(e) =>
                  setFormData({ ...formData, review_text: e.target.value })
                }
              />

              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  {editingReview ? "Update" : "Create"}
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
