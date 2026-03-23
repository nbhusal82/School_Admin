import React from "react";
import { Plus } from "lucide-react";
import Button from "./Button";

const AddButton = ({ onClick, label = "Add New", icon: Icon = Plus, className = "" }) => {
  return (
    <Button onClick={onClick} icon={Icon} className={className}>
      {label}
    </Button>
  );
};

export default AddButton;
