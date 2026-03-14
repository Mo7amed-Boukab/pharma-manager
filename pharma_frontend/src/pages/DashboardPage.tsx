import { useEffect, useMemo } from "react";
import { Bell } from "lucide-react";
import StatCard from "../components/common/StatCard";
import LatestMedicamentsList from "../components/dashboard/LatestMedicamentsList";
import QuickAccessLinks from "../components/dashboard/QuickAccessLinks";
import { useMedicaments } from "../hooks/useMedicaments";
import { useCategories } from "../hooks/useCategories";
import { useVentes } from "../hooks/useVentes";

function formatAddedDate(dateValue: string) {
  const targetDate = new Date(dateValue);
  const today = new Date();

  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const diffInDays = Math.round(
    (todayDay.getTime() - targetDay.getTime()) / 86400000,
  );

  if (diffInDays === 0) {
    return "Ajouté aujourd'hui";
  }

  if (diffInDays === 1) {
    return "Ajouté hier";
  }

  return `Ajouté le ${targetDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
  })}`;
}

export default function DashboardPage() {
  const {
    medicaments,
    alertesCount,
    loading: medicamentsLoading,
    error: medicamentsError,
    fetchMedicaments,
    fetchAlertes,
  } = useMedicaments();
  const { categories, fetchCategories } = useCategories();
  const {
    ventes,
    loading: ventesLoading,
    error: ventesError,
    fetchVentes,
  } = useVentes();

  useEffect(() => {
    void fetchMedicaments();
    void fetchCategories();
    void fetchVentes();
    void fetchAlertes();
  }, [fetchMedicaments, fetchCategories, fetchVentes, fetchAlertes]);

  const latestMedicaments = useMemo(
    () =>
      [...medicaments]
        .sort(
          (left, right) =>
            new Date(right.date_creation).getTime() -
            new Date(left.date_creation).getTime(),
        )
        .slice(0, 4)
        .map((medicament) => ({
          id: medicament.id,
          nom: medicament.nom,
          dci: medicament.dci,
          date: formatAddedDate(medicament.date_creation),
        })),
    [medicaments],
  );

  const ventesCompletees = useMemo(
    () => ventes.filter((vente) => vente.statut === "completee"),
    [ventes],
  );

  const totalMedicaments = medicamentsLoading ? "..." : medicaments.length;
  const totalVentes = ventesLoading ? "..." : ventesCompletees.length;
  const totalCategories = categories.length;
  const dashboardError = medicamentsError ?? ventesError;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-400 mx-auto">
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-xl sm:text-2xl py-1 font-semibold tracking-tight text-gray-900">
          Tableau de Bord
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Aperçu global de votre activité.
        </p>
      </div>

      {/* 3 Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-12">
        <StatCard label="Total Médicaments" value={totalMedicaments} />
        <StatCard label="Total Ventes" value={totalVentes} roundedSm />
        <StatCard label="Catégories" value={totalCategories} roundedSm />
      </div>

      {dashboardError && (
        <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dashboardError}
        </div>
      )}

      {/* Alert Notification */}
      <div className="mb-8 lg:mb-10 p-4 sm:p-6 bg-white border border-[#f0f0f0] rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
          <Bell size={20} className="text-gray-900" />
        </div>
        <div>
          <h3 className="text-[16px] sm:text-[17px] font-bold text-gray-900 leading-tight">
            Alerte de Stock Bas
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
            Vous avez {alertesCount} médicament{alertesCount > 1 ? "s" : ""} qui
            arrive{alertesCount > 1 ? "nt" : ""} à épuisement. Vérifiez votre
            inventaire pour éviter les ruptures de stock.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Last Added Medicaments */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[17px] sm:text-[18px] font-bold text-gray-900">
              Derniers Médicaments Ajoutés
            </h2>
          </div>
          <LatestMedicamentsList medicaments={latestMedicaments} />
        </div>

        {/* Right Column: Quick Access Links */}
        <div className="lg:col-span-4 flex flex-col gap-8 order-1 lg:order-2">
          <QuickAccessLinks />
        </div>
      </div>
    </div>
  );
}
