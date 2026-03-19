import React, { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
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

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Question Bank</h1>
          <p className="text-xs text-gray-500 italic">Manage question papers and resources</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Title</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Class</th>
              <th className="p-3">Year</th>
              <th className="p-3">File</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q, index) => (
              <tr key={q.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3 font-medium text-gray-700">{q.title}</td>
                <td className="p-3">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{q.subject}</span>
                </td>
                <td className="p-3 text-gray-500">{q.class_level}</td>
                <td className="p-3 text-gray-500">{q.year}</td>
                <td className="p-3">
                  {q.file_type === "pdf" ? (
                    <a href={`http://localhost:5000/${q.file_url}`} target="_blank" className="text-blue-600 underline text-xs">View PDF</a>
                  ) : (
                    <span className="text-gray-400 text-xs">No file</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openModal(q)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">{editing ? "Edit Question" : "Add Question"}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Title</label>
                <input
                  required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Question title"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Subject</label>
                  <input
                    required value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Math"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Class</label>
                  <input
                    required value={form.class_level}
                    onChange={(e) => setForm({ ...form, class_level: e.target.value })}
                    placeholder="e.g. 10"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Year</label>
                  <input
                    required value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Description</label>
                <textarea
                  required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description..."
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-14 resize-none"
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
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-1.5 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating || isUpdating} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                  {isCreating || isUpdating ? (editing ? "Updating..." : "Adding...") : (editing ? "Update Question" : "Save Question")}
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
