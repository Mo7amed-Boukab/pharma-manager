import { Pill, Clock } from 'lucide-react';

interface LatestMedicament {
  id: number;
  nom: string;
  dci: string;
  date: string;
}

interface LatestMedicamentsListProps {
  medicaments: LatestMedicament[];
}

export default function LatestMedicamentsList({ medicaments }: LatestMedicamentsListProps) {
  return (
    <div className="bg-white border border-[#f0f0f0] rounded overflow-hidden">
      <div className="divide-y divide-gray-50">
        {medicaments.map((med) => (
          <div key={med.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-center gap-3 sm:gap-4 flex-grow min-w-0">
              <div className="p-2 sm:p-2.5 bg-gray-50 rounded-[6px] group-hover:bg-[#e6f4f1] transition-colors flex-shrink-0">
                <Pill size={18} className="text-gray-400 group-hover:text-[#00877a]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{med.nom}</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-[#00877a] lg:text-gray-400 uppercase tracking-wider truncate">{med.dci}</p>
              </div>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px]">
                <Clock size={12} className="hidden xs:block" />
                <span className="whitespace-nowrap">{med.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
