import { Pencil, Plus } from 'lucide-react';

interface Medicament {
  id: number;
  nom: string;
  dci: string;
  dosage: string;
  forme: string;
  price: string;
  stock: number;
}

interface MedicamentCardProps {
  product: Medicament;
  onAddToCart: (p: Medicament) => void;
}

export default function MedicamentCard({ product, onAddToCart }: MedicamentCardProps) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-sm flex flex-col justify-between transition-all group hover:border-[#00877a]/30">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <h3 className="text-[17px] font-bold text-gray-900 leading-tight">{product.nom}</h3>
            <span className="text-[11px] font-bold text-[#00877a] uppercase tracking-wider mt-0.5">{product.dci}</span>
          </div>
          <button className="p-1 text-gray-300 hover:text-gray-600 transition-colors">
            <Pencil size={14} />
          </button>
        </div>
        
        <div className="flex flex-col gap-1.5 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Dosage:</span>
            <span className="text-xs font-bold text-gray-700">{product.dosage}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Forme:</span>
            <span className="text-xs font-bold text-gray-700">{product.forme}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] ${product.stock <= 10 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-8">
        <div className="text-lg font-bold text-gray-900">
          {product.price} <span className="text-xs font-medium ml-0.5 text-gray-400">MAD</span>
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="p-1.5 bg-[#e6f4f1] text-[#00877a] rounded-[4px] hover:bg-[#ccebe5] transition-colors"
        >
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
