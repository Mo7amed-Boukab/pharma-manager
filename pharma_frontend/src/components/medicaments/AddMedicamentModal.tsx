import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import type { Category } from "../../types/category";
import type { MedicamentPayload } from "../../types/medicament";

interface AddMedicamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: MedicamentPayload) => Promise<void>;
  initialValue?: any;
  categories: Category[];
  loading?: boolean;
}

const FORME_CHOICES = [
  { value: "comprime", label: "Comprimé" },
  { value: "sirop", label: "Sirop" },
  { value: "injection", label: "Injection" },
  { value: "capsule", label: "Capsule" },
  { value: "pommade", label: "Pommade" },
  { value: "autre", label: "Autre" },
];

export default function AddMedicamentModal({
  isOpen,
  onClose,
  onSubmit,
  initialValue,
  categories,
  loading,
}: AddMedicamentModalProps) {
  const [formData, setFormData] = useState<MedicamentPayload>({
    nom: "",
    dci: "",
    categorie: categories[0]?.id || 0,
    forme: "comprime",
    dosage: "",
    prix_achat: "",
    prix_vente: "",
    stock_actuel: 0,
    stock_minimum: 10,
    date_expiration: new Date().toISOString().split("T")[0],
    ordonnance_requise: false,
  });

  useEffect(() => {
    if (initialValue) {
      setFormData({
        nom: initialValue.nom || "",
        dci: initialValue.dci || "",
        categorie: initialValue.categorie || categories[0]?.id || 0,
        forme: initialValue.forme || "comprime",
        dosage: initialValue.dosage || "",
        prix_achat: initialValue.prix_achat || "",
        prix_vente: initialValue.prix_vente || "",
        stock_actuel: initialValue.stock_actuel || 0,
        stock_minimum: initialValue.stock_minimum || 10,
        date_expiration:
          initialValue.date_expiration ||
          new Date().toISOString().split("T")[0],
        ordonnance_requise: initialValue.ordonnance_requise || false,
      });
    } else {
      setFormData({
        nom: "",
        dci: "",
        categorie: categories[0]?.id || 0,
        forme: "comprime",
        dosage: "",
        prix_achat: "",
        prix_vente: "",
        stock_actuel: 0,
        stock_minimum: 10,
        date_expiration: new Date().toISOString().split("T")[0],
        ordonnance_requise: false,
      });
    }
  }, [initialValue, isOpen, categories]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "categorie" ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.nom || !formData.categorie || !formData.prix_vente) {
      return;
    }
    void onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialValue ? "Modifier le Médicament" : "Ajouter un Médicament"}
      description="Saisissez les informations complètes du produit."
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Nom Commercial
            </label>
            <input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              type="text"
              required
              placeholder="Ex: Doliprane"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              DCI
            </label>
            <input
              name="dci"
              value={formData.dci}
              onChange={handleChange}
              type="text"
              placeholder="Ex: Paracétamol"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Catégorie
            </label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a] bg-white"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Dosage
            </label>
            <input
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              type="text"
              required
              placeholder="Ex: 500mg"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Forme
            </label>
            <select
              name="forme"
              value={formData.forme}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a] bg-white"
            >
              {FORME_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Prix d'Achat (MAD)
            </label>
            <input
              name="prix_achat"
              value={formData.prix_achat}
              onChange={handleChange}
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Prix de Vente (MAD)
            </label>
            <input
              name="prix_vente"
              value={formData.prix_vente}
              onChange={handleChange}
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Stock Actuel
            </label>
            <input
              name="stock_actuel"
              value={formData.stock_actuel}
              onChange={handleChange}
              type="number"
              required
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Stock Minimum
            </label>
            <input
              name="stock_minimum"
              value={formData.stock_minimum}
              onChange={handleChange}
              type="number"
              placeholder="10"
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
              Date d'Expiration
            </label>
            <input
              name="date_expiration"
              value={formData.date_expiration}
              onChange={handleChange}
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input
              id="ordonnance_requise_check"
              name="ordonnance_requise"
              checked={formData.ordonnance_requise}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ordonnance_requise: e.target.checked,
                }))
              }
              type="checkbox"
              className="w-4 h-4 text-[#00877a]"
            />
            <label
              htmlFor="ordonnance_requise_check"
              className="text-xs font-bold text-gray-700 uppercase cursor-pointer"
            >
              Ordonnance Requise
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-[4px] hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-[#00877a] rounded-[4px] hover:bg-[#007065] disabled:opacity-50"
          >
            {loading ? "Chargement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
