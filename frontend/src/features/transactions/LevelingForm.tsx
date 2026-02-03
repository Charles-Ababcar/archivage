import React, { useState, useEffect } from 'react';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { useAddLevelingMutation } from '../../api/transactionApi';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeftRight, Upload, CheckCircle2, XCircle, X 
} from 'lucide-react';

const LevelingForm: React.FC = () => {
  const { data: banques } = useGetBanquesQuery();
  const [addLeveling, { isLoading }] = useAddLevelingMutation();
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Auto-fermeture du toast après 5 secondes
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const srcId = formData.get('banque_source_id');
    const destId = formData.get('banque_dest_id');
    
    // Validation client
    if (srcId === destId) {
      setToast({ type: "error", msg: "Les banques source et destination doivent être différentes !" });
      return;
    }

    const srcName = banques?.find(b => b.id.toString() === srcId)?.nom_banque;
    const destName = banques?.find(b => b.id.toString() === destId)?.nom_banque;

    formData.append('banque_source_nom', srcName || '');
    formData.append('banque_dest_nom', destName || '');

    try {
      await addLeveling(formData).unwrap();
      setToast({ type: "success", msg: "Nivellement effectué et soldes mis à jour avec succès !" });
      form.reset(); // Vide le formulaire après succès
    } catch (err: any) {
      setToast({ 
        type: "error", 
        msg: err.data?.detail || "Une erreur est survenue lors du nivellement." 
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      
      {/* 1. COMPOSANT TOAST (Notification) */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <p className="text-sm font-bold">{toast.msg}</p>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. FORMULAIRE */}
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ArrowLeftRight size={20} />
          </div>
          <h2 className="font-black text-slate-800 tracking-tight">Nouveau Nivellement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Banque de départ</label>
            <select name="banque_source_id" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all" required>
              <option value="">Source (Débit)...</option>
              {banques?.map(b => <option key={b.id} value={b.id}>{b.nom_banque}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Banque réceptrice</label>
            <select name="banque_dest_id" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all" required>
              <option value="">Destination (Crédit)...</option>
              {banques?.map(b => <option key={b.id} value={b.id}>{b.nom_banque}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Date d'opération</label>
            <input type="date" name="date_trans" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Montant (FCFA)</label>
            <input type="number" name="montant" placeholder="0.00" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold" required />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Libellé</label>
          <input type="text" name="libelle" placeholder="Ex: Nivellement mensuel BOA vers ECOBANK" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm" required />
        </div>
        
        <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl group hover:border-blue-200 transition-colors">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <Upload size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold text-slate-400">Joindre le PDF (Optionnel)</span>
            <input type="file" name="file" accept=".pdf" className="hidden" />
          </label>
        </div>

        <Button 
          type="submit"
          className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all" 
          isLoading={isLoading}
        >
          <ArrowLeftRight size={18} /> Confirmer le transfert interne
        </Button>
      </form>
    </div>
  );
};

export default LevelingForm;