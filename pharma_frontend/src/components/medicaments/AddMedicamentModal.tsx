import Modal from '../common/Modal';

interface AddMedicamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMedicamentModal({ isOpen, onClose }: AddMedicamentModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Ajouter un Médicament" 
      description="Saisissez les informations complètes du produit."
    >
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nom Commercial</label>
          <input type="text" placeholder="Ex: Doliprane" className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">DCI</label>
          <input type="text" placeholder="Ex: Paracétamol" className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Catégorie</label>
          <select className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a] bg-white">
            <option>Antalgique</option>
            <option>Antibiotique</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Dosage</label>
          <input type="text" placeholder="Ex: 500mg" className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Forme</label>
          <select className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a] bg-white">
            <option>Comprimé</option>
            <option>Sirop</option>
            <option>Injection</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Prix de Vente (MAD)</label>
          <input type="number" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Stock Initial</label>
          <input type="number" placeholder="0" className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" />
        </div>
      </div>
      
      <div className="flex gap-3 mt-8 justify-end">
        <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-[4px] hover:bg-gray-100">
          Annuler
        </button>
        <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-white bg-[#00877a] rounded-[4px] hover:bg-[#007065]">
          Enregistrer
        </button>
      </div>
    </Modal>
  );
}
