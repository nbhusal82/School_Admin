import React, { useState } from "react";
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from "../../redux/feature/siteslice";

const Team = () => {
  const { data: teamMembers = [], isLoading } = useGetTeamQuery();
  const [createMember] = useCreateTeamMutation();
  const [updateMember] = useUpdateTeamMutation();
  const [deleteMember] = useDeleteTeamMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

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
  const imgurl = import.meta.env.VITE_IMAGE_URL;
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

    if (editingMember) {
      await updateMember({ id: editingMember.id, data });
    } else {
      await createMember(data);
    }
    setModalOpen(false);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-blue-600">
        Loading Team Dashboard...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Team Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage faculty and staff members
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
        >
          + Add Team Member
        </button>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-bold text-gray-400 uppercase text-xs">
                ID
              </th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs">
                Member
              </th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs">
                Position & Role
              </th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs">
                Contact
              </th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs">
                Category
              </th>
              <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teamMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-blue-50/20 transition-all"
              >
                <td className="p-4 text-gray-400 font-mono text-xs">
                  #{member.id}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${imgurl}/${member.image}`}
                      className="w-12 h-12 rounded-full object-cover border shadow-sm"
                      alt=""
                    />
                    <div>
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        {member.name}
                        {member.is_main === 1 && (
                          <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Main
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(member.created_at)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-blue-600">
                    {member.position}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {member.role}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-700 font-medium">
                    {member.number}
                  </div>
                  <div className="text-xs text-gray-400">
                    {member.email || "No Email"}
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {member.category_name}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg font-bold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg font-bold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modern Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-8 pb-4 border-b">
              <h2 className="text-2xl font-black text-gray-800">
                {editingMember ? "Edit Member" : "Add New Member"}
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-8 grid grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              />
              <input
                type="text"
                placeholder="Position "
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
                <option value="admin">Administration</option>
              </select>

              <select
                value={formData.is_main}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_main: parseInt(e.target.value),
                  })
                }
                className="bg-gray-50 border-none p-4 rounded-2xl outline-none"
              >
                <option value={0}>Normal Member</option>
                <option value={1}>Main Member (Priority)</option>
              </select>

              <div className="col-span-2">
                <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer hover:border-blue-400">
                  <span className="text-sm font-bold text-blue-600">
                    {formData.image
                      ? `✓ ${formData.image.name}`
                      : "Upload Member Photo"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <div className="col-span-2 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
                >
                  Save Member
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
