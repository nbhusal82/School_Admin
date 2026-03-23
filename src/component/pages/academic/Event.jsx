import React, { useState } from "react";
import { Plus, Trash2, X, Calendar } from "lucide-react";
import TableSkeleton from "../../shared/Skeleton_table";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventQuery,
} from "../../redux/feature/academic";

const Event = () => {
  const { data: events = [], isLoading } = useGetEventQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const imageurl = import.meta.env.VITE_IMAGE_URL;

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
    if (window.confirm("Delete this event?")) await deleteEvent(id);
  };

  if (isLoading) return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Events Management</h1>
          <p className="text-xs text-gray-500 italic">Manage school events</p>
        </div>
      </div>
      <div className="hidden lg:block">
        <TableSkeleton rows={5} columns={7} />
      </div>
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Events Management
          </h1>
          <p className="text-xs text-gray-500 italic">Manage school events</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm shadow-sm min-h-11 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Event</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* DESKTOP TABLE - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border">
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
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {event.category}
                  </span>
                </td>
                <td className="p-3 text-gray-500 max-w-xs truncate">
                  {event.description}
                </td>
                <td className="p-3 text-gray-500 flex items-center gap-1">
                  <Calendar size={13} className="text-gray-400" />
                  {new Date(event.event_date).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <img
                    src={`${imageurl}/${event.pdf_url}`}
                    alt="event"
                    className="w-12 h-9 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS - Visible only on mobile/tablet */}
      <div className="lg:hidden space-y-3">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {event.category}
                  </span>
                </div>
                <h3 className="font-medium text-gray-700 mb-1">
                  {event.title}
                </h3>
              </div>

              <button
                onClick={() => handleDelete(event.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition min-h-11 min-w-11 flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={`${imageurl}/${event.pdf_url}`}
                alt="event"
                className="w-16 h-12 object-cover rounded shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={13} className="text-gray-400" />
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-sm sm:max-w-md rounded-xl shadow-2xl p-4 sm:p-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-base sm:text-lg">
                Add Event
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg min-h-11 min-w-11 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full border border-gray-200 px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-11"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Category
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="Category"
                    className="w-full border border-gray-200 px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-11"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.event_date}
                    onChange={(e) =>
                      setForm({ ...form, event_date: e.target.value })
                    }
                    className="w-full border border-gray-200 px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-11"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Description
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Event description..."
                  className="w-full border border-gray-200 px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-20 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Image URL
                </label>
                <input
                  required
                  value={form.pdf_url}
                  onChange={(e) =>
                    setForm({ ...form, pdf_url: e.target.value })
                  }
                  placeholder="Image URL"
                  className="w-full border border-gray-200 px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-11"
                />
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 py-3 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50 min-h-11"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm min-h-11 flex items-center justify-center gap-2"
                >
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
