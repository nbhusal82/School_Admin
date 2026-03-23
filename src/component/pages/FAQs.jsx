import React, { useState } from "react";
import PageHeader from "../shared/PageHeader";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import Button, { AddButton, ActionButtons } from "../shared/Button";
import TableSkeleton from "../shared/Skeleton_table";
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

  const columns = [
    { header: "S.N", render: (_, index) => <span className="text-gray-400">{index + 1}</span> },
    { header: "Question", accessor: "question", cellClassName: "font-medium text-gray-700 max-w-xs" },
    { header: "Answer", accessor: "answer", cellClassName: "text-gray-500 max-w-sm truncate" },
  ];

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

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="FAQ Management" subtitle="Manage frequently asked questions" />
      <TableSkeleton rows={5} columns={4} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="FAQ Management" subtitle="Manage frequently asked questions">
        <AddButton onClick={openAddModal} label="Add FAQ" />
      </PageHeader>

      <Table
        columns={columns}
        data={faqs}
        actions={(row) => (
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row._id || row.id)}
          />
        )}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaq ? "Edit FAQ" : "Add FAQ"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Question</label>
            <input
              type="text" required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter question"
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Answer</label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Enter answer"
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-3">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editingFaq ? "Update FAQ" : "Save FAQ"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FAQPage;
