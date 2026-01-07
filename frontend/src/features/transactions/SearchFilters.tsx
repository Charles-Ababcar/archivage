import React, { useState } from 'react';
import { useGetTransactionsQuery, useDeleteTransactionMutation } from '../../api/transactionApi';
import { Table } from '../../components/ui/Table';
import { Loader } from '../../components/ui/Loader';
import { AmountBadge } from '../../components/ui/AmountBadge';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  Trash2, 
  Eye,
  Search,
  Filter,
  X
} from 'lucide-react';

const SearchTransactions: React.FC = () => {
  const [filters, setFilters] = useState({ 
    min_m: '', 
    max_m: '' 
  });
  
  const { data: transactions, isLoading, refetch } = useGetTransactionsQuery({
    min_m: filters.min_m ? parseFloat(filters.min_m) : undefined,
    max_m: filters.max_m ? parseFloat(filters.max_m) : undefined
  });

  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDownload = (path: string) => {
    window.open(`http://localhost:8000/${path}`, '_blank');
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

  const clearFilters = () => {
    setFilters({ min_m: '', max_m: '' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader/>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Recherche par montant</h1>
          <p className="text-xs text-slate-500">
            Filtrer les transactions par plage de montant
          </p>
        </div>
        
        {(filters.min_m || filters.max_m) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            icon={<X size={12} />}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Les 2 champs de recherche côte à côte (comme l'original) */}
      <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Montant minimum (FCFA)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={filters.min_m}
              onChange={e => setFilters({...filters, min_m: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Montant maximum (FCFA)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="∞"
              value={filters.max_m}
              onChange={e => setFilters({...filters, max_m: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Liste compacte des résultats */}
      <div className="space-y-2">
        {transactions?.map((t) => (
          <div 
            key={t.id} 
            className="bg-white border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Informations principales */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <AmountBadge
                    amount={t.montant}
                    type={t.type as 'Entrée' | 'Sortie'}
                    currency="FCFA"
                    compact
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {t.libelle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{t.tiers}</span>
                      <span>•</span>
                      <span>
                        {new Date(t.date_trans).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        #{t.id.toString().padStart(4, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-3">
                <Button
                  variant="ghost"
                  className="p-1.5 hover:bg-blue-50"
                  onClick={() => handleDownload(t.pdf_path || '')}
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
        ))}
      </div>

      {/* État vide */}
      {!isLoading && transactions?.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
          <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-slate-700 mb-1">
            {filters.min_m || filters.max_m ? "Aucune transaction trouvée" : "Aucune transaction"}
          </h3>
          <p className="text-xs text-slate-500">
            {filters.min_m || filters.max_m 
              ? "Aucune transaction ne correspond aux critères" 
              : "Utilisez les filtres ci-dessus pour rechercher"}
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
                const transaction = transactions?.find(t => t.id === transactionToDelete);
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

export default SearchTransactions;