import axiosInstance from "./axiosConfig";
import type { Medicament, MedicamentPayload } from "../types/medicament";

interface AlertesResponse {
  count: number;
  results: Medicament[];
}

export async function fetchMedicaments(params?: { search?: string; categorie?: number }) {
  const response = await axiosInstance.get<Medicament[]>("/medicaments/", { params });
  return response.data;
}

export async function createMedicament(data: MedicamentPayload) {
  const response = await axiosInstance.post<Medicament>("/medicaments/", data);
  return response.data;
}

export async function updateMedicament(id: number, data: MedicamentPayload) {
  const response = await axiosInstance.patch<Medicament>(`/medicaments/${id}/`, data);
  return response.data;
}

export async function deleteMedicament(id: number) {
  await axiosInstance.delete(`/medicaments/${id}/`);
}

export async function fetchMedicamentsAlertes() {
  const response = await axiosInstance.get<AlertesResponse>('/medicaments/alertes/');
  return response.data;
}
