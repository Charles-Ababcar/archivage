import React, { useState } from "react";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "../../api/transactionApi";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

const TransactionTable: React.FC = () => {
  // 1. Gestion de la pagination locale
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // 2. Appel API avec les nouveaux paramètres
  const { data, isLoading, refetch } = useGetTransactionsQuery({
    page,
    size: pageSize,
  });

  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

 const handleDownload = (path: string) => {
  if (!path) return; // Sécurité supplémentaire
  window.open(`http://localhost:8000/${path}`, "_blank");
};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete).unwrap();
        refetch();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        setShowDeleteModal(false);
        setTransactionToDelete(null);
      }
    }
  };

  // 3. Accès sécurisé aux résultats paginés
  const transactions = data?.results || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Filtrage local (pour la recherche instantanée sur la page actuelle)
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tiers.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Transactions</h1>
          <p className="text-xs text-slate-500">
            {totalItems} opérations au total
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={typeFilter === "all" ? "primary" : "outline"}
            onClick={() => {
              setTypeFilter("all");
              setPage(1);
            }}
          >
            Tous
          </Button>
          <Button
            variant={typeFilter === "Entrée" ? "success" : "outline"}
            onClick={() => {
              setTypeFilter("Entrée");
              setPage(1);
            }}
          >
            Entrées
          </Button>
          <Button
            variant={typeFilter === "Sortie" ? "danger" : "outline"}
            onClick={() => {
              setTypeFilter("Sortie");
              setPage(1);
            }}
          >
            Sorties
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
        <Input
          type="text"
          placeholder="Rechercher sur cette page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 text-sm py-1.5"
          label={""}
        />
      </div>

      {/* Liste compacte */}
      <div className="space-y-2">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter ${
                      t.nature === "Interne"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {t.nature}
                  </span>
                  <div
                    className={`p-1 rounded ${t.type === "Entrée" ? "bg-emerald-100" : "bg-rose-100"}`}
                  >
                    {t.type === "Entrée" ? (
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {t.libelle}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <User className="w-3 h-3" />
                        {t.tiers}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(t.date_trans).toLocaleDateString("fr-FR")}
                      </span>
                      {t.banque && (
                        <span className="text-blue-700 font-medium ml-1">
                          ({t.banque.nom_banque})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-3">
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${t.type === "Entrée" ? "text-emerald-700" : "text-rose-700"}`}
                  >
                    {t.type === "Entrée" ? "+" : "-"}{" "}
                    {formatCurrency(t.montant)}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">
                    Solde:{" "}
                    <span className="text-slate-600 font-bold">
                      {formatCurrency(t.solde_final)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* On n'affiche le bouton Eye que si pdf_path existe et n'est pas vide */}
                  {t.pdf_path && t.pdf_path.trim() !== "" && (
                    <Button
                      variant="ghost"
                      className="p-1.5 hover:bg-blue-50 transition-colors"
                      onClick={() => handleDownload(t.pdf_path)}
                      title="Voir le justificatif"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="p-1.5 hover:bg-rose-50 transition-colors"
                    onClick={() => handleDeleteClick(t.id)}
                    title="Supprimer la transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Navigation de Pagination */}
      <div className="flex items-center justify-between px-2 py-4 border-t">
        <span className="text-xs text-slate-500 font-medium">
          Page {page} sur {totalPages || 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Suivant <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Modal de suppression (Simplifié pour la démo) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xs w-full p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Confirmer la suppression ?
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={confirmDelete}
                isLoading={isDeleting}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
