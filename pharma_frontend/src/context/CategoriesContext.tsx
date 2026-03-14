import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchCategories as fetchCategoriesApi,
  updateCategory as updateCategoryApi,
} from "../api/categoriesApi";
import { getApiErrorMessage } from "../api/axiosConfig";
import type { Category, CategoryPayload } from "../types/category";

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (payload: CategoryPayload) => Promise<boolean>;
  updateCategory: (id: number, payload: CategoryPayload) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  clearError: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CategoriesContext = createContext<
  CategoriesContextValue | undefined
>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategoriesApi();
      setCategories(data);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de charger les catégories."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (payload: CategoryPayload) => {
      setError(null);
      try {
        await createCategoryApi(payload);
        await fetchCategories();
        return true;
      } catch (err) {
        setError(getApiErrorMessage(err, "Echec de création de la catégorie."));
        return false;
      }
    },
    [fetchCategories],
  );

  const updateCategory = useCallback(
    async (id: number, payload: CategoryPayload) => {
      setError(null);
      try {
        await updateCategoryApi(id, payload);
        await fetchCategories();
        return true;
      } catch (err) {
        setError(
          getApiErrorMessage(err, "Echec de modification de la catégorie."),
        );
        return false;
      }
    },
    [fetchCategories],
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await deleteCategoryApi(id);
        await fetchCategories();
        return true;
      } catch (err) {
        setError(
          getApiErrorMessage(err, "Echec de suppression de la catégorie."),
        );
        return false;
      }
    },
    [fetchCategories],
  );

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      clearError,
    }),
    [
      categories,
      loading,
      error,
      fetchCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      clearError,
    ],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
