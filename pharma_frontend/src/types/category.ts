export interface Category {
  id: number;
  nom: string;
  description: string | null;
}

export interface CategoryPayload {
  nom: string;
  description?: string | null;
}
