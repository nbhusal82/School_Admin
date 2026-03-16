import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, LayoutGrid, Calendar, X, Save } from "lucide-react";
import { useCreatevacancyMutation, useDeletevacancyMutation, useGetvacancyQuery } from "../../redux/feature/content";
import { useGet_vacancy_categoryQuery } from "../../redux/feature/category";



const VacancyManagement = () => {
  const navigate = useNavigate();

  const { data: vacancy = [], isLoading } = useGetvacancyQuery();
  const { data: categories = [] } = useGet_vacancy_categoryQuery();

  const [createVacancy, { isLoading: isCreating }] = useCreatevacancyMutation();

  const [deleteVacancy] = useDeletevacancyMutation();

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    deadline: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createVacancy(form).unwrap();

      setForm({
        title: "",
        category_id: "",
        deadline: "",
      });

      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vacancy Management</h1>
          <p className="text-gray-500 text-sm">Manage job vacancies</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/vacancy/category")}
            className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl"
          >
            <LayoutGrid size={18} />
            Category
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "Add Vacancy"}
          </button>
        </div>
      </div>

      {/* ADD FORM */}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow border mb-8">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <input
              name="title"
              placeholder="Vacancy Title"
              className="border p-2 rounded"
              value={form.title}
              onChange={handleInput}
            />

            <select
              name="category_id"
              className="border p-2 rounded"
              value={form.category_id}
              onChange={handleInput}
            >
              <option value="">Category</option>

              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="deadline"
              className="border p-2 rounded"
              value={form.deadline}
              onChange={handleInput}
            />

            <button className="bg-blue-600 text-white py-2 rounded col-span-3">
              <Save size={16} className="inline mr-1" />
              {isCreating ? "Saving..." : "Save Vacancy"}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs text-gray-400 uppercase">
                Title
              </th>

              <th className="px-6 py-4 text-xs text-gray-400 uppercase">
                Category
              </th>

              <th className="px-6 py-4 text-xs text-gray-400 uppercase">
                Deadline
              </th>

              <th className="px-6 py-4 text-xs text-gray-400 uppercase text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {vacancy.map((item) => {
              const category = categories.find(
                (c) => String(c.category_id) === String(item.category_id),
              );

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{item.title}</td>

                  <td className="px-6 py-4">
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                      {category?.category_name}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-1">
                    <Calendar size={14} />
                    {item.deadline}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        window.confirm("Delete vacancy?") &&
                        deleteVacancy(item.id)
                      }
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VacancyManagement;
