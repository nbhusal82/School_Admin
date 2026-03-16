import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  useCreatecategory_galleryMutation,
  useDeletecategory_galleryMutation,
  useGetcategory_galleryQuery,
} from "../../redux/feature/category";

const GalleryCategory = () => {
  const { data: categories = [] } = useGetcategory_galleryQuery();

  const [createCategory] = useCreatecategory_galleryMutation();
  const [deleteCategory] = useDeletecategory_galleryMutation();

  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name) return;

    await createCategory({ name }).unwrap();

    setName("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) {
      await deleteCategory(id).unwrap();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gallery Categories</h1>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Category Name"
          className="border px-4 py-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <p>{cat.name}</p>

            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryCategory;
