import { useContext } from 'react';
import { VentesContext } from '../context/VentesContext';

export function useVentes() {
  const context = useContext(VentesContext);
  if (!context) {
    throw new Error('useVentes must be used within VentesProvider');
  }
  return context;
}
