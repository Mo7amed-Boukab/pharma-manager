import axiosInstance from "./axiosConfig";
import type { Category, CategoryPayload } from "../types/category";

export async function fetchCategories() {
  const response = await axiosInstance.get<Category[]>("/categories/");
  return response.data;
}

export async function createCategory(data: CategoryPayload) {
  const response = await axiosInstance.post<Category>("/categories/", data);
  return response.data;
}

export async function updateCategory(id: number, data: CategoryPayload) {
  const response = await axiosInstance.patch<Category>(
    `/categories/${id}/`,
    data,
  );
  return response.data;
}

export async function deleteCategory(id: number) {
  await axiosInstance.delete(`/categories/${id}/`);
}
