import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import DeleteTransactionModal from '../DeleteTransactionModal';

interface DeleteTransactionButtonProps {
  transactionId: string;
  onDelete: (id: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function DeleteTransactionButton({
  transactionId,
  onDelete,
  isSubmitting
}: DeleteTransactionButtonProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await onDelete(transactionId);
    setShowDeleteModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDeleteModal(true)}
        className="text-gray-600 hover:text-red-600 transition-colors duration-200"
        disabled={isSubmitting}
        title="Eliminar movimiento"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <DeleteTransactionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </>
  );
}