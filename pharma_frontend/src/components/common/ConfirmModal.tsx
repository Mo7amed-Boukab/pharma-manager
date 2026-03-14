import Modal from "./Modal";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Êtes-vous sûr de vouloir effectuer cette action ?",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-[#00877a] hover:bg-[#007065] text-white",
  };

  const iconColors = {
    danger: "text-red-600",
    warning: "text-yellow-500",
    info: "text-[#00877a]",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="400px"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`rounded-full p-3 mt-2 bg-opacity-10 ${variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-yellow-100' : 'bg-[#00877a] bg-opacity-10'}`}>
          <AlertCircle className={iconColors[variant]} size={32} />
        </div>
        
        <p className="text-gray-600 text-sm">
          {message}
        </p>

        <div className="mt-4 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-sm border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
            className={`flex-1 rounded-sm px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${variantClasses[variant]}`}
          >
            {loading ? "Chargement..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
