import React from 'react';
import { Transaction } from '../types';
import { FileText, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AmountBadge } from './ui/AmountBadge';
import { Button } from './ui/Button';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete: (id: number) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, onDelete }) => {
  const isSortie = transaction.type === 'Sortie';

  const handleOpenPDF = () => {
    // URL vers ton backend FastAPI configuré avec StaticFiles
    window.open(`http://127.0.0.1:8000/${transaction.pdf_path}`, '_blank');
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
      <td className="p-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isSortie ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
        }`}>
          {isSortie ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
        </div>
      </td>
      
      <td className="p-4 text-sm font-mono text-slate-500">
        {transaction.date_trans}
      </td>

      <td className="p-4">
        <div className="font-bold text-slate-800">{transaction.libelle}</div>
        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
          Réf: #{transaction.id}
        </div>
      </td>

      <td className="p-4 text-slate-600 font-medium">
        {transaction.tiers}
      </td>

      <td className="p-4">
        <AmountBadge 
          amount={transaction.montant} 
          type={transaction.type as 'Entrée' | 'Sortie'} 
        />
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="outline" 
            className="p-2 h-9 w-9 text-blue-600 border-blue-100 hover:bg-blue-50"
            onClick={handleOpenPDF}
            title="Voir le justificatif PDF"
          >
            <FileText size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            className="p-2 h-9 w-9 text-red-500 border-red-100 hover:bg-red-50"
            onClick={() => onDelete(transaction.id)}
            title="Supprimer la transaction"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;