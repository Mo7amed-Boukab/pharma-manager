import Modal from "../common/Modal";
import type { VenteDetail } from "../../types/vente";

interface VenteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vente: VenteDetail | null;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  cancelLoading?: boolean;
}

function formatStatut(statut: VenteDetail["statut"]) {
  if (statut === "completee") {
    return "Complétée";
  }

  if (statut === "annulee") {
    return "Annulée";
  }

  return "En cours";
}

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VenteDetailsModal({
  isOpen,
  onClose,
  vente,
  loading = false,
  error = null,
  onCancel,
  cancelLoading = false,
}: VenteDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vente ? `Détails de ${vente.reference}` : "Détails de la vente"}
      description="Vue complète de la vente telle qu'exposée par le backend."
      maxWidth="960px"
    >
      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500">
          Chargement des détails...
        </div>
      ) : error ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : vente ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded border border-[#f0f0f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                ID Vente
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                #{vente.id}
              </p>
            </div>
            <div className="rounded border border-[#f0f0f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Date de vente
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatDate(vente.date_vente)}
              </p>
            </div>
            <div className="rounded border border-[#f0f0f0] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Statut
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatStatut(vente.statut)}
              </p>
            </div>
            <div className="rounded border border-[#f0f0f0] p-4 md:col-span-2 xl:col-span-1">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total TTC
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {vente.total_ttc} MAD
              </p>
            </div>
            <div className="rounded border border-[#f0f0f0] p-4 md:col-span-2 xl:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Notes
              </p>
              <p className="mt-2 text-sm text-gray-700">
                {vente.notes?.trim()
                  ? vente.notes
                  : "Aucune note pour cette vente."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded border border-[#f0f0f0]">
            <div className="border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-bold text-gray-900">
                Lignes de vente
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      ID Ligne
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Médicament
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      ID Médicament
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Prix unitaire
                    </th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Sous-total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vente.lignes.map((ligne) => (
                    <tr
                      key={ligne.id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">
                        #{ligne.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {ligne.medicament_nom}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {ligne.medicament}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {ligne.quantite}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {ligne.prix_unitaire} MAD
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {ligne.sous_total} MAD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {vente.statut !== "annulee" && (
              <button
                type="button"
                onClick={onCancel}
                disabled={cancelLoading}
                className="rounded border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLoading ? "Annulation..." : "Annuler la vente"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-[#00877a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#007065]"
            >
              Fermer
            </button>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-gray-500">
          Aucune vente sélectionnée.
        </div>
      )}
    </Modal>
  );
}
