import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import ConfirmModal from "../components/common/ConfirmModal";
import VenteDetailsModal from "../components/ventes/VenteDetailsModal";
import VentesTable from "../components/ventes/VentesTable";
import CustomSelect from "../components/common/CustomSelect";
import CustomDatePicker from "../components/common/CustomDatePicker";
import { useVentes } from "../hooks/useVentes";
import type { Vente, VenteDetail, VenteStatut } from "../types/vente";
import { exportToCSV } from "../utils/csvExport";

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
  const [exportLoading, setExportLoading] = useState(false);
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

  const handleExportCSV = async () => {
    if (filteredVentes.length === 0) return;

    setExportLoading(true);

    const ventesWithDetails = await Promise.all(
      filteredVentes.map(async (vente) => {
        const detail = await fetchVenteDetail(vente.id);
        return {
          vente,
          nbArticles: detail
            ? detail.lignes.reduce((sum, ligne) => sum + ligne.quantite, 0)
            : 0,
        };
      }),
    );

    const dataToExport = ventesWithDetails.map(({ vente, nbArticles }) => ({
      Référence: vente.reference,
      Date: new Date(vente.date_vente).toLocaleDateString("fr-FR"),
      Statut:
        vente.statut === "completee"
          ? "Complétée"
          : vente.statut === "en_cours"
            ? "En cours"
            : "Annulée",
      "Total (Dhs)": vente.total_ttc,
      "Nb Articles": nbArticles,
    }));

    exportToCSV(
      dataToExport,
      `ventes_export_${new Date().toISOString().split("T")[0]}.csv`,
    );

    setExportLoading(false);
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
        <button
          onClick={() => {
            void handleExportCSV();
          }}
          disabled={filteredVentes.length === 0 || exportLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#f0f0f0] text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} /> {exportLoading ? "Export..." : "Exporter CSV"}
        </button>
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
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded text-sm focus:outline-none transition-all"
          />
        </div>
        <CustomDatePicker value={selectedDate} onChange={setSelectedDate} />
        <CustomSelect
          value={selectedStatut}
          onChange={setSelectedStatut}
          placeholder="Tous les statuts"
          options={[
            { value: "completee", label: "Complétée" },
            { value: "en_cours", label: "En cours" },
            { value: "annulee", label: "Annulée" },
          ]}
        />
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded border border-[#f0f0f0] bg-white px-4 py-10 text-center text-sm text-gray-500">
          Chargement des ventes...
        </div>
      ) : filteredVentes.length === 0 ? (
        <div className="rounded border border-[#f0f0f0] bg-white px-4 py-10 text-center text-sm text-gray-500">
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
