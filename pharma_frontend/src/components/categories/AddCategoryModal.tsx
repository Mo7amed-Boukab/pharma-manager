import Modal from '../common/Modal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nouvelle Catégorie" 
      description="Ajoutez une nouvelle catégorie au catalogue."
      maxWidth="450px"
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nom</label>
          <input 
            type="text" 
            placeholder="Ex: Antibiotique" 
            className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Description</label>
          <textarea 
            placeholder="Description..." 
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-[4px] text-sm focus:outline-none focus:border-[#00877a]"
          ></textarea>
        </div>
      </div>
      
      <div className="flex gap-3 mt-8 justify-end">
        <button 
          onClick={onClose}
          className="px-5 py-2 text-sm font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-[4px] hover:bg-gray-100"
        >
          Annuler
        </button>
        <button 
          onClick={onClose}
          className="px-5 py-2 text-sm font-medium text-white bg-[#00877a] rounded-[4px] hover:bg-[#007065]"
        >
          Enregistrer
        </button>
      </div>
    </Modal>
  );
}
