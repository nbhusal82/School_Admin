import React from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
