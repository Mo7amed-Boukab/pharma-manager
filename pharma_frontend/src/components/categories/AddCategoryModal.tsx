import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import type { Category } from "../../types/category";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { nom: string; description: string }) => Promise<void>;
  initialValue?: Category | null;
  loading?: boolean;
  error?: string | null;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialValue,
  loading = false,
  error,
}: AddCategoryModalProps) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setNom(initialValue?.nom ?? "");
    setDescription(initialValue?.description ?? "");
  }, [initialValue, isOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit({ nom, description });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialValue ? "Modifier Catégorie" : "Nouvelle Catégorie"}
      description="Ajoutez une nouvelle catégorie au catalogue."
      maxWidth="450px"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">
            Nom
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder="Ex: Antibiotique"
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:border-[#00877a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows={3}
            className="w-full rounded-sm border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#00877a]"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-sm border border-gray-200 bg-gray-50 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-sm bg-[#00877a] px-5 py-2 text-sm font-medium text-white hover:bg-[#007065] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
