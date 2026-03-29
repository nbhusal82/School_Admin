import React from "react";
import { LogOut } from "lucide-react";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          {/* Icon change */}
          <div className="shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <LogOut className="text-blue-600" size={24} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title || "Sign Out"}
            </h3>
            <p className="text-gray-600 text-sm">
              {message || "Are you sure you want to sign out?"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          {/* Blue button */}
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
