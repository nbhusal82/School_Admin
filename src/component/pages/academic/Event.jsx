import React, { useState } from "react";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventQuery,
} from "../../redux/feature/academic";

const Event = () => {
  const { data: events = [], isLoading } = useGetEventQuery();
  const [createEvent] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [modal, setModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    event_date: "",
    pdf_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEvent(form).unwrap();

    setModal(false);

    setForm({
      title: "",
      category: "",
      description: "",
      event_date: "",
      pdf_url: "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await deleteEvent(id);
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Events Management</h1>

        <button
          onClick={() => setModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Event
        </button>
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{event.title}</td>

                <td className="p-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                    {event.category}
                  </span>
                </td>

                <td className="p-3 text-gray-600">{event.description}</td>

                <td className="p-3">
                  {new Date(event.event_date).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <img
                    src={`http://localhost:5000/${event.pdf_url}`}
                    alt="event"
                    className="w-14 h-10 object-cover rounded"
                  />
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(event.id)}
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

      {/* Add Event Modal */}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Add Event</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <input
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                type="date"
                className="w-full border p-2 rounded"
                value={form.event_date}
                onChange={(e) =>
                  setForm({ ...form, event_date: e.target.value })
                }
                required
              />

              <input
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                value={form.pdf_url}
                onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                required
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

export default Event;
