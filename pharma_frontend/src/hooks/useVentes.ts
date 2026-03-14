import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  annulerVente as annulerVenteApi,
  createVente as createVenteApi,
  fetchVenteDetail as fetchVenteDetailApi,
  fetchVentes as fetchVentesApi,
  type VenteFilters,
} from "../api/ventesApi";
import type { VentePayload } from "../types/vente";

interface UseVentesOptions {
  enabled?: boolean;
  filters?: VenteFilters;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur est survenue.";
}

export function useVentes(options?: UseVentesOptions) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);
  const filters = options?.filters;
  const enabled = options?.enabled ?? true;

  const ventesQuery = useQuery({
    queryKey: ["ventes", filters ?? {}],
    queryFn: () => fetchVentesApi(filters),
    enabled,
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: VentePayload) => createVenteApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ventes"] });
      await queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      await queryClient.invalidateQueries({ queryKey: ["medicaments", "alertes"] });
    },
  });

  const annulerMutation = useMutation({
    mutationFn: (id: number) => annulerVenteApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ventes"] });
      await queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      await queryClient.invalidateQueries({ queryKey: ["medicaments", "alertes"] });
    },
  });

  const fetchVentes = async (targetFilters?: VenteFilters) => {
    setMutationError(null);
    if (targetFilters) {
      await queryClient.fetchQuery({
        queryKey: ["ventes", targetFilters],
        queryFn: () => fetchVentesApi(targetFilters),
      });
      return;
    }
    await ventesQuery.refetch();
  };

  const fetchVenteDetail = async (id: number) => {
    setMutationError(null);
    try {
      return await queryClient.fetchQuery({
        queryKey: ["ventes", "detail", id],
        queryFn: () => fetchVenteDetailApi(id),
        staleTime: 30 * 1000,
      });
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return null;
    }
  };

  const createVente = async (payload: VentePayload) => {
    setMutationError(null);
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const annulerVente = async (id: number) => {
    setMutationError(null);
    try {
      await annulerMutation.mutateAsync(id);
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
    ventes: ventesQuery.data ?? [],
    loading:
      ventesQuery.isLoading ||
      ventesQuery.isFetching ||
      createMutation.isPending ||
      annulerMutation.isPending,
    error: mutationError ?? (ventesQuery.error ? getErrorMessage(ventesQuery.error) : null),
    fetchVentes,
    fetchVenteDetail,
    createVente,
    annulerVente,
    clearError,
  };
}
