import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FolderOpen, Filter } from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Button, { AddButton } from "../../shared/Button";
import {
  useCreategalleryMutation,
  useDeletegalleryMutation,
  useGetgalleryQuery,
  useUpdategalleryMutation,
} from "../../redux/feature/content";
import {
  useGetcategory_galleryQuery,
  useCreatecategory_galleryMutation,
  useUpdatecategory_galleryMutation,
  useDeletecategory_galleryMutation,
} from "../../redux/feature/category";

const Gallery = () => {
  const { data: gallery = [], isLoading } = useGetgalleryQuery();
  const { data: catRes } = useGetcategory_galleryQuery();
  const categories = catRes?.data || [];

  const [createGallery, { isLoading: isCreating }] = useCreategalleryMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdategalleryMutation();
  const [deleteGallery] = useDeletegalleryMutation();

  const [createCategory, { isLoading: isCreatingCat }] =
    useCreatecategory_galleryMutation();
  const [updateCategory, { isLoading: isUpdatingCat }] =
    useUpdatecategory_galleryMutation();
  const [deleteCategory] = useDeletecategory_galleryMutation();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Gallery Modal States
  const [galleryModal, setGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    category_id: "",
    caption: "",
    images: [],
  });

  // Category Modal States
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const imageurl = import.meta.env.VITE_IMAGE_URL;

  const filteredGallery =
    selectedCategory === "All"
      ? gallery?.data || []
      : (gallery?.data || []).filter(
          (n) => String(n.category_id) === String(selectedCategory),
        );

  // Gallery Handlers
  const openGalleryModal = (item = null) => {
    setEditingGallery(item);
    setGalleryForm(
      item
        ? { category_id: item.category_id, caption: item.caption, images: [] }
        : { category_id: "", caption: "", images: [] },
    );
    setGalleryModal(true);
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category_id", galleryForm.category_id);
    formData.append("caption", galleryForm.caption);
    for (let i = 0; i < galleryForm.images.length; i++) {
      formData.append("images", galleryForm.images[i]);
    }

    try {
      if (editingGallery) {
        await updateGallery({ id: editingGallery.id, data: formData }).unwrap();
      } else {
        await createGallery(formData).unwrap();
      }
      setGalleryModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm("Are you sure to delete this Gallery?")) {
      try {
        await deleteGallery(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Category Handlers
  const openCategoryModal = (item = null) => {
    setEditingCategory(item);
    setCategoryName(item ? item.category_name : "");
    setCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: { name: categoryName },
        }).unwrap();
      } else {
        await createCategory({ name: categoryName }).unwrap();
      }
      setCategoryModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <PageHeader title="Gallery" subtitle="Loading gallery items..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Gallery"
        subtitle={`Showing ${filteredGallery.length} items`}
      >
        <button
          onClick={() => openCategoryModal()}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Manage Categories
        </button>
        <AddButton onClick={() => openGalleryModal()} label="Add New" />
      </PageHeader>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-8 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === "All"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Items
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              String(selectedCategory) === String(cat.id)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
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
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
              >
                <div className="h-48 relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="h-full [&_.swiper-button-next]:w-5 [&_.swiper-button-prev]:w-5 [&_.swiper-button-next]:h-5 [&_.swiper-button-prev]:h-5 [&_.swiper-button-next]:after:text-[8px] [&_.swiper-button-prev]:after:text-[8px]"
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
                  <div className="flex gap-2 mt-4 border-t pt-3">
                    <Button
                      onClick={() => openGalleryModal(item)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteGallery(item.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </Button>
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

      {/* GALLERY MODAL */}
      <Modal
        isOpen={galleryModal}
        onClose={() => setGalleryModal(false)}
        title={editingGallery ? "Update Gallery" : "Add Gallery"}
        size="md"
      >
        <form onSubmit={handleGallerySubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Category
            </label>
            <select
              required
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={galleryForm.category_id}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, category_id: e.target.value })
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
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Caption
            </label>
            <textarea
              placeholder="Description..."
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
              value={galleryForm.caption}
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, caption: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Images
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setGalleryForm({ ...galleryForm, images: e.target.files })
              }
              className="w-full text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setGalleryModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {editingGallery ? "Update" : "Upload"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="sm"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Category Name
            </label>
            <input
              autoFocus
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Campus Events"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreatingCat || isUpdatingCat}
            >
              {editingCategory ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Gallery;
