import axiosInstance from "./axiosConfig";
import type {
  Vente,
  VenteDetail,
  VentePayload,
  VenteStatut,
} from "../types/vente";

export interface VenteFilters {
  date?: string;
  statut?: VenteStatut;
}

export async function fetchVentes(filters?: VenteFilters) {
  const response = await axiosInstance.get<Vente[]>("/ventes/", {
    params: filters,
  });
  return response.data;
}

export async function fetchVenteDetail(id: number) {
  const response = await axiosInstance.get<VenteDetail>(`/ventes/${id}/`);
  return response.data;
}

export async function createVente(data: VentePayload) {
  const response = await axiosInstance.post<VenteDetail>("/ventes/", data);
  return response.data;
}

export async function annulerVente(id: number) {
  const response = await axiosInstance.post<{ message: string }>(
    `/ventes/${id}/annuler/`,
  );
  return response.data;
}
