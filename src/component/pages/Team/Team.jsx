import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, User, Briefcase, Mail, Phone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableSkeleton from "../../shared/Skeleton_table";
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

  if (isLoading) return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Team Management</h1>
          <p className="text-xs text-gray-500 italic">Manage your organization's hierarchy and members</p>
        </div>
      </div>
      <div className="hidden lg:block">
        <TableSkeleton rows={5} columns={6} />
      </div>
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Team Management</h1>
          <p className="text-xs text-gray-500 italic">
            Manage your organization's hierarchy and members
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate("/admin/team/category")}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition bg-gray-50 text-gray-700"
          >
            <Users size={16} /> <span className="hidden sm:inline">Team Categories</span><span className="sm:hidden">Categories</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden border">
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

      {/* Mobile Cards - Visible only on mobile */}
      <div className="lg:hidden space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start gap-3 mb-3">
              <img
                src={`${imgurl}/${member.image}`}
                className="w-12 h-12 rounded-full object-cover border shrink-0"
                alt={member.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 truncate">{member.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${member.is_main ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {member.is_main ? "⭐" : "Normal"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{member.number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400 shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">ID: #{member.id} • Joined: {formatDate(member.created_at)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESPONSIVE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-sm sm:max-w-md rounded-xl shadow-2xl p-4 sm:p-5 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 text-base sm:text-lg pr-2">
                {editingMember ? "Edit Member" : "New Member"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
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
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Position
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="Position"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Role"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    placeholder="Phone number"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Email address"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Category ID
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    placeholder="Category ID"
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Type
                  </label>
                  <select
                    value={formData.is_main}
                    onChange={(e) =>
                      setFormData({ ...formData, is_main: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value={0}>Normal</option>
                    <option value={1}>Main Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  {editingMember ? "Update" : "Create"}
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