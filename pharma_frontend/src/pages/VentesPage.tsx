import { Search } from 'lucide-react';
import VentesTable from '../components/ventes/VentesTable';

export default function VentesPage() {
  const sales = [
    { id: 1, reference: 'VNT-2026-0001', date: '2026-03-14 10:30', total: '120.50', statut: 'Payée' },
    { id: 2, reference: 'VNT-2026-0002', date: '2026-03-14 11:15', total: '45.00', statut: 'Payée' },
    { id: 3, reference: 'VNT-2026-0003', date: '2026-03-14 12:45', total: '210.00', statut: 'Annulée' },
    { id: 4, reference: 'VNT-2026-0004', date: '2026-03-14 13:20', total: '85.20', statut: 'Payée' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div>
            <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">Historique des Ventes</h1>
            <p className="text-sm text-gray-500">Consultez et suivez vos transactions.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative w-full">
         <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
         </div>
         <input 
           type="text" 
           placeholder="Rechercher une vente par référence ou client..." 
           className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded-[4px] text-sm focus:outline-none transition-all"
         />
      </div>

      <VentesTable sales={sales} />
    </div>
  );
}
