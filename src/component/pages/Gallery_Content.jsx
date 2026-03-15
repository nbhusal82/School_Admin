import React, { useState } from "react";
// Swiper Components र Styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Images,
  FolderOpen,
  Calendar,
} from "lucide-react";
import {
  useCreategalleryMutation,
  useDeletegalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
} from "../redux/feature/content";

const Gallery = () => {
  const { data: gallery = [], isLoading } = useGetgalleryQuery();
  const [createGallery] = useCreategalleryMutation();
  const [updateGallery] = useUpdategalleryMutation();
  const [deleteGallery] = useDeletegalleryMutation();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    caption: "",
    images: [],
  });

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  const openModal = (item = null) => {
    setEditing(item);
    setPreviews([]);
    setForm(
      item
        ? { category_id: item.category_id, caption: item.caption, images: [] }
        : { category_id: "", caption: "", images: [] }
    );
    setModal(true);
  };

  const handleFiles = (e) => {
    const files = e.target.files;
    setForm({ ...form, images: files });
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("caption", form.caption);
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }

    try {
      if (editing) {
        await updateGallery({ id: editing.id, data: formData }).unwrap();
      } else {
        await createGallery(formData).unwrap();
      }
      setModal(false);
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      await deleteGallery(id).unwrap();
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-500 mt-1">
            {gallery.length} items in collection
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus size={18} /> Add Gallery
        </button>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Images size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg">No gallery items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {gallery.map((item) => {
            const images = item.image_url ? item.image_url.split(",") : [];
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Image Slider Section */}
                <div className="relative h-64 bg-gray-100">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={`${imageurl}/${img.trim()}`}
                          className="w-full h-full object-cover"
                          alt={`Gallery ${i}`}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="bg-white/90 text-blue-600 p-2 rounded-full hover:bg-white shadow-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white/90 text-red-500 p-2 rounded-full hover:bg-white shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
                      Category {item.category_id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h2 className="text-base font-bold text-gray-800">
                {editing ? "Edit Gallery" : "Add Gallery"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category ID
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Caption
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  value={form.caption}
                  onChange={(e) =>
                    setForm({ ...form, caption: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Images
                </label>
                <label className="flex items-center gap-3 w-full px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Images size={18} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500">
                    {previews.length > 0
                      ? `${previews.length} file(s) selected`
                      : "Click to upload images"}
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                </label>
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className="w-12 h-12 object-cover rounded-lg border"
                        alt="preview"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium shadow-md"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;