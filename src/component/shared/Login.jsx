import React, { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/feature/authslice";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/feature/authState";
import logoImg from "../../assets/image/logo.jpg";
import ErrorToast from "./ErrorToast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (errorOpen) {
      const timer = setTimeout(() => setErrorOpen(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setUser({ user: res.user, token: res.token }));
      navigate("/admin/dashboard");
    } catch (err) {
      setErrorMsg("Invalid email or password. Please try again.");
      setErrorOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 font-sans">
      {/* Small Compact Card */}
      <div className="bg-white w-full max-w-90 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* --- LOGO SECTION (Smaller) --- */}
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <img
              src={logoImg}
              alt="Logo"
              className="w-full h-full object-cover rounded-full border-2 border-blue-50 shadow-sm"
            />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight uppercase">
            Namuna Vidhya <span className="text-blue-600">Sadan</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Admin Login
          </p>
        </div>

        {/* --- COMPACT FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative group">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Submit Button (Sleek) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-tighter">
          © 2026 Namuna Bidhya School
        </p>
      </div>

      <ErrorToast
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
        message={errorMsg}
      />
    </div>
  );
};

export default AdminLogin;
