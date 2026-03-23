import React, { useState } from "react";
import { FolderOpen } from "lucide-react";
import PageHeader from "../../shared/PageHeader";
import Table from "../../shared/Table";
import Modal from "../../shared/Modal";
import Button, { AddButton, ActionButtons } from "../../shared/Button";
import TableSkeleton from "../../shared/Skeleton_table";

import {
  useCreatevacancyMutation,
  useDeletevacancyMutation,
  useGetvacancyQuery,
  useUpdatevacancyMutation,
} from "../../redux/feature/content";

import { 
  useGet_vacancy_categoryQuery,
  useCreatecategory_vacancyMutation,
  useUpdatecategory_vacancyMutation,
  useDeletecategory_vacancyMutation,
} from "../../redux/feature/category";

const VacancyManagement = () => {
  const { data: vacancyRes, isLoading, refetch } = useGetvacancyQuery();
  const { data: catRes } = useGet_vacancy_categoryQuery();

  const vacancyItems = vacancyRes?.data || [];
  const categories = catRes?.data || catRes || [];

  const [createVacancy, { isLoading: isCreating }] = useCreatevacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdatevacancyMutation();
  const [deleteVacancy] = useDeletevacancyMutation();

  const [createCategory, { isLoading: isCreatingCat }] = useCreatecategory_vacancyMutation();
  const [updateCategory, { isLoading: isUpdatingCat }] = useUpdatecategory_vacancyMutation();
  const [deleteCategory] = useDeletecategory_vacancyMutation();

  // Vacancy Modal States
  const [vacancyModal, setVacancyModal] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [vacancyForm, setVacancyForm] = useState({
    title: "",
    category_id: "",
    description: "",
    deadline: "",
    status: "open",
  });

  // Category Modal States
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Vacancy Handlers
  const openVacancyModal = (item = null) => {
    setEditingVacancy(item);
    setVacancyForm(
      item
        ? {
            title: item.title,
            category_id: item.category_id,
            description: item.description,
            deadline: item.application_deadline,
            status: item.status || "open",
          }
        : {
            title: "",
            category_id: "",
            description: "",
            deadline: "",
            status: "open",
          }
    );
    setVacancyModal(true);
  };

  const handleVacancySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: vacancyForm.title,
      category_id: vacancyForm.category_id,
      description: vacancyForm.description,
      application_deadline: vacancyForm.deadline,
      status: vacancyForm.status,
      posted_date: new Date().toISOString().split("T")[0],
    };

    try {
      if (editingVacancy) {
        await updateVacancy({ id: editingVacancy.id, data: payload }).unwrap();
      } else {
        await createVacancy(payload).unwrap();
      }
      refetch();
      setVacancyModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateVacancy({
        id: item.id,
        data: {
          title: item.title,
          category_id: item.category_id,
          description: item.description,
          application_deadline: item.application_deadline,
          status: newStatus,
        },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (window.confirm("Are you sure to delete this vacancy?")) {
      try {
        await deleteVacancy(id).unwrap();
        refetch();
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
        await updateCategory({ id: editingCategory.category_id, data: { name: categoryName } }).unwrap();
      } else {
        await createCategory({ name: categoryName }).unwrap();
      }
      setCategoryModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "Title", accessor: "title", cellClassName: "font-medium" },
    {
      header: "Category",
      render: (row) =>
        categories.find((c) => String(c.category_id) === String(row.category_id))
          ?.category_name || "N/A",
    },
    { header: "Deadline", accessor: "application_deadline", cellClassName: "text-center" },
    { header: "Posted", accessor: "posted_date", cellClassName: "text-center" },
    {
      header: "Status",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className={`border rounded px-2 py-1 text-sm font-semibold ${
            row.status === "open"
              ? "text-green-600"
              : row.status === "closed"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="pending">Pending</option>
        </select>
      ),
      cellClassName: "text-center",
    },
  ];

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Vacancy Management" subtitle="Manage job vacancies" />
      <TableSkeleton rows={5} columns={6} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Vacancy Management" subtitle="Manage job vacancies">
        <button
          onClick={() => openCategoryModal()}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Manage Categories
        </button>
        <AddButton onClick={() => openVacancyModal()} label="Add Vacancy" />
      </PageHeader>

      <Table
        columns={columns}
        data={vacancyItems}
        actions={(row) => (
          <ActionButtons
            onEdit={() => openVacancyModal(row)}
            onDelete={() => handleDeleteVacancy(row.id)}
          />
        )}
      />

      {/* VACANCY MODAL */}
      <Modal
        isOpen={vacancyModal}
        onClose={() => setVacancyModal(false)}
        title={editingVacancy ? "Update Vacancy" : "Add Vacancy"}
        size="md"
      >
        <form onSubmit={handleVacancySubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold block mb-1 text-gray-400 uppercase">Title</label>
            <input
              value={vacancyForm.title}
              onChange={(e) => setVacancyForm({ ...vacancyForm, title: e.target.value })}
              placeholder="Vacancy title"
              className="w-full border p-2 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-gray-400 uppercase">Description</label>
            <textarea
              value={vacancyForm.description}
              onChange={(e) => setVacancyForm({ ...vacancyForm, description: e.target.value })}
              placeholder="Job description"
              className="w-full border p-2 rounded-lg text-sm h-20 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1 text-gray-400 uppercase">Category</label>
              <select
                value={vacancyForm.category_id}
                onChange={(e) => setVacancyForm({ ...vacancyForm, category_id: e.target.value })}
                className="w-full border p-2 rounded-lg text-sm"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1 text-gray-400 uppercase">Status</label>
              <select
                value={vacancyForm.status}
                onChange={(e) => setVacancyForm({ ...vacancyForm, status: e.target.value })}
                className="w-full border p-2 rounded-lg text-sm"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-gray-400 uppercase">Application Deadline</label>
            <input
              type="date"
              value={vacancyForm.deadline}
              onChange={(e) => setVacancyForm({ ...vacancyForm, deadline: e.target.value })}
              className="w-full border p-2 rounded-lg text-sm"
              required
            />
          </div>

          <div className="flex gap-2 pt-3">
            <Button variant="outline" className="flex-1" onClick={() => setVacancyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editingVacancy ? "Update Vacancy" : "Save Vacancy"}
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
              placeholder="e.g. IT Department"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setCategoryModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreatingCat || isUpdatingCat}>
              {editingCategory ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VacancyManagement;
