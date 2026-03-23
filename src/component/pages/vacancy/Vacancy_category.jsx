import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import Table from "../../shared/Table";
import AddButton from "../../shared/AddButton";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import { DeleteButton } from "../../shared/ActionButtons";
import {
  useCreatecategory_vacancyMutation,
  useDeletecategory_vacancyMutation,
  useGet_vacancy_categoryQuery,
} from "../../redux/feature/category";

const Vacancy_Category = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useGet_vacancy_categoryQuery();
  const [createCategory, { isLoading: isCreating }] = useCreatecategory_vacancyMutation();
  const [deleteCategory] = useDeletecategory_vacancyMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ category_name: name }).unwrap();
      setModalOpen(false);
      setName("");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete category?")) await deleteCategory(id);
  };

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Vacancy Categories" subtitle="Manage vacancy categories">
        <button onClick={() => navigate("/admin/vacancy")} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      </PageHeader>
      <div className="max-w-2xl">
        <TableSkeleton rows={5} columns={3} />
      </div>
    </div>
  );

  const columns = [
    {
      header: "S.N",
      accessor: "category_id",
      className: "w-16",
      render: (row, index) => <span className="text-gray-400">{index + 1}</span>,
    },
    {
      header: "Category Name",
      accessor: "category_name",
      render: (row) => <span className="font-medium text-gray-700">{row.category_name}</span>,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Vacancy Categories" subtitle="Manage vacancy categories">
        <button onClick={() => navigate("/admin/vacancy")} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition bg-white shadow-sm mr-2">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <AddButton onClick={() => { setName(""); setModalOpen(true); }} label="Add Category" />
      </PageHeader>

      <div className="max-w-2xl">
        <Table
          columns={columns}
          data={categories}
          actions={(row) => (
            <DeleteButton onClick={() => handleDelete(row.category_id)} />
          )}
          emptyMessage="No categories found"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Category"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            autoFocus required value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-1.5 text-sm text-gray-500 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isCreating} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              {isCreating ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vacancy_Category;
