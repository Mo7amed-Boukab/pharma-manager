import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import MedicamentsPage from "../pages/MedicamentsPage";
import VentesPage from "../pages/VentesPage";
import CategoriesPage from "../pages/CategoriesPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicaments" element={<MedicamentsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/ventes" element={<VentesPage />} />
      </Route>
    </Routes>
  );
}
