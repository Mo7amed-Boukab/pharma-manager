import { useState } from 'react';
import { Search, Plus, ChevronDown } from 'lucide-react';
import MedicamentCard from '../components/medicaments/MedicamentCard';
import CartDrawer from '../components/medicaments/CartDrawer';
import AddMedicamentModal from '../components/medicaments/AddMedicamentModal';

export default function MedicamentsPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const categories = ['Tous', 'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Gastro-entérologie'];

  const products = [
    { id: 1, nom: 'Doliprane', dci: 'Paracétamol', dosage: '1000mg', forme: 'Comprimé', price: '20.00', stock: 145, categorie: 'Antalgique' },
    { id: 2, nom: 'Aspegic', dci: 'Acide acétylsalicylique', dosage: '1000mg', forme: 'Poudre', price: '32.00', stock: 50, categorie: 'Antalgique' },
    { id: 3, nom: 'Fervex', dci: 'Paracétamol + Phéniramine', dosage: 'Adulte', forme: 'Sachet', price: '45.00', stock: 24, categorie: 'Antalgique' },
    { id: 4, nom: 'Smecta', dci: 'Diosmectite', dosage: '3g', forme: 'Sachet', price: '28.00', stock: 8, categorie: 'Gastro-entérologie' },
    { id: 5, nom: 'Spasfon', dci: 'Phloroglucinol', dosage: '80mg', forme: 'Comprimé Lyoc', price: '35.00', stock: 68, categorie: 'Bile' },
    { id: 6, nom: 'Betadine', dci: 'Povidone iodée', dosage: '10%', forme: 'Solution dermique', price: '29.50', stock: 41, categorie: 'Antiseptique' },
  ];

  const [cart, setCart] = useState<{id: number, nom: string, price: number, qte: number}[]>([]);

  const addToCart = (p: any) => {
    setCart(prev => {
        const exists = prev.find(item => item.id === p.id);
        if (exists) return prev.map(item => item.id === p.id ? {...item, qte: item.qte + 1} : item);
        return [...prev, { id: p.id, nom: p.nom, price: parseFloat(p.price), qte: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qte, 0);

  return (
    <div className="p-8 relative font-sans">
      <div className="flex justify-between items-center mb-16">
        <div>
           <h1 className="text-2xl py-1 font-semibold tracking-tight text-gray-900">Gestion des Medicaments</h1>
           <p className="text-sm text-gray-500">Gérez votre stock au quotidien.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00877a] text-white text-sm font-medium rounded-[4px] hover:bg-[#007065] transition-colors"
        >
           <Plus size={18} /> Ajoute un medicament
        </button>
      </div>
      
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="p-6 border border-[#f0f0f0] rounded">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-gray-900">Filtres</h3>
              <button className="text-xs font-medium text-gray-400 hover:text-gray-600">Reset</button>
            </div>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-900">Catégories</span>
                <ChevronDown size={14} className="text-gray-300" />
              </div>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      defaultChecked={cat === 'Tous'} 
                      className="w-4 h-4 rounded-[3px] border-gray-300 text-[#00877a] focus:ring-[#00877a]"
                    />
                    <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-grow">
          <div className="mb-8 relative">
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
             </div>
             <input 
               type="text" 
               placeholder="Rechercher par nom ou DCI..." 
               className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#f0f0f0] rounded-sm text-sm focus:outline-none transition-all"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.map(p => (
               <MedicamentCard 
                 key={p.id} 
                 product={p} 
                 onAddToCart={addToCart} 
               />
             ))}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
        total={total} 
      />

      {/* Add Medicament Modal */}
      <AddMedicamentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
