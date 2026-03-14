import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  fetchCategories as fetchCategoriesApi,
  updateCategory as updateCategoryApi,
} from "../api/categoriesApi";
import type { CategoryPayload } from "../types/category";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur est survenue.";
}

export function useCategories() {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesApi,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => createCategoryApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryPayload }) =>
      updateCategoryApi(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategoryApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const fetchCategories = async () => {
    setMutationError(null);
    await categoriesQuery.refetch();
  };

  const createCategory = async (payload: CategoryPayload) => {
    setMutationError(null);
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const updateCategory = async (id: number, payload: CategoryPayload) => {
    setMutationError(null);
    try {
      await updateMutation.mutateAsync({ id, payload });
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const deleteCategory = async (id: number) => {
    setMutationError(null);
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const clearError = () => {
    setMutationError(null);
  };

  return {
    categories: categoriesQuery.data ?? [],
    loading:
      categoriesQuery.isLoading ||
      categoriesQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      mutationError ??
      (categoriesQuery.error ? getErrorMessage(categoriesQuery.error) : null),
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
}
