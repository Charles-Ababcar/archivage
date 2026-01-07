import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface AmountBadgeProps {
  amount: number;
  type: 'Entrée' | 'Sortie';
  currency?: string;
  compact?: boolean;
}

export const AmountBadge: React.FC<AmountBadgeProps> = ({ 
  amount, 
  type, 
  currency = 'FCFA',
  compact = false 
}) => {
  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amt);
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
        type === 'Entrée' 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'bg-rose-50 text-rose-700'
      }`}>
        {type === 'Entrée' ? (
          <ArrowUpRight size={12} className="mr-1" />
        ) : (
          <ArrowDownLeft size={12} className="mr-1" />
        )}
        {type === 'Entrée' ? '+' : '-'} {formatAmount(amount)} {currency}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium ${
      type === 'Entrée' 
        ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200' 
        : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 border border-rose-200'
    }`}>
      <div className={`p-1.5 rounded-lg ${
        type === 'Entrée' ? 'bg-emerald-100' : 'bg-rose-100'
      }`}>
        {type === 'Entrée' ? (
          <ArrowUpRight size={16} className="text-emerald-600" />
        ) : (
          <ArrowDownLeft size={16} className="text-rose-600" />
        )}
      </div>
      <div>
        <div className="font-semibold">
          {type === 'Entrée' ? '+' : '-'} {formatAmount(amount)}
        </div>
        <div className="text-xs opacity-80">
          {currency}
        </div>
      </div>
    </div>
  );
};