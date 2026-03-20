import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, User, Briefcase, Mail, Phone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "../../redux/feature/siteslice";

const Team = () => {
  const navigate = useNavigate();
  const { data: teamMembers = [], isLoading } = useGetTeamQuery();

  const [createMember] = useCreateTeamMutation();
  const [updateMember] = useUpdateTeamMutation();
  const [deleteMember] = useDeleteTeamMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

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

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      position: "",
      number: "",
      email: "",
      category_id: "",
      is_main: 0,
      image: null,
    });
    setModalOpen(true);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this member?")) {
      await deleteMember(id).unwrap();
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Team Management</h1>
          <p className="text-xs text-gray-500 italic">
            Manage your organization's hierarchy and members
          </p>
        </div>

        <div className="flex gap-2">
          {/* Category Management Button */}
          <button
            onClick={() => navigate("/admin/team/category")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white transition bg-gray-50 text-gray-700"
          >
            <Users size={16} /> Team Categories
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-600 font-medium">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Member Details</th>
              <th className="p-3">Position & Role</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Type</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition">
                <td className="p-3 text-gray-400">#{member.id}</td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={`${imgurl}/${member.image}`}
                    className="w-10 h-10 rounded-full object-cover border"
                    alt={member.name}
                  />
                  <div>
                    <div className="font-semibold text-gray-700">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                      Joined: {formatDate(member.created_at)}
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium text-blue-600 leading-tight">
                    {member.position}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {member.role}
                  </div>
                </td>

                <td className="p-3">
                  <div className="text-gray-700 flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />{" "}
                    {member.number}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Mail size={12} /> {member.email}
                  </div>
                </td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${member.is_main ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {member.is_main ? "⭐ Main" : "Normal"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPACT MODAL - Matches Blog Style */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-lg">
                {editingMember ? "Edit Team Member" : "New Member Registration"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  className="w-full border border-gray-200 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              {/* Position & Role Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Position
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g. Principal"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full border border-gray-200 px-2 py-1.5 rounded-lg text-sm outline-none bg-white"
                  >
                    <option value="">Select Role</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    placeholder="98XXXXXXXX"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="mail@example.com"
                    className="w-full border border-gray-200 px-3 py-1.5 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>

              {/* Member Type */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Member Status
                </label>
                <select
                  value={formData.is_main}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_main: parseInt(e.target.value),
                    })
                  }
                  className="w-full border border-gray-200 px-2 py-1.5 rounded-lg text-sm outline-none bg-white"
                >
                  <option value={0}>Normal Member</option>
                  <option value={1}>Main Member (Featured)</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
                  Member Photo
                </label>
                <div className="flex items-center gap-3 border-2 border-dashed p-2 rounded-lg border-gray-200">
                  <input
                    type="file"
                    className="text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />
                  {formData.image && (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      className="w-8 h-8 rounded object-cover border"
                      alt="preview"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-1.5 text-sm font-medium text-gray-500 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  {editingMember ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;