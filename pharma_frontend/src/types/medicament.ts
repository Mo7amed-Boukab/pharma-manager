import type { Category } from "./category";

export interface Medicament {
  id: number;
  nom: string;
  dci: string;
  categorie: number;
  categorie_detail?: Category;
  forme: string;
  dosage: string;
  prix_achat: string;
  prix_vente: string;
  stock_actuel: number;
  stock_minimum: number;
  date_expiration: string;
  ordonnance_requise: boolean;
  date_creation: string;
  est_actif: boolean;
  est_en_alerte: boolean;
}

export interface MedicamentPayload {
  nom: string;
  dci?: string;
  categorie: number;
  forme: string;
  dosage: string;
  prix_achat: number | string;
  prix_vente: number | string;
  stock_actuel?: number;
  stock_minimum?: number;
  date_expiration: string;
  ordonnance_requise?: boolean;
}
