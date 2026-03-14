import { BrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./routes/AppRoutes";
import { CategoriesProvider } from "./context/CategoriesContext";

export default function App() {
  return (
    <BrowserRouter>
      <CategoriesProvider>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </CategoriesProvider>
    </BrowserRouter>
  );
}
