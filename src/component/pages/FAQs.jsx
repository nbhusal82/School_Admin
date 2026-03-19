import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../redux/feature/siteslice";

const FAQPage = () => {
  const { data: faqs = [], isLoading } = useGetFaqsQuery();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({ question: "", answer: "" });
    setModalOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete FAQ?")) {
      try { await deleteFaq(id).unwrap(); } catch (err) { console.error(err); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq._id || editingFaq.id, data: formData }).unwrap();
      } else {
        await createFaq(formData).unwrap();
      }
      setModalOpen(false);
    } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">FAQ Management</h1>
          <p className="text-xs text-gray-500 italic">Manage frequently asked questions</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Question</th>
              <th className="p-3">Answer</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <tr key={faq._id || faq.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3 font-medium text-gray-700 max-w-xs">{faq.question}</td>
                <td className="p-3 text-gray-500 max-w-sm truncate">{faq.answer}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(faq)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(faq._id || faq.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition">
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">{editingFaq ? "Edit FAQ" : "Add FAQ"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Question</label>
                <input
                  type="text" required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter question"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Answer</label>
                <textarea
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Enter answer"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-28 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-1.5 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating || isUpdating} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                  {isCreating || isUpdating ? (editingFaq ? "Updating..." : "Adding...") : (editingFaq ? "Update FAQ" : "Save FAQ")}
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
