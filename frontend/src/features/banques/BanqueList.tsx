import React, { useState } from 'react';
import { useGetBanquesQuery } from '../../api/banqueApi';
import { Table } from '../../components/ui/Table';
import { Loader } from '../../components/ui/Loader';
import { Landmark, CreditCard, Eye } from 'lucide-react';
import BanqueDetails from './BanqueDetails';

const BanqueList: React.FC = () => {
  const { data: banques, isLoading, isError } = useGetBanquesQuery();

const [selectedBanqueId, setSelectedBanqueId] = useState<number | null>(null);


 console.log("Nombre de banques reçues :", banques?.length);

  if (isLoading) return <Loader />;
  if (isError) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Erreur lors de la récupération des banques.</div>;

  return (
    <div className="space-y-4">
      {selectedBanqueId && (
        <BanqueDetails 
          banqueId={selectedBanqueId} 
          onClose={() => setSelectedBanqueId(null)} 
        />
      )}
      <Table headers={['Nom de la Banque', 'RIB / Identifiant', 'Actions']}>
        {banques?.map((banque) => (
          <tr key={banque.id} className="hover:bg-slate-50 transition-colors">
            <td className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Landmark size={20} />
                </div>
                <span className="font-bold text-slate-800">{banque.nom_banque}</span>
              </div>
            </td>
            <td className="p-4">
              <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                <CreditCard size={16} />
                {banque.rib}
              </div>
            </td>
          <td className="p-4">
              <button 
                onClick={() => setSelectedBanqueId(banque.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
              >
                <Eye size={16} /> Voir transactions
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {banques?.length === 0 && (
        <div className="text-center py-10 text-slate-400 italic">
          Aucune banque enregistrée pour le moment.
        </div>
      )}
    </div>
  );
};

export default BanqueList;