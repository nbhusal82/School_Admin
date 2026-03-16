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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}

      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
          <p className="text-sm text-gray-500">Manage school team members</p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Member
        </button>
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Member</th>
              <th className="p-3">Position</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-3">#{member.id}</td>

                <td className="p-3 flex items-center gap-3">
                  <img
                    src={`${imgurl}/${member.image}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <div className="font-semibold">{member.name}</div>

                    <div className="text-xs text-gray-400">
                      {formatDate(member.created_at)}
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-medium text-blue-600">
                    {member.position}
                  </div>

                  <div className="text-xs text-gray-400">{member.role}</div>
                </td>

                <td className="p-3">
                  <div>{member.number}</div>
                  <div className="text-xs text-gray-400">{member.email}</div>
                </td>

                <td className="p-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {member.category_name}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl">
            <h2 className="text-lg font-bold mb-4">
              {editingMember ? "Edit Member" : "Add Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Position"
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Phone"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={formData.is_main}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_main: parseInt(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value={0}>Normal Member</option>
                <option value={1}>Main Member</option>
              </select>
              {/* File Upload with Preview */}
              <div className="col-span-2">
                <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors gap-3">
                  <span className="text-sm text-gray-500">
                    {formData.image
                      ? formData.image.name
                      : "Choose Member Photo"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, image: e.target.files[0] });
                      }
                    }}
                  />
                </label>

                {/* Preview */}
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  Save
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
