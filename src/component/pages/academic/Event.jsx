import React, { useState } from "react";
import { Plus, Trash2, X, Calendar } from "lucide-react";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventQuery,
} from "../../redux/feature/academic";

const Event = () => {
  const { data: events = [], isLoading } = useGetEventQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", description: "", event_date: "", pdf_url: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createEvent(form).unwrap();
    setModal(false);
    setForm({ title: "", category: "", description: "", event_date: "", pdf_url: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) await deleteEvent(id);
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Events Management</h1>
          <p className="text-xs text-gray-500 italic">Manage school events</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">S.N</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Date</th>
              <th className="p-3">Image</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">{index + 1}</td>
                <td className="p-3 font-medium text-gray-700">{event.title}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{event.category}</span>
                </td>
                <td className="p-3 text-gray-500 max-w-xs truncate">{event.description}</td>
                <td className="p-3 text-gray-500 flex items-center gap-1">
                  <Calendar size={13} className="text-gray-400" />
                  {new Date(event.event_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <img src={`http://localhost:5000/${event.pdf_url}`} alt="event" className="w-12 h-9 object-cover rounded" />
                </td>
                <td className="p-3">
                  <div className="flex justify-center">
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition">
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
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">Add Event</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Title</label>
                <input
                  required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Category</label>
                  <input
                    required value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Category"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Date</label>
                  <input
                    type="date" required value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Description</label>
                <textarea
                  required value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Event description..."
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Image URL</label>
                <input
                  required value={form.pdf_url}
                  onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                  placeholder="Image URL"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-1.5 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                  {isCreating ? "Adding..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
