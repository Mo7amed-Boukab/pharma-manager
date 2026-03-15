import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, description, children, maxWidth = '550px' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div 
        className="bg-white w-full p-8 rounded relative z-10 mx-4" 
        style={{ maxWidth }}
      >
        <div className="flex justify-between items-start mb-2">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
            </button>
        </div>
        {children}
      </div>
    </div>
  );
}
