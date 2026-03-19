import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FolderOpen,
  Upload,
  Filter,
} from "lucide-react";

import {
  useCreategalleryMutation,
  useDeletegalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
} from "../../redux/feature/content";
import { useGetcategory_galleryQuery } from "../../redux/feature/category";

const Gallery = () => {
  const navigate = useNavigate();
  const { data: gallery = [], isLoading } = useGetgalleryQuery();
  const { data: catRes } = useGetcategory_galleryQuery();
  const categories = catRes?.data || [];

  const [createGallery] = useCreategalleryMutation();
  const [updateGallery] = useUpdategalleryMutation();
  const [deleteGallery] = useDeletegalleryMutation();

  // Filter State: Default "All" hunchha
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    caption: "",
    images: [],
  });

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  // Logic: Filter gareko gallery matra nikalne
  const filteredGallery =
    selectedCategory === "All"
      ? gallery?.data || []
      : (gallery?.data || []).filter(
          (n) => String(n.category_id) === String(selectedCategory),
        );

  const openModal = (item = null) => {
    setEditing(item);
    setPreviews([]);
    setForm(
      item
        ? { category_id: item.category_id, caption: item.caption, images: [] }
        : { category_id: "", caption: "", images: [] },
    );
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
    setPreviews([]);
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
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-8 text-center font-bold">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery</h1>
          <p className="text-gray-500 font-medium">
            Showing {filteredGallery.length} items
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/admin/gallery/category")}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            <FolderOpen size={16} /> Categories
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-md"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-8 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 px-3 text-gray-400 border-r mr-2">
          <Filter size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Filter:
          </span>
        </div>

        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === "All" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${String(selectedCategory) === String(cat.id) ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* GALLERY GRID */}
      {filteredGallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => {
            const images = item.image_url ? item.image_url.split(",") : [];
            const catName =
              categories.find((c) => String(c.id) === String(item.category_id))
                ?.category_name || "Unknown";

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="h-48">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="h-full [&_.swiper-button-next]:w-5!
[&_.swiper-button-prev]:w-5!
[&_.swiper-button-next]:h-5!
[&_.swiper-button-prev]:h-5!

[&_.swiper-button-next]:after:text-[8px]!
[&_.swiper-button-prev]:after:text-[8px]!"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={`${imageurl}/${img}`}
                          className="h-full w-full object-cover"
                          alt="Gallery Item"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                    {catName}
                  </span>
                  <p className="mt-2 text-sm text-gray-700 font-medium line-clamp-2">
                    {item.caption}
                  </p>
                  <div className="flex gap-4 mt-4 border-t pt-3">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-20 text-center rounded-2xl border-2 border-dashed">
          <p className="text-gray-400 font-medium">
            No images found in this category.
          </p>
        </div>
      )}

      {/* MODAL (Compact) */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800">
                {editing ? "Update Gallery" : "Add Gallery"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Category
              </label>
              <select
                required
                className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Caption
              </label>
              <textarea
                placeholder="Description..."
                className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none bg-gray-50"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="w-full mt-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Gallery;
