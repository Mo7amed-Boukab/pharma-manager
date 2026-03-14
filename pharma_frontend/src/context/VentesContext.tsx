import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  annulerVente as annulerVenteApi,
  createVente as createVenteApi,
  fetchVenteDetail as fetchVenteDetailApi,
  fetchVentes as fetchVentesApi,
} from "../api/ventesApi";
import { getApiErrorMessage } from "../api/axiosConfig";
import type {
  Vente,
  VenteDetail,
  VentePayload,
  VenteStatut,
} from "../types/vente";

interface VenteFilters {
  date?: string;
  statut?: VenteStatut;
}

interface VentesContextValue {
  ventes: Vente[];
  loading: boolean;
  error: string | null;
  fetchVentes: (filters?: VenteFilters) => Promise<void>;
  fetchVenteDetail: (id: number) => Promise<VenteDetail | null>;
  createVente: (payload: VentePayload) => Promise<boolean>;
  annulerVente: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const VentesContext = createContext<VentesContextValue | undefined>(
  undefined,
);

export function VentesProvider({ children }: { children: ReactNode }) {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchVentes = useCallback(async (filters?: VenteFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVentesApi(filters);
      setVentes(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Impossible de charger les ventes."));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVenteDetail = useCallback(async (id: number) => {
    setError(null);
    try {
      return await fetchVenteDetailApi(id);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger le détail de la vente."),
      );
      return null;
    }
  }, []);

  const createVente = useCallback(async (payload: VentePayload) => {
    setError(null);
    try {
      const createdVente = await createVenteApi(payload);
      setVentes((currentVentes) => [createdVente, ...currentVentes]);
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Echec de création de la vente."));
      return false;
    }
  }, []);

  const annulerVente = useCallback(async (id: number) => {
    setError(null);
    try {
      await annulerVenteApi(id);
      setVentes((currentVentes) =>
        currentVentes.map((vente) =>
          vente.id === id ? { ...vente, statut: "annulee" } : vente,
        ),
      );
      return true;
    } catch (err) {
      setError(getApiErrorMessage(err, "Echec de l'annulation de la vente."));
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      ventes,
      loading,
      error,
      fetchVentes,
      fetchVenteDetail,
      createVente,
      annulerVente,
      clearError,
    }),
    [
      ventes,
      loading,
      error,
      fetchVentes,
      fetchVenteDetail,
      createVente,
      annulerVente,
      clearError,
    ],
  );

  return (
    <VentesContext.Provider value={value}>{children}</VentesContext.Provider>
  );
}
