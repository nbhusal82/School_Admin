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
  Filter,
  Loader2,
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

  const [createGallery, { isLoading: isCreating }] = useCreategalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdategalleryMutation();
  const [deleteGallery] = useDeletegalleryMutation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previews, setPreviews] = useState([]);

  // ✅ Dialog states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    caption: "",
    images: [],
  });

  const imageurl = import.meta.env.VITE_IMAGE_URL;

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
    setForm({ category_id: "", caption: "", images: [] });
  };

  const handleFiles = (e) => {
    const files = e.target.files;
    setForm({ ...form, images: files });
    setPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  };

  // ✅ OPEN CONFIRM DIALOG
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await deleteGallery(selectedId).unwrap();
      setConfirmOpen(false);
      setAlertMsg("Gallery deleted successfully!");
      setAlertOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD / UPDATE
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
        setAlertMsg("Gallery updated successfully!");
      } else {
        await createGallery(formData).unwrap();
        setAlertMsg("Gallery added successfully!");
      }

      setAlertOpen(true);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Gallery</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredGallery.map((item) => {
          const images = item.image_url?.split(",") || [];

          return (
            <div key={item.id} className="bg-white p-3 rounded-xl shadow">
              <Swiper modules={[Navigation, Pagination]} navigation pagination>
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={`${imageurl}/${img}`}
                      className="h-40 w-full object-cover rounded"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <p className="text-sm mt-2">{item.caption}</p>

              <div className="flex justify-between mt-3">
                <button onClick={() => openModal(item)}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-5 rounded-xl w-80 space-y-3"
          >
            <input
              placeholder="Caption"
              className="w-full border p-2"
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
            />

            <input type="file" multiple onChange={handleFiles} />

            <div className="flex gap-2">
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit">
                {isCreating || isUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : editing ? (
                  "Update"
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ CONFIRM DELETE */}
      {confirmOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-5 rounded-xl w-80">
            <h2 className="font-bold">Confirm Delete</h2>
            <p className="text-sm text-gray-500 my-2">
              Are you sure you want to delete?
            </p>

            <div className="flex gap-2">
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SUCCESS ALERT */}
      {alertOpen && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl shadow">
            <p>{alertMsg}</p>
            <button
              onClick={() => setAlertOpen(false)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
