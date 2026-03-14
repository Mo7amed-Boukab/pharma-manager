import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createMedicament as createMedicamentApi,
  deleteMedicament as deleteMedicamentApi,
  fetchMedicamentsAlertes,
  fetchMedicaments as fetchMedicamentsApi,
  updateMedicament as updateMedicamentApi,
} from "../api/medicamentsApi";
import { getApiErrorMessage } from "../api/axiosConfig";
import type { Medicament, MedicamentPayload } from "../types/medicament";

interface MedicamentsContextValue {
  medicaments: Medicament[];
  alertesCount: number;
  loading: boolean;
  error: string | null;
  fetchMedicaments: (params?: { search?: string; categorie?: number }) => Promise<void>;
  fetchAlertes: () => Promise<void>;
  createMedicament: (payload: MedicamentPayload) => Promise<boolean>;
  updateMedicament: (id: number, payload: MedicamentPayload) => Promise<boolean>;
  deleteMedicament: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const MedicamentsContext = createContext<
  MedicamentsContextValue | undefined
>(undefined);

export function MedicamentsProvider({ children }: { children: ReactNode }) {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [alertesCount, setAlertesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchMedicaments = useCallback(
    async (params?: { search?: string; categorie?: number }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMedicamentsApi(params);
        setMedicaments(data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Impossible de charger les médicaments."));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchAlertes = useCallback(async () => {
    try {
      const data = await fetchMedicamentsAlertes();
      setAlertesCount(data.count);
    } catch {
      setAlertesCount(0);
    }
  }, []);

  const createMedicament = useCallback(
    async (payload: MedicamentPayload) => {
      setError(null);
      try {
        await createMedicamentApi(payload);
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, "Echec de création du médicament."));
        return false;
      }
    },
    [],
  );

  const updateMedicament = useCallback(
    async (id: number, payload: MedicamentPayload) => {
      setError(null);
      try {
        await updateMedicamentApi(id, payload);
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, "Echec de modification du médicament."));
        return false;
      }
    },
    [],
  );

  const deleteMedicament = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await deleteMedicamentApi(id);
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, "Echec de suppression du médicament."));
        return false;
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      medicaments,
      alertesCount,
      loading,
      error,
      fetchMedicaments,
      fetchAlertes,
      createMedicament,
      updateMedicament,
      deleteMedicament,
      clearError,
    }),
    [
      medicaments,
      alertesCount,
      loading,
      error,
      fetchMedicaments,
      fetchAlertes,
      createMedicament,
      updateMedicament,
      deleteMedicament,
      clearError,
    ],
  );

  return (
    <MedicamentsContext.Provider value={value}>
      {children}
    </MedicamentsContext.Provider>
  );
}
