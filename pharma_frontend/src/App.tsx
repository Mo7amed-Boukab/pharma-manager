import { BrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import { CategoriesProvider } from "./context/CategoriesContext";
import { MedicamentsProvider } from "./context/MedicamentsContext";

export default function App() {
  return (
    <BrowserRouter>
      <CategoriesProvider>
        <MedicamentsProvider>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </MedicamentsProvider>
      </CategoriesProvider>
    </BrowserRouter>
  );
}
