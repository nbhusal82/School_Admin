import React, { useState } from "react";
import { useCreatequestion_bankMutation, useDeletequestion_bankMutation, useGetquestion_bankQuery, useUpdatequestion_bankMutation } from "../../redux/feature/academic";


const QuestionBankAdmin = () => {
  const { data: questions = [], isLoading } = useGetquestion_bankQuery();
  const [createQuestion] = useCreatequestion_bankMutation();
  const [updateQuestion] = useUpdatequestion_bankMutation();
  const [deleteQuestion] = useDeletequestion_bankMutation();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    class_level: "",
    year: "",
    description: "",
    file: null,
  });

  // Open modal for add or edit
  const openModal = (question = null) => {
    setEditing(question);
    setForm(
      question
        ? {
            title: question.title,
            subject: question.subject,
            class_level: question.class_level,
            year: question.year,
            description: question.description,
            file: null, // file replace only if uploading new
          }
        : {
            title: "",
            subject: "",
            class_level: "",
            year: "",
            description: "",
            file: null,
          },
    );
    setModal(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subject", form.subject);
    formData.append("class_level", form.class_level);
    formData.append("year", form.year);
    formData.append("description", form.description);
    if (form.file) formData.append("file", form.file);

    if (editing) {
      await updateQuestion({ id: editing.id, data: formData }).unwrap();
    } else {
      await createQuestion(formData).unwrap();
    }

    setModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await deleteQuestion(id).unwrap();
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Question Bank</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          + Add Question
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">File</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{q.title}</td>
                <td className="p-3">{q.subject}</td>
                <td className="p-3">{q.class_level}</td>
                <td className="p-3">{q.year}</td>
                <td className="p-3 text-gray-600 line-clamp-2">
                  {q.description}
                </td>
                <td className="p-3">
                  {q.file_type === "pdf" ? (
                    <a
                      href={`http://localhost:5000/${q.file_url}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      View PDF
                    </a>
                  ) : (
                    <span className="text-gray-500">No file</span>
                  )}
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {new Date(q.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openModal(q)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Question" : "Add Question"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border p-2 rounded"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Class Level"
                className="w-full border p-2 rounded"
                value={form.class_level}
                onChange={(e) =>
                  setForm({ ...form, class_level: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Year"
                className="w-full border p-2 rounded"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              <input
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              />
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankAdmin;
