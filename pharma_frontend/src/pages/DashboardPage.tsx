import { Bell } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import LatestMedicamentsList from '../components/dashboard/LatestMedicamentsList';
import QuickAccessLinks from '../components/dashboard/QuickAccessLinks';

export default function DashboardPage() {
  const latestMedicaments = [
    { id: 1, nom: 'Doliprane 1000mg', dci: 'Paracétamol', date: 'Ajouté aujourd\'hui' },
    { id: 2, nom: 'Augmentin 500mg', dci: 'Amoxicilline', date: 'Ajouté hier' },
    { id: 3, nom: 'Ventoline', dci: 'Salbutamol', date: 'Ajouté le 12 Mars' },
    { id: 4, nom: 'Spasfon Lyoc', dci: 'Phloroglucinol', date: 'Ajouté le 10 Mars' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-xl sm:text-2xl py-1 font-semibold tracking-tight text-gray-900">Tableau de Bord</h1>
        <p className="text-xs sm:text-sm text-gray-500">Aperçu global de votre activité.</p>
      </div>
      
      {/* 3 Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 lg:mb-12">
        <StatCard label="Total Médicaments" value="345" />
        <StatCard label="Total Ventes" value="1,280" roundedSm />
        <StatCard label="Catégories" value="12" roundedSm />
      </div>

      {/* Alert Notification */}
      <div className="mb-8 lg:mb-10 p-4 sm:p-6 bg-white border border-[#f0f0f0] rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100">
          <Bell size={20} className="text-gray-900" />
        </div>
        <div>
          <h3 className="text-[16px] sm:text-[17px] font-bold text-gray-900 leading-tight">Alerte de Stock Bas</h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
            Vous avez 8 médicaments qui arrivent à épuisement. Vérifiez votre inventaire pour éviter les ruptures de stock.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* Left Column: Last Added Medicaments */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
          <div className="flex justify-between items-center px-1">
              <h2 className="text-[17px] sm:text-[18px] font-bold text-gray-900">Derniers Médicaments Ajoutés</h2>
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
