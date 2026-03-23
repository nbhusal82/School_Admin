import React from "react";
import Button from "./Button";
import { Plus, Save, Trash2, Download, Edit } from "lucide-react";

// Example usage of the Button component

const ButtonExamples = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Primary Buttons */}
      <div>
        <h3 className="font-bold mb-2">Primary Buttons</h3>
        <div className="flex gap-2">
          <Button icon={Plus}>Add New</Button>
          <Button icon={Save}>Save</Button>
          <Button icon={Download}>Download</Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div>
        <h3 className="font-bold mb-2">Secondary Buttons</h3>
        <div className="flex gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary" icon={Edit}>Edit</Button>
        </div>
      </div>

      {/* Danger Buttons */}
      <div>
        <h3 className="font-bold mb-2">Danger Buttons</h3>
        <div className="flex gap-2">
          <Button variant="danger" icon={Trash2}>Delete</Button>
          <Button variant="danger">Remove</Button>
        </div>
      </div>

      {/* Outline Buttons */}
      <div>
        <h3 className="font-bold mb-2">Outline Buttons</h3>
        <div className="flex gap-2">
          <Button variant="outline">Categories</Button>
          <Button variant="outline" icon={Plus}>Add</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-bold mb-2">Button Sizes</h3>
        <div className="flex gap-2 items-center">
          <Button size="sm" icon={Plus}>Small</Button>
          <Button size="md" icon={Plus}>Medium</Button>
          <Button size="lg" icon={Plus}>Large</Button>
        </div>
      </div>

      {/* Form Buttons */}
      <div>
        <h3 className="font-bold mb-2">Form Buttons</h3>
        <div className="flex gap-2">
          <Button type="submit" icon={Save}>Submit</Button>
          <Button type="button" variant="secondary">Cancel</Button>
        </div>
      </div>

      {/* Disabled State */}
      <div>
        <h3 className="font-bold mb-2">Disabled State</h3>
        <div className="flex gap-2">
          <Button disabled icon={Plus}>Disabled</Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonExamples;
