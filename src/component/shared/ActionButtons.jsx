import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "./Button";

export const EditButton = ({ onClick, className = "" }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      icon={Pencil}
      className={`text-blue-600 hover:bg-blue-50 p-2 ${className}`}
      title="Edit"
    />
  );
};

export const DeleteButton = ({ onClick, className = "" }) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      icon={Trash2}
      className={`text-red-600 hover:bg-red-50 p-2 ${className}`}
      title="Delete"
    />
  );
};

export const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <>
      {onEdit && <EditButton onClick={onEdit} />}
      {onDelete && <DeleteButton onClick={onDelete} />}
    </>
  );
};
