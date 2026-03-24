import React, { useState } from "react";
// ✅ Fix: Import should be PascalCase 'FolderOpen'
import { Users, Pencil, Trash2, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
import PageHeader from "../../shared/PageHeader";
import Modal from "../../shared/Modal";
import Table from "../../shared/Table";
import Button, {
  AddButton,
  ActionButtons,
  ConfirmDialog,
} from "../../shared/Button";

import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "../../redux/feature/siteslice";
import { useGet_team_categoryQuery } from "../../redux/feature/category";

const Team = () => {
  const navigate = useNavigate();

  // 1. Data Fetching
  const { data: teamMembers = [], isLoading } = useGetTeamQuery();
  const { data: catRes } = useGet_team_categoryQuery();
  const categories = catRes?.data || catRes || [];

  const [createMember, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const imgurl = import.meta.env.VITE_IMAGE_URL;

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    position: "",
    number: "",
    email: "",
    category_id: "",
    is_main: 0,
    image: null,
  });

  // 2. Filter Logic
  const filteredMembers =
    selectedCategory === "All"
      ? teamMembers
      : teamMembers.filter(
          (m) => String(m.category_id) === String(selectedCategory),
        );

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      position: member.position,
      number: member.number || "",
      email: member.email || "",
      category_id: member.category_id,
      is_main: member.is_main,
      image: null,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMember(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image") {
        if (formData.image) data.append("image", formData.image);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editingMember) {
        await updateMember({ id: editingMember.id, data }).unwrap();
      } else {
        await createMember(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Table Columns Setup
  const columns = [
    {
      header: "ID",
      render: (row) => (
        <span className="text-gray-400 font-mono text-xs">#{row.id}</span>
      ),
    },
    {
      header: "Member",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={`${imgurl}/${row.image}`}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
            alt={row.name}
          />
          <span className="font-bold text-gray-700">{row.name}</span>
        </div>
      ),
    },
    { header: "Position", accessor: "position" },
    {
      header: "Category",
      render: (row) => {
        const cat = categories.find(
          (c) => String(c.category_id || c.id) === String(row.category_id),
        );
        return (
          <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
            {cat?.category_name || cat?.name || "Uncategorized"}
          </span>
        );
      },
    },
    {
      header: "Contact",
      render: (row) => (
        <div className="text-xs">
          <p className="font-bold text-gray-600">{row.number || "No Phone"}</p>
          <p className="text-gray-400 lowercase">{row.email || "No Email"}</p>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="p-6">
        <TableSkeleton rows={8} columns={6} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Team Members"
        subtitle={`Managing ${teamMembers.length} staff members`}
      >
        <button
          onClick={() => navigate('/admin/team/category')}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Manage Categories
        </button>
        <AddButton
          onClick={() => {
            setEditingMember(null);
            setModalOpen(true);
          }}
          label="Add Member"
        />
      </PageHeader>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
            selectedCategory === "All"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
          }`}
        >
          All Members
        </button>

        {categories.map((cat) => {
          const catId = cat.category_id || cat.id;
          const catName = cat.category_name || cat.name;

          return (
            <button
              key={catId}
              onClick={() => setSelectedCategory(catId)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                String(selectedCategory) === String(catId)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {catName}{" "}
              <span className="ml-1.5 opacity-60 text-[10px] font-medium italic"></span>
            </button>
          );
        })}
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          data={filteredMembers}
          actions={(row) => (
            <ActionButtons
              onEdit={() => handleEdit(row)}
              onDelete={() => handleDeleteClick(row.id)}
            />
          )}
        />
      </div>

      {/* ADD/EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMember ? "Update Staff Info" : "Register New Staff"}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Full Name
            </label>
            <input
              required
              className="w-full border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Position
            </label>
            <input
              required
              className="w-full border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Category
            </label>
            <select
              required
              className="w-full border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
            >
              <option value="">Choose Category</option>
              {categories.map((c) => (
                <option
                  key={c.category_id || c.id}
                  value={c.category_id || c.id}
                >
                  {c.category_name || c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">
              Profile Photo
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full text-xs file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-bold hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          <div className="col-span-2 flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-2"
              isLoading={isCreating || isUpdating}
            >
              Save Member
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Team;
