import { useState, useEffect, useMemo } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import MedicamentCard from "../components/medicaments/MedicamentCard";
import CartDrawer from "../components/medicaments/CartDrawer";
import AddMedicamentModal from "../components/medicaments/AddMedicamentModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { useMedicaments } from "../hooks/useMedicaments";
import { useCategories } from "../hooks/useCategories";

export default function MedicamentsPage() {
  const { 
    medicaments, 
    loading, 
    error, 
    fetchMedicaments,
    createMedicament,
    updateMedicament,
    deleteMedicament 
  } = useMedicaments();
  const { categories, fetchCategories } = useCategories();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicament, setEditingMedicament] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicamentToDelete, setMedicamentToDelete] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    void fetchMedicaments();
    void fetchCategories();
  }, [fetchMedicaments, fetchCategories]);

  const [cart, setCart] = useState<
    { id: number; nom: string; price: number; qte: number }[]
  >([]);

  const addToCart = (p: {
    id: number;
    nom: string;
    price: string | number;
  }) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === p.id);
      if (exists)
        return prev.map((item) =>
          item.id === p.id ? { ...item, qte: item.qte + 1 } : item,
        );
      return [
        ...prev,
        {
          id: p.id,
          nom: p.nom,
          price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
          qte: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qte, 0);

  const filteredMedicaments = useMemo(() => {
    return medicaments.filter((med) => {
      const matchSearch =
        med.nom.toLowerCase().includes(search.toLowerCase()) ||
        med.dci.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(med.categorie);

      return matchSearch && matchCategory;
    });
  }, [medicaments, search, selectedCategories]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const openCreateModal = () => {
    setEditingMedicament(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (medicament: any) => {
    setEditingMedicament(medicament);
    setIsAddModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    setMedicamentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (medicamentToDelete) {
      setIsSubmitting(true);
      const success = await deleteMedicament(medicamentToDelete);
      if (success) {
        await fetchMedicaments();
      }
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setMedicamentToDelete(null);
    }
  };

  const handleMedicamentSubmit = async (payload: any) => {
    setIsSubmitting(true);
    let success = false;
    if (editingMedicament) {
      success = await updateMedicament(editingMedicament.id, payload);
    } else {
      success = await createMedicament(payload);
    }

    if (success) {
      await fetchMedicaments();
      setIsAddModalOpen(false);
      setEditingMedicament(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 relative font-sans">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">
            Gestion des Medicaments
          </h1>
          <p className="text-sm text-gray-500">
            Gérez votre stock au quotidien.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00877a] text-white text-sm font-medium rounded-[4px] hover:bg-[#007065] transition-colors"
        >
          <Plus size={18} /> Ajoute un medicament
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="p-6 border border-[#f0f0f0] rounded">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-gray-900">Filtres</h3>
              <button
                onClick={() => setSelectedCategories([])}
                className="text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                Reset
              </button>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-900">
                  Catégories
                </span>
                <ChevronDown size={14} className="text-gray-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === 0}
                    onChange={() => setSelectedCategories([])}
                    className="w-4 h-4 rounded-[3px] border-gray-300 text-[#00877a] focus:ring-[#00877a]"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    Tous
                  </span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="w-4 h-4 rounded-[3px] border-gray-300 text-[#00877a] focus:ring-[#00877a]"
                    />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      {cat.nom}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-grow">
          <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou DCI..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded-sm text-sm focus:outline-none transition-all"
            />
          </div>

          {loading ? (
            <div className="text-sm text-gray-500 mb-4">Chargement des médicaments...</div>
          ) : error ? (
            <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicaments.map((p) => (
                <MedicamentCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={addToCart} 
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
              {filteredMedicaments.length === 0 && (
                 <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                   Aucun médicament trouvé.
                 </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        total={total}
      />

      {/* Add Medicament Modal */}
      <AddMedicamentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMedicament(null);
        }}
        onSubmit={handleMedicamentSubmit}
        initialValue={editingMedicament}
        categories={categories}
        loading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le médicament"
        message="Êtes-vous sûr de vouloir supprimer ce médicament ? Cette action est irréversible."
        confirmLabel="Supprimer"
        loading={isSubmitting}
        variant="danger"
      />
    </div>
  );
}
