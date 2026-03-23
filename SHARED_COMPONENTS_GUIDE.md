# Shared Components Usage Guide

## Overview
This guide shows how to use shared components (Table, Modal, Button, Skeleton_table, PageHeader) across all pages in the project.

---

## ✅ Already Refactored Pages

### 1. Review.jsx
- ✅ Uses Table component
- ✅ Uses Modal component
- ✅ Uses Button (AddButton, ActionButtons)
- ✅ Uses ConfirmDialog
- ✅ Uses PageHeader
- ✅ Uses TableSkeleton

### 2. FAQs.jsx
- ✅ Uses Table component
- ✅ Uses Modal component
- ✅ Uses Button (AddButton, ActionButtons)
- ✅ Uses PageHeader
- ✅ Uses TableSkeleton

### 3. Question__Bank.jsx
- ✅ Uses Table component
- ✅ Uses Modal component
- ✅ Uses Button (AddButton, ActionButtons)
- ✅ Uses PageHeader
- ✅ Uses TableSkeleton

### 4. Achievement.jsx
- ✅ Uses Modal component
- ✅ Uses Button (AddButton, ActionButtons)
- ✅ Uses PageHeader
- ✅ Custom grid layout (not table-based)

---

## 📋 Shared Components API

### 1. Table Component
```jsx
import Table from "../shared/Table";

<Table
  columns={[
    { header: "S.N", render: (_, index) => index + 1 },
    { header: "Name", accessor: "name", cellClassName: "font-medium" },
    { header: "Email", accessor: "email" },
  ]}
  data={items}
  actions={(row) => (
    <ActionButtons
      onEdit={() => handleEdit(row)}
      onDelete={() => handleDelete(row.id)}
    />
  )}
  emptyMessage="No data found"
/>
```

### 2. Modal Component
```jsx
import Modal from "../shared/Modal";

<Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title="Add New Item"
  size="md" // sm, md, lg, xl
>
  <form onSubmit={handleSubmit}>
    {/* Form content */}
  </form>
</Modal>
```

### 3. Button Components
```jsx
import Button, { AddButton, ActionButtons, ConfirmDialog } from "../shared/Button";

// Add Button
<AddButton onClick={openModal} label="Add New" isLoading={isCreating} />

// Action Buttons (Edit/Delete)
<ActionButtons
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item.id)}
  isDeleting={isDeleting}
/>

// Confirm Dialog
<ConfirmDialog
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleConfirmDelete}
  isLoading={isDeleting}
/>

// Base Button
<Button
  onClick={handleClick}
  variant="primary" // primary, secondary, danger, outline
  size="md" // sm, md
  isLoading={isLoading}
>
  Click Me
</Button>
```

### 4. PageHeader Component
```jsx
import PageHeader from "../shared/PageHeader";

<PageHeader
  title="Page Title"
  subtitle="Page description"
>
  <AddButton onClick={openModal} label="Add New" />
</PageHeader>
```

### 5. TableSkeleton Component
```jsx
import TableSkeleton from "../shared/Skeleton_table";

{isLoading && <TableSkeleton rows={5} columns={6} />}
```

---

## 🔄 Pages That Need Refactoring

### Gallery_Content.jsx
**Current:** Custom modal, custom buttons, custom grid
**Recommendation:** Keep custom grid layout, but use:
- Modal component for add/edit forms
- Button components (AddButton, ActionButtons)
- PageHeader component

### Vacancy_Management.jsx
**Current:** Custom modal, custom buttons, custom table
**Recommendation:**
- Use Table component for desktop view
- Use Modal component
- Use Button components (AddButton, ActionButtons)
- Use PageHeader component
- Use TableSkeleton for loading state

### Notice_management.jsx
**Current:** Custom modal, custom buttons, custom card layout
**Recommendation:** Keep custom card layout, but use:
- Modal component for add form
- Button components (AddButton)
- PageHeader component

---

## 📝 Standard Pattern for All Pages

