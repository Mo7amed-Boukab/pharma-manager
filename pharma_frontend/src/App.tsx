import { BrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import { CategoriesProvider } from "./context/CategoriesContext";
import { MedicamentsProvider } from "./context/MedicamentsContext";
import { VentesProvider } from "./context/VentesContext";

export default function App() {
  return (
    <BrowserRouter>
      <CategoriesProvider>
        <MedicamentsProvider>
          <VentesProvider>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </VentesProvider>
        </MedicamentsProvider>
      </CategoriesProvider>
    </BrowserRouter>
  );
}
