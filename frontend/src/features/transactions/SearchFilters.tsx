// import React, { useState } from 'react';
// import { useGetTransactionsQuery, useDeleteTransactionMutation } from '../../api/transactionApi';
// import { Loader } from '../../components/ui/Loader';
// import { Button } from '../../components/ui/Button';
// import { 
//   Trash2, 
//   Eye,
//   Search,
//   X,
//   ArrowDownLeft,
//   ArrowUpRight,
//   Building,
//   Activity
// } from 'lucide-react';

// const SearchTransactions: React.FC = () => {
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState({ 
//     min_m: '', 
//     max_m: '',
//     start_date: '',
//     end_date: ''
//   });
  
//   const { data: transactions, isLoading, refetch } = useGetTransactionsQuery({
//     min_m: filters.min_m ? parseFloat(filters.min_m) : undefined,
//     max_m: filters.max_m ? parseFloat(filters.max_m) : undefined,
//     page:pageXOffset,size:10
//   });

//   const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
//   const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const handleDownload = (path: string) => {
//     window.open(`http://localhost:8000/${path}`, '_blank');
//   };

//   const handleDeleteClick = (id: number) => {
//     setTransactionToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (transactionToDelete) {
//       try {
//         await deleteTransaction(transactionToDelete).unwrap();
//         refetch();
//       } catch (error) {
//         console.error("Erreur lors de la suppression:", error);
//       } finally {
//         setShowDeleteModal(false);
//         setTransactionToDelete(null);
//       }
//     }
//   };

//   const clearFilters = () => setFilters({ min_m: '', max_m: '', start_date: '', end_date: '' });

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
//   };

//   if (isLoading) return <div className="flex justify-center p-10"><Loader/></div>;

//   return (
//     <div className="space-y-6">
//       {/* En-tête (Cahier des charges 4.5) */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight">Recherche par montant</h1>
//           <p className="text-xs text-slate-500 font-medium">Rechercher par montant exact ou par intervalle</p>
//         </div>
//         {(filters.min_m || filters.max_m) && (
//           <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs gap-1">
//             <X size={14} /> Effacer les filtres
//           </Button>
//         )}
//       </div>

//       {/* Inputs de filtrage */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Montant Minimum</label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input
//               type="number"
//               placeholder="Ex: 100000"
//               value={filters.min_m}
//               onChange={e => setFilters({...filters, min_m: e.target.value})}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//             />
//           </div>
//         </div>
//         <div className="space-y-1.5">
//           <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Montant Maximum</label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//             <input
//               type="number"
//               placeholder="Ex: 500000"
//               value={filters.max_m}
//               onChange={e => setFilters({...filters, max_m: e.target.value})}
//               className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Liste des Résultats (Conforme 4.5) */}
//       <div className="space-y-3">
//         {transactions?.map((t) => (
//           <div key={t.id} className="group bg-white border border-slate-100 p-4 rounded-2xl hover:shadow-md hover:border-blue-100 transition-all">
//             <div className="flex items-center justify-between gap-4">
              
//               <div className="flex items-center gap-4 flex-1">
//                 {/* Icône de type */}
//                 <div className={`p-3 rounded-xl ${t.type === 'Entrée' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
//                   {t.type === 'Entrée' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-sm font-bold text-slate-800 truncate">{t.libelle}</span>
//                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
//                       t.nature === 'Interne' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {t.nature}
//                     </span>
//                   </div>
                  
//                   <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] font-medium text-slate-500">
//                     <span className="flex items-center gap-1"><Building size={12}/> {t.banque?.nom_banque}</span>
//                     <span className="text-slate-300">|</span>
//                     <span>{t.type === 'Entrée' ? 'Provenance' : 'Destination'}: <b className="text-slate-700">{t.tiers}</b></span>
//                     <span className="text-slate-300">|</span>
//                     <span>{new Date(t.date_trans).toLocaleDateString('fr-FR')}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Montants et Actions */}
//               <div className="flex items-center gap-6">
//                 <div className="text-right">
//                   <p className={`text-base font-black ${t.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600'}`}>
//                     {t.type === 'Entrée' ? '+' : '-'} {formatCurrency(t.montant)}
//                   </p>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
//                     Solde Final: {formatCurrency(t.solde_final)}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => handleDownload(t.pdf_path)}
//                     className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                     title="Voir Justificatif"
//                   >
//                     <Eye size={18} />
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteClick(t.id)}
//                     className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* État vide */}
//       {transactions?.length === 0 && (
//         <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
//           <Activity className="mx-auto text-slate-300 mb-4" size={48} />
//           <p className="text-slate-500 font-bold">Aucune transaction dans cette tranche de prix</p>
//           <p className="text-xs text-slate-400 mt-1">Ajustez vos montants min/max pour voir plus de résultats</p>
//         </div>
//       )}

//       {/* Modal suppression (omitted for brevity, keep your existing code here) */}
//     </div>
//   );
// };

// export default SearchTransactions;


import React, { useState } from 'react';
import { useGetTransactionsQuery, useDeleteTransactionMutation } from '../../api/transactionApi';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { 
  Trash2, Eye, Search, X, ArrowDownLeft, ArrowUpRight, 
  Building, ChevronLeft, ChevronRight, Calendar 
} from 'lucide-react';

const SearchTransactions: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ 
    min_m: '', 
    max_m: '',
    start_date: '',
    end_date: ''
  });
  
  const { data, isLoading, refetch } = useGetTransactionsQuery({
    min_m: filters.min_m ? parseFloat(filters.min_m) : undefined,
    max_m: filters.max_m ? parseFloat(filters.max_m) : undefined,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
    page: page,
    size: 10
  });

  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleDownload = (path: string) => window.open(`http://localhost:8000/${path}`, '_blank');
  const clearFilters = () => {
    setFilters({ min_m: '', max_m: '', start_date: '', end_date: '' });
    setPage(1);
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader/></div>;

  const totalPages = Math.ceil((data?.total || 0) / 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Recherche Avancée</h1>
        {(filters.min_m || filters.max_m || filters.start_date || filters.end_date) && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
            Effacer tout
          </Button>
        )}
      </div>

      {/* Grille de Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Montant Min</label>
          <input type="number" value={filters.min_m} onChange={e => {setFilters({...filters, min_m: e.target.value}); setPage(1);}} className="w-full p-2 text-sm rounded-xl border outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Montant Max</label>
          <input type="number" value={filters.max_m} onChange={e => {setFilters({...filters, max_m: e.target.value}); setPage(1);}} className="w-full p-2 text-sm rounded-xl border outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 italic text-blue-600">Depuis le</label>
          <input type="date" value={filters.start_date} onChange={e => {setFilters({...filters, start_date: e.target.value}); setPage(1);}} className="w-full p-2 text-sm rounded-xl border border-blue-100 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-1 italic text-blue-600">Jusqu'au</label>
          <input type="date" value={filters.end_date} onChange={e => {setFilters({...filters, end_date: e.target.value}); setPage(1);}} className="w-full p-2 text-sm rounded-xl border border-blue-100 outline-none" />
        </div>
      </div>

      {/* Liste des Résultats */}
      <div className="space-y-2">
        {data?.results.map((t) => (
          <div key={t.id} className="bg-white border p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
               <div className={`p-2 rounded-lg ${t.type === 'Entrée' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {t.type === 'Entrée' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
               </div>
               <div className="truncate">
                  <p className="text-sm font-bold text-slate-800">{t.libelle}</p>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                    {new Date(t.date_trans).toLocaleDateString()} • {t.banque?.nom_banque}
                  </p>
               </div>
            </div>
            <div className="text-right flex items-center gap-4">
               <div>
                  <p className={`text-sm font-black ${t.type === 'Entrée' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {t.montant.toLocaleString()} F
                  </p>
                  <p className="text-[9px] font-bold text-slate-400">SOLDE: {t.solde_final.toLocaleString()}</p>
               </div>
               <button onClick={() => handleDownload(t.pdf_path || "")} className="p-2 hover:bg-slate-100 rounded-lg"><Eye size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-4 border-t">
        <span className="text-xs text-slate-500 font-medium">Total: <b>{data?.total}</b> opérations</span>
        <div className="flex items-center gap-3">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="p-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronLeft size={18}/>
          </button>
          <span className="text-xs font-black">Page {page} / {totalPages || 1}</span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="p-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-30"
          >
            <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchTransactions;