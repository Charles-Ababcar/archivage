export interface Banque {
  id: number;
  rib: string;
  nom_banque: string;
}

export interface Transaction {
  id: number;
  banque_id: number;
  type: 'Entrée' | 'Sortie';
  date_trans: string;
  libelle: string;
  montant: number;
  tiers: string;
  pdf_path: string;
banque?: Banque;
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}