import React, { useState } from "react";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../redux/feature/siteslice";

const FAQPage = () => {
  const { data: faqs = [], isLoading } = useGetFaqsQuery();

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({ question: "", answer: "" });
    setModalOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete FAQ?")) {
      try {
        await deleteFaq(id).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete FAQ");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id || editingFaq.id,
          data: formData,
        }).unwrap();
      } else {
        await createFaq(formData).unwrap();
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to save FAQ");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-600">FAQ Management</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add FAQ
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Question</th>
            <th className="p-3">Answer</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {faqs.map((faq) => (
            <tr key={faq._id || faq.id} className="border-t">
              <td className="p-3">{faq.question}</td>

              <td className="p-3">{faq.answer}</td>

              <td className="p-3 flex gap-3">
                <button
                  onClick={() => handleEdit(faq)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(faq._id || faq.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingFaq ? "Edit FAQ" : "Add FAQ"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Question"
                className="w-full border p-2 mb-3"
                value={formData.question}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    question: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Answer"
                className="w-full border p-2 mb-3"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    answer: e.target.value,
                  })
                }
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
