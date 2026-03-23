import React, { useState } from "react";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import TableSkeleton from "../../shared/Skeleton_table";
import {
  useCreatequestion_bankMutation,
  useDeletequestion_bankMutation,
  useGetquestion_bankQuery,
  useUpdatequestion_bankMutation,
} from "../../redux/feature/academic";

const QuestionBankAdmin = () => {
  const { data: questions = [], isLoading } = useGetquestion_bankQuery();
  const [createQuestion, { isLoading: isCreating }] = useCreatequestion_bankMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdatequestion_bankMutation();
  const [deleteQuestion] = useDeletequestion_bankMutation();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", class_level: "", year: "", description: "", file: null });

  const openModal = (question = null) => {
    setEditing(question);
    setForm(question
      ? { title: question.title, subject: question.subject, class_level: question.class_level, year: question.year, description: question.description, file: null }
      : { title: "", subject: "", class_level: "", year: "", description: "", file: null }
    );
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject);
    formData.append("class_level", form.class_level);
    formData.append("year", form.year);
    formData.append("description", form.description);
    if (form.file) formData.append("file", form.file);
    try {
      if (editing) {
        await updateQuestion({ id: editing.id, data: formData }).unwrap();
      } else {
        await createQuestion(formData).unwrap();
      }
      setModal(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) await deleteQuestion(id).unwrap();
  };

  const columns = [
    { header: "S.N", render: (_, index) => <span className="text-gray-400">{index + 1}</span> },
    { header: "Title", accessor: "title", cellClassName: "font-medium text-gray-700" },
    { header: "Subject", render: (row) => <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{row.subject}</span> },
    { header: "Class", accessor: "class_level", cellClassName: "text-gray-500" },
    { header: "Year", accessor: "year", cellClassName: "text-gray-500" },
    { header: "File", render: (row) => row.file_type === "pdf" ? <a href={`http://localhost:5000/${row.file_url}`} target="_blank" className="text-blue-600 underline text-xs">View PDF</a> : <span className="text-gray-400 text-xs">No file</span> },
  ];

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Question Bank" subtitle="Manage question papers and resources" />
      <TableSkeleton rows={5} columns={7} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Question Bank" subtitle="Manage question papers and resources">
        <AddButton onClick={() => openModal()} label="Add Question" />
      </PageHeader>

      <Table
        columns={columns}
        data={questions}
        actions={(row) => (
          <ActionButtons
            onEdit={() => openModal(row)}
            onDelete={() => handleDelete(row.id)}
          />
        )}
      />

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Question" : "Add Question"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Title</label>
            <input
              required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Question title"
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Subject</label>
              <input
                required value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Math"
                className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Class</label>
              <input
                required value={form.class_level}
                onChange={(e) => setForm({ ...form, class_level: e.target.value })}
                placeholder="e.g. 10"
                className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Year</label>
              <input
                required value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 2024"
                className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Description</label>
            <textarea
              required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description..."
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">File (PDF)</label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
            />
          </div>
          <div className="flex gap-2 pt-3">
            <Button variant="outline" className="flex-1" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editing ? "Update Question" : "Save Question"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionBankAdmin;