```jsx
import React, { useState } from "react";
import PageHeader from "../shared/PageHeader";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import Button, { AddButton, ActionButtons, ConfirmDialog } from "../shared/Button";
import TableSkeleton from "../shared/Skeleton_table";
import { useGetQuery, useCreateMutation, useUpdateMutation, useDeleteMutation } from "../redux/feature/...";

const MyPage = () => {
  const { data: items = [], isLoading } = useGetQuery();
  const [createItem, { isLoading: isCreating }] = useCreateMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", email: "" });
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, email: item.email });
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteItem(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem({ id: editingItem.id, data: formData }).unwrap();
      } else {
        await createItem(formData).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: "S.N", render: (_, index) => <span className="text-gray-400">{index + 1}</span> },
    { header: "Name", accessor: "name", cellClassName: "font-medium text-gray-900" },
    { header: "Email", accessor: "email", cellClassName: "text-gray-900" },
  ];

  if (isLoading) return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="My Page" subtitle="Manage items" />
      <TableSkeleton rows={5} columns={4} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="My Page" subtitle="Manage items">
        <AddButton onClick={openAddModal} label="Add New" />
      </PageHeader>

      <Table
        columns={columns}
        data={items}
        actions={(row) => (
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDeleteClick(row.id)}
          />
        )}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Item" : "Add Item"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Enter email"
            />
          </div>
          <div className="flex gap-2 pt-3">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editingItem ? "Update Item" : "Save Item"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MyPage;
```

---

## 🎯 Benefits of Using Shared Components

1. **Consistency** - Same look and feel across all pages
2. **Maintainability** - Update once, apply everywhere
3. **Less Code** - Reuse instead of rewrite
4. **Better UX** - Standardized interactions
5. **Faster Development** - Copy-paste pattern and customize

---

## 📦 Component Locations

```
src/component/shared/
├── Table.jsx           - Reusable table with actions
├── Modal.jsx           - Modal dialog
├── Button.jsx          - Button variants (AddButton, ActionButtons, ConfirmDialog)
├── Skeleton_table.jsx  - Loading skeleton for tables
└── PageHeader.jsx      - Page title with actions
```

---

## ✨ Next Steps

1. Refactor remaining pages (Gallery, Vacancy, Notice) to use shared components
2. Create additional shared components as needed (e.g., FormInput, Card)
3. Document any custom patterns that emerge
4. Consider creating a Storybook for component documentation


---

## 🎯 Managing Content AND Category in Same Page

### Example: Two Modals in One Page

```jsx
import React, { useState } from "react";
import { FolderOpen } from "lucide-react";
import PageHeader from "../shared/PageHeader";
import Modal from "../shared/Modal";
import Button, { AddButton } from "../shared/Button";

const GalleryPage = () => {
  // Gallery Modal States
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ category_id: "", caption: "", images: [] });

  // Category Modal States  
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Gallery Management" subtitle="Manage photos and categories">
        {/* Two separate buttons */}
        <button
          onClick={() => setCategoryModalOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 mr-2"
        >
          <FolderOpen size={16} /> Add Category
        </button>
        <AddButton onClick={() => setGalleryModalOpen(true)} label="Add Gallery" />
      </PageHeader>

      {/* Gallery Content Modal */}
      <Modal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        title="Add Gallery"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Category</label>
            <select className="w-full border px-3 py-2 rounded-lg">
              <option>Select Category</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Caption</label>
            <textarea className="w-full border px-3 py-2 rounded-lg h-20" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Images</label>
            <input type="file" multiple className="w-full text-sm" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setGalleryModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Upload</Button>
          </div>
        </form>
      </Modal>

      {/* Category Modal - Separate and Simple */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add Category"
        size="sm"
      >
        <form className="space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Category Name</label>
            <input
              autoFocus
              required
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Campus Events"
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
```

### Key Points:
1. **Two separate modal states**: `galleryModalOpen` and `categoryModalOpen`
2. **Two separate buttons**: One for category, one for content
3. **Different modal sizes**: `size="md"` for gallery, `size="sm"` for category
4. **Independent forms**: Each modal has its own form and submit handler
5. **Clean separation**: Easy to manage and maintain

### Benefits:
- ✅ User stays on same page
- ✅ Quick category creation without navigation
- ✅ Better UX - no page reload
- ✅ Consistent modal design
- ✅ Easy to add more modals if needed
