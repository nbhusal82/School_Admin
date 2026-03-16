import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderPlus, Trash2 } from "lucide-react";

import {
  useCreatecategory_noticeMutation,
  useDeletecategory_noticeMutation,
  useGetcategory_noticeQuery,
} from "../../redux/feature/category";

const Notice_Category = () => {
  const navigate = useNavigate();

  const { data: categories = [], isLoading } = useGetcategory_noticeQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreatecategory_noticeMutation();

  const [deleteCategory] = useDeletecategory_noticeMutation();

  const [name, setName] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createCategory({
        category_name: name,
      }).unwrap();

      setName("");
      alert("Category Added Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold">Loading Categories...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/admin/notice")}
          className="flex items-center gap-2 text-gray-600 mb-6 font-semibold hover:text-blue-600"
        >
          <ArrowLeft size={20} />
          Back to Notices
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* ADD CATEGORY */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FolderPlus size={20} />
              <h2 className="font-bold text-lg">Add Category</h2>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <input
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <button
                disabled={isCreating}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                {isCreating ? "Saving..." : "Save Category"}
              </button>
            </form>
          </div>

          {/* CATEGORY LIST */}
          <div className="md:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">
              Existing Categories
            </div>

            <div className="divide-y">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div
                    key={cat.category_id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-700">
                      {cat.category_name}
                    </span>

                    <button
                      onClick={() =>
                        window.confirm("Delete category?") &&
                        deleteCategory(cat.category_id)
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-400">
                  No categories found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice_Category;
