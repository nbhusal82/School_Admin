# Shared Form Components Usage Guide

## ✅ Already Updated Forms:
1. Review.jsx - Using FormInput, FormTextarea, FormImageUpload
2. FAQs.jsx - Using FormInput, FormTextarea

## 📝 How to Update Remaining Forms:

### Import Statement:
```jsx
import { FormInput, FormTextarea, FormSelect, FormImageUpload, FormFileUpload } from "../shared/FormInput";
```

### Replace Old Input with FormInput:
```jsx
// OLD:
<div>
  <label className="text-[10px]...">Name</label>
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full border..."
    placeholder="Enter name"
    required
  />
</div>

// NEW:
<FormInput
  label="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter name"
  required
/>
```

### Replace Textarea:
```jsx
// OLD:
<div>
  <label>Description</label>
  <textarea value={desc} onChange={...} className="..." />
</div>

// NEW:
<FormTextarea
  label="Description"
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  placeholder="Write description..."
  rows={4}
  required
/>
```

### Replace Select:
```jsx
// OLD:
<select value={cat} onChange={...}>
  <option value="">Select</option>
  {categories.map(c => <option value={c.id}>{c.name}</option>)}
</select>

// NEW:
<FormSelect
  label="Category"
  value={cat}
  onChange={(e) => setCat(e.target.value)}
  options={categories.map(c => ({ value: c.id, label: c.name }))}
  placeholder="Select Category"
  required
/>
```

### Replace Image Upload:
```jsx
// OLD:
<input type="file" onChange={(e) => setImage(e.target.files[0])} />

// NEW:
<FormImageUpload
  label="Profile Photo"
  image={image}
  onImageChange={(e) => setImage(e.target.files[0])}
  onImageRemove={() => setImage(null)}
  existingImageUrl={editing?.image ? `${imgurl}/${editing.image}` : null}
  previewShape="rounded-full"  // or "rounded-xl"
  previewSize="w-20 h-20"
  hint="PNG, JPG up to 2MB"
/>
```

### Mobile Responsive Padding:
```jsx
// Change all:
<div className="p-6 bg-gray-50 min-h-screen">

// To:
<div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
```

### Mobile Responsive Form Spacing:
```jsx
// Change:
<form className="space-y-5">

// To:
<form className="space-y-4 sm:space-y-5">
```

### Mobile Responsive Button Gap:
```jsx
// Change:
<div className="flex gap-3 pt-2">

// To:
<div className="flex gap-2 sm:gap-3 pt-2">
```

## 🎯 Forms to Update:
- Blog.jsx
- Team.jsx
- Notice_management.jsx
- Gallery_Content.jsx
- Vacancy_Management.jsx
- Event.jsx
- Achievement.jsx
- Question_Bank.jsx

## 📱 Mobile Responsive Checklist:
✅ p-3 sm:p-6 for padding
✅ space-y-4 sm:space-y-5 for form spacing
✅ gap-2 sm:gap-3 for button gaps
✅ grid-cols-1 sm:grid-cols-2 for two-column layouts
✅ flex-col sm:flex-row for header layouts
