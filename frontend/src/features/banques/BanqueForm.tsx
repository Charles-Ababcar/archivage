import React, { useState } from 'react';
import { useAddBanqueMutation } from '../../api/banqueApi';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { getErrorMessage } from '../../utils/errorHelper';
import { Building, CreditCard } from 'lucide-react';

const BanqueForm: React.FC = () => {
  const [addBanque, { isLoading }] = useAddBanqueMutation();
  const [form, setForm] = useState({ rib: '', nom_banque: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addBanque(form).unwrap();
      setToast({ 
        type: 'success', 
        msg: `Banque "${res.nom_banque}" ajoutée`
      });
      setForm({ rib: '', nom_banque: '' });
    } catch (err) {
      setToast({ type: 'error', msg: getErrorMessage(err) });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* En-tête minimal */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Ajouter une banque</h1>
            <p className="text-sm text-slate-600">Remplissez les informations ci-dessous</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Champ RIB/IBAN */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <span className="flex items-center gap-2">
              <CreditCard size={14} className="text-blue-500" />
              RIB / IBAN
            </span>
          </label>
          <input
            type="text"
            placeholder="FR76 3000 4000 5000 6000 7000 123"
            value={form.rib}
            onChange={e => setForm({...form, rib: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
            required
          />
        </div>

        {/* Champ Nom */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            <span className="flex items-center gap-2">
              <Building size={14} className="text-blue-500" />
              Nom de la banque
            </span>
          </label>
          <input
            type="text"
            placeholder="Ex: Banque Centrale Européenne"
            value={form.nom_banque}
            onChange={e => setForm({...form, nom_banque: e.target.value})}
            className="w-full p-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
            required
          />
        </div>

        {/* Bouton */}
        <Button 
          variant="primary" 
          className="w-full py-2.5"
          isLoading={isLoading}
        >
          {isLoading ? 'Création...' : 'Créer la banque'}
        </Button>
      </form>

      {/* Toast */}
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

export default BanqueForm;