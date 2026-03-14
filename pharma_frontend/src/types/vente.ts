export type VenteStatut = "en_cours" | "completee" | "annulee";

export interface Vente {
  id: number;
  reference: string;
  date_vente: string;
  total_ttc: string;
  statut: VenteStatut;
}

export interface LigneVente {
  id: number;
  medicament: number;
  medicament_nom: string;
  quantite: number;
  prix_unitaire: string;
  sous_total: string;
}

export interface VenteDetail extends Vente {
  notes: string | null;
  lignes: LigneVente[];
}

export interface LigneVentePayload {
  medicament: number;
  quantite: number;
}

export interface VentePayload {
  statut?: VenteStatut;
  notes?: string;
  lignes: LigneVentePayload[];
}
