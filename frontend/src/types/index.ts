export interface Banque {
  id: number;
  rib: string;
  nom_banque: string;
}

export interface Transaction {
id: number;
  type: 'Entrée' | 'Sortie';
  nature: 'Externe' | 'Interne';
  date_trans: string;
  libelle: string;
  montant: number;
  tiers: string;
  pdf_path: string;
  banque_id: number;
  solde_initial: number;
  solde_final: number;
  leveling_id?: string;
  banque?: Banque;
}

// Nouvelle interface pour la réponse paginée du backend
export interface PaginatedTransactions {
  total: number;
  page: number;
  size: number;
  results: Transaction[];
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}