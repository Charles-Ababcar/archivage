import React, { useState } from "react";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "../../api/transactionApi";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import { AmountBadge } from "../../components/ui/AmountBadge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { 
  FileText, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye,
  Calendar,
  User,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";

const TransactionTable: React.FC = () => {
  const { data: transactions, isLoading, refetch } = useGetTransactionsQuery({});
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const handleDownload = (path: string) => {
    window.open(`http://localhost:8000/${path}`, "_blank");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
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

  const getTransactionDetails = (id: number) => {
    return transactions?.find(t => t.id === id);
  };

  // Filtrage
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchTerm === "" || 
      transaction.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.tiers.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* En-tête ultra-compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Transactions</h1>
          <p className="text-xs text-slate-500">
            {transactions?.length || 0} opérations
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant={typeFilter === "all" ? "primary" : "outline"}
            onClick={() => setTypeFilter("all")}
          >
            Tous
          </Button>
          <Button
            variant={typeFilter === "Entrée" ? "success" : "outline"}
            onClick={() => setTypeFilter("Entrée")}
          >
            Entrées
          </Button>
          <Button
            variant={typeFilter === "Sortie" ? "danger" : "outline"}
            onClick={() => setTypeFilter("Sortie")}
          >
            Sorties
          </Button>
        </div>
      </div>

      {/* Barre de recherche minimaliste */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
        <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm py-1.5" label={""}        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Liste compacte */}
      <div className="space-y-2">
        {filteredTransactions?.map((t) => (
          <div 
            key={t.id} 
            className="bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              {/* Colonne gauche : Type et Libellé */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1 rounded ${t.type === "Entrée" ? "bg-emerald-100" : "bg-rose-100"}`}>
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
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-slate-500 flex items-center gap-0.5">
                        <User className="w-3 h-3" />
                        {t.tiers}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(t.date_trans).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                      {t.banque && (
                        <>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-blue-700 truncate max-w-25">
                            {t.banque.nom_banque}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Montant et Actions */}
              <div className="flex items-center gap-2 ml-3">
                <div className="text-right">
                  <div className={`text-sm font-semibold ${t.type === "Entrée" ? "text-emerald-700" : "text-rose-700"}`}>
                    {t.type === "Entrée" ? "+" : "-"} {formatCurrency(t.montant)}
                  </div>
                  <div className="text-xs text-slate-500">
                    #{t.id.toString().padStart(4, '0')}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    className="p-1.5 hover:bg-blue-50"
                    onClick={() => handleDownload(t.pdf_path || "")}
                    title="Voir PDF"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="p-1.5 hover:bg-rose-50"
                    onClick={() => handleDeleteClick(t.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* État vide minimaliste */}
      {filteredTransactions?.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-slate-700 mb-1">
            {searchTerm ? "Aucun résultat" : "Aucune transaction"}
          </h3>
          <p className="text-xs text-slate-500">
            {searchTerm ? "Essayez d'autres termes" : "Ajoutez votre première opération"}
          </p>
        </div>
      )}

      {/* Modal de suppression compact */}
      {showDeleteModal && transactionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xs w-full p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-rose-100 rounded-lg">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">
                Supprimer ?
              </h3>
            </div>

            <div className="text-xs text-slate-600 mb-4">
              {(() => {
                const transaction = getTransactionDetails(transactionToDelete);
                return transaction ? (
                  <div className="space-y-1.5">
                    <p><span className="font-medium">Libellé:</span> {transaction.libelle}</p>
                    <p><span className="font-medium">Montant:</span> {formatCurrency(transaction.montant)}</p>
                    <p><span className="font-medium">Date:</span> {new Date(transaction.date_trans).toLocaleDateString('fr-FR')}</p>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTransactionToDelete(null);
                }}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 text-xs"
                onClick={confirmDelete}
                isLoading={isDeleting}
              >
                {isDeleting ? "..." : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;