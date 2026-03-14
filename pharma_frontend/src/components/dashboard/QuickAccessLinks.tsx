import { Link } from 'react-router-dom';
import { Pill, ShoppingCart, LayoutGrid, ChevronRight } from 'lucide-react';

export default function QuickAccessLinks() {
  const links = [
    { name: 'Medicaments', path: '/medicaments', icon: Pill },
    { name: 'Ventes', path: '/ventes', icon: ShoppingCart },
    { name: 'Categories', path: '/categories', icon: LayoutGrid },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[18px] font-bold text-gray-900 mb-4">Accès Rapide</h2>
      {links.map((link) => (
        <Link to={link.path} key={link.path} className="group">
          <div className="p-4 bg-white border border-[#f0f0f0] rounded hover:border-[#00877a]/30 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="p-2.5 bg-gray-50 rounded-[6px] group-hover:bg-[#e6f4f1] transition-colors">
                  <link.icon size={20} className="text-gray-400 group-hover:text-[#00877a]" />
                </div>
                <span className="text-[17px] font-semibold text-gray-900">{link.name}</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-[#00877a] transition-all transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
