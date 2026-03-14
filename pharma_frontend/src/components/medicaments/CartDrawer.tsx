import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  nom: string;
  price: number;
  qte: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: number) => void;
  total: number;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove, total }: CartDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/10 z-40 transition-opacity" onClick={onClose} />
      )}
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white z-50 border-l border-gray-100 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
           <div className="p-8 border-b border-gray-100 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-gray-900" />
                <h3 className="text-lg font-bold text-gray-900">Panier</h3>
             </div>
             <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
             </button>
           </div>
           
           <div className="flex-grow overflow-y-auto p-8">
             {cart.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                       <div>
                         <p className="text-sm font-bold text-gray-900">{item.nom}</p>
                         <p className="text-sm text-[#00877a]">{item.price.toFixed(2)} MAD</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-[4px]">
                             <button className="text-gray-400 hover:text-gray-600"><Minus size={12} /></button>
                             <span className="text-sm font-bold text-gray-900">{item.qte}</span>
                             <button className="text-gray-400 hover:text-gray-600"><Plus size={12} /></button>
                          </div>
                          <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30 mt-20">
                   <ShoppingCart size={48} className="text-gray-900" />
                   <p className="text-sm font-medium">Votre panier est vide</p>
                </div>
             )}
           </div>
           
           <div className="p-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-[#00877a]">{total.toFixed(2)} MAD</span>
              </div>
              <button className="w-full py-2.5 bg-[#00877a] text-white rounded">
                Valider la vente
              </button>
           </div>
        </div>
      </div>
    </>
  );
}
