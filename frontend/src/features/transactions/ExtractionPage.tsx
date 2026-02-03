import React, { useState, useMemo } from 'react';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { useGetTransactionsQuery } from '../../api/transactionApi';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Calendar, Search, Trash2, Info } from 'lucide-react';
import { Loader } from '../../components/ui/Loader';

const ExtractionPage: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: banques } = useGetBanquesQuery();
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({ size: 2000 });

  const allTransactions = transactionsData?.results || [];


  console.log('======================',allTransactions);
  

  // Filtrage optimisé avec useMemo pour éviter les calculs inutiles au rendu
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const matchesBank = selectedBank ? t.banque_id.toString() === selectedBank : true;
      const dateT = new Date(t.date_trans);
      const matchesStart = startDate ? dateT >= new Date(startDate) : true;
      const matchesEnd = endDate ? dateT <= new Date(endDate) : true;
      return matchesBank && matchesStart && matchesEnd;
    });
  }, [allTransactions, selectedBank, startDate, endDate]);

  // Calcul des totaux pour le résumé
  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'Entrée') acc.entrees += t.montant;
      else acc.sorties += t.montant;
      return acc;
    }, { entrees: 0, sorties: 0 });
  }, [filteredTransactions]);

  const handleExportExcel = () => {
    if (filteredTransactions.length === 0) return alert("Aucune donnée à exporter.");

    const ws = XLSX.utils.json_to_sheet(filteredTransactions.map(t => ({
      Date: t.date_trans,
      Banque: t.banque?.nom_banque || 'N/A',
      Libellé: t.libelle,
      Tiers: t.tiers,
      Nature: t.nature,
      Débit: t.type === 'Entrée' ? t.montant : 0,
      Crédit: t.type === 'Sortie' ? t.montant : 0,
      'Solde Initial': t.solde_initial,
      'Solde Final': t.solde_final
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal");
    const fileName = `Export_${selectedBank ? 'Banque' : 'Global'}_${new Date().toLocaleDateString()}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (isLoading) return <div className="p-10 text-center"><Loader /></div>;

  return (
    <div className="space-y-4">
      {/* SECTION FILTRES */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Établissement</label>
            <select 
              value={selectedBank} 
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les banques</option>
              {banques?.map(b => <option key={b.id} value={b.id}>{b.nom_banque}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Début</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Fin</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-lg text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportExcel} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 font-bold text-xs transition-all">
              <FileSpreadsheet size={16} /> Exporter Excel
            </button>
            <button onClick={() => {setSelectedBank(""); setStartDate(""); setEndDate("");}} className="p-2 text-slate-400 hover:text-rose-500 border rounded-lg hover:bg-rose-50 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* RÉSUMÉ DES FLUX (Nouvelle section) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-emerald-600 uppercase">Total Débit (+)</p>
          <p className="text-lg font-black text-emerald-700">{totals.entrees.toLocaleString()} F</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-rose-600 uppercase">Total Crédit (-)</p>
          <p className="text-lg font-black text-rose-700">{totals.sorties.toLocaleString()} F</p>
        </div>
        <div className="hidden md:block bg-blue-50 border border-blue-100 p-3 rounded-xl">
          <p className="text-[10px] font-bold text-blue-600 uppercase">Balance Période</p>
          <p className={`text-lg font-black ${(totals.entrees - totals.sorties) >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
            {(totals.entrees - totals.sorties).toLocaleString()} F
          </p>
        </div>
      </div>

      {/* APERÇU TABLEAU */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="max-h-[350px] overflow-y-auto">
          <table className="w-full text-[11px] text-left">
            <thead className="sticky top-0 bg-slate-50 border-b text-slate-500 font-bold uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Banque</th>
                <th className="px-4 py-3">Libellé</th>
                <th className="px-4 py-3 text-right">Débit</th>
                <th className="px-4 py-3 text-right">Crédit</th>
                <th className="px-4 py-3 text-right">Solde Final</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{t.date_trans}</td>
                  <td className="px-4 py-3 font-medium text-blue-600 uppercase">{t.banque?.nom_banque}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{t.libelle}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{t.type === 'Entrée' ? t.montant.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right text-rose-600">{t.type === 'Sortie' ? t.montant.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900">{t.solde_final.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && <div className="p-10 text-center text-slate-400 italic">Aucune donnée.</div>}
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;