import React from 'react';
import { useGetTransactionsQuery } from '../../api/transactionApi';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { Landmark, ArrowLeft, RotateCw, Info, FileSpreadsheet } from 'lucide-react';

interface Props {
  banqueId: number;
  onClose: () => void;
}

const BanqueDetails: React.FC<Props> = ({ banqueId, onClose }) => {
  // On récupère les données
  const { data: transactionsData, isLoading, refetch } = useGetTransactionsQuery({ size: 2000 });
  const { data: banques } = useGetBanquesQuery();
  
  const banque = banques?.find(b => b.id === banqueId);
  const bankTrans = transactionsData?.results?.filter(t => t.banque_id === banqueId) || [];

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' F';

  return (
    <div className="space-y-6">
      {/* 1. BARRE D'ACTIONS (Retour & Reset) */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors"
        >
          <ArrowLeft size={16} /> Retour à la liste
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => refetch()}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
            title="Actualiser les données"
          >
            <RotateCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 2. RÉSUMÉ DU COMPTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Banque sélectionnée</p>
          <div className="flex items-center gap-2">
            <Landmark size={16} className="text-blue-600" />
            <p className="text-sm font-black text-slate-800">{banque?.nom_banque}</p>
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-1">{banque?.rib}</p>
        </div>
        
        <div className="p-4 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-blue-400">Solde Actuel</p>
          <p className="text-xl font-black text-white">
            {bankTrans.length > 0 ? formatCurrency(bankTrans[0].solde_final) : '0 F'}
          </p>
        </div>
      </div>

      {/* 3. TABLEAU DES MOUVEMENTS */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-slate-400">
              <th className="px-4 pb-2 text-left font-bold">Date</th>
              <th className="px-4 pb-2 text-left font-bold">Désignation</th>
              <th className="px-4 pb-2 text-right text-emerald-600">Entrée</th>
              <th className="px-4 pb-2 text-right text-rose-600">Sortie</th>
              <th className="px-4 pb-2 text-right text-slate-800">Solde Final</th>
            </tr>
          </thead>
          <tbody>
            {bankTrans.map((t) => (
              <tr key={t.id} className="text-xs group">
                <td className="px-4 py-3 bg-white border-y border-l rounded-l-xl text-slate-500 group-hover:bg-slate-50">
                  {new Date(t.date_trans).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 bg-white border-y group-hover:bg-slate-50">
                  <div className="font-bold text-slate-800">{t.libelle}</div>
                  <div className="text-[9px] px-1.5 py-0.5 bg-slate-100 rounded w-fit mt-1 text-slate-500 font-bold uppercase">
                    {t.nature}
                  </div>
                </td>
                <td className="px-4 py-3 bg-white border-y text-right font-bold text-emerald-600 group-hover:bg-slate-50">
                  {t.type === 'Entrée' ? formatCurrency(t.montant) : '-'}
                </td>
                <td className="px-4 py-3 bg-white border-y text-right font-bold text-rose-600 group-hover:bg-slate-50">
                  {t.type === 'Sortie' ? formatCurrency(t.montant) : '-'}
                </td>
                <td className="px-4 py-3 bg-white border-y border-r rounded-r-xl text-right font-black text-blue-800 bg-slate-50/50 group-hover:bg-slate-100/50">
                  {formatCurrency(t.solde_final)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bankTrans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
             <Info size={32} strokeWidth={1.5} />
             <p className="mt-2 text-xs font-medium italic">Aucun mouvement trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BanqueDetails;