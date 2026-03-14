import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import AddCategoryModal from "../components/categories/AddCategoryModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../types/category";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = useCategories();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) {
      return categories;
    }
    const term = search.toLowerCase();
    return categories.filter((cat) => cat.nom.toLowerCase().includes(term));
  }, [categories, search]);

  async function handleSubmit(payload: { nom: string; description: string }) {
    setIsSubmitting(true);

    const success = editingCategory
      ? await updateCategory(editingCategory.id, payload)
      : await createCategory(payload);

    setIsSubmitting(false);
    if (success) {
      setIsAddModalOpen(false);
      setEditingCategory(null);
      clearError();
    }
  }

  function handleDelete(categoryId: number) {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (categoryToDelete !== null) {
      setIsSubmitting(true);
      await deleteCategory(categoryToDelete);
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  }

  function openCreateModal() {
    setEditingCategory(null);
    clearError();
    setIsAddModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditingCategory(category);
    clearError();
    setIsAddModalOpen(true);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">
            Gestion des Categories
          </h1>
          <p className="text-sm text-gray-500">
            Gérez vos catégories de produits.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-sm bg-[#00877a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#007065]"
        >
          <Plus size={18} /> Ajoute une categorie
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie..."
          className="w-full rounded-sm border border-[#f0f0f0] bg-white py-2.5 pl-11 pr-4 text-sm transition-all focus:outline-none"
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mb-4 text-sm text-gray-500">
          Chargement des catégories...
        </div>
      ) : null}

      <div className="bg-white border border-[#f0f0f0] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-900">
                    {cat.nom}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-500">
                    {cat.description || "—"}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      className="rounded-sm p-2 text-[#00877a] transition-colors hover:bg-gray-100"
                      onClick={() => openEditModal(cat)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="rounded-sm p-2 text-red-600 transition-colors hover:bg-gray-100"
                      onClick={() => void handleDelete(cat.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCategories.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-8 text-center text-sm text-gray-500"
                  colSpan={3}
                >
                  Aucune catégorie trouvée.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCategory(null);
          clearError();
        }}
        onSubmit={handleSubmit}
        initialValue={editingCategory}
        loading={isSubmitting}
        error={error}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => void confirmDelete()}
        title="Supprimer la catégorie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
        confirmLabel="Supprimer"
        loading={isSubmitting}
      />
    </div>
  );
}
