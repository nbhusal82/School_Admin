import React from "react";
import { AlertCircle, X } from "lucide-react";

const ErrorToast = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-red-500 p-4 flex items-start gap-3 max-w-md">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="text-red-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">Login Failed</h3>
          <p className="text-xs text-gray-600 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
