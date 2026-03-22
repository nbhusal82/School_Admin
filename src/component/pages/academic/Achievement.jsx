import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Award,
  Calendar,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import {
  useCreateachievementMutation,
  useDeleteachievementMutation,
  useGetachievementQuery,
  useUpdateachievementMutation,
} from "../../redux/feature/academic";

const Achievement = () => {
  const { data: response = [], isLoading: isFetching } =
    useGetachievementQuery();
  const achievements = response?.data || response;

  const [createAch, { isLoading: isCreating }] = useCreateachievementMutation();
  const [updateAch, { isLoading: isUpdating }] = useUpdateachievementMutation();
  const [deleteAch] = useDeleteachievementMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const imgurl = import.meta.env.VITE_IMAGE_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    achievement_date: "",
    image: null,
  });

  const openAddModal = () => {
    setEditingAch(null);
    setFormData({
      title: "",
      description: "",
      achievement_date: "",
      image: null,
    });
    setModalOpen(true);
  };

  const handleEdit = (ach) => {
    setEditingAch(ach);
    setFormData({
      title: ach.title,
      description: ach.description || "",
      achievement_date: ach.achievement_date
        ? ach.achievement_date.split("T")[0]
        : "",
      image: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("achievement_date", formData.achievement_date);
    if (formData.image) data.append("images", formData.image);

    try {
      if (editingAch) {
        await updateAch({ id: editingAch.id, data }).unwrap();
      } else {
        await createAch(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isFetching)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading Achievements...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-amber-500" /> School Achievements
          </h1>
          <p className="text-xs text-gray-500 italic">
            Showcase awards and milestones
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm font-medium"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {/* Grid Layout for Cards (Instead of Table for better visual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition group"
          >
            <div className="relative h-40 bg-gray-200">
              <img
                src={`${imgurl}/${ach.image_urls}`}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEdit(ach)}
                  className="p-1.5 bg-white/90 text-blue-600 rounded-lg shadow-sm hover:bg-white"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => window.confirm("Delete?") && deleteAch(ach.id)}
                  className="p-1.5 bg-white/90 text-red-500 rounded-lg shadow-sm hover:bg-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase mb-1">
                <Calendar size={12} />{" "}
                {new Date(ach.achievement_date).toLocaleDateString()}
              </div>
              <h3 className="font-bold text-gray-800 line-clamp-1">
                {ach.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 h-8">
                {ach.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isCreating && !isUpdating && setModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border animate-in zoom-in-95 duration-200">
            <h2 className="font-bold text-gray-800 text-lg mb-4">
              {editingAch ? "Edit Achievement" : "Add New Achievement"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Achievement Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Best School Award 2024"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write a brief detail..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.achievement_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        achievement_date: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Upload Image
                  </label>
                  <label className="flex items-center justify-center border-2 border-dashed h-9.5 rounded-xl cursor-pointer hover:bg-gray-50 transition border-gray-200">
                    <ImageIcon size={16} className="text-gray-400 mr-2" />
                    <span className="text-[10px] text-gray-500 truncate px-1">
                      {formData.image ? formData.image.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-500 border rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Working...
                    </>
                  ) : (
                    "Save Achievement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievement;
