import { Eye } from 'lucide-react';

interface Sale {
  id: number;
  reference: string;
  date: string;
  total: string;
  statut: string;
}

interface VentesTableProps {
  sales: Sale[];
}

export default function VentesTable({ sales }: VentesTableProps) {
  return (
    <div className="bg-white border border-[#f0f0f0] rounded overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-gray-200">
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Référence</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total (MAD)</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Détails</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-gray-900">{sale.reference}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm text-gray-500">{sale.date}</span>
              </td>
              <td className="px-6 py-5">
                <span className="text-sm font-medium text-gray-900">{sale.total}</span>
              </td>
              <td className="px-6 py-5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium ${
                  sale.statut === 'Payée' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {sale.statut}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="p-1.5 text-[#00877a] hover:text-indigo-700 transition-colors">
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
