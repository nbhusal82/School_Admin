import React from "react";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({ isOpen, onClose, title, children, size = "sm" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className={`bg-white p-8 rounded-2xl w-full ${sizeClasses[size]} shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={X}
            className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
