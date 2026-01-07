import React, { useState } from 'react';
import { useAddTransactionMutation } from '../../api/transactionApi';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { getErrorMessage } from '../../utils/errorHelper';
import { Upload, Building, Calendar, DollarSign, User, FileText } from 'lucide-react';

const TransactionForm: React.FC = () => {
  const { data: banques } = useGetBanquesQuery();
  const [addTransaction, { isLoading }] = useAddTransactionMutation();
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  const form = e.currentTarget; 
  const formData = new FormData(form);

  try {
    await addTransaction(formData).unwrap();
    
    setToast({ type: 'success', msg: 'Transaction archivée avec succès !' });
    
  
    form.reset(); 
    
  } catch (err: any) {
    console.error("Détail de l'erreur:", err);
    setToast({ type: 'error', msg: getErrorMessage(err) });
  }
};

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-5">
        <h1 className="text-lg font-bold text-slate-800 mb-1">Nouvelle Transaction</h1>
        <p className="text-xs text-slate-500">Remplissez tous les champs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banque */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1">
              <Building size={12} />
              Banque
            </span>
          </label>
          <select 
            name="banque_id" 
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Sélectionner...</option>
            {banques?.map(b => (
              <option key={b.id} value={b.id}>
                {b.nom_banque} ({b.rib?.slice(-4) || ''})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Date
              </span>
            </label>
            <input
              type="date"
              name="date_trans"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Nature */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                Type
              </span>
            </label>
            <select 
              name="type_trans" 
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="Sortie">Sortie</option>
              <option value="Entrée">Entrée</option>
            </select>
          </div>
        </div>

        {/* Libellé */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1">
              <FileText size={12} />
              Libellé
            </span>
          </label>
          <input
            type="text"
            name="libelle"
            placeholder="Description de la transaction"
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Montant */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                Montant
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              name="montant"
              placeholder="0.00"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Tiers */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <User size={12} />
                Tiers
              </span>
            </label>
            <input
              type="text"
              name="tiers"
              placeholder="Client/Fournisseur"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Fichier */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            <span className="flex items-center gap-1">
              <Upload size={12} />
              Justificatif PDF
            </span>
          </label>
          <input
            type="file"
            name="file"
            accept=".pdf"
            required
            className="w-full p-2 border border-slate-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-slate-500 mt-1">PDF uniquement, max 10MB</p>
        </div>

        {/* Bouton */}
        <Button 
          variant="primary" 
          className="w-full py-2 text-sm"
          isLoading={isLoading}
        >
          {isLoading ? 'En cours...' : 'Archiver'}
        </Button>
      </form>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.msg} 
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default TransactionForm;