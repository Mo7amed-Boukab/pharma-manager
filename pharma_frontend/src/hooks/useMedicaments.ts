import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMedicament as createMedicamentApi,
  deleteMedicament as deleteMedicamentApi,
  fetchMedicaments as fetchMedicamentsApi,
  fetchMedicamentsAlertes,
  updateMedicament as updateMedicamentApi,
} from "../api/medicamentsApi";
import type { MedicamentPayload } from "../types/medicament";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur est survenue.";
}

export function useMedicaments() {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const medicamentsQuery = useQuery({
    queryKey: ["medicaments"],
    queryFn: () => fetchMedicamentsApi(),
    staleTime: 60 * 1000,
  });

  const alertesQuery = useQuery({
    queryKey: ["medicaments", "alertes"],
    queryFn: fetchMedicamentsAlertes,
    staleTime: 30 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: MedicamentPayload) => createMedicamentApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      await queryClient.invalidateQueries({
        queryKey: ["medicaments", "alertes"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MedicamentPayload }) =>
      updateMedicamentApi(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      await queryClient.invalidateQueries({
        queryKey: ["medicaments", "alertes"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMedicamentApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medicaments"] });
      await queryClient.invalidateQueries({
        queryKey: ["medicaments", "alertes"],
      });
    },
  });

  const fetchMedicaments = async () => {
    setMutationError(null);
    await medicamentsQuery.refetch();
  };

  const fetchAlertes = async () => {
    setMutationError(null);
    await alertesQuery.refetch();
  };

  const createMedicament = async (payload: MedicamentPayload) => {
    setMutationError(null);
    try {
      await createMutation.mutateAsync(payload);
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const updateMedicament = async (id: number, payload: MedicamentPayload) => {
    setMutationError(null);
    try {
      await updateMutation.mutateAsync({ id, payload });
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  const deleteMedicament = async (id: number) => {
    setMutationError(null);
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch (error) {
      setMutationError(getErrorMessage(error));
      return false;
    }
  };

  return {
    medicaments: medicamentsQuery.data ?? [],
    alertesCount: alertesQuery.data?.count ?? 0,
    loading:
      medicamentsQuery.isLoading ||
      medicamentsQuery.isFetching ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      mutationError ??
      (medicamentsQuery.error ? getErrorMessage(medicamentsQuery.error) : null),
    fetchMedicaments,
    fetchAlertes,
    createMedicament,
    updateMedicament,
    deleteMedicament,
  };
}
