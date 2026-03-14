import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import MedicamentsPage from '../pages/MedicamentsPage';
import VentesPage from '../pages/VentesPage';
import CategoriesPage from '../pages/CategoriesPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/medicaments" element={<MedicamentsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/ventes" element={<VentesPage />} />
    </Routes>
  );
}
