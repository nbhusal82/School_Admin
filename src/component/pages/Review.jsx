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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const imgurl = import.meta.env.VITE_IMAGE_URL;

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

  // --- DELETE FUNCTION FIXED ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id).unwrap();
        // Tag "site" bhae ko le aafai refresh hunchha
      } catch (err) {
        console.error("Delete failed:", err);
      }
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
        // Edit garda: Laravel jasto backend ho bhane POST method bhitra _method PATCH pathaunu parcha
        data.append("_method", "PATCH");
        await updateReview({ id: editingReview.id, data }).unwrap();
      } else {
        await createReview(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Review Management</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Review
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">S.N.</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Position</th>
              <th className="p-3">Review</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={`${imgurl}/${review.image}`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="p-3 font-medium">{review.name}</td>
                <td className="p-3">{review.position}</td>
                <td className="p-3 max-w-xs truncate">{review.review_text}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
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

      {/* Modal code remains same... */}
    </div>
  );
};

export default Review;
