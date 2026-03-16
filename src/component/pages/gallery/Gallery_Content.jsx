import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Plus, Pencil, Trash2, X, Images, FolderOpen } from "lucide-react";

import {
  useCreategalleryMutation,
  useDeletegalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
} from "../../redux/feature/content";

const Gallery = () => {
  const navigate = useNavigate();

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
        : { category_id: "", caption: "", images: [] },
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
        await updateGallery({
          id: editing.id,
          data: formData,
        }).unwrap();
      } else {
        await createGallery(formData).unwrap();
      }

      setModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this gallery item?")) {
      await deleteGallery(id).unwrap();
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-gray-500">{gallery.length} items</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/gallery/category")}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            <FolderOpen size={18} />
            Category View
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Gallery
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">
        {gallery.map((item) => {
          const images = item.image_url ? item.image_url.split(",") : [];

          return (
            <div key={item.id} className="bg-white rounded-xl shadow">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
              >
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={`${imageurl}/${img}`}
                      className="h-60 w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="p-4">
                <p className="text-sm text-gray-500">
                  Category {item.category_id}
                </p>

                <p className="mt-2">{item.caption}</p>

                <div className="flex gap-3 mt-3">
                  <button onClick={() => openModal(item)}>
                    <Pencil size={18} />
                  </button>

                  <button onClick={() => handleDelete(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-96 space-y-4"
          >
            <input
              placeholder="Category ID"
              className="border p-2 w-full"
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
            />

            <textarea
              placeholder="Caption"
              className="border p-2 w-full"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
            />

            <input type="file" multiple onChange={handleFiles} />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editing ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Gallery;
