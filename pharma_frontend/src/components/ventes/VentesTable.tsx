import { Ban, Eye } from "lucide-react";
import type { Vente } from "../../types/vente";

interface VentesTableProps {
  ventes: Vente[];
  onView: (vente: Vente) => void;
  onCancel: (vente: Vente) => void;
  cancellingSaleId?: number | null;
}

function formatStatut(statut: Vente["statut"]) {
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

export default function VentesTable({
  ventes,
  onView,
  onCancel,
  cancellingSaleId = null,
}: VentesTableProps) {
  return (
    <div className="bg-white border border-[#f0f0f0] rounded overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Référence
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total (MAD)
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ventes.map((vente) => (
            <tr
              key={vente.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-gray-900">
                  {vente.reference}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-gray-500">
                  {formatDate(vente.date_vente)}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-gray-900">
                  {vente.total_ttc}
                </span>
              </td>
              <td className="px-6 py-5">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${
                    vente.statut === "completee"
                      ? "bg-green-50 text-green-700"
                      : vente.statut === "annulee"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {formatStatut(vente.statut)}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(vente)}
                    className="p-1.5 text-[#00877a] hover:text-[#007065] transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  {vente.statut !== "annulee" && (
                    <button
                      onClick={() => onCancel(vente)}
                      disabled={cancellingSaleId === vente.id}
                      className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Ban size={14} />
                      {cancellingSaleId === vente.id
                        ? "Annulation..."
                        : "Annuler"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
