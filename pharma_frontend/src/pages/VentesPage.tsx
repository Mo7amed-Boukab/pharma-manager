import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ConfirmModal from "../components/common/ConfirmModal";
import VenteDetailsModal from "../components/ventes/VenteDetailsModal";
import VentesTable from "../components/ventes/VentesTable";
import { useVentes } from "../hooks/useVentes";
import type { Vente, VenteDetail, VenteStatut } from "../types/vente";

function buildFilters(date: string, statut: string) {
  return {
    date: date || undefined,
    statut: (statut || undefined) as VenteStatut | undefined,
  };
}

export default function VentesPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedVente, setSelectedVente] = useState<VenteDetail | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cancellingSaleId, setCancellingSaleId] = useState<number | null>(null);
  const [venteToCancel, setVenteToCancel] = useState<Vente | null>(null);

  const apiFilters = useMemo(
    () => buildFilters(selectedDate, selectedStatut),
    [selectedDate, selectedStatut],
  );

  const {
    ventes,
    loading,
    error,
    fetchVentes,
    fetchVenteDetail,
    annulerVente,
    clearError,
  } = useVentes({ enabled: true, filters: apiFilters });

  const filteredVentes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return ventes.filter((vente) => {
      if (!normalizedSearch) {
        return true;
      }

      return vente.reference.toLowerCase().includes(normalizedSearch);
    });
  }, [ventes, search]);

  const handleOpenDetails = async (vente: Vente) => {
    setIsDetailsOpen(true);
    setDetailLoading(true);
    clearError();

    const detail = await fetchVenteDetail(vente.id);
    setSelectedVente(detail);
    setDetailLoading(false);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedVente(null);
    clearError();
  };

  const handleAskCancel = (vente: Vente) => {
    setVenteToCancel(vente);
  };

  const handleConfirmCancel = async () => {
    if (!venteToCancel) {
      return;
    }

    setCancellingSaleId(venteToCancel.id);
    const success = await annulerVente(venteToCancel.id);

    if (success) {
      await fetchVentes();
      setSelectedVente((currentVente) =>
        currentVente && currentVente.id === venteToCancel.id
          ? { ...currentVente, statut: "annulee" }
          : currentVente,
      );
      setVenteToCancel(null);
    }

    setCancellingSaleId(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div>
          <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">
            Historique des Ventes
          </h1>
          <p className="text-sm text-gray-500">
            Consultez et suivez vos transactions.
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une vente par référence..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded-sm text-sm focus:outline-none transition-all"
          />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-[#f0f0f0] rounded-sm text-sm focus:outline-none transition-all"
        />
        <select
          value={selectedStatut}
          onChange={(event) => setSelectedStatut(event.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-[#f0f0f0] rounded-sm text-sm focus:outline-none transition-all"
        >
          <option value="">Tous les statuts</option>
          <option value="completee">Complétée</option>
          <option value="en_cours">En cours</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-sm border border-[#f0f0f0] bg-white px-4 py-10 text-center text-sm text-gray-500">
          Chargement des ventes...
        </div>
      ) : filteredVentes.length === 0 ? (
        <div className="rounded-sm border border-[#f0f0f0] bg-white px-4 py-10 text-center text-sm text-gray-500">
          Aucune vente trouvée.
        </div>
      ) : (
        <VentesTable
          ventes={filteredVentes}
          onView={handleOpenDetails}
          onCancel={handleAskCancel}
          cancellingSaleId={cancellingSaleId}
        />
      )}

      <VenteDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        vente={selectedVente}
        loading={detailLoading}
        error={isDetailsOpen && !detailLoading ? error : null}
        onCancel={() => {
          if (selectedVente) {
            handleAskCancel(selectedVente);
          }
        }}
        cancelLoading={cancellingSaleId === selectedVente?.id}
      />

      <ConfirmModal
        isOpen={venteToCancel !== null}
        onClose={() => {
          if (!cancellingSaleId) {
            setVenteToCancel(null);
            clearError();
          }
        }}
        onConfirm={() => {
          void handleConfirmCancel();
        }}
        title="Annuler la vente"
        message={
          venteToCancel
            ? `Voulez-vous annuler la vente ${venteToCancel.reference} ? Le backend réintégrera automatiquement le stock.`
            : "Voulez-vous annuler cette vente ?"
        }
        confirmLabel="Annuler la vente"
        loading={cancellingSaleId !== null}
        variant="warning"
      />
    </div>
  );
}
