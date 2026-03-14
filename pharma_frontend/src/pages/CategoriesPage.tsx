import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import AddCategoryModal from '../components/categories/AddCategoryModal';

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const categories = [
    { id: 1, nom: 'Antalgique', description: 'Médicaments contre la douleur' },
    { id: 2, nom: 'Antibiotique', description: 'Infections bactériennes' },
    { id: 3, nom: 'Anti-inflammatoire', description: 'Inflammation' },
    { id: 4, nom: 'Gastro-entérologie', description: 'Système digestif' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-16">
        <div>
            <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">Gestion des Categories</h1>
            <p className="text-sm text-gray-500">Gérez vos catégories de produits.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00877a] text-white text-sm font-medium rounded-[4px] hover:bg-[#007065] transition-colors"
        >
          <Plus size={18} /> Ajoute une categorie
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative w-full">
         <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
         </div>
         <input 
           type="text" 
           placeholder="Rechercher une catégorie..." 
           className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded-[4px] text-sm focus:outline-none transition-all"
         />
      </div>

      <div className="bg-white border border-[#f0f0f0] rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-900">{cat.nom}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-500">{cat.description || '—'}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <button className="p-1 px-2 text-[#00877a] hover:bg-gray-100 p-2 rounded-[4px] transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1 px-2 text-red-600 hover:bg-gray-100 p-2 rounded-[4px] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
