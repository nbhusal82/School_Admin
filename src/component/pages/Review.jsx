import React, { useState } from "react";
import PageHeader from "../shared/PageHeader";
import Table from "../shared/Table";
import Modal from "../shared/Modal";
import Button, {
  AddButton,
  ActionButtons,
  ConfirmDialog,
} from "../shared/Button";
import TableSkeleton from "../shared/Skeleton_table";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetreviewQuery,
  useUpdateReviewMutation,
} from "../redux/feature/siteslice";

const Review = () => {
  const { data: reviews = [], isLoading } = useGetreviewQuery();
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const imgurl = import.meta.env.VITE_IMAGE_URL;

  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    review_text: "",
    image: null,
  });

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({ name: "", position: "", review_text: "", image: null });
    setModalOpen(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      position: review.position,
      review_text: review.review_text,
      image: null,
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(selectedId).unwrap();
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("review_text", formData.review_text);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingReview) {
        await updateReview({ id: editingReview.id, data }).unwrap();
      } else {
        await createReview(data).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Table Columns Setup
  const columns = [
    {
      header: "S.N",
      render: (_, index) => <span className="text-gray-400">{index + 1}</span>,
    },
    {
      header: "Image",
      render: (row) => (
        <img
          src={`${imgurl}/${row.image}`}
          className="w-10 h-10 rounded-full object-cover border"
          alt={row.name}
        />
      ),
    },
    {
      header: "Name",
      accessor: "name",
      cellClassName: "font-medium text-gray-900",
    },
    {
      header: "Position",
      accessor: "position",
      cellClassName: "text-gray-900 font-medium",
    },
    {
      header: "Review",
      accessor: "review_text",
      cellClassName: "text-gray-900 max-w-xs font-medium truncate",
    },
  ];

  if (isLoading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <PageHeader
          title="Review Management"
          subtitle="Manage customer reviews"
        />
        <TableSkeleton rows={5} columns={6} />
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Review Management" subtitle="Manage customer reviews">
        <AddButton onClick={openAddModal} label="Add Review" />
      </PageHeader>

      <Table
        columns={columns}
        data={reviews}
        actions={(row) => (
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDeleteClick(row.id)}
          />
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingReview ? "Edit Review" : "Add Review"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Reviewer name"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
              Position
            </label>
            <input
              type="text"
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="e.g. Parent, Student"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
              Review
            </label>
            <textarea
              required
              value={formData.review_text}
              onChange={(e) =>
                setFormData({ ...formData, review_text: e.target.value })
              }
              className="w-full border border-gray-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
              placeholder="Review text..."
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">
              Photo
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
              className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
            />
          </div>

          <div className="flex gap-2 pt-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isCreating || isUpdating}
            >
              {editingReview ? "Update Review" : "Save Review"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Review;
