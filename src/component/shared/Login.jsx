import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/feature/authslice";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/feature/authState";

const AdminLogin = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-800">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">
            Namuna Bidhya School
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label>Email</label>
            <div className="flex border rounded-lg px-3 py-2 mt-1">
              <Mail size={18} className="mr-2 text-gray-400" />
              <input
                type="email"
                className="w-full outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <div className="flex border rounded-lg px-3 py-2 mt-1">
              <Lock size={18} className="mr-2 text-gray-400" />
              <input
                type="password"
                className="w-full outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
